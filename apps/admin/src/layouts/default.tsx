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

import logo from "@ecotoken/ui/assets/brand/logo.png";
import Navbar from "@/components/layout/navbar";
import Sidebar, {
    SidebarItem,
    type SidebarItemProps,
    type SidebarCategoryProps,
    SidebarCategory,
} from "@/components/layout/sidebar";
import {
    faArrowLeft,
    faGear,
    faUser,
    faHouse,
    faLeaf,
    faGlobe,
    faScrewdriverWrench,
    faWallet,
    faAddressCard,
    faHammer,
    faLocationDot,
    faHandHoldingMedical,
    faImages,
    faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { Transition } from "@headlessui/react";

const sidebarCategories: Readonly<SidebarCategoryProps>[] = [
    {
        name: "Admin",
        icon: faUser,
        items: [
            {
                path: "/admin-users",
                name: "Admin Users",
                icon: faUser,
            },
            {
                path: "/websites",
                name: "Websites",
                icon: faGlobe,
            },
            {
                path: "/roles",
                name: "Roles",
                icon: faAddressCard,
            },
            {
                path: "/configuration",
                name: "Configuration",
                icon: faScrewdriverWrench,
            },
            {
                path: "/nft-builder",
                name: "NFT Builder",
                icon: faHammer,
            },
            {
                path: "/nft-series",
                name: "NFT Series",
                icon: faImages,
            },
        ],
    },
    {
        name: "ecoProjects",
        icon: faLeaf,
        items: [
            {
                path: "/eco-projects/benefits",
                name: "Benefits",
                icon: faHandHoldingMedical,
            },
            {
                path: "/eco-projects/locations",
                name: "Locations",
                icon: faLocationDot,
            },
            {
                path: "/eco-projects/orders",
                name: "Orders",
                icon: faShoppingCart,
            },
            {
                path: "/eco-projects",
                name: "Projects",
                icon: faLeaf,
            },
        ],
    },
];

const sidebarItems: SidebarItemProps[] = [
    {
        path: "/",
        name: "Dashboard",
        icon: faHouse,
    },
    {
        path: "/administration",
        name: "Administration",
        icon: faWallet,
    },
    {
        path: "/users",
        name: "Users",
        icon: faUser,
    },
    {
        path: "/settings",
        name: "Settings",
        icon: faGear,
    },
    {
        path: "/projects",
        name: "ecoProjects",
        icon: faLeaf,
    },
];

const DefaultLayout: NextPage<React.PropsWithChildren> = ({ children }) => {
    const context = trpc.useContext();
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    const { data: selectedSiteID } = trpc.websites.getSelectedSite.useQuery();
    const { mutateAsync: updateCurrentSite } =
        trpc.websites.updateSelectedSite.useMutation({
            async onSuccess() {
                await context.websites.getSelectedSite.invalidate();
            },
        });

    const { data: siteData } = trpc.websites.getAll.useInfiniteQuery({});

    const router = useRouter();

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

            <div id="grid">
                <Sidebar
                    id="sidebar"
                    expanded={sidebarExpanded}
                    className="border-r border-slate-300"
                >
                    <div className="flex">
                        <div className="ml-0.5 flex h-[60px] w-[60px] items-center justify-center">
                            <Image
                                src={logo}
                                alt="ecoToken System"
                                className="w-10"
                            />
                        </div>
                        <Transition
                            appear
                            show={!!selectedSiteID}
                            className="flex items-center"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            enter="transition-all ease-in-out duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            leave="transition-all ease-in-out duration-200"
                        >
                            <div className="flex items-center rounded-lg bg-slate-300 px-4 py-2">
                                <select
                                    name="Current site"
                                    className="appearance-none bg-transparent text-center"
                                    onChange={async (e) => {
                                        await updateCurrentSite({
                                            siteID: e.target.value,
                                        });
                                        router.push("/");
                                    }}
                                    value={selectedSiteID}
                                >
                                    {siteData?.pages[0]?.websites.map(
                                        (website, index) => (
                                            <option
                                                value={website.siteID}
                                                key={index}
                                            >
                                                {website.siteName}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>
                        </Transition>
                    </div>
                    {sidebarCategories.map(
                        ({ name, items, icon }, categoryIndex) => (
                            <SidebarCategory
                                name={name}
                                icon={icon}
                                expanded={sidebarExpanded}
                                key={categoryIndex}
                            >
                                {items?.map(
                                    ({ name, path, icon }, itemIndex) => (
                                        <SidebarItem
                                            key={itemIndex}
                                            path={path}
                                            name={name}
                                            icon={icon}
                                            expanded={sidebarExpanded}
                                        />
                                    ),
                                )}
                            </SidebarCategory>
                        ),
                    )}
                    {sidebarItems.map(({ name, path, icon }, index) => (
                        <SidebarItem
                            key={index}
                            path={path}
                            name={name}
                            icon={icon}
                            expanded={sidebarExpanded}
                        />
                    ))}
                    <SidebarItem
                        name="Collapse Sidebar"
                        icon={() => (
                            <FontAwesomeIcon
                                icon={faArrowLeft}
                                className={`ease-out ${
                                    !sidebarExpanded && "-rotate-180"
                                }`}
                            />
                        )}
                        expanded={sidebarExpanded}
                        onClick={() => setSidebarExpanded(!sidebarExpanded)}
                        className={clsx(
                            "-mt-2.5 opacity-0 delay-75 duration-200 hover:opacity-100 focus:opacity-100",
                        )}
                    />
                </Sidebar>

                <Navbar className="flex h-full w-full border-b border-slate-300 bg-slate-200 px-4" />
                <main
                    id="main"
                    className="m-0 flex h-full w-full items-start justify-start overflow-x-auto overflow-y-auto bg-slate-200 p-8"
                >
                    {children}
                </main>
            </div>
        </>
    );
};

export default DefaultLayout;
