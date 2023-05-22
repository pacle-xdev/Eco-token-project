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

import React, { useMemo } from "react";
import DefaultCard, {
    CardDescription,
    CardTitle,
} from "@ecotoken/ui/components/Card";
import Table from "@ecotoken/ui/components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { trpc } from "@/utils/trpc";

import { type AdminUser } from "@prisma/client";
import Button from "@ecotoken/ui/components/Button";
import { useRouter } from "next/router";

const AdminUsers = () => {
    const { data } = trpc.adminUsers.getAll.useInfiniteQuery({});
    const router = useRouter();
    const columnHelper = createColumnHelper<AdminUser>();

    const { data: roles } = trpc.roles.getAll.useInfiniteQuery({
        domain: "ADMIN",
    });

    const transformedRoles = useMemo(
        () => roles?.pages.flatMap((rolePage) => rolePage.roles),
        [roles],
    );

    const columns = [
        columnHelper.accessor("adminID", {
            header: "Admin ID",
            id: "id",
        }),
        columnHelper.accessor("roleID", {
            header: "Role",
            cell: (info) => {
                if (transformedRoles) {
                    const foundRole = transformedRoles.find(
                        (role) => role.roleID === info.getValue(),
                    );
                    if (foundRole) return foundRole.role;
                }
                return info.getValue();
            },
        }),
        columnHelper.accessor("username", {
            header: "Username",
        }),
        columnHelper.accessor("email", {
            header: "Email Address",
        }),
        columnHelper.accessor("firstName", {
            header: "First Name",
        }),
        columnHelper.accessor("lastName", {
            header: "Last Name",
        }),
        columnHelper.accessor("lastLogin", {
            header: "Last Login",
            cell: (info) => info.getValue()?.toDateString(),
        }),
        columnHelper.accessor("createdAt", {
            header: "Created At",
            cell: (info) => info.getValue().toDateString(),
        }),
        columnHelper.accessor("updatedAt", {
            header: "Updated At",
            cell: (info) => info.getValue().toDateString(),
        }),
        columnHelper.accessor("hits", {
            header: "Hits",
        }),
    ];

    return (
        <div>
            <DefaultCard className="space-y-4">
                <div className="flex w-full">
                    <div className="flex flex-col">
                        <CardTitle>Admin Users</CardTitle>
                        <CardDescription>
                            A list of all ecoToken admin users.
                        </CardDescription>
                    </div>
                    <div className="flex flex-1 items-end justify-end space-x-2">
                        <Button
                            onClick={() =>
                                router.push(`${router.asPath}/create`)
                            }
                        >
                            Add User
                        </Button>
                    </div>
                </div>
                <Table
                    data={data?.pages[0]?.adminUsers ?? []}
                    columns={columns}
                    alternate
                    fullWidth
                />
            </DefaultCard>
        </div>
    );
};

export default AdminUsers;
