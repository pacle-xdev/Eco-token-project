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

import { promises } from "fs";
import { join } from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createCanvas, loadImage, type SKRSContext2D } from "@napi-rs/canvas";

import { formatCountryAndState } from "../../../../apps/admin/src/utils/formatter";
import { createNFTSchema } from "../schema/nft-builder";
import { adminAuthedProcedure, router } from "../trpc";
import { s3Client } from "../utils/s3";

export const nftBuilderRouter = router({
        mint: adminAuthedProcedure
        .input(createNFTSchema)
        .mutation(
            async ({ ctx, input: { credits, retiredBy, nftSeriesID } }) => {
                const series = await ctx.prisma.nFTSeries.findUnique({
                    where: {
                        nftSeriesID,
                    },
                    include: {
                        project: {
                            include: {
                                location: {
                                    select: {
                                        cn: true,
                                        st: true,
                                        location: true,
                                    },
                                },
                                producer: {
                                    select: {
                                        companyName: true,
                                    },
                                },
                            },
                        },
                    },
                });

                const IMAGE_WIDTH = 1200,
                    IMAGE_HEIGHT = 1200,
                    IMAGE_X_OFFSET = 20,
                    IMAGE_Y_OFFSET = 20,
                    FONT_HEIGHT = 36;

                const canvas = createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
                const canvasContext = canvas.getContext("2d");

                const baseImage = await loadImage(
                    series?.seriesImage.startsWith("https")
                        ? series.seriesImage
                        : `${process.env.NEXT_PUBLIC_CDN_URL}/eco-projects/${series?.project.projectID}/nft-series/${series?.nftSeriesID}/seriesImage.png`,
                );

                const scale = Math.max(
                    canvas.width / baseImage.width,
                    canvas.height / baseImage.height,
                );

                const w = baseImage.width * scale;
                const h = baseImage.height * scale;
                const x = canvas.width / 2 - w / 2;
                const y = canvas.height / 2 - h / 2;

                canvasContext.drawImage(baseImage, x, y, w, h);

                canvasContext.font = `${FONT_HEIGHT}px Arial`;
                canvasContext.fillStyle = "white";

                const texts = [
                    `Credits: ${credits} ${series?.seriesType}`,
                    `Retired By: ${retiredBy}`,
                    `Project: ${series?.project.shortTitle}`,
                    `Location: ${formatCountryAndState(
                        series?.project.location?.location ?? "",
                        series?.project?.location?.cn ?? "",
                        series?.project?.location?.st ?? "",
                    )}`,
                    `Producer: ${series?.project.producer.companyName}`,
                    `Date: ${new Date().toDateString()}`,
                    `ID: ${series?.regenBatch}`,
                ];
                texts
                    .reverse()
                    .forEach((text, index) =>
                        canvasContext.fillText(
                            text,
                            IMAGE_X_OFFSET,
                            IMAGE_HEIGHT - IMAGE_Y_OFFSET - FONT_HEIGHT * index,
                        ),
                    );

                // const buffer = canvas.toBuffer("image/png");
                const finalImage = await canvas.encode("png");
                await promises.writeFile(
                    join(__dirname, "simple.png"),
                    finalImage,
                );

                // next up, create the metadata and mint the nft, problem is we need to add wallet support and mint somehow :)
            },
        ),
});
