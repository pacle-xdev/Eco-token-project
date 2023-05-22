/*
 * Copyright (C) 2023 EcoToken Systems
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { PutObjectCommand } from "@aws-sdk/client-s3";
import {
    DirectSecp256k1HdWallet,
    DirectSecp256k1Wallet,
} from "@cosmjs/proto-signing";
import {
    Metaplex,
    bundlrStorage,
    keypairIdentity,
    toMetaplexFile,
    token,
} from "@metaplex-foundation/js";
import { RegenApi } from "@regen-network/api";
import {
    QuerySellOrdersByBatchResponse,
    QueryClientImpl as SellOrderQueryClient,
} from "@regen-network/api/lib/generated/regen/ecocredit/marketplace/v1/query.js";
import { MsgBuyDirect } from "@regen-network/api/lib/generated/regen/ecocredit/marketplace/v1/tx.js";
import {
    QueryBatchesByProjectResponse,
    QueryClientImpl as QueryBatchesClient,
} from "@regen-network/api/lib/generated/regen/ecocredit/v1/query.js";
import { MsgRetire } from "@regen-network/api/lib/generated/regen/ecocredit/v1/tx.js";
// import TokenStandard
import {
    Connection,
    Keypair,
    PublicKey,
    clusterApiUrl,
    type Cluster,
} from "@solana/web3.js";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import bs58 from "bs58";
import { z } from "zod";
import { type EcoOrder } from "@ecotoken/db";

import { createEcoOrderSchema, updateEcoOrderSchema } from "../../schema/order";
import { adminAuthedProcedure, authedProcedure, router } from "../../trpc";
import { s3Client } from "../../utils/s3";

export const ordersRouter = router({
    getAll: authedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).optional().default(10),
                cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
                project: z.string().cuid().optional(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const orders = await ctx.prisma.ecoOrder.findMany({
                take: input.limit + 1,
                ...(ctx.session.user.type === "user" && {
                    where: {
                        userID: ctx.session.user.id,
                    },
                }),
                where: {
                    ...(input.project && {
                        nftSeries: {
                            projectID: input.project,
                        },
                    }),
                },
                ...(input?.cursor && {
                    cursor: {
                        ecoOrderID: input.cursor,
                    },
                }),
            });
            let nextCursor: EcoOrder | undefined;
            if (orders?.length > input.limit) nextCursor = orders.pop();

            return {
                orders,
                nextCursor,
            };
        }),
    get: authedProcedure
        .input(
            z.object({
                ecoOrderID: z.string(),
                project: z.boolean().optional(),
            }),
        )
        .query(async ({ ctx, input: { ecoOrderID, project } }) => {
            return await ctx.prisma.ecoOrder.findFirst({
                where: {
                    ecoOrderID,
                    ...(ctx.session.user.type === "user" && {
                        userID: ctx.session.user.id,
                    }),
                },
                include: {
                    nftSeries: {
                        include: {
                            ...(project && {
                                project: {
                                    include: {
                                        location: true,
                                        producer: true,
                                    },
                                },
                            }),
                        },
                    },
                },
            });
        }),
    create: authedProcedure
        .input(createEcoOrderSchema)
        .mutation(async ({ ctx, input: { image, ...input } }) => {
            // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
            const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK as Cluster;
            if (
                !network ||
                !process.env.SOLANA_ADMIN_WALLET ||
                !process.env.REGEN_WALLET ||
                !process.env.REGEN_ENDPOINT ||
                !process.env.COLLECTION_ADDRESS
            )
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Env file error.",
                });
            const secretKey = bs58.decode(process.env.SOLANA_ADMIN_WALLET);
            const wallet = Keypair.fromSecretKey(secretKey);

            // You can also provide a custom RPC endpoint.
            const endpoint = clusterApiUrl(network);

            const connection = new Connection(endpoint, "confirmed");

            const series = await ctx.prisma.nFTSeries.findUnique({
                where: {
                    nftSeriesID: input.nftSeriesID,
                },
                include: {
                    project: true,
                },
            });

            if (!series)
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Series for NFT not found.",
                });
            if (!series.project) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Project not found.",
                });
            }

            // check previous tx hash
            const existed = await ctx.prisma.ecoOrder.findFirst({
                where: {
                    payHash: input.payHash,
                },
            });

            if (existed) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Order already exists.",
                });
            }

            let vaildInput = false;
            try {
                const txRes = await axios.get(
                    `https://api.solscan.io/transaction?tx=${input.payHash}&cluster=devnet`,
                );
                if (
                    txRes.data.status === "Success" &&
                    txRes.data.signer[0] === input.userWallet &&
                    txRes.data.mainActions[0].action === "spl-transfer" &&
                    txRes.data.txStatus === "confirmed" &&
                    txRes.data.mainActions[0].data.source_owner ===
                        input.userWallet &&
                    txRes.data.mainActions[0].data.destination_owner ===
                        wallet.publicKey.toString() &&
                    txRes.data.mainActions[0].data.token.address ===
                        process.env.NEXT_PUBLIC_SOLANA_USDC &&
                    txRes.data.mainActions[0].data.amount ===
                        series.creditPrice
                            .times(input.creditsPurchased)
                            .times(1e6)
                ) {
                    vaildInput = true;
                }
            } catch (error) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "That is not real transaction hash.",
                });
            }

            // retire credits
            const sender = process.env.REGEN_WALLET;
            // const signer = await DirectSecp256k1Wallet.fromKey(
            //     Buffer.from(sender.replace("0x", ""), "hex"),
            //     "regen",
            // );
            const signer = await DirectSecp256k1HdWallet.fromMnemonic(sender, {
                prefix: "regen",
            });
            const [account] = await signer.getAccounts();
            if (!account)
                throw new TRPCError({
                    message: "Env file is not correct.",
                    code: "CONFLICT",
                });

            let retireHash = "";
            try {
                const regenApi = await RegenApi.connect({
                    connection: {
                        type: "tendermint",
                        endpoint: process.env.REGEN_ENDPOINT,
                        signer,
                    },
                });
                const TEST_MSG_RETIRE = MsgRetire.fromPartial({
                    owner: account.address,
                    credits: [
                        {
                            batchDenom: series.regenBatch,
                            amount: input.creditsPurchased.toString(),
                        },
                    ],
                    jurisdiction: "US-OR",
                });
                const TEST_FEE = {
                    amount: [
                        {
                            denom: "uregen",
                            amount: "5000",
                        },
                    ],
                    gas: "200000",
                };
                const TEST_MEMO = "Retire credits";

                const { msgClient } = regenApi;

                if (!msgClient)
                    throw new TRPCError({
                        message: "Error. Try again.",
                        code: "CONFLICT",
                    });

                const signedTxBytes: any = await msgClient.sign(
                    account.address,
                    [TEST_MSG_RETIRE],
                    TEST_FEE,
                    TEST_MEMO,
                );

                const txRes = await msgClient.broadcast(signedTxBytes);
                retireHash = txRes.transactionHash;

                // return txRes;
            } catch (err) {
                console.log(err);
                throw new TRPCError({
                    message: "Error in retiring process. Contact to dev team.",
                    code: "CONFLICT",
                });
            }

            // create NFT
            try {
                const metaplex = Metaplex.make(connection)
                    .use(keypairIdentity(wallet))
                    .use(
                        bundlrStorage({
                            address: "https://devnet.bundlr.network",
                            providerUrl: endpoint,
                            timeout: 60000,
                        }),
                    );

                const { uri, metadata } = await metaplex.nfts().uploadMetadata({
                    name: `ECO NFT`,
                    symbol: "ECO",
                    description:
                        "This NFT is used to prove the retirement of environment credits.",
                    image,
                    external_url: process.env.EXTERNAL_URL,
                    properties: {
                        creators: [
                            {
                                address: wallet.publicKey.toString(),
                                share: 100,
                            },
                            // {
                            //     address: creator2.publicKey.toString(),
                            //     share: 40,
                            // },
                        ],
                    },
                    attributes: [
                        {
                            trait_type: "Project Name",
                            value: series.project?.title,
                        },
                        {
                            trait_type: "Retired Credits",
                            value: input.creditsPurchased.toString(),
                        },
                        {
                            trait_type: "Retired Time",
                            value: new Date().toLocaleDateString(),
                        },
                        {
                            trait_type: "Retired By",
                            value: input.retireBy,
                        },
                        {
                            trait_type: "Retire Tx Hash",
                            value: retireHash,
                        },
                    ],
                });

                console.log(uri, metadata);
                const { nft } = await metaplex.nfts().create({
                    uri: uri,
                    name: `ECO NFT`,
                    sellerFeeBasisPoints: 500, // Represents 5.00%.
                    tokenOwner: new PublicKey(input.userWallet),

                    // used for create collection items.
                    creators: [
                        {
                            address: wallet.publicKey,
                            authority: wallet,
                            share: 100,
                        },
                        //   {
                        //     address: creator2.publicKey,
                        //     authority: creator2,
                        //     share: 40,
                        //   },
                    ],
                    isCollection: true,
                    collection: new PublicKey(process.env.COLLECTION_ADDRESS),
                    collectionAuthority: wallet,
                    collectionIsSized: false,
                });
            } catch (err) {
                throw new TRPCError({
                    message:
                        "Error in NFT creating process. Contact to dev team.",
                    code: "CONFLICT",
                });
            }

            const order = await ctx.prisma.ecoOrder.create({
                data: {
                    ...input,
                    nftSeriesID: series.nftSeriesID,
                    userID:
                        input.userID && ctx.session.user.type === "admin"
                            ? input.userID
                            : ctx.session.user.id,
                    retireWallet: series.recieveWallet,
                    ecoWallet: series.creditWallet,
                    creditKey: series.creditKey,
                    creditWallet: series.creditWallet,
                    retireHash,
                    status: "ORDER_COMPLETE",
                },
                select: {
                    ecoOrderID: true,
                },
            });

            await ctx.prisma.nFTSeries.update({
                where: {
                    nftSeriesID: input.nftSeriesID,
                },
                data: {
                    setAmount: series.setAmount?.minus(input.creditsPurchased),
                },
            });

            return order;
        }),
    update: adminAuthedProcedure
        .input(updateEcoOrderSchema)
        .mutation(async ({ ctx, input: { ecoOrderID, ...input } }) => {
            await ctx.prisma.ecoOrder.update({
                where: {
                    ecoOrderID,
                },
                data: {
                    ...input,
                },
            });
        }),
    delete: adminAuthedProcedure
        .input(
            z.object({
                ecoOrderID: z.string(),
            }),
        )
        .mutation(async ({ ctx, input: { ecoOrderID } }) => {
            await ctx.prisma.ecoOrder.delete({
                where: {
                    ecoOrderID,
                },
            });
        }),
});
