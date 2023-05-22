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

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { exclude } from "@ecotoken/db";

import {
    createNFTSeriesSchema,
    editNFTSeriesSchema,
} from "../schema/nft-series";
import { adminAuthedProcedure, router } from "../trpc";

export const nftSeriesRouter = router({
    get: adminAuthedProcedure
        .input(
            z.object({
                nftSeriesID: z.string(),
                project: z.boolean().optional(),
            }),
        )
        .query(async ({ ctx, input: { nftSeriesID, project } }) => {
            const series = await ctx.prisma.nFTSeries.findFirst({
                where: {
                    nftSeriesID,
                    project: {
                        isDelete: false,
                    },
                },
                include: {
                    project,
                },
            });
            if (!series)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "NFT series not found.",
                });
            return exclude(series, ["creditKey"]);
        }),
    create: adminAuthedProcedure
        .input(createNFTSeriesSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.nFTSeries.create({
                data: {
                    ...input,
                },
                select: {
                    nftSeriesID: true,
                },
            });
        }),
    update: adminAuthedProcedure
        .input(editNFTSeriesSchema)
        .mutation(async ({ ctx, input: { nftSeriesID, ...input } }) => {
            const series = await ctx.prisma.nFTSeries.update({
                where: {
                    nftSeriesID,
                },
                data: {
                    ...input,
                },
                select: {
                    nftSeriesID: true,
                },
            });
            if (!series)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "NFT series not found.",
                });
            return series;
        }),
});
