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

import { Permission } from "@ecotoken/db";

export const hasPermission = (
	permissions: Permission[],
	roles: string | string[]
) => {
	if (permissions.length === 0) return true;
	if (typeof roles === "string")
		return permissions.find((permission) =>
			roles.includes(permission.permission)
		);
	else
		return roles.every((identifer) =>
			permissions
				.map((permission) => permission.permission)
				.includes(identifer)
		);
};
