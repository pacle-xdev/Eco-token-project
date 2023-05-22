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

import { trpc } from "@/utils/trpc";
import { createAdminUserSchema } from "@ecotoken/api/src/schema/admin-user";
import { CardTitle, CardDescription } from "@ecotoken/ui/components/Card";
import Form, {
    FormInput,
    FormSelect,
    useZodForm,
} from "@ecotoken/ui/components/Form";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import generator from "generate-password";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { Fragment, useMemo } from "react";
import Link from "next/link";
import Button from "@ecotoken/ui/components/Button";

const AdminUserCreate = () => {
    const router = useRouter();
    const context = trpc.useContext();
    const { mutateAsync, isLoading } = trpc.adminUsers.create.useMutation({
        onSuccess: async (data) => {
            await context.adminUsers.getAll.invalidate();
            router.push(`/admin-users/${data.adminID}/edit`);
            toast.success("Admin user has been created.");
        },
        onError(e) {
            toast.error(e.message);
        },
    });

    const { data: roles, isLoading: areRolesLoading } =
        trpc.roles.getAll.useInfiniteQuery({
            domain: "ADMIN",
        });

    const mappedRoles = useMemo(
        () => roles?.pages.flatMap((page) => page.roles),
        [roles],
    );

    const form = useZodForm({
        schema: createAdminUserSchema,
    });

    return (
        <Transition
            as={Fragment}
            show
            appear
            enter="ease-out duration-500"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="ease-in duration-500"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-2"
        >
            <div className="space-y-4">
                <div className="flex space-x-2">
                    <Link href="/admin-users" className="inline-block">
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            size="lg"
                            className="mt-1.5 text-slate-400"
                        />
                    </Link>
                    <div>
                        <CardTitle>Create User</CardTitle>
                        <CardDescription>
                            Create an admin user in the database.
                        </CardDescription>
                    </div>
                </div>
                <Form
                    form={form}
                    onSubmit={async (data) => {
                        await mutateAsync({
                            ...data,
                        });
                    }}
                    className="flex w-full flex-col gap-4"
                >
                    <div className="flex flex-col gap-4 md:flex-row">
                        <FormSelect label="Role" {...form.register("roleID")}>
                            {mappedRoles?.map((role) => (
                                <option key={role.roleID} value={role.roleID}>
                                    {role.role}
                                </option>
                            ))}
                        </FormSelect>
                    </div>
                    <div className="flex flex-col gap-4 md:flex-row">
                        <FormInput
                            label="First Name"
                            {...form.register("firstName")}
                        />
                        <FormInput
                            label="Last Name"
                            {...form.register("lastName")}
                        />
                    </div>
                    <div className="flex flex-col gap-4 md:flex-row">
                        <FormInput
                            label="Username"
                            {...form.register("username")}
                        />
                        <FormInput
                            label="Email"
                            type="email"
                            {...form.register("email")}
                        />
                    </div>
                    <div>
                        <div className="flex flex-col gap-4 md:flex-row">
                            <FormInput
                                label="Password"
                                {...form.register("password")}
                            />
                            <FormInput
                                label="Confirm Password"
                                {...form.register("confirmPassword")}
                            />
                        </div>
                        <span
                            className="cursor-pointer select-none text-xs text-slate-400 underline underline-offset-2 ease-linear hover:text-slate-500"
                            onClick={() => {
                                const password = generator.generate({
                                    length: 20,
                                    numbers: true,
                                    symbols: true,
                                    strict: true,
                                });
                                form.setValue("password", password);
                                form.setValue("confirmPassword", password);
                            }}
                        >
                            Generate a secure password automatically
                        </span>
                    </div>
                    <Button loading={isLoading || areRolesLoading} fullWidth>
                        Create
                    </Button>
                </Form>
            </div>
        </Transition>
    );
};

export default AdminUserCreate;
