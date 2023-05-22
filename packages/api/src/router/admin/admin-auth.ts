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

import { publicProcedure, router, adminAuthedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { verify } from "argon2";
import { loginAdminUserSchema } from "../../schema/admin-user";

export const adminAuthRouter = router({
    login: publicProcedure
        .input(loginAdminUserSchema)
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.prisma.adminUser.findUnique({
                where: {
                    username: input.username,
                },
            });
            if (!user)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "A user could not be found.",
                });
            else if (!(await verify(user.password, input.password)))
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Username or password is incorrect.",
                });

            const currentDate = new Date(Date.now());
            const expireDate = currentDate;
            expireDate.setDate(expireDate.getDate() + 180);

            await ctx.prisma.adminUser.update({
                where: {
                    username: input.username,
                },
                data: {
                    hits: user.hits + 1,
                    lastLogin: currentDate,
                    expireAt: expireDate,
                },
            });

            // set default site to be ecoToken
            const firstSite = await ctx.prisma.site.findFirst({
                where: {
                    siteName: "ecoToken",
                },
            });
            ctx.session!.user = {
                type: "admin",
                id: user.adminID,
                ipAddress:
                    process.env.NODE_ENV === "production"
                        ? (ctx.req.headers["x-real-ip"] as string) ?? ""
                        : undefined,
                selectedSite: firstSite?.siteID,
            };
            await ctx.session!.save();
        }),
    logout: adminAuthedProcedure.query(async ({ ctx }) => {
        ctx.session.destroy();
        return 200;
    }),
});
