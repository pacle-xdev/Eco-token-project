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

/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        "./src/**/*.{ts,tsx}",
        "../../packages/ui/components/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                ecogreen: {
                    100: "#e7f2d3",
                    200: "#cfe6a8",
                    300: "#b6d97c",
                    400: "#9ecd51",
                    500: "#86c025",
                    600: "#6b9a1e",
                    700: "#507316",
                    800: "#364d0f",
                    900: "#1b2607",
                },
                ecoblue: {
                    100: "#ccebfa",
                    200: "#99d7f4",
                    300: "#66c3ef",
                    400: "#33afe9",
                    500: "#009be4",
                    600: "#007cb6",
                    700: "#005d89",
                    800: "#003e5b",
                    900: "#001f2e",
                },
            },
            fontFamily: {
                head: ["Poppins"],
            },
        },
    },
    plugins: [],
};

module.exports = config;
