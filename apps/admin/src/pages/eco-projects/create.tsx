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
import ProjectTabPanelForCreate from "@/components/eco-project/project-tab-panel-for-create";
import { formatEnum } from "@/utils/formatter";
import { trpc } from "@/utils/trpc";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createId } from "@paralleldrive/cuid2";
import { toast } from "react-hot-toast";
import { createEcoProjectSchema } from "@ecotoken/api/src/schema/project";
import Button from "@ecotoken/ui/components/Button";
import DefaultCard, { CardTitle } from "@ecotoken/ui/components/Card";
import Form, {
    FormInput,
    FormSelect,
    useZodForm,
} from "@ecotoken/ui/components/Form";

const CreateEcoProject = () => {
    const router = useRouter();
    const context = trpc.useContext();

    const { mutateAsync, isLoading: isCreatingProject } =
        trpc.ecoProjects.create.useMutation({
            async onSuccess(data) {
                context.ecoProjects.getAll.invalidate();
                await router.push(`/eco-projects/${data.projectID}/edit`);
                toast.success("Project created successfully.");
            },
        });

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

    const form = useZodForm({
        schema: createEcoProjectSchema.omit({
            projectID: true,
        }),
    });

    return (
        <div className="w-full space-y-4">
            <ProjectTabPanelForCreate index={1}>
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
                            {/* <CardDescription>
                                    Create an eco project.
                                </CardDescription> */}
                        </div>
                    </div>
                    <Form
                        form={form}
                        onSubmit={async (project) => {
                            const projectID = createId();
                            await mutateAsync({
                                ...project,
                                projectID,
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
                                <option key={user.userID} value={user.userID}>
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
                            {createEcoProjectSchema.shape.status.options?.map(
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
                            {createEcoProjectSchema.shape.creditType.options?.map(
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
                        {/* <FormSelect
                                label="Location"
                                size="xl"
                                wrapperClass="w-fit"
                                defaultValue=""
                                {...form.register("locationID")}
                            >
                                <option value="" hidden></option>
                                {cachedLocations?.map((location) => (
                                    <option
                                        key={location.locationID}
                                        value={location.locationID}
                                    >
                                        {`${location.location}, 
								${formatCountryAndState(location.cn, location.st)}`}
                                    </option>
                                ))}
                            </FormSelect> */}
                        {/* <FormSelect
                                label="Verifier"
                                size="xl"
                                wrapperClass="w-fit"
                                defaultValue=""
                                {...form.register("vfyUserID")}
                            >
                                <option value="" hidden></option>
                                {verifierUsers?.map((user) => (
                                    <option
                                        key={user.userID}
                                        value={user.userID}
                                    >
                                        {user.username}
                                        {" - "}
                                        {user.email}
                                    </option>
                                ))}
                            </FormSelect> */}

                        {/* <FormInput
                                label="Eco URL"
                                size="xl"
                                wrapperClass="w-fit"
                                {...form.register("ecoUrl")}
                            />
                            <FormInput
                                name="listImage"
                                label="List Image"
                                size="xl"
                                wrapperClass="w-fit"
                                type="file"
                                onChange={handleImageLoad}
                            />
                            <FormInput
                                name="headOne"
                                label="1st Image"
                                size="xl"
                                wrapperClass="w-fit"
                                type="file"
                                onChange={handleImageLoad}
                            />
                            <FormInput
                                name="headTwo"
                                label="2nd Head Image"
                                size="xl"
                                wrapperClass="w-fit"
                                type="file"
                                onChange={handleImageLoad}
                            />
                            <FormInput
                                name="headThree"
                                label="3rd Head Image"
                                size="xl"
                                wrapperClass="w-fit"
                                type="file"
                                onChange={handleImageLoad}
                            />
                            <FormTextArea
                                label="Intro"
                                width="xl"
                                height="md"
                                wrapperClass="w-fit"
                                {...form.register("intro")}
                            />
                            <FormTextArea
                                label="Project"
                                width="xl"
                                height="md"
                                wrapperClass="w-fit"
                                {...form.register("project")}
                            />
                            <FormTextArea
                                label="Overview"
                                width="xl"
                                wrapperClass="w-fit"
                                {...form.register("overview")}
                            />
                            <FormInput
                                label="Fund Amount"
                                type="number"
                                size="xl"
                                wrapperClass="w-fit"
                                {...form.register("fundAmount", {
                                    valueAsNumber: true,
                                })}
                            />
                            <FormInput
                                label="Fund Recieved"
                                type="number"
                                size="xl"
                                wrapperClass="w-fit"
                                {...form.register("fundRecieved", {
                                    valueAsNumber: true,
                                })}
                            />
                            <FormInput
                                label="Return"
                                type="number"
                                size="xl"
                                wrapperClass="w-fit"
                                {...form.register("return", {
                                    valueAsNumber: true,
                                })}
                            />
                            <FormInput
                                label="Payback"
                                size="xl"
                                wrapperClass="w-fit"
                                {...form.register("payback")}
                            />
                            <FormInput
                                label="Start Date"
                                type="date"
                                size="xl"
                                wrapperClass="w-fit"
                                {...form.register("dateStart", {
                                    valueAsDate: true,
                                })}
                            />
                            <FormInput
                                label="End Date"
                                type="date"
                                size="xl"
                                wrapperClass="w-fit"
                                {...form.register("dateEnd", {
                                    valueAsDate: true,
                                })}
                            />
                            <FormInput
                                label="Visible"
                                type="checkbox"
                                size="xl"
                                wrapperClass="w-fit"
                                defaultChecked
                                {...form.register("isVisible")}
                            /> */}
                        <Button
                            fullWidth
                            loading={isCreatingProject || fetchingUsers}
                        >
                            Create
                        </Button>
                    </Form>
                </DefaultCard>
            </ProjectTabPanelForCreate>
        </div>
    );
};

export default CreateEcoProject;
