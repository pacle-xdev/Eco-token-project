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

import {
    DirectSecp256k1HdWallet,
    DirectSecp256k1Wallet,
} from "@cosmjs/proto-signing";
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
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure, router } from "../../trpc";

export const creditRouter = router({
    getSellOrderByBatch: publicProcedure
        .input(z.object({ batch: z.string() }))
        .query(async ({ ctx, input }) => {
            if (!process.env.REGEN_WALLET)
                throw new TRPCError({
                    message: "Env file is not correct.",
                    code: "CONFLICT",
                });
            const sender = process.env.REGEN_WALLET;
            // const signer = await DirectSecp256k1Wallet.fromKey(
            //     Buffer.from(sender.replace("0x", ""), "hex"),
            //     "regen",
            // );

            const signer = await DirectSecp256k1HdWallet.fromMnemonic(sender, {
                prefix: "regen",
            });

            try {
                const regenApi = await RegenApi.connect({
                    connection: {
                        type: "tendermint",
                        endpoint: "http://redwood.regen.network:26657",
                        signer,
                    },
                });
                const queryClient = new SellOrderQueryClient(
                    regenApi.queryClient,
                );
                const sellOrder: any = await queryClient.SellOrdersByBatch({
                    batchDenom: input.batch,
                });
                console.log(sellOrder);
                return sellOrder;
            } catch (err) {
                console.log(err);
                throw new TRPCError({
                    message: "Error. Try again.",
                    code: "CONFLICT",
                });
            }
        }),
    getCreditsByProject: publicProcedure
        .input(z.object({ projectId: z.string() }))
        .query(async ({ ctx, input }) => {
            if (!process.env.REGEN_WALLET)
                throw new TRPCError({
                    message: "Env file is not correct.",
                    code: "CONFLICT",
                });
            const sender = process.env.REGEN_WALLET;
            // const signer = await DirectSecp256k1Wallet.fromKey(
            //     Buffer.from(sender.replace("0x", ""), "hex"),
            //     "regen",
            // );

            const signer = await DirectSecp256k1HdWallet.fromMnemonic(sender, {
                prefix: "regen",
            });

            try {
                const regenApi = await RegenApi.connect({
                    connection: {
                        type: "tendermint",
                        endpoint: "http://redwood.regen.network:26657",
                        signer,
                    },
                });
                const queryClient = new QueryBatchesClient(
                    regenApi.queryClient,
                );
                const batches: any = await queryClient.BatchesByProject({
                    projectId: input.projectId,
                });
                console.log(batches);
                return batches.batches;
            } catch (err) {
                console.log(err);
                throw new TRPCError({
                    message: "Error. Try again.",
                    code: "CONFLICT",
                });
            }
        }),
    retireCreditFromMarketplace: publicProcedure
        .input(
            z.object({
                sellOrderId: z.string(),
                quantity: z.string(),
                denom: z.string(),
                amount: z.string(),
                retirementJurisdiction: z.string(),
                memo: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            if (!process.env.REGEN_WALLET)
                throw new TRPCError({
                    message: "Env file is not correct.",
                    code: "CONFLICT",
                });
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

            try {
                const regenApi = await RegenApi.connect({
                    connection: {
                        type: "tendermint",
                        endpoint: "http://redwood.regen.network:26657",
                        signer,
                    },
                });
                const TEST_MSG_BUY: any = MsgBuyDirect.fromPartial({
                    buyer: account.address,
                    orders: [
                        {
                            sellOrderId: input.sellOrderId.toString(),
                            quantity: input.quantity.toString(),
                            bidPrice: {
                                denom: input.denom.toString(),
                                amount: input.amount.toString(),
                            },
                            disableAutoRetire: false, // retire only
                            retirementJurisdiction:
                                input.retirementJurisdiction.toString(),
                        },
                    ],
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

                const { msgClient } = regenApi;

                if (!msgClient)
                    throw new TRPCError({
                        message: "Error. Try again.",
                        code: "CONFLICT",
                    });

                const signedTxBytes: any = await msgClient.sign(
                    account.address,
                    [TEST_MSG_BUY],
                    TEST_FEE,
                    input.memo.toString(),
                );
                console.log("signedTxBytes", signedTxBytes);

                const txRes = await msgClient.broadcast(signedTxBytes);

                console.log("txRes", txRes);

                return txRes;
            } catch (err) {
                console.log(err);
                throw new TRPCError({
                    message: "Error. Try again.",
                    code: "CONFLICT",
                });
            }
        }),
    retireAdminCredit: publicProcedure
        .input(
            z.object({
                txId: z.string(),
                publicKey: z.string(),
                batch: z.string(),
                quantity: z.string(),
                memo: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            if (!process.env.REGEN_WALLET)
                throw new TRPCError({
                    message: "Env file is not correct.",
                    code: "CONFLICT",
                });
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

            try {
                const regenApi = await RegenApi.connect({
                    connection: {
                        type: "tendermint",
                        endpoint: "http://redwood.regen.network:26657",
                        signer,
                    },
                });
                const TEST_MSG_RETIRE = MsgRetire.fromPartial({
                    owner: account.address,
                    credits: [
                        {
                            batchDenom: input.batch,
                            amount: input.quantity,
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
                    input.memo.toString(),
                );
                console.log("signedTxBytes", signedTxBytes);

                const txRes = await msgClient.broadcast(signedTxBytes);

                console.log("txRes", txRes);

                return txRes;
            } catch (err) {
                console.log(err);
                throw new TRPCError({
                    message: "Error. Try again.",
                    code: "CONFLICT",
                });
            }
        }),
});
