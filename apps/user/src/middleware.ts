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
import { stripUrl } from "@ecotoken/auth/src/utils/strip-url";
import { getEdgeSession } from "@ecotoken/auth/src/iron-session/get-edge-session";

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
	const { pathname, host } = req.nextUrl;
	const response = NextResponse.next();
	const session = await getEdgeSession(req, response, stripUrl(host) ?? "");

	// TODO: check request.ip and add the IP check logic back
	if (req.ip !== session.user?.ipAddress) session.destroy();

	if (pathname.startsWith("/login")) {
		if (session.user?.id) {
			return NextResponse.redirect(new URL("/user", req.url));
		}
	} else if(pathname !== "/") {
		if (!session.user?.id) {
			return NextResponse.redirect(new URL("/login", req.url));
		}
	}

	return response;
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
		 * - email-verification (public route)
		 * - register (public route)
		 */
		"/user/:path*",
		"/login"

		/* "/((?!api|_next/static|_next/image|favicon.ico|email-verification|register).*)" */
	]
};
