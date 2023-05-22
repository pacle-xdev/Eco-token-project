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

import { z } from "zod";
import { exclude } from "@ecotoken/db";

import {
    createEcoProjectSchema,
    editEcoProjectSchema,
} from "../../schema/project";
import { adminAuthedProcedure, publicProcedure, router } from "../../trpc";

export const projectsRouter = router({
    get: publicProcedure
        .input(
            z
                .object({
                    identifier: z.string().optional(),
                    projectID: z.string().optional(),
                    benefits: z.boolean().optional(),
                    location: z.boolean().optional(),
                    producer: z.boolean().optional(),
                    series: z.boolean().optional(),
                })
                .superRefine(({ identifier, projectID }, ctx) => {
                    if (!identifier && !projectID) {
                        ctx.addIssue({
                            path: ["identifier", "projectID"],
                            code: "custom",
                            message:
                                "Please specify an ID to reference a project by.",
                        });
                    }
                }),
        )
        .query(async ({ ctx, input }) => {
            const project = await ctx.prisma.ecoProject.findFirst({
                where: {
                    OR: [
                        {
                            identifier: input.identifier,
                        },
                        {
                            projectID: input.projectID,
                        },
                    ],
                    siteID: ctx.selectedSite?.siteID ?? ctx.currentSite.siteID,
                    ...((!ctx.session ||
                        ctx.session?.user?.type === "user") && {
                        isVisible: true,
                    }),
                    isDelete: false,
                },
                include: {
                    benefits: input.benefits,
                    location: input.location,
                    producer: input.producer,
                    ...(input.series && {
                        nftSeries: {
                            select: {
                                regenBatch: true,
                                nftSeriesID: true,
                                setAmount: true,
                                totalCredits: true,
                                creditPrice: true,
                                seriesType: true,
                                seriesImage: true,
                                isActive: true,
                                creditWallet: true,
                                recieveWallet: true,
                                retireWallet: true,
                                seriesName: true,
                            },
                        },
                    }),
                },
            });

            return project;
        }),
    getAll: publicProcedure
        .input(
            z.object({
                benefits: z.boolean().optional(),
                location: z.boolean().optional(),
                series: z.boolean().optional(),
                limit: z.number().min(1).max(100).nullish().default(10),
                cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
            }),
        )
        .query(async ({ ctx, input }) => {
            const limit = input?.limit ?? 50;
            const databaseProjects = await ctx.prisma.ecoProject.findMany({
                take: limit + 1, // get an extra item at the end which we'll use as next cursor
                where: {
                    siteID: ctx.selectedSite?.siteID ?? ctx.currentSite.siteID,
                    ...((!ctx.session ||
                        ctx.session?.user?.type === "user") && {
                        isVisible: true,
                    }),
                    isDelete: false,
                },
                include: {
                    benefits: input.benefits,
                    location: input.location,
                    ...(input.series && {
                        nftSeries: {
                            select: {
                                regenBatch: true,
                                nftSeriesID: true,
                                setAmount: true,
                                totalCredits: true,
                                creditPrice: true,
                                seriesType: true,
                                seriesImage: true,
                                isActive: true,
                            },
                        },
                    }),
                },
                ...(input?.cursor && {
                    cursor: {
                        projectID: input.cursor,
                    },
                }),
            });

            const projects = databaseProjects.map((project) =>
                exclude(project, ["siteID"]),
            );

            return {
                projects,
                ...(projects?.length > limit
                    ? { nextCursor: projects.pop() }
                    : {}),
            };
        }),
    create: adminAuthedProcedure
        .input(createEcoProjectSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.ecoProject.create({
                data: {
                    ...input,
                    siteID: ctx.selectedSite?.siteID ?? ctx.currentSite.siteID,
                },
                select: {
                    projectID: true,
                },
            });
        }),
    update: adminAuthedProcedure
        .input(editEcoProjectSchema)
        .mutation(async ({ ctx, input: { projectID, ...input } }) => {
            await ctx.prisma.ecoProject.update({
                where: {
                    projectID,
                },
                data: {
                    ...input,
                },
            });
        }),
    delete: adminAuthedProcedure
        .input(z.object({ projectID: z.string() }))
        .mutation(async ({ ctx, input: { projectID } }) => {
            await ctx.prisma.ecoProject.update({
                where: {
                    projectID,
                },
                data: {
                    isDelete: true,
                },
            });
        }),
});
