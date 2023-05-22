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
import ProjectTabPanel from "@/components/eco-project/project-tab-panel";
import { trpc } from "@/utils/trpc";
import { createColumnHelper } from "@tanstack/react-table";
import { toast } from "react-hot-toast";
import { CardTitle } from "@ecotoken/ui/components/Card";
import Spinner from "@ecotoken/ui/components/Spinner";
import Table from "@ecotoken/ui/components/Table";

type Unarrayify<T> = T extends Array<infer E> ? E : T;

const Orders = () => {
    const router = useRouter();
    const { id } = router.query;

    const { data, isLoading } = trpc.ecoOrders.getAll.useInfiniteQuery(
        {
            project: id as string,
        },
        {
            enabled: !!id,
        },
    );

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

    if (!data) {
        if (isLoading) return <Spinner />;
        else {
            toast.error("No orders found.");
            router.push("/eco-projects");
            return null;
        }
    } else
        return (
            <ProjectTabPanel index={8} projectId={id}>
                <div className="p-5 overflow-x-auto">
                    <CardTitle>Orders</CardTitle>
                    <Table data={orders ?? []} columns={columns} fullWidth />
                </div>
            </ProjectTabPanel>
        );
};

export default Orders;
