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

import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { createColumnHelper } from "@tanstack/react-table";
import Button from "@ecotoken/ui/components/Button";
import { CardDescription, CardTitle } from "@ecotoken/ui/components/Card";
import Table from "@ecotoken/ui/components/Table";

type Unarrayify<T> = T extends Array<infer E> ? E : T;

const EcoOrders = () => {
    const router = useRouter();

    const { data } = trpc.ecoOrders.getAll.useInfiniteQuery({});
    const orders = data?.pages.flatMap((data) => data.orders);
    type Order = Unarrayify<typeof orders>;

    const columnHelper = createColumnHelper<Order>();

    const columns = [
        columnHelper.accessor("ecoOrderID", {
            header: "Order ID",
            id: "id",
        }),
        columnHelper.accessor("userID", {
            header: "User ID",
        }),
        columnHelper.accessor("payAmount", {
            header: "Payed",
        }),
        columnHelper.accessor("creditsPurchased", {
            header: "Credits",
        }),
        columnHelper.accessor("retireBy", {
            header: "Retired By",
        }),
        columnHelper.accessor("userWallet", {
            header: "User Wallet",
        }),
        columnHelper.accessor("payHash", {
            header: "Tx. Hash",
        }),
        columnHelper.accessor("retireHash", {
            header: "Retire Hash",
        }),
        columnHelper.accessor("createdAt", {
            header: "Created At",
            cell: (info) => <>{info.renderValue()?.toDateString()}</>,
        }),
    ];

    return (
        <div className="space-y-4">
            <div className="flex w-full">
                <div>
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>
                        A list of all available orders.
                    </CardDescription>
                </div>
                <div className="flex flex-1 items-end justify-end space-x-2">
                    <Button
                        onClick={() => router.push(`${router.asPath}/create`)}
                    >
                        Create an order
                    </Button>
                </div>
            </div>
            <Table data={orders ?? []} columns={columns} fullWidth />
        </div>
    );
};

export default EcoOrders;
