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

import { useMemo, useState, type ChangeEvent } from "react";
import { trpc, uploadMutation } from "@/utils/trpc";
import { createId } from "@paralleldrive/cuid2";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createNFTSeriesSchema } from "@ecotoken/api/src/schema/nft-series";
import Button from "@ecotoken/ui/components/Button";
import { CardDescription, CardTitle } from "@ecotoken/ui/components/Card";
import Form, {
    FormInput,
    FormSelect,
    useZodForm,
} from "@ecotoken/ui/components/Form";

const NFTSeries: React.FC = () => {
    const [seriesImage, setSeriesImage] = useState<File>();
    const form = useZodForm({
        schema: createNFTSeriesSchema.omit({
            seriesImage: true,
            nftSeriesID: true,
        }),
    });

    const { mutateAsync: createPresignedUrl } =
        trpc.spaces.createPresignedUrls.useMutation();

    const { mutateAsync, isLoading: isCreating } =
        trpc.nftSeries.create.useMutation({
            onSuccess() {
                toast.success("NFT Series created successfully.");
            },
            onError() {
                toast.error("NFT Series failed to create.");
            },
        });
    const { data: ecoProjects, isLoading: fetchingEcoProjects } =
        trpc.ecoProjects.getAll.useInfiniteQuery({});

    const { mutateAsync: uploadImage, isLoading: isUploadingImage } =
        useMutation({
            mutationKey: ["uploadSeriesImage"],
            mutationFn: uploadMutation,
        });

    const cachedProjects = useMemo(
        () => ecoProjects?.pages.flatMap((page) => page.projects),
        [ecoProjects],
    );

    const handleImageLoad = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        // we have one file
        if (files && files[0]) {
            setSeriesImage(files[0]);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <CardTitle>NFT Series</CardTitle>
                <CardDescription>Create a NFT series.</CardDescription>
            </div>
            <Form
                form={form}
                onSubmit={async (data) => {
                    if (!seriesImage) return;
                    const nftSeriesID = createId();
                    const imageKey = `eco-projects/${data.projectID}/nft-series/${nftSeriesID}/seriesImage.png`;
                    const url = await createPresignedUrl({
                        contentType: "image/png",
                        key: imageKey,
                        acl: "public-read",
                    });
                    await uploadImage({
                        url: url as string,
                        image: seriesImage,
                    });
                    await mutateAsync({
                        ...data,
                        nftSeriesID,
                        seriesImage: `${process.env.NEXT_PUBLIC_CDN_URL}/${imageKey}`,
                    });
                }}
                className="flex w-full flex-col gap-4"
            >
                <FormInput
                    name="seriesImage"
                    label="Series Image"
                    size="full"
                    type="file"
                    onChange={handleImageLoad}
                />
                <FormSelect
                    label="Project"
                    size="full"
                    defaultValue=""
                    {...form.register("projectID")}
                >
                    <option value="" hidden></option>
                    {cachedProjects?.map((project) => (
                        <option
                            key={project?.projectID}
                            value={project?.projectID}
                        >
                            {project?.title}
                        </option>
                    ))}
                </FormSelect>
                <FormInput
                    label="Series Type"
                    size="full"
                    {...form.register("seriesType")}
                />
                <FormInput
                    label="Series Name"
                    size="full"
                    {...form.register("seriesName")}
                />
                <FormInput
                    label="Series Number"
                    type="number"
                    size="full"
                    defaultValue={1}
                    {...form.register("seriesNumber", {
                        valueAsNumber: true,
                    })}
                />
                <FormInput
                    label="Retirement Wallet Address"
                    size="full"
                    {...form.register("retireWallet")}
                />
                <FormInput
                    label="Recieving Wallet Address"
                    size="full"
                    {...form.register("recieveWallet")}
                />
                <FormInput
                    label="Credit Wallet Address"
                    size="full"
                    {...form.register("creditWallet")}
                />
                <FormInput
                    label="Credit Wallet Private Key"
                    size="full"
                    {...form.register("creditKey")}
                />
                <Button
                    loading={
                        fetchingEcoProjects || isCreating || isUploadingImage
                    }
                    fullWidth
                >
                    Create
                </Button>
            </Form>
        </div>
    );
};

export default NFTSeries;
