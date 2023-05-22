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

import React, { useRef, useState, type ChangeEvent } from "react";
import NFTBuilderPreview from "@/components/nft-builder-preview";
import { trpc } from "@/utils/trpc";
import html2canvas from "html2canvas";
import { createNFTSchema } from "@ecotoken/api/src/schema/nft-builder";
import Button from "@ecotoken/ui/components/Button";
import DefaultCard, {
    CardDescription,
    CardTitle,
} from "@ecotoken/ui/components/Card";
import Form, { FormInput, useZodForm } from "@ecotoken/ui/components/Form";

const NFTBuilder = () => {
    const form = useZodForm({
        schema: createNFTSchema.omit({
            nftSeriesID: true,
        }),
    });
    const { isLoading, mutateAsync } = trpc.nftBuilder.mint.useMutation();

    const [imageBlob, setImageBlob] = useState<string>();
    const componentRef = useRef<HTMLDivElement | null>(null);

    const credits = form.watch("credits");
    const retiredBy = form.watch("retiredBy");

    return (
        <div className="h-full w-full">
            <DefaultCard className="flex flex-col space-y-8" size="half">
                <div>
                    <CardTitle>NFT Builder</CardTitle>
                    <CardDescription>
                        Construct an NFT based on some attributes.
                    </CardDescription>
                </div>
                <div className="flex space-x-8">
                    <div className="flex flex-1 flex-col space-y-4">
                        <Form
                            form={form}
                            onSubmit={async (data) => {
                                // if (componentRef.current) {
                                //     const canvas = await html2canvas(
                                //         componentRef.current,
                                //     );
                                //     document.body.appendChild(canvas);
                                await mutateAsync({
                                    ...data,
                                    nftSeriesID: "clf5u97ve001rygfew00btecw",
                                });
                            }}
                            className="flex w-full flex-col gap-4"
                        >
                            <FormInput
                                label="Credits"
                                type="number"
                                defaultValue={1}
                                min={1}
                                {...form.register("credits", {
                                    setValueAs: (value: string) =>
                                        isNaN(parseInt(value))
                                            ? 0
                                            : parseInt(value),
                                })}
                                size="full"
                            />
                            <FormInput
                                label="Retired By"
                                size="full"
                                {...form.register("retiredBy")}
                            />
                            <Button loading={isLoading} fullWidth>
                                Build
                            </Button>
                        </Form>
                    </div>
                    <div className="relative flex flex-1 flex-col overflow-hidden rounded-lg">
                        {/* <NFTBuilderPreview
                            ref={componentRef}
                            image={imageBlob?.toString()}
                            batch={"999"}
                            credits={credits}
                            symbol={symbol}
                            project={project}
                            location={location}
                            producer={producer}
                            date={date}
                            width={1200}
                            height={1200}
                        /> */}
                        {/* {imageBlob && <Image src={imageBlob} alt="preview" fill />} */}
                    </div>
                </div>
            </DefaultCard>
        </div>
    );
};

export default NFTBuilder;
