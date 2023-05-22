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
	return routeName?.replaceAll("-", " ") ?? "";
};

// export const parseRouteData = (router: NextRouter) => {
// 	const placeholderRouterPieces = router.route.split("/");
// 	let dynamicUrls = placeholderRouterPieces.filter((urlPiece) =>
// 		urlPiece.includes("[")
// 	);
// 	dynamicUrls = dynamicUrls.map((dynamicUrl) =>
// 		dynamicUrl.replace("[", "").replace("]", "")
// 	);

// 	dynamicUrls = dynamicUrls.map((dynamicUrl) => {
// 		if (dynamicUrl === "id") {
// 			return (
// 				trpc.websites.get.useQuery({
// 					siteID: router.query[dynamicUrl] as string
// 				}).data?.siteName ?? dynamicUrl
// 			);
// 		} else return dynamicUrl;
// 	});

// 	return dynamicUrls.join(", ");
// };
