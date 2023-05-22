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

import { PrismaClient } from "@prisma/client";
import hashPasswordMiddleware from "./middleware/hash-password";

declare global {
	// allow global `var` declarations
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

export const prisma =
	global.prisma ||
	new PrismaClient({
		log:
			process.env.NODE_ENV === "development"
				? ["query", "error", "warn"]
				: ["error"]
	});

export * from "@prisma/client";

if (process.env.NODE_ENV !== "production") {
	global.prisma = prisma;
}

// Exclude keys from user
export function exclude<T, Key extends keyof T>(
	user: T,
	keys: Key[]
): Omit<T, Key> {
	for (const key of keys) {
		delete user[key];
	}
	return user;
}

hashPasswordMiddleware(prisma, "AdminUser");
hashPasswordMiddleware(prisma, "User");
