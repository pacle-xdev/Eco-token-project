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


import { decimal } from "./utils";

export const ecoProjectEnumSchema = z.object({
    status: z.enum(["DATA_ENTRY", "NEW", "UNFUNDED", "ACTIVE", "COMPLETED"]),
    creditType: z.enum(["CARBON", "WATER", "HABITAT"]),
});

export const createEcoProjectSchema = z.object({
    // temporary fix for cuid to cuid2 migration for prisma
    projectID: z.union([z.string().cuid2(), z.string().cuid()]).optional(),
    title: z.string().min(1, "A title is required to create a project."),
    shortTitle: z
        .string()
        .min(1, "A short title is required to create a project."),
    identifier: z
        .string()
        .min(1, "Please provide a identifier for your project."),
    intro: z.string().optional(),
    project: z.string().optional(),
    overview: z.string().optional(),
    process: z.string().optional(),
    creditType: ecoProjectEnumSchema.shape.creditType,
    status: ecoProjectEnumSchema.shape.status,
    producerID: z
        .string()
        .cuid()
        .min(1, "Please choose a producer for this project."),
    verifierID: z.string().cuid().nullish(),
    listImage: z.string().optional(),
    headImage: z.string().optional(),
    fundAmount: z.number().nullish(),
    fundRecieved: z.number().nullish(),
    return: decimal(5, 2).nullish(),
    payback: decimal(5, 2).nullish(),
    duration: z.string().nullish(),
    period: z.string().nullish(),
    dateStart: z.date().nullish(),
    dateEnd: z.date().nullish(),
    needsFunding: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    isVisible: z.boolean().default(true),
});

export const editEcoProjectSchema = z.object({
    // temporary fix for cuid to cuid2 migration for prisma
    projectID: z.union([z.string().cuid2(), z.string().cuid()]),
    title: z.string().optional(),
    shortTitle: z.string().optional(),
    identifier: z.string().optional(),
    intro: z.string().nullish(),
    project: z.string().nullish(),
    overview: z.string().nullish(),
    process: z.string().nullish(),
    creditType: ecoProjectEnumSchema.shape.creditType.optional(),
    status: ecoProjectEnumSchema.shape.status.optional(),
    locationID: z.string().cuid().optional(),
    producerID: z.string().cuid().optional(),
    verifierID: z.string().cuid().nullish(),
    listImage: z.string().nullish(),
    headImage: z.string().nullish(),
    fundAmount: z.number().nullish(),
    fundRecieved: z.number().nullish(),
    return: decimal(5, 2).nullish(),
    payback: decimal(5, 2).nullish(),
    duration: z.string().nullish(),
    period: z.string().nullish(),
    dateStart: z.date().nullish(),
    dateEnd: z.date().nullish(),
    needsFunding: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    isVisible: z.boolean().optional(),
});
