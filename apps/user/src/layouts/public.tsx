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

// import PublicFooter from "@/components/public/layout/footer";
import type { NextPage } from "next";
import Head from "next/head";
import PublicFooter from "@/components/public/footer";
import PublicNavbar from "@/components/public/layout/navbar";

const DefaultLayout: NextPage<React.PropsWithChildren> = ({ children }) => {
    return (
        <>
            <Head>
                <title>EcoToken</title>
                <meta name="description" content="The EcoToken system." />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex flex-col">
                <div className="flex w-full flex-col">
                    <PublicNavbar />
                </div>
                <div className="grid h-full w-full grid-flow-col grid-rows-[auto_minmax(0,max-content)] bg-slate-200/75">
                    <main className="mt-16 flex justify-center overflow-y-auto">
                        {children}
                    </main>
                    <div className="flex w-full auto-rows-max flex-col">
                        <PublicFooter />
                    </div>
                </div>
            </div>
        </>
    );
};

export default DefaultLayout;
