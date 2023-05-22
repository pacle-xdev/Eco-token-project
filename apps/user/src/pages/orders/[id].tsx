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
/* eslint-disable */
import { useRouter } from "next/router";
import NftPreview from "@/components/project/nft-preview";
import { trpc } from "@/utils/trpc";
import Spinner from "@ecotoken/ui/components/Spinner";

import { formatCountryAndState } from "../../../../admin/src/utils/formatter";

const Order: React.FC = () => {
    const router = useRouter();

    let { id } = router.query;
    if (typeof id !== "string" && typeof id !== "undefined") id = id[0];
    if (!id) id = "";

    const { data: order, isLoading } = trpc.ecoOrders.get.useQuery({
        ecoOrderID: id,
        project: true,
    });

    if (isLoading) return <Spinner />;
    else if (!order) return <div>No order found.</div>;

    const imageUrl = order.nftSeries?.project?.headImage?.startsWith("https")
        ? order.nftSeries.project?.headImage
        : `${process.env.NEXT_PUBLIC_CDN_URL}/${order.nftSeries.project?.headImage}`;

    const nftImageURL = `${process.env.NEXT_PUBLIC_CDN_URL}/eco-projects/${order.nftSeries?.project?.projectID}/nft-series/${order.nftSeries?.nftSeriesID}/nfts/${order.payHash}.png`;

    if (order?.status === "ORDER_COMPLETE")
        return (
            <div className="relative flex w-full flex-col border-red-600 ">
                <div
                    className="border-6 flex h-[120px] w-full items-end border-purple-500 px-8 py-10 [background-position:0%_80%]"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                >
                    <h2 className="font-head text-3xl font-semibold text-white ">
                        {order.nftSeries?.project?.title}
                    </h2>
                </div>
                {/* <div className="relative h-96 w-full rounded-lg">
                    <Image
                        src={imageUrl}
                        alt="EcoProject thumbnail image"
                        className=" h-60 min-h-[200px] w-full object-cover"
                        fill
                    />
                </div> */}
                <div className="mx-auto mt-10 flex w-[1400px] flex-col flex-wrap items-start justify-between px-3 lg:flex-row-reverse lg:flex-nowrap">
                    <NftPreview
                        image={imageUrl}
                        project={order.nftSeries?.project?.shortTitle}
                        location={formatCountryAndState(
                            order.nftSeries?.project?.location?.location ?? "",
                            order.nftSeries?.project?.location?.cn ?? "",
                            order.nftSeries?.project?.location?.st ?? "",
                        )}
                        producer={
                            order.nftSeries?.project?.producer?.companyName ??
                            undefined
                        }
                        batch={order.nftSeries.regenBatch}
                        symbol={order.nftSeries.seriesType}
                        credits={Number(order.creditsPurchased)}
                        retiredBy={order.retireBy}
                        date={new Date(order.createdAt)}
                    />
                    <div className="space-y-2 lg:w-[600px]">
                        <h1 className="text-4xl font-bold">Order Complete!</h1>
                        <div className="space-y-1">
                            <p className="text-lg font-semibold">
                                {order.nftSeries?.project?.title}
                            </p>
                            {order.nftSeries?.project?.location && (
                                <p className="font-medium text-[#656565]">
                                    {formatCountryAndState(
                                        order.nftSeries?.project?.location
                                            .location,
                                        order.nftSeries?.project?.location.cn,
                                        order.nftSeries?.project?.location.st,
                                    )}
                                </p>
                            )}
                        </div>
                        {/* <p className="mt-[50px] text-[27px] font-[500] text-[#00AEEF]">
                            Credit Retirement Process
                        </p>
                        <div className="w-full">
                            <Stepper title="FUNDS ReCEIVED" status={true} />
                            <Stepper
                                title="REQUEST TO RETIRE SENT"
                                status={true}
                            />
                            <Stepper title="Credits retired" status={true} />
                            <Stepper title="NFT being created" status={true} />
                            <Stepper
                                title="NFT IN YOUR WALLET"
                                status={false}
                            />
                            <Stepper title="order Complete" status={false} />
                            <Stepper
                                title="SHARE your CONTRIBUTION"
                                status={false}
                            />
                        </div> */}
                    </div>
                </div>
            </div>
        );
    else return <></>;
    // else
    //     return (
    //         <div className="min-h-screen w-full">
    //             <div className="relative h-[17.5rem] w-full">
    //                 <Image
    //                     fill
    //                     src={imageUrl}
    //                     alt="EcoProject head image"
    //                     style={{ objectFit: "cover" }}
    //                 />
    //             </div>
    //             <div className="flex w-full flex-1 space-x-8 px-20 pt-10">
    //                 <div className="flex w-fit flex-1 flex-col">
    //                     <h1 className="text-4xl font-bold">Order Complete!</h1>
    //                     <h3 className="font-medium">
    //                         {order.nftSeries?.project?.title}
    //                     </h3>
    //                 </div>
    //                 <div className="relative flex w-1/2 flex-1">
    //                     <div className="relative h-[32rem] w-[32rem] overflow-hidden rounded-lg">
    //                         <Image
    //                             fill
    //                             src={nftImageURL}
    //                             alt="EcoProject head image"
    //                             style={{ objectFit: "cover" }}
    //                             priority
    //                         />
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     );
};

export default Order;
