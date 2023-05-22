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

import { Site } from "@ecotoken/db";
import { z } from "zod";
import { createWebsiteSchema, updateWebsiteSchema } from "../../schema/website";
import { adminAuthedProcedure, router } from "../../trpc";

export const websiteRouter = router({
	getAll: adminAuthedProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).optional().default(10),
				cursor: z.string().nullish()
			})
		)
		.query(async ({ ctx, input }) => {
			const websites = await ctx.prisma.site.findMany({
				take: input.limit + 1,
				...(input.cursor && {
					cursor: {
						siteID: input.cursor
					}
				})
			});

			let nextCursor: Site | undefined;
			// only create a next cursor when there is enough websites in the database to satify
			// the limit as well as the extra taken for the nextCursor
			if (websites.length > input.limit) nextCursor = websites.pop();

			return {
				websites,
				nextCursor
			};
		}),
	get: adminAuthedProcedure
		.input(z.object({ siteID: z.string() }))
		.query(async ({ ctx, input: { siteID } }) => {
			return await ctx.prisma.site.findUnique({
				where: {
					siteID
				}
			});
		}),
	create: adminAuthedProcedure
		.input(createWebsiteSchema)
		.mutation(async ({ ctx, input }) => {
			return await ctx.prisma.site.create({
				data: {
					...input
				}
			});
		}),
	update: adminAuthedProcedure
		.input(updateWebsiteSchema)
		.mutation(async ({ ctx, input: { siteID, ...input } }) => {
			await ctx.prisma.site.update({
				where: {
					siteID
				},
				data: {
					...input
				}
			});
		}),
	delete: adminAuthedProcedure
		.input(z.object({ siteID: z.string() }))
		.mutation(async ({ ctx, input: { siteID } }) => {
			await ctx.prisma.site.delete({
				where: {
					siteID
				}
			});
		}),
	updateSelectedSite: adminAuthedProcedure
		.input(z.object({ siteID: z.string() }))
		.mutation(async ({ ctx, input }) => {
			ctx.session.user = {
				...ctx.session.user,
				selectedSite: input.siteID,
			};
			await ctx.session.save();
			return 200;
		}),
	getCurrentSite: adminAuthedProcedure.query(async ({ ctx }) => {
		return ctx.currentSite.siteID;
	}),
	getSelectedSite: adminAuthedProcedure.query(async ({ ctx }) => {
		return ctx.session.user.selectedSite;
	})
});
