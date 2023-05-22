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

import { Prisma, PrismaClient } from "@prisma/client";
import { hash } from "argon2";

const hashPasswordMiddleware = (
	prisma: PrismaClient,
	model: Prisma.ModelName
) => {
	prisma.$use(async (params, next) => {
		if (params.model === model) {
			if (params.action === "create" || params.action === "update") {
				const password = params.args.data["password"];
				// hash password if the password that is attempting to be inserted isn't already hashed
				if (password && !password.startsWith("$argon"))
					params.args.data["password"] = await hash(password);
			}
		}
		return await next(params);
	});
};

export default hashPasswordMiddleware;
