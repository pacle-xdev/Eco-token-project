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

// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getEdgeSession } from "@ecotoken/auth/src/iron-session/get-edge-session";
import { stripUrl } from "@ecotoken/auth/src/utils/strip-url";

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
	const { pathname, host } = req.nextUrl;
	const res = NextResponse.next();
	const session = await getEdgeSession(req, res, stripUrl(host) ?? "");

	if (req.ip !== session.user?.ipAddress) session.destroy();

	if (pathname.startsWith("/login")) {
		if (session.user?.id) {
			return NextResponse.redirect(new URL("/", req.url));
		}
	} else {
		if (!session.user?.id) {
			return NextResponse.redirect(new URL("/login", req.url));
		}
	}

	return res;
}

// matching routes
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)"
	]
};
