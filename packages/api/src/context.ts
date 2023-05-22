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

import { getClientSession } from "@ecotoken/auth/src/iron-session/get-client-session";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type UserSession, type AdminSession } from "@ecotoken/auth";
import { stripUrl } from "@ecotoken/auth/src/utils/strip-url";
import type { NextApiRequest, NextApiResponse } from "next";
import { type inferAsyncReturnType } from "@trpc/server";
import { prisma, Site } from "@ecotoken/db";

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type CreateContextOptions = {
	session?: AdminSession | UserSession;
	currentSite?: Site;
	selectedSite?: Site;
	req: NextApiRequest;
	res: NextApiResponse;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
	return {
		prisma,
		...opts
	};
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/

export const createContext = async ({ req, res }: CreateNextContextOptions) => {
	// fetch the session, decrypt cookie/deserialize -> get session as `userSession` or `adminSession`
	const url = stripUrl(req.headers.referer);
	const session = await getClientSession(req, res, url ?? "");

	const currentSite = await prisma.site.findFirst({
		where: {
			OR: [
				{
					devUrl: {
						equals: url
					}
				},
				{
					stageUrl: {
						equals: url
					}
				},
				{
					prodUrl: {
						equals: url
					}
				}
			]
		}
	});

	let selectedSite;
	if (session && session.user?.type === "admin") {
		selectedSite = await prisma.site.findUnique({
			where: {
				siteID: session.user?.selectedSite ?? ""
			}
		});
	}

	return await createContextInner({
		session,
		currentSite: currentSite ?? undefined,
		selectedSite: selectedSite ?? undefined,
		req,
		res
	});
};

export type Context = inferAsyncReturnType<typeof createContext>;
