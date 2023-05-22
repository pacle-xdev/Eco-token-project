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

import type { EcoLocation } from "@prisma/client";
import { z } from "zod";
import {
	createEcoLocationSchema,
	updateEcoLocationSchema
} from "../../schema/location";
import { router, adminAuthedProcedure } from "../../trpc";

export const locationsRouter = router({
	get: adminAuthedProcedure
		.input(
			z.object({
				locationID: z.string()
			})
		)
		.query(async ({ ctx, input }) => {
			const location = await ctx.prisma.ecoLocation.findFirst({
				where: {
					locationID: input.locationID
				}
			});
			return location;
		}),
	getAll: adminAuthedProcedure
		.input(
			z.object({
				siteID: z.string().optional(),
				limit: z.number().min(1).max(100).nullish().default(10),
				cursor: z.string().nullish() // <-- "cursor" needs to exist, but can be any type
			})
		)
		.query(async ({ ctx, input }) => {
			const limit = input?.limit ?? 50;
			const locations = await ctx.prisma.ecoLocation.findMany({
				take: limit + 1, // get an extra item at the end which we'll use as next cursor
				where: {
					siteID: input.siteID
				},
				...(input?.cursor && {
					cursor: {
						locationID: input.cursor
					}
				})
			});

			let nextCursor: EcoLocation | undefined;
			if (locations?.length > limit) nextCursor = locations.pop();

			return {
				locations,
				nextCursor
			};
		}),
	create: adminAuthedProcedure
		.input(createEcoLocationSchema)
		.mutation(async ({ ctx, input }) => {
			return await ctx.prisma.ecoLocation.create({
				data: {
					...input
				},
				select: {
					locationID: true
				}
			});
		}),
	update: adminAuthedProcedure
		.input(updateEcoLocationSchema)
		.mutation(async ({ ctx, input: { locationID, ...input } }) => {
			await ctx.prisma.ecoLocation.update({
				where: {
					locationID
				},
				data: {
					...input
				}
			});
		}),
	delete: adminAuthedProcedure
		.input(z.object({ locationID: z.string() }))
		.mutation(async ({ ctx, input: { locationID } }) => {
			await ctx.prisma.ecoLocation.delete({
				where: {
					locationID
				}
			});
		})
});
