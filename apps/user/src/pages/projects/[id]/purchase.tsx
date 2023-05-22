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

import React, { useMemo, useRef } from "react";
import { useRouter } from "next/router";
// import NFTBuilderPreview from "../../../../../admin/src/components/nft-builder-preview";
import NftPreview from "@/components/project/nft-preview";
import { clientEnv } from "@/env/schema.mjs";
import { createAssociatedTokenAccountInstruction } from "@/utils/transferSplToken/createAssociatedTokenAccountInstruction";
import { createTransferInstruction } from "@/utils/transferSplToken/createTransferInstructions";
import { getAccountInfo } from "@/utils/transferSplToken/getAccountInfo";
import { getAssociatedTokenAddress } from "@/utils/transferSplToken/getAssociatedTokerAddress";
import { trpc, uploadMutation } from "@/utils/trpc";
import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
    PublicKey,
    Transaction,
    type PublicKeyInitData,
} from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";
import Decimal from "decimal.js";
import html2canvas from "html2canvas";
import { toast } from "react-hot-toast";
import { createEcoOrderSchema } from "@ecotoken/api/src/schema/order";
import Button from "@ecotoken/ui/components/Button";
import Form, {
    FormInput,
    FormSelect,
    useZodForm,
} from "@ecotoken/ui/components/Form";

import { formatCountryAndState } from "../../../../../admin/src/utils/formatter";

// admin wllet
const adminKey = new PublicKey(
    clientEnv.NEXT_PUBLIC_SOLANA_ADMIN_PUBKEY as PublicKeyInitData,
);
// usdc address
const mint = new PublicKey(
    clientEnv.NEXT_PUBLIC_SOLANA_USDC as PublicKeyInitData,
);

const PurchaseProject = () => {
    const router = useRouter();
    const { connection } = useConnection();
    const { id } = router.query;

    const { data: project } = trpc.ecoProjects.get.useQuery(
        {
            identifier: id as string,
            location: true,
            producer: true,
            series: true,
        },
        {
            enabled: !!id,
        },
    );

    const { mutateAsync, isLoading: isOrdering } =
        trpc.ecoOrders.create.useMutation({
            async onSuccess(data) {
                await router.push(`/orders/${data.ecoOrderID}`);
            },
        });

    const { data: price } = trpc.coinPrice.get.useQuery();

    const form = useZodForm({
        schema: createEcoOrderSchema.omit({
            nftSeriesID: true,
            userWallet: true,
            payAmount: true,
            payFee: true,
            payHash: true,
            userID: true,
            image: true,
        }),
        defaultValues: {
            creditsPurchased: new Decimal(0),
        },
    });

    const { publicKey, wallet, sendTransaction, signTransaction } = useWallet();

    const date = useMemo(() => new Date(), []);
    const nftPreviewRef = useRef<HTMLDivElement | null>(null);

    const currency = form.watch("currency");
    let credits;
    try {
        credits = form.watch("creditsPurchased").toNumber();
    } catch (error) {
        // @ts-ignore
        credits = form.watch("creditsPurchased") as number;
    }
    const retiredBy = form.watch("retireBy");

    const { mutateAsync: uploadImage, isLoading: isUploadingImage } =
        useMutation({
            mutationKey: ["uploadSeriesImage"],
            mutationFn: uploadMutation,
        });

    const { mutateAsync: createPresignedUrl } =
        trpc.spaces.createPresignedUrls.useMutation();

    if (!project || !price) return <>Loading...</>;

    if (!project.nftSeries)
        return <div>No NFT series are attached to this project.</div>;
    else
        return (
            <div className="relative mb-8 flex min-h-screen w-full flex-wrap justify-center ">
                <div
                    className="flex h-[280px] w-full items-end px-8  py-10 "
                    style={{
                        backgroundImage: `url(${
                            project.listImage?.startsWith("https")
                                ? project.listImage
                                : `${process.env.NEXT_PUBLIC_CDN_URL}/${project.listImage}`
                        })`,
                    }}
                >
                    <h2 className="font-head text-3xl font-semibold text-white ">
                        {project.title}
                    </h2>
                </div>
                <div className="mt-16 flex w-[1024px] flex-wrap items-start justify-between px-3 lg:flex-row-reverse lg:flex-nowrap">
                    <div className="flex w-full justify-center px-0 py-0 lg:w-[600px]">
                        <NftPreview
                            image={
                                project.nftSeries.seriesImage?.startsWith(
                                    "https",
                                )
                                    ? project.nftSeries.seriesImage
                                    : `${process.env.NEXT_PUBLIC_CDN_URL}/eco-projects/${project.projectID}/nft-series/${project.nftSeries.nftSeriesID}/baseImage.png`
                            }
                            project={project.shortTitle}
                            location={formatCountryAndState(
                                project.location?.location ?? "",
                                project.location?.cn ?? "",
                                project.location?.st ?? "",
                            )}
                            producer={project.producer.companyName ?? undefined}
                            batch={project.nftSeries.regenBatch}
                            symbol={project.nftSeries?.seriesType}
                            credits={credits}
                            retiredBy={retiredBy}
                            date={date}
                            ref={nftPreviewRef}
                        />
                        {/* <NFTBuilderPreview
                            className="h-[600px] w-[600px]"
                            image={
                                project.nftSeries.seriesImage?.startsWith(
                                    "https",
                                )
                                    ? project.nftSeries.seriesImage
                                    : `${process.env.NEXT_PUBLIC_CDN_URL}/eco-projects/${project.projectID}/nft-series/${project.nftSeries.nftSeriesID}/baseImage.png`
                            }
                            project={project.shortTitle}
                            location={project.location?.location}
                            producer={project.producer.companyName ?? undefined}
                            batch={project.nftSeries.regenBatch}
                            symbol={project.nftSeries?.seriesType}
                            credits={credits.toNumber()}
                            retiredBy={retiredBy}
                            date={date}
                        /> */}
                    </div>

                    <div className="flex w-full justify-center py-5 pr-2 lg:w-[380px]">
                        <div className="flex w-screen max-w-[500px] flex-col  px-4 lg:px-0">
                            <h3 className="text-lg font-bold leading-[1.25] text-slate-700">
                                {project.title}
                            </h3>
                            <h4 className="text-lg text-slate-600">
                                {project.location?.location}
                            </h4>
                            <Form
                                className="space-y-4"
                                form={form}
                                onSubmit={async (data) => {
                                    if (!publicKey)
                                        toast.error("Please connect a wallet.");
                                    if (
                                        !publicKey ||
                                        !signTransaction ||
                                        !project.nftSeries
                                    )
                                        return;

                                    let image;
                                    if (nftPreviewRef.current) {
                                        const canvas = await html2canvas(
                                            nftPreviewRef.current,
                                        );
                                        document.body.appendChild(canvas);
                                        canvas.toBlob((blob) => {
                                            image = blob;
                                            document.body.removeChild(canvas);
                                        });
                                    }

                                    // send USDC to admin wallet
                                    let txId;
                                    const buyerAssiciatedToken =
                                        await getAssociatedTokenAddress(
                                            mint,
                                            publicKey,
                                            false,
                                            TOKEN_PROGRAM_ID,
                                            ASSOCIATED_TOKEN_PROGRAM_ID,
                                        );

                                    const adminAssiciatedToken =
                                        await getAssociatedTokenAddress(
                                            mint,
                                            adminKey,
                                            false,
                                            TOKEN_PROGRAM_ID,
                                            ASSOCIATED_TOKEN_PROGRAM_ID,
                                        );

                                    const transaction = new Transaction();
                                    let account;
                                    try {
                                        account = await getAccountInfo(
                                            connection,
                                            buyerAssiciatedToken,
                                            undefined,
                                            TOKEN_PROGRAM_ID,
                                        );
                                    } catch (error: any) {
                                        if (
                                            error.message ===
                                                "TokenAccountNotFoundError" ||
                                            error.message ===
                                                "TokenInvalidAccountOwnerError"
                                        ) {
                                            transaction.add(
                                                createAssociatedTokenAccountInstruction(
                                                    publicKey,
                                                    buyerAssiciatedToken,
                                                    publicKey,
                                                    mint,
                                                    TOKEN_PROGRAM_ID,
                                                    ASSOCIATED_TOKEN_PROGRAM_ID,
                                                ),
                                            );
                                        }
                                    }
                                    try {
                                        account = await getAccountInfo(
                                            connection,
                                            adminAssiciatedToken,
                                            undefined,
                                            TOKEN_PROGRAM_ID,
                                        );
                                    } catch (error: any) {
                                        if (
                                            error.message ===
                                                "TokenAccountNotFoundError" ||
                                            error.message ===
                                                "TokenInvalidAccountOwnerError"
                                        ) {
                                            transaction.add(
                                                createAssociatedTokenAccountInstruction(
                                                    publicKey,
                                                    adminAssiciatedToken,
                                                    adminKey,
                                                    mint,
                                                    TOKEN_PROGRAM_ID,
                                                    ASSOCIATED_TOKEN_PROGRAM_ID,
                                                ),
                                            );
                                        }
                                    }
                                    try {
                                        transaction.add(
                                            createTransferInstruction(
                                                buyerAssiciatedToken, // source
                                                adminAssiciatedToken, // dest
                                                publicKey,
                                                data.creditsPurchased.toNumber() *
                                                    Number(
                                                        project.nftSeries
                                                            .creditPrice,
                                                    ) *
                                                    1e6,
                                                [],
                                                TOKEN_PROGRAM_ID,
                                            ),
                                        );
                                        transaction.feePayer = publicKey;
                                        transaction.recentBlockhash = (
                                            await connection.getLatestBlockhash()
                                        ).blockhash;
                                        const signed = await signTransaction(
                                            transaction,
                                        );

                                        txId =
                                            await connection.sendRawTransaction(
                                                signed.serialize(),
                                            );
                                        await connection.confirmTransaction(
                                            txId,
                                        );
                                        toast.success(
                                            "USDC Successfully transferred. NFT is processing.",
                                        );
                                    } catch (error) {
                                        toast.error("Transfer USDC failed");
                                        return;
                                    }

                                    const imageURL = `eco-projects/${project?.projectID}/nft-series/${project?.nftSeries?.nftSeriesID}/nfts/${txId}.png`;

                                    const url = (await createPresignedUrl({
                                        contentType: "image/png",
                                        key: imageURL,
                                        acl: "public-read",
                                    })) as string;

                                    if (image && url) {
                                        await uploadImage({
                                            image,
                                            url,
                                        });

                                        await mutateAsync({
                                            ...data,
                                            nftSeriesID:
                                                project.nftSeries
                                                    ?.nftSeriesID ?? "",
                                            userWallet: publicKey?.toBase58(),
                                            payFee: 0,
                                            payAmount:
                                                data.creditsPurchased.toNumber() *
                                                Number(
                                                    project.nftSeries
                                                        .creditPrice,
                                                ),
                                            payHash: txId,
                                            image: `${process.env.NEXT_PUBLIC_CDN_URL}/${imageURL}`,
                                        });
                                    }
                                }}
                            >
                                <div className="mt-4 flex items-end justify-start">
                                    <FormInput
                                        className="float-left mt-3 mr-0 w-48"
                                        id="creditamt"
                                        type="number"
                                        label="Amount of Credits to Purchase"
                                        defaultValue={100}
                                        step="any"
                                        {...form.register("creditsPurchased", {
                                            min: 0,
                                        })}
                                    />
                                    <div className="float-left mb-2 inline-block border">
                                        {project.nftSeries.seriesType}
                                    </div>
                                </div>
                                <FormSelect
                                    label="Currency"
                                    className="mt-3 w-48"
                                    {...form.register("currency")}
                                >
                                    {/* {createEcoOrderSchema.shape.currency.options.map(
                                        (type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ),
                                    )} */}
                                    <option>USDC</option>
                                </FormSelect>

                                <div className="inline-block w-[100%] py-2">
                                    Purchase Price:{" $"}
                                    {Number(
                                        (Number(credits) *
                                            Number(
                                                project.nftSeries.creditPrice,
                                            )) /
                                            (currency === "SOL"
                                                ? // @ts-ignore eslint-disable-next-line
                                                  (price.data.solana
                                                      .usd as number)
                                                : 1),
                                    ).toFixed(2)}
                                </div>
                                <FormInput
                                    size="full"
                                    label="Retired By"
                                    className="mt-3 mb-3"
                                    {...form.register("retireBy")}
                                />
                                <Button
                                    className="mt-8"
                                    fullWidth
                                    loading={isOrdering || isUploadingImage}
                                >
                                    Purchase Credits
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        );
};

export default PurchaseProject;
