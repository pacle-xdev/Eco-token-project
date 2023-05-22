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

import { TRPCError, initTRPC } from "@trpc/server";
import { transformer } from "../transformer";
import { hasPermission } from "./utils/permission";

import type { Context } from "./context";
import type { UserSession, AdminSession } from "@ecotoken/auth";

type Meta = {
	requiredPermissions?: string[];
};

export type DeepRequired<T> = {
	[K in keyof T]: DeepRequired<T[K]>;
} & Required<T>;

const t = initTRPC
	.context<Context>()
	.meta<Meta>()
	.create({
		transformer,
		errorFormatter({ shape }) {
			return shape;
		}
	});

export const isOnWhitelistedSite = t.middleware(({ next, ctx }) => {
	if (!ctx.currentSite?.siteID) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "You are not authorized to access this endpoint."
		});
	}
	return next({
		ctx: {
			// Infers the `session` as non-nullable
			currentSite: ctx.currentSite
		}
	});
});

export const isAuthenticated = isOnWhitelistedSite.unstable_pipe(
	({ next, ctx }) => {
		if (!ctx.session?.user?.id) {
			throw new TRPCError({
				code: "UNAUTHORIZED"
			});
		}
		const session = ctx.session as DeepRequired<typeof ctx.session>;
		return next({
			ctx: {
				// Infers the `session` as non-nullable
				session
			}
		});
	}
);

export const isUserAuthenticated = isAuthenticated.unstable_pipe(
	({ next, ctx }) => {
		if (ctx.session.user.type !== "user") {
			throw new TRPCError({
				code: "UNAUTHORIZED"
			});
		}
		const session = ctx.session as DeepRequired<UserSession>;
		return next({
			ctx: {
				// Infers the `session` as non-nullable
				session
			}
		});
	}
);

export const isAdminAuthenticated = isAuthenticated.unstable_pipe(
	({ next, ctx }) => {
		if (ctx.session.user.type !== "admin") {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "You are not authorized to access this endpoint."
			});
		}
		const session = ctx.session as DeepRequired<AdminSession>;
		return next({
			ctx: {
				// Infers the `session` as non-nullable
				session
			}
		});
	}
);

export const hasRequiredPermissions = isAuthenticated.unstable_pipe(
	async ({ ctx, meta, next }) => {
		if (
			!hasPermission(
				ctx.session.user.permissions ?? [],
				meta?.requiredPermissions ?? ""
			)
		)
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "Not enough permissions."
			});
		return next({ ctx });
	}
);

export const router = t.router;

export const publicProcedure = t.procedure.use(isOnWhitelistedSite);
export const authedProcedure = publicProcedure.use(isAuthenticated);
export const userAuthedProcedure = publicProcedure.use(isUserAuthenticated);
export const adminAuthedProcedure = publicProcedure.use(isAdminAuthenticated);
