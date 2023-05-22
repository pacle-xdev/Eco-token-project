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

import Button from "@ecotoken/ui/components/Button";
import { CardDescription, CardTitle } from "@ecotoken/ui/components/Card";
import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import DefaultCard from "@ecotoken/ui/components/Card";
import { trpc } from "@/utils/trpc";
import clsx from "clsx";
import { Transition } from "@headlessui/react";

const RoleItem: React.FC<{ name?: string; loading?: boolean }> = ({
    name,
    loading = false,
}) => {
    return (
        <div
            suppressHydrationWarning={true}
            className={clsx("rounded-md bg-slate-300 px-2 py-0.5", {
                "animate-pulse text-transparent": loading,
            })}
        >
            {name}
        </div>
    );
};

const Roles = () => {
    const { data: roleData, isLoading: areRolesLoading } =
        trpc.roles.getAll.useInfiniteQuery({});
    const { data: permissionData, isLoading: arePermissionsLoading } =
        trpc.permissions.getAll.useInfiniteQuery({});

    return (
        <div className="h-full w-full">
            <Tab.Group as="div" className="space-y-8">
                <Tab.List className="[&>*]:tab space-x-2 border-slate-400">
                    <Tab className="ui-selected:bg-slate-500 ui-selected:text-white ui-not-selected:bg-slate-200 ui-not-selected:text-black ui-selected: h-16 w-32 rounded-lg px-4 pt-2 pb-8 align-top duration-150 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1 focus:ring-offset-slate-200">
                        Roles
                    </Tab>
                    <Tab className="ui-selected:bg-slate-500 ui-selected:text-white ui-not-selected:bg-slate-200 ui-not-selected:text-black ui-selected: ui-selected:focus:ring-slate-500 ui-not-selected:focus:ring-slate-200 w-32 rounded-lg px-4 py-2 align-top duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-200">
                        Permissions
                    </Tab>
                </Tab.List>
                <Tab.Panels>
                    {/* Roles Panel */}
                    <Tab.Panel as={Fragment}>
                        <DefaultCard className="w-full max-w-5xl space-y-6">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <CardTitle>Roles</CardTitle>
                                    <CardDescription>
                                        A place to view, create, update, and
                                        delete roles.
                                    </CardDescription>
                                </div>
                                <Button className="h-fit justify-end">
                                    Create
                                </Button>
                            </div>
                            {arePermissionsLoading ? (
                                <Transition
                                    appear
                                    show={areRolesLoading}
                                    as="div"
                                    className="flex w-full flex-wrap gap-2"
                                    enter="transition-all ease-out duration-200"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="transition-all ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    {[...(Array(21) as number[])].map(
                                        (_, index) => (
                                            <RoleItem
                                                key={index}
                                                name={"a".repeat(index)}
                                                loading={arePermissionsLoading}
                                            />
                                        ),
                                    )}
                                </Transition>
                            ) : (
                                <div className="flex w-full flex-wrap gap-2">
                                    {roleData?.pages[0]?.roles.map(
                                        (permissions) => (
                                            <RoleItem
                                                key={permissions.roleID}
                                                name={permissions.role}
                                            />
                                        ),
                                    )}
                                </div>
                            )}
                        </DefaultCard>
                    </Tab.Panel>
                    {/* Permissions Panel */}
                    <Tab.Panel>
                        <DefaultCard className="w-full max-w-5xl space-y-6">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <CardTitle>Permissions</CardTitle>
                                    <CardDescription>
                                        A place to view, create, update, and
                                        delete permissions.
                                    </CardDescription>
                                </div>
                                <Button className="h-fit justify-end">
                                    Create
                                </Button>
                            </div>
                            {arePermissionsLoading ? (
                                <Transition
                                    appear
                                    show={arePermissionsLoading}
                                    as="div"
                                    className="flex w-full flex-wrap gap-2"
                                    enter="transition-all ease-out duration-200"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="transition-all ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    {[...(Array(21) as number[])].map(
                                        (_, index) => (
                                            <RoleItem
                                                key={index}
                                                name={"a".repeat(index)}
                                                loading={arePermissionsLoading}
                                            />
                                        ),
                                    )}
                                </Transition>
                            ) : (
                                <div className="flex w-full flex-wrap gap-2">
                                    {permissionData?.pages[0]?.permissions.map(
                                        (permissions) => (
                                            <RoleItem
                                                key={permissions.permissionID}
                                                name={permissions.permission}
                                            />
                                        ),
                                    )}
                                </div>
                            )}
                        </DefaultCard>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export default Roles;
