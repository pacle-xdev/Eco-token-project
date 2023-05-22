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

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ProjectTabPanel from "@/components/eco-project/project-tab-panel";
import { formatEnum } from "@/utils/formatter";
import { trpc } from "@/utils/trpc";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-hot-toast";
import {
    ecoProjectEnumSchema,
    editEcoProjectSchema,
} from "@ecotoken/api/src/schema/project";
import Button from "@ecotoken/ui/components/Button";
import DefaultCard, { CardTitle } from "@ecotoken/ui/components/Card";
import Form, {
    FormInput,
    FormSelect,
    useZodForm,
} from "@ecotoken/ui/components/Form";
import Spinner from "@ecotoken/ui/components/Spinner";

const Summary = () => {
    const router = useRouter();
    const context = trpc.useContext();
    const { id } = router.query;

    const { data: fetchedProject, isLoading: fetchingProject } =
        trpc.ecoProjects.get.useQuery(
            {
                projectID: id as string,
            },
            {
                enabled: !!id,
                onSuccess(data) {
                    if (data) {
                        const {
                            title,
                            shortTitle,
                            identifier,
                            producerID,
                            status,
                            isVisible,
                            isFeatured,
                            needsFunding,
                        } = data;
                        form.reset({
                            title,
                            shortTitle,
                            identifier,
                            producerID,
                            status,
                            isVisible,
                            isFeatured,
                            needsFunding,
                        });
                    }
                },
            },
        );

    const { data: users, isLoading: fetchingUsers } =
        trpc.users.getAll.useInfiniteQuery({
            role: ["Producer", "Verifier"],
        });

    const cachedUsers = useMemo(
        () => users?.pages.flatMap((page) => page.users),
        [users],
    );

    const producerUsers = useMemo(
        () => cachedUsers?.filter((user) => user.role.role === "Producer"),
        [cachedUsers],
    );

    const { mutateAsync: editMutate, isLoading: isUpdating } =
        trpc.ecoProjects.update.useMutation({
            onSuccess: async () => {
                await context.ecoProjects.getAll.invalidate();
                await context.ecoProjects.get.invalidate({
                    projectID: id as string,
                });
                toast.success("Project has been edited.");
            },
            onError(e) {
                toast.error(e.message);
            },
        });

    const { mutateAsync: deleteMutate, isLoading: isDeleting } =
        trpc.ecoProjects.delete.useMutation({
            onSuccess: async () => {
                await context.ecoProjects.getAll.invalidate();
                router.push("/eco-projects");
                toast.success("Project has been deleted.");
            },
            onError(e) {
                toast.error(e.message);
            },
        });

    const form = useZodForm({
        schema: editEcoProjectSchema.omit({
            projectID: true,
        }),
    });

    if (!fetchedProject) {
        if (fetchingProject) return <Spinner />;
        else {
            toast.error("Project does not exist.");
            router.push("/eco-projects");
            return null;
        }
    } else
        return (
            <div className="w-full">
                <ProjectTabPanel index={1} projectId={id}>
                    <DefaultCard
                        className="flex w-full flex-col space-y-4"
                        size="half"
                    >
                        <div className="flex space-x-2">
                            <Link href="/eco-projects" className="inline-block">
                                <FontAwesomeIcon
                                    icon={faArrowLeft}
                                    size="lg"
                                    className="mt-1.5 text-slate-400"
                                />
                            </Link>
                            <div>
                                <CardTitle>Project Summary</CardTitle>
                            </div>
                        </div>
                        <Form
                            form={form}
                            onSubmit={async (project) => {
                                await editMutate({
                                    ...project,
                                    projectID: id as string,
                                });
                            }}
                            className="flex w-fit flex-col gap-4"
                        >
                            <FormInput
                                label="Project Title"
                                size="xl"
                                wrapperClass="w-fit"
                                {...form.register("title")}
                            />
                            <FormInput
                                label="Short Title"
                                size="xl"
                                wrapperClass="w-fit"
                                {...form.register("shortTitle")}
                            />
                            <FormInput
                                label="Project Identifier"
                                size="xl"
                                wrapperClass="w-fit"
                                {...form.register("identifier")}
                            />
                            <FormSelect
                                label="Producer"
                                size="xl"
                                wrapperClass="w-fit"
                                defaultValue=""
                                {...form.register("producerID")}
                            >
                                <option value="" hidden></option>
                                {producerUsers?.map((user) => (
                                    <option
                                        key={user.userID}
                                        value={user.userID}
                                    >
                                        {user.username}
                                        {" - "}
                                        {user.email}
                                    </option>
                                ))}
                            </FormSelect>
                            <FormSelect
                                label="Project Status"
                                size="xl"
                                wrapperClass="w-fit"
                                {...form.register("status")}
                            >
                                {ecoProjectEnumSchema.shape.status.options?.map(
                                    (type) => (
                                        <option key={type} value={type}>
                                            {formatEnum(type)}
                                        </option>
                                    ),
                                )}
                            </FormSelect>
                            <FormSelect
                                label="Credit Type"
                                size="xl"
                                wrapperClass="w-fit"
                                {...form.register("creditType")}
                            >
                                {ecoProjectEnumSchema.shape.creditType.options?.map(
                                    (type) => (
                                        <option key={type} value={type}>
                                            {formatEnum(type)}
                                        </option>
                                    ),
                                )}
                            </FormSelect>
                            <FormInput
                                label="Needs Funding"
                                type="checkbox"
                                size="xl"
                                wrapperClass="w-fit flex space-x-2"
                                className="w-fit"
                                {...form.register("needsFunding")}
                            />
                            <FormInput
                                label="Featured"
                                type="checkbox"
                                size="xl"
                                wrapperClass="w-fit flex space-x-2"
                                className="w-fit"
                                {...form.register("isFeatured")}
                            />
                            <FormInput
                                label="Visible"
                                type="checkbox"
                                size="xl"
                                wrapperClass="w-fit flex space-x-2"
                                className="w-fit"
                                {...form.register("isVisible")}
                            />
                            <div className="space-y-1.5">
                                <Button
                                    fullWidth
                                    loading={
                                        fetchingUsers ||
                                        fetchingProject ||
                                        isUpdating
                                    }
                                >
                                    Update
                                </Button>
                                <Button
                                    intent="destructive"
                                    type="button"
                                    loading={isDeleting}
                                    fullWidth
                                    onClick={async () => {
                                        if (location)
                                            await deleteMutate({
                                                projectID: id as string,
                                            });
                                    }}
                                >
                                    Delete
                                </Button>
                            </div>
                        </Form>
                    </DefaultCard>
                </ProjectTabPanel>
            </div>
        );
};

export default Summary;
