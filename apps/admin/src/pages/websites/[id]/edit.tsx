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
import { CardDescription, CardTitle } from "@ecotoken/ui/components/Card";
import { updateWebsiteSchema } from "@ecotoken/api/src/schema/website";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Spinner from "@ecotoken/ui/components/Spinner";
import Button from "@ecotoken/ui/components/Button";
import { Transition } from "@headlessui/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { Fragment } from "react";
import Link from "next/link";

const EditWebsite = () => {
    const router = useRouter();
    const context = trpc.useContext();
    let { id } = router.query;
    if (typeof id !== "string" && typeof id !== "undefined") id = id[0];
    if (!id) id = "";

    const form = useZodForm({
        schema: updateWebsiteSchema,
    });

    const { data: website, isLoading: isFetching } = trpc.websites.get.useQuery(
        {
            siteID: id,
        },
        {
            enabled: !!id,
            refetchOnWindowFocus: false,
            onSuccess(data) {
                form.reset({
                    ...data,
                });
            },
        },
    );

    const { mutateAsync, isLoading } = trpc.websites.update.useMutation({
        onSuccess: async () => {
            await context.websites.get.invalidate({
                siteID: id as string,
            });
            await context.websites.getAll.invalidate();
            toast.success("Website has been edited.");
        },
        onError(e) {
            toast.error(e.message);
        },
    });

    const { mutateAsync: deleteMutate, isLoading: isDeleting } =
        trpc.websites.delete.useMutation({
            onSuccess: async () => {
                await context.websites.getAll.invalidate();
                router.push("/websites");
                toast.success("Website has been deleted.");
            },
            onError(e) {
                toast.error(e.message);
            },
        });

    if (!website) {
        if (isFetching) return <Spinner />;
        else {
            toast.error("Website does not exist.");
            router.push("/websites");
            return null;
        }
    } else {
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
                            <CardTitle>Edit Website</CardTitle>
                            <CardDescription>
                                Update a website in the database.
                            </CardDescription>
                        </div>
                    </div>
                    <Form
                        form={form}
                        className="flex w-full flex-col gap-4"
                        onSubmit={async (website) =>
                            await mutateAsync({
                                ...website,
                                siteID: id as string,
                            })
                        }
                    >
                        <div className="flex flex-col gap-4">
                            <FormInput
                                label="Site Name"
                                size="full"
                                {...form.register("siteName")}
                            />
                            <FormInput
                                label="Legal Name"
                                size="full"
                                {...form.register("legalName")}
                            />
                            <FormInput
                                label="Mailing Address"
                                size="full"
                                {...form.register("mailAddress")}
                            />
                            <FormInput
                                label="Production URL"
                                size="full"
                                {...form.register("prodUrl")}
                            />
                            <FormInput
                                label="Staging URL"
                                size="full"
                                {...form.register("stageUrl")}
                            />
                            <FormInput
                                label="Development URL"
                                size="full"
                                {...form.register("devUrl")}
                            />
                        </div>
                        <div className="w-full space-y-1.5">
                            <Button loading={isLoading} fullWidth>
                                Update
                            </Button>
                            <Button
                                type="button"
                                loading={isDeleting}
                                intent="destructive"
                                fullWidth
                                onClick={async () =>
                                    await deleteMutate({
                                        siteID: id as string,
                                    })
                                }
                            >
                                Delete
                            </Button>
                        </div>
                    </Form>
                </div>
            </Transition>
        );
    }

    return <div>Edit website {id}</div>;
};

export default EditWebsite;
