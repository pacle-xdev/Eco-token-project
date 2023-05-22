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

import Link from "next/link";
import { useRouter } from "next/router";
import ProjectTabPanel from "@/components/eco-project/project-tab-panel";
import { trpc } from "@/utils/trpc";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-hot-toast";
import { editEcoProjectSchema } from "@ecotoken/api/src/schema/project";
import Button from "@ecotoken/ui/components/Button";
import DefaultCard, { CardTitle } from "@ecotoken/ui/components/Card";
import Form, { FormTextArea, useZodForm } from "@ecotoken/ui/components/Form";
import Spinner from "@ecotoken/ui/components/Spinner";

const Overview = () => {
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
                        const { overview, intro } = data;
                        form.reset({
                            overview,
                            intro,
                        });
                    }
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
            <ProjectTabPanel index={4} projectId={id}>
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
                            <CardTitle>Project Overview</CardTitle>
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
                        <FormTextArea
                            label="Introduction"
                            width="xl"
                            height="md"
                            wrapperClass="w-fit"
                            {...form.register("intro")}
                        />
                        <FormTextArea
                            label="Overview"
                            width="xl"
                            height="md"
                            wrapperClass="w-fit"
                            {...form.register("overview")}
                        />
                        <Button
                            fullWidth
                            loading={fetchingProject || isUpdating}
                        >
                            Update
                        </Button>
                    </Form>
                </DefaultCard>
            </ProjectTabPanel>
        );
};

export default Overview;
