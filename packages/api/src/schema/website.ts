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

export const createWebsiteSchema = z.object({
	siteName: z
		.string({
			required_error: "A site name is required."
		})
		.min(1, "Please specify a site name."),
	prodUrl: z.string().nullish().or(z.literal("")),
	stageUrl: z.string().nullish().or(z.literal("")),
	devUrl: z.string().nullish().or(z.literal(""))
});

export const updateWebsiteSchema = z.object({
	siteID: z.string().cuid(),
	siteName: z.string().optional(),
	legalName: z.string().nullish().or(z.literal("")),
	mailAddress: z.string().nullish().or(z.literal("")),
	prodUrl: z.string().nullish().or(z.literal("")),
	stageUrl: z.string().nullish().or(z.literal("")),
	devUrl: z.string().nullish().or(z.literal(""))
});
