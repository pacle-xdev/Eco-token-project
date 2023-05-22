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

import Form, { FormInput, useZodForm } from "@ecotoken/ui/components/Form";
import { loginAdminUserSchema } from "@ecotoken/api/src/schema/admin-user";
import Button from "@ecotoken/ui/components/Button";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { trpc } from "@/utils/trpc";

const Login = () => {
    const { mutateAsync, isLoading } = trpc.adminAuth.login.useMutation({
        onSuccess() {
            router.push("/");
            toast.success("Login success.");
        },
        onError(e) {
            toast.error(e.message);
        },
    });
    const router = useRouter();

    const form = useZodForm({
        schema: loginAdminUserSchema,
    });

    return (
        <div className="flex h-full w-full items-center justify-center">
            <Form
                form={form}
                onSubmit={async ({ username, password }) => {
                    await mutateAsync({
                        username,
                        password,
                    });
                }}
                className="m-4 space-y-4 rounded-md bg-slate-200 p-4"
            >
                <FormInput
                    label="Username"
                    size="full"
                    {...form.register("username")}
                />
                <FormInput
                    size="full"
                    label="Password"
                    type="password"
                    {...form.register("password")}
                />
                <Button fullWidth loading={isLoading}>
                    Login
                </Button>
            </Form>
        </div>
    );
};

Login.getLayout = (page: React.ReactElement) => <>{page}</>;
export default Login;
