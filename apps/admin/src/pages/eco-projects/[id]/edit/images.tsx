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
import Link from "next/link";
import { useRouter } from "next/router";
import ProjectTabPanel from "@/components/eco-project/project-tab-panel";
import { trpc } from "@/utils/trpc";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { editEcoProjectSchema } from "@ecotoken/api/src/schema/project";
import Button from "@ecotoken/ui/components/Button";
import DefaultCard, { CardTitle } from "@ecotoken/ui/components/Card";
import Form, { FormInput, useZodForm } from "@ecotoken/ui/components/Form";
import Spinner from "@ecotoken/ui/components/Spinner";

const Images = () => {
    const router = useRouter();
    const context = trpc.useContext();
    const { id } = router.query;

    const { data: project, isLoading: fetchingProject } =
        trpc.ecoProjects.get.useQuery(
            {
                projectID: id as string,
            },
            {
                enabled: !!id,
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

    const { mutateAsync: createPresignedUrl } =
        trpc.spaces.createPresignedUrls.useMutation();

    const uploadMutation = async ({
        url,
        file,
    }: {
        url: string;
        file: File;
    }) => {
        await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "image/png",
                "x-amz-acl": "public-read",
            },
            mode: "cors",
            body: file,
        });
    };

    const { mutateAsync: uploadImage, isLoading: isUploadingImage } =
        useMutation({
            mutationKey: ["uploadImage"],
            mutationFn: uploadMutation,
        });

    const form = useZodForm({
        schema: editEcoProjectSchema.omit({
            projectID: true,
        }),
    });

    const [listImage, setListImage] = useState<File>();
    const [headImage, setHeadImage] = useState<File>();

    if (!project) {
        if (fetchingProject) return <Spinner />;
        else {
            toast.error("Project does not exist.");
            router.push("/eco-projects");
            return null;
        }
    } else
        return (
            <ProjectTabPanel index={3} projectId={id}>
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
                            <CardTitle>Project Images</CardTitle>
                        </div>
                    </div>
                    <Form
                        form={form}
                        className="flex w-fit flex-col gap-4"
                        onSubmit={async () => {
                            if (listImage) {
                                const listImageUrl = (await createPresignedUrl({
                                    contentType: "image/png",
                                    key: `eco-projects/${
                                        project.projectID
                                    }/listImage.png`,
                                    acl: "public-read",
                                })) as string;
                                await uploadImage({
                                    url: listImageUrl,
                                    file: listImage,
                                });
                            }
                            if (headImage) {
                                const headImageUrl = (await createPresignedUrl({
                                    contentType: "image/png",
                                    key: `eco-projects/${
                                        project.projectID
                                    }/headImage.png`,
                                    acl: "public-read",
                                })) as string;
                                await uploadImage({
                                    url: headImageUrl,
                                    file: headImage,
                                });
                            }
                            await editMutate({
                                projectID: id as string,
                                ...(listImage && {
                                    listImage: `eco-projects/${
                                        project.projectID
                                    }/listImage.png`,
                                }),
                                ...(headImage && {
                                    headImage: `eco-projects/${
                                        project.projectID
                                    }/headImage.png`,
                                }),
                            });
                        }}
                    >
                        <FormInput
                            type="file"
                            name="listImage"
                            label="List Image"
                            wrapperClass="w-fit"
                            onChange={(e) => {
                                const files = e.target.files;
                                if (files && files[0]) setListImage(files[0]);
                            }}
                        />
                        <FormInput
                            type="file"
                            name="headImage"
                            label="Head Image"
                            wrapperClass="w-fit"
                            onChange={(e) => {
                                const files = e.target.files;
                                if (files && files[0]) setHeadImage(files[0]);
                            }}
                        />
                        <Button
                            loading={
                                fetchingProject ||
                                isUpdating ||
                                isUploadingImage
                            }
                        >
                            Update
                        </Button>
                    </Form>
                </DefaultCard>
            </ProjectTabPanel>
        );
};
export default Images;
