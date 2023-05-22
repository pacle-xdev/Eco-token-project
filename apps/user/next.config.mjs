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
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    swcMinify: true,
    // Enables hot-reload and easy integration for local packages
    transpilePackages: [
        "@ecotoken/api",
        "@ecotoken/db",
        "@ecotoken/auth",
        "@ecotoken/ui",
    ],
    // We already do linting on GH actions
    eslint: {
        ignoreDuringBuilds: !!process.env.CI,
    },
    images: {
        domains: [
            process.env.NEXT_PUBLIC_CDN_URL?.replaceAll("https://", "") ?? "",
            "regen-registry-server.herokuapp.com",
            "cdn.discordapp.com",
            "discordapp.com",
            "eco-token.io",
        ],
        // remotePatterns: [
        //     {
        //         protocol: "https",
        //         hostname:
        //             process.env.NEXT_PUBLIC_CDN_URL?.replaceAll(
        //                 "https://",
        //                 "",
        //             ) ?? "",
        //         port: "",
        //         pathname: "*",
        //     },
        //     {
        //         protocol: "https",
        //         hostname: "eco-token.io",
        //         port: "",
        //         pathname: "*",
        //     },
        //     {
        //         protocol: "https",
        //         hostname: "regen-registry-server.herokuapp.com",
        //         port: "",
        //         pathname: "*",
        //     },
        // ],
    },
};

export default config;
