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

// import { type RouterInputs, trpc } from "@/utils/trpc";
// import { createUserSchema } from "@ecotoken/api/src/schema/user";
// import Button from "@ecotoken/ui/components/Button";
// import { useRouter } from "next/router";
// import Form, { FormInput, useZodForm } from "@ecotoken/ui/components/Form";
// import { toast } from "react-hot-toast";
import { type NextPageWithLayout } from "./_app";
// import logo from "@ecotoken/ui/assets/brand/logo.png";
// import Image from "next/image";
// import Link from "@ecotoken/ui/components/Link";

// type RegisterFormInput = RouterInputs["userAuth"]["register"];

const Register: NextPageWithLayout = () => {
    // const form = useZodForm({
    //     // add the confirm password verifier only to the form, ignoring the official schema to allow
    //     schema: createUserSchema.superRefine(
    //         ({ password, confirmPassword }, ctx) => {
    //             if (confirmPassword !== password) {
    //                 ctx.addIssue({
    //                     code: "custom",
    //                     path: ["confirmPassword"],
    //                     message: "Passwords do not match!",
    //                 });
    //             }
    //         },
    //     ),
    // });

    // const router = useRouter();

    // const { mutateAsync, isLoading } = trpc.userAuth.register.useMutation({
    // 	async onSuccess() {
    // 		await router.push("/email-verification");
    // 	},
    // 	onError(e) {
    // 		toast.error(e.message);
    // 	}
    // });

    // const onSubmit = async (values: RegisterFormInput) => {
    //     await mutateAsync({
    //         ...values,
    //     });
    // };

    return (
        <div className="flex h-full w-full items-center justify-center">
            {/* <Form
				form={form}
				onSubmit={onSubmit}
				className="max-w-sm space-y-4 rounded-md border border-slate-300 bg-slate-200 p-6"
			>
				<div className="flex flex-col items-center space-y-4">
					<div className="relative h-12 min-h-[2rem] w-12 min-w-[2rem]">
						<Image
							src={logo}
							alt="ecoToken logo"
							fill
							className="object-contain"
						/>
					</div>
					<div className="text-center">
						<h1 className="appearance-none text-xl font-bold text-slate-700">
							Register
						</h1>
						<h3 className="appearance-none text-sm text-slate-700">
							Register for an ecoToken account.
						</h3>
					</div>
				</div>
				<FormInput
					wrapperClass="flex flex-col flex-1"
					size="full"
					label="First name"
					{...form.register("firstName")}
				/>
				<FormInput
					wrapperClass="flex flex-col flex-1"
					size="full"
					label="Last name"
					{...form.register("lastName")}
				/>
				<FormInput
					size="full"
					label="Email"
					{...form.register("email")}
				/>
				<FormInput
					size="full"
					label="Username"
					{...form.register("username")}
				/>
				<FormInput
					size="full"
					label="Password"
					type="password"
					{...form.register("password")}
				/>
				<FormInput
					size="full"
					label="Confirm Password"
					type="password"
					{...form.register("confirmPassword")}
				/>
				<div className="space-y-2">
					<Button fullWidth loading={isLoading}>
						Register
					</Button>
					<span className="block text-center">
						Already have an account?{" "}
						<Link
							href="/login"
							underline={false}
							className="text-right"
						>
							Login here.
						</Link>
					</span>
				</div>
			</Form> */}
        </div>
    );
};

Register.getLayout = (page) => <>{page}</>;

export default Register;
