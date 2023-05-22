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

export const updateAdminUserSchema = z
	.object({
		adminID: z.string().cuid(),
		roleID: z.string().cuid().min(1, "A role is required."),
		firstName: z
			.string()
			.min(1, "You must specify a first name.")
			.optional()
			.or(z.literal("")),
		lastName: z.string().nullish().or(z.literal("")),
		email: z
			.string()
			.email("A valid email is required.")
			.optional()
			.or(z.literal("")),
		username: z
			.string()
			.min(3, "Username must be at least 3 characters.")
			.max(32, "A shorter username is required.")
			.optional()
			.or(z.literal("")),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters.")
			.max(64, "A shorter password is required.")
			.optional()
			.or(z.literal("")),
		confirmPassword: z.string().optional().or(z.literal(""))
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				path: ["confirmPassword"],
				code: "custom",
				message: "Passwords don't match!"
			});
		}
	});

export const createAdminUserSchema = z
	.object({
		roleID: z.string().cuid().min(1, "A role is required."),
		firstName: z.string().min(1, "You must specify a first name."),
		lastName: z.string().nullish().or(z.literal("")),
		email: z.string().email("A valid email is required."),
		username: z
			.string()
			.min(3, "Username must be at least 3 characters.")
			.max(32, "A shorter username is required."),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters.")
			.max(64, "A shorter password is required."),
		confirmPassword: z.string()
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				path: ["confirmPassword"],
				code: "custom",
				message: "Passwords don't match!"
			});
		}
	});

export const loginAdminUserSchema = z.object({
	username: z.string().min(1, "Username is required."),
	password: z.string().min(1, "Password is required.")
});
