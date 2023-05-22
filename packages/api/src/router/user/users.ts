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

import { type User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createUserSchema, updateUserSchema } from "../../schema/user";
import {
    adminAuthedProcedure,
    authedProcedure,
    publicProcedure,
    router,
} from "../../trpc";

export const usersRouter = router({
    usernameCheck: publicProcedure
        .input(z.object({ username: z.string() }))
        .query(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.findUnique({
                where: {
                    username_siteID: {
                        username: input.username,
                        siteID: ctx.currentSite.siteID,
                    },
                },
            });
            if (!user?.userID)
                throw new TRPCError({
                    message: "Username is not available.",
                    code: "CONFLICT",
                });
        }),
    get: authedProcedure
        .input(
            z.object({
                userID: z.string().optional(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.findFirst({
                where: {
                    userID:
                        input.userID && ctx.session.user.type === "admin"
                            ? input.userID
                            : ctx.session.user.id,
                },
            });
            if (!user)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found.",
                });
            return user;
        }),
    getAll: adminAuthedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).optional().default(10),
                role: z.union([z.string().array(), z.string()]).optional(),
                cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
            }),
        )
        .query(async ({ ctx, input }) => {
            const users = await ctx.prisma.user.findMany({
                where: {
                    siteID: ctx.selectedSite?.siteID,
                    ...(input.role && {
                        role: {
                            ...(typeof input.role === "string"
                                ? {
                                      role: input.role,
                                  }
                                : {
                                      OR: input.role.map((role) => ({
                                          role,
                                      })),
                                  }),
                        },
                    }),
                },
                include: {
                    role: !!input.role,
                },
                take: input.limit + 1,
                ...(input?.cursor && {
                    cursor: {
                        userID: input.cursor,
                    },
                }),
            });

            let nextCursor: User | undefined;
            if (users?.length > input.limit) nextCursor = users.pop();

            return {
                users,
                nextCursor,
            };
        }),
    create: adminAuthedProcedure
        .input(createUserSchema)
        .mutation(async ({ ctx, input }) => {
            const role = await ctx.prisma.role.findFirst({
                where: {
                    OR: [
                        {
                            sites: {
                                some: {
                                    siteID: ctx.selectedSite?.siteID,
                                },
                            },
                            scope: "SITE",
                        },
                        {
                            domain: {
                                equals: "USER",
                            },
                            scope: "DEFAULT",
                        },
                    ],
                },
            });
            if (role) {
                return await ctx.prisma.user.create({
                    data: {
                        ...input,
                        siteID: ctx.selectedSite?.siteID ?? "",
                        roleID: role.roleID,
                    },
                });
            } else
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Role not found. Creation process cannot proceed.",
                });
        }),
    update: adminAuthedProcedure
        .input(updateUserSchema)
        .mutation(async ({ ctx, input: { userID, ...input } }) => {
            await ctx.prisma.user.update({
                where: {
                    userID,
                },
                data: {
                    ...input,
                },
            });
        }),
    delete: adminAuthedProcedure
        .input(
            z.object({
                userID: z.string(),
            }),
        )
        .mutation(async ({ ctx, input: { userID } }) => {
            await ctx.prisma.user.update({
                where: {
                    userID,
                },
                data: {
                    isDelete: true,
                },
            });
        }),
});
