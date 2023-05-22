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

import { router, adminAuthedProcedure } from "../../trpc";
import {
	createPermissionSchema,
	updatePermissionSchema
} from "../../schema/permission";
import { z } from "zod";
import { Permission } from "@ecotoken/db";

export const permissionsRouter = router({
	get: adminAuthedProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.query(async ({ ctx, input }) => {
			return await ctx.prisma.role.findUnique({
				where: {
					roleID: input.id
				}
			});
		}),
	getAll: adminAuthedProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).optional().default(10),
				cursor: z.string().nullish()
			})
		)
		.query(async ({ ctx, input }) => {
			const permissions = await ctx.prisma.permission.findMany({
				where: {},
				take: input.limit + 1,
				...(input?.cursor && {
					cursor: {
						permissionID: input.cursor
					}
				})
			});

			let nextCursor: Permission | undefined;
			if (permissions?.length > input.limit)
				nextCursor = permissions.pop();

			return {
				permissions,
				nextCursor
			};
		}),
	create: adminAuthedProcedure
		.meta({
			requiredPermissions: ["PERMISSION_CONFIG"]
		})
		.input(createPermissionSchema)
		.mutation(async ({ ctx, input }) => {
			await ctx.prisma.permission.create({
				data: {
					...input
				}
			});
		}),
	update: adminAuthedProcedure
		.meta({ requiredPermissions: ["PERMISSION_CONFIG"] })
		.input(updatePermissionSchema)
		.mutation(async ({ ctx, input: { id, ...input } }) => {
			await ctx.prisma.role.update({
				where: {
					roleID: id
				},
				data: {
					...input
				}
			});
		})
});
