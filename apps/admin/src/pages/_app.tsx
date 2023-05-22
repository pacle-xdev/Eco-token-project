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

import DashboardLayout from "@/layouts/default";
import "@/styles/globals.css";
import "@/styles/react-tabs.css";
import { trpc } from "@/utils/trpc";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";
import { Toaster } from "react-hot-toast";

config.autoAddCss = false;

export type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
    const defaultLayout = (page: ReactNode) => {
        return <DashboardLayout>{page}</DashboardLayout>;
    };
    const getLayout = Component.getLayout ?? defaultLayout;
    return (
        <>
            {getLayout(<Component {...pageProps} />)}
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 2000,
                    custom: {
                        className: "bg-slate-200 text-black",
                    },
                }}
            />
        </>
    );
};

export default trpc.withTRPC(App);
