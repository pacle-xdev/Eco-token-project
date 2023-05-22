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

export {
	ironOptions,
	adminIronOptions
} from "./src/iron-session/session-options";
export type { IronSessionData } from "iron-session";
import type { IronSession } from "iron-session";
import { Permission } from "@ecotoken/db";

export type UserSession = {
	user?: {
		type: "user";
		id: string;
		permissions?: Permission[];
		ipAddress?: string;
	};
} & IronSession;

export type AdminSession = {
	user?: {
		type: "admin";
		id: string;
		permissions?: Permission[];
		ipAddress?: string;
		selectedSite?: string;
	};
} & IronSession;
