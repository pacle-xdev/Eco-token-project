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

import { IronSessionOptions } from "iron-session";

export const ironOptions: IronSessionOptions = {
	cookieName: "ecotoken-session",
	password: process.env.IRON_SESSION_PASSWORD as string,
	cookieOptions: {
		// If you want cookies to expire when the user closes the browser, pass
		// maxAge: undefined in cookie options, this way:
		maxAge: undefined,
		secure: process.env.NODE_ENV === "production"
	}
};

export const adminIronOptions: IronSessionOptions = {
	cookieName: "admin-session",
	password: process.env.IRON_SESSION_PASSWORD as string,
	cookieOptions: {
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60 * Number(process.env.IRON_SESSION_COOKIE_EXPIRE_TIME)
	}
};

export const getOptionsBySite = (url: string) => {
	switch (url) {
		case "localhost:3000": {
			return ironOptions;
		}
		case "localhost:3001": {
			return adminIronOptions;
		}
		default: {
			return ironOptions;
		}
	}
};
