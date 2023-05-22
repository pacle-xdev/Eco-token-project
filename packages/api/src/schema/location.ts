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

/*
    model EcoLocation {
        locationID String @id @default(cuid())
        areaID     Int    @default(autoincrement()) @db.UnsignedSmallInt
        location   String
        cn         String
        st         String

        site     Site         @relation(fields: [siteID], references: [siteID])
        siteID   String
        projects EcoProject[]

        isDelete  Boolean  @default(false)
        updatedAt DateTime @updatedAt

        @@index([areaID])
        @@index([siteID])
        @@map("eco_location")
    }
*/

export const createEcoLocationSchema = z.object({
	location: z.string().min(1, "A location is required."),
	cn: z
		.string()
		.min(2, "A country is required.")
		.max(2, "A country is required."),
	st: z
		.string()
		.min(2, "A state/province is required.")
		.max(2, "A state/province is required."),
	siteID: z.string().cuid()
});

export const updateEcoLocationSchema = z.object({
	locationID: z.string().cuid(),
	siteID: z.string().cuid().optional().or(z.literal("")),
	location: z
		.string()
		.min(1, "A location is required.")
		.optional()
		.or(z.literal("")),
	cn: z
		.string()
		.min(2, "A country is required.")
		.max(2, "A country is required.")
		.optional()
		.or(z.literal("")),
	st: z
		.string()
		.min(2, "A state/province is required.")
		.max(2, "A state/province is required.")
		.optional()
		.or(z.literal(""))
});
// .catchall(z.literal(""));
