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
import { createRoleSchema, updateRoleSchema } from "../../schema/role";
import { z } from "zod";
import { Role, UserDomain } from "@ecotoken/db";

export const rolesRouter = router({
	get: adminAuthedProcedure
		.input(
			z
				.object({
					id: z.string().optional(),
					name: z.string().optional()
				})
				.superRefine(({ id, name }, ctx) => {
					if (!id && !name) {
						ctx.addIssue({
							path: ["id", "name"],
							code: "custom",
							message:
								"You must specify a ID or name to find a role by."
						});
					}
				})
		)
		.query(async ({ ctx, input }) => {
			return await ctx.prisma.role.findFirst({
				where: {
					OR: [
						{
							roleID: input.id
						},
						{
							role: input.name
						}
					]
				}
			});
		}),
	getAll: adminAuthedProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).optional().default(10),
				cursor: z.string().nullish(),
				domain: z.nativeEnum(UserDomain).optional()
			})
		)
		.query(async ({ ctx, input }) => {
			const roles = await ctx.prisma.role.findMany({
				where: {
					domain: input.domain
				},
				take: input.limit + 1,
				...(input?.cursor && {
					cursor: {
						roleID: input.cursor
					}
				})
			});

			let nextCursor: Role | undefined;
			if (roles?.length > input.limit) nextCursor = roles.pop();

			return {
				roles,
				nextCursor
			};
		}),
	create: adminAuthedProcedure
		.meta({
			requiredPermissions: ["ROLES_CONFIG"]
		})
		.input(createRoleSchema)
		.mutation(async ({ ctx, input }) => {
			await ctx.prisma.role.create({
				data: {
					...input
				}
			});
		}),
	update: adminAuthedProcedure
		.meta({ requiredPermissions: ["ROLES_CONFIG"] })
		.input(updateRoleSchema)
		.mutation(async ({ ctx, input: { roleID: id, ...input } }) => {
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
