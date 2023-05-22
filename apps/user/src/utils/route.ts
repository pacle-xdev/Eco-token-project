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

export const getRouteName = (route: string) => {
	let routeName = route === "/" ? "Dashboard" : undefined;
	if (route !== "/") {
		const strippedDynamicRoutes = route.split("[")[0];
		if (strippedDynamicRoutes) {
			const pathNestedRoutes = strippedDynamicRoutes
				.split("/")
				.filter((v) => v.length > 0);
			routeName = pathNestedRoutes[pathNestedRoutes.length - 1];
		}
	}
	return routeName ?? "";
};
