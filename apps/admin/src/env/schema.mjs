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

// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    IRON_SESSION_PASSWORD: z.string(),
    IRON_SESSION_COOKIE_EXPIRE_TIME: z.string(),
    EMAIL_VERIFICATION_EMAIL_ADDRESS: z.string(),
    EMAIL_VERIFICATION_EXPIRE_TIME: z.string(),
    EMAIL_CLIENT_ID: z.string(),
    EMAIL_PRIVATE_KEY: z.string(),
    DISABLE_EMAIL_VERIFICATION: z.string().optional(),
    SPACES_KEY: z.string(),
    SPACES_SECRET: z.string(),
    SPACES_BUCKET: z.string(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
    // NEXT_PUBLIC_BAR: z.string(),
    NEXT_PUBLIC_SOLANA_RPC: z.string(),
    NEXT_PUBLIC_SOLANA_NETWORK: z.string(),
    NEXT_PUBLIC_CDN_URL: z.string(),
    NEXT_PUBLIC_SOLANA_ADMIN_PUBKEY: z.string(),
    NEXT_PUBLIC_SOLANA_USDC: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
    // NEXT_PUBLIC_BAR: process.env.NEXT_PUBLIC_BAR,
    NEXT_PUBLIC_SOLANA_RPC: process.env.NEXT_PUBLIC_SOLANA_RPC,
    NEXT_PUBLIC_SOLANA_NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK,
    NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
    NEXT_PUBLIC_SOLANA_ADMIN_PUBKEY: process.env.NEXT_PUBLIC_SOLANA_ADMIN_PUBKEY,
    NEXT_PUBLIC_SOLANA_USDC: process.env.NEXT_PUBLIC_SOLANA_USDC,
};
