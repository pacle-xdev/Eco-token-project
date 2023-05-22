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

import { useState } from "react";
import { useRouter } from "next/router";
import ProjectTabPanel from "@/components/eco-project/project-tab-panel";

import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { trpc } from "@/utils/trpc";
import { toast } from "react-hot-toast";
import { editEcoProjectSchema } from "@ecotoken/api/src/schema/project";
import Button from "@ecotoken/ui/components/Button";
import DefaultCard, { CardTitle } from "@ecotoken/ui/components/Card";
import Form, { FormInput, useZodForm } from "@ecotoken/ui/components/Form";
import Spinner from "@ecotoken/ui/components/Spinner";

const ReactQuillDynamic = dynamic(async () => await import("react-quill"), {
    ssr: false,
});

const Story = () => {
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
                    setStory(data?.project ?? undefined);
                },
            },
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

    const form = useZodForm({
        schema: editEcoProjectSchema.omit({
            projectID: true,
            project: true,
        }),
    });

    const [story, setStory] = useState<string>();

    if (!fetchedProject) {
        if (fetchingProject) return <Spinner />;
        else {
            toast.error("Project does not exist.");
            router.push("/eco-projects");
            return null;
        }
    } else
        return (
            <ProjectTabPanel index={5} projectId={id}>
                <DefaultCard
                    className="flex w-full flex-col"
                    size="threeQuarter"
                >
                    <CardTitle className="mb-2">Project Story</CardTitle>
                    <ReactQuillDynamic
                        theme="snow"
                        value={story}
                        onChange={setStory}
                        className="h-36"
                    />
                    <br />
                    <Form
                        form={form}
                        onSubmit={async () => {
                            await editMutate({
                                project: story,
                                projectID: id as string,
                            });
                        }}
                        className="mt-8 flex w-fit flex-col gap-4"
                    >
                        <FormInput
                            name="imageCaption"
                            label="Image Caption"
                            width="xl"
                            height="md"
                            wrapperClass="w-fit"
                        />
                        <Button
                            fullWidth
                            loading={fetchingProject || isUpdating}
                            onClick={async () => {
                                await editMutate({
                                    project: story,
                                    projectID: id as string,
                                });
                            }}
                        >
                            Update
                        </Button>
                    </Form>
                    {/* <TabPreview /> */}
                </DefaultCard>
            </ProjectTabPanel>
        );
};

export default Story;
