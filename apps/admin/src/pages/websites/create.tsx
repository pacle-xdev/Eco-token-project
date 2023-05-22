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
import { createWebsiteSchema } from "@ecotoken/api/src/schema/website";
import Button from "@ecotoken/ui/components/Button";
import { CardDescription, CardTitle } from "@ecotoken/ui/components/Card";
import Form, { FormInput, useZodForm } from "@ecotoken/ui/components/Form";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { toast } from "react-hot-toast";

const CreateWebsite = () => {
	const router = useRouter();
	const context = trpc.useContext();
	const { mutateAsync, isLoading } = trpc.websites.create.useMutation({
		onSuccess: async (data) => {
			router.push(`/websites/${data.siteID}/edit`);
			await context.websites.getAll.invalidate();
			toast.success("Admin user has been created.");
		},
		onError(e) {
			toast.error(e.message);
		}
	});

	const form = useZodForm({
		schema: createWebsiteSchema
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
					<Link href="/websites" className="inline-block">
						<FontAwesomeIcon
							icon={faArrowLeft}
							size="lg"
							className="mt-1.5 text-slate-400"
						/>
					</Link>
					<div>
						<CardTitle>Create Website</CardTitle>
						<CardDescription>Create a website.</CardDescription>
					</div>
				</div>
				{/* <WebsiteCreateForm
					loading={isLoading}
					onCreate={async (website) => {
						await mutateAsync({
							...website
						});
					}}
				/> */}
				<Form
					form={form}
					className="flex w-full flex-col gap-4"
					onSubmit={async (website) =>
						await mutateAsync({
							...website
						})
					}
				>
					<div className="flex flex-col gap-4">
						<FormInput
							label="Site Name"
							size="xl"
							{...form.register("siteName")}
						/>
						<FormInput
							label="Production URL"
							size="xl"
							{...form.register("prodUrl")}
						/>
						<FormInput
							label="Staging URL"
							size="xl"
							{...form.register("prodUrl")}
						/>
						<FormInput
							label="Development URL"
							size="xl"
							{...form.register("prodUrl")}
						/>
					</div>
					<Button loading={isLoading} fullWidth>
						Create
					</Button>
				</Form>
			</div>
		</Transition>
	);
};

export default CreateWebsite;
