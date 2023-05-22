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

export const createRoleSchema = z.object({
	domain: z.enum(["ADMIN", "USER"]),
	scope: z.enum(["DEFAULT", "SITE"]),
	role: z.string().min(1, "Role name is required."),
	description: z.string().nullable()
});

export const updateRoleSchema = createRoleSchema
	.extend({
		roleID: z.string().cuid()
	})
	.partial()
	.catchall(z.literal(""));
