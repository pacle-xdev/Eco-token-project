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
import { formatEnum } from "@/utils/formatter";
import { trpc } from "@/utils/trpc";
import { createColumnHelper } from "@tanstack/react-table";
import Button from "@ecotoken/ui/components/Button";
import DefaultCard, {
    CardDescription,
    CardTitle,
} from "@ecotoken/ui/components/Card";
import Table from "@ecotoken/ui/components/Table";

type Unarrayify<T> = T extends Array<infer E> ? E : T;

const EcoProjectsList = () => {
    const router = useRouter();

    const { data } = trpc.ecoProjects.getAll.useInfiniteQuery({});
    const projects = data?.pages.flatMap((data) => data.projects);
    type Project = Unarrayify<typeof projects>;

    const columnHelper = createColumnHelper<Project>();
    const columns = [
        columnHelper.accessor("projectID", {
            header: "Project ID",
            id: "id",
        }),
        columnHelper.accessor("status", {
            header: "Status",
            cell: (info) => formatEnum(info.getValue()),
        }),
        columnHelper.accessor("shortTitle", {
            header: "Short Title",
        }),
        columnHelper.accessor("fundAmount", {
            header: "Fund Amount",
        }),
        columnHelper.accessor("fundRecieved", {
            header: "Fund Recieved",
        }),
        columnHelper.accessor("creditType", {
            header: "Project Type",
            cell: (info) => formatEnum(info.getValue()),
        }),
        columnHelper.accessor("createdAt", {
            header: "Created At",
            cell: (info) => info.renderValue()?.toDateString(),
        }),
    ];

    return (
        <div className="w-full text-black">
            <DefaultCard className="flex w-full flex-col space-y-4" size="half">
                <div className="flex w-full">
                    <div>
                        <CardTitle>Eco Projects</CardTitle>
                        <CardDescription>
                            A list of all available eco projects.
                        </CardDescription>
                    </div>
                    <div className="flex flex-1 items-end justify-end space-x-2">
                        <Button
                            onClick={async () =>
                                await router.push(`${router.asPath}/create`)
                            }
                        >
                            Create a project
                        </Button>
                    </div>
                </div>
                <Table data={projects ?? []} columns={columns} fullWidth />
            </DefaultCard>
        </div>
    );
};

export default EcoProjectsList;
