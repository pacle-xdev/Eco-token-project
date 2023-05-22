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

import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import ProjectTabPanel from "@/components/eco-project/project-tab-panel";
import { trpc } from "@/utils/trpc";
import { toast } from "react-hot-toast";
import Button from "@ecotoken/ui/components/Button";
import DefaultCard, { CardTitle } from "@ecotoken/ui/components/Card";
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
                    setProcess(data?.process ?? undefined);
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

    const [process, setProcess] = useState<string>();

    if (!fetchedProject) {
        if (fetchingProject) return <Spinner />;
        else {
            toast.error("Project does not exist.");
            router.push("/eco-projects");
            return null;
        }
    } else
        return (
            <ProjectTabPanel index={6} projectId={id}>
                <DefaultCard
                    className="flex w-full flex-col space-y-4"
                    size="threeQuarter"
                >
                    <CardTitle>Project Process</CardTitle>
                    <ReactQuillDynamic
                        theme="snow"
                        value={process}
                        onChange={setProcess}
                        className="h-36"
                    />
                    <br />
                    {/* <TabPreview /> */}
                    <Button
                        fullWidth
                        loading={fetchingProject || isUpdating}
                        onClick={async () => {
                            await editMutate({
                                process,
                                projectID: id as string,
                            });
                        }}
                    >
                        Update
                    </Button>
                </DefaultCard>
            </ProjectTabPanel>
        );
};

export default Story;
