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

import type { UrlObject } from "url";
import { Fragment } from "react";
import Link from "next/link";
import { trpc } from "@/utils/trpc";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
    faChevronDown,
    faCircleQuestion,
    faCircleUser,
    faExternalLink,
    faGift,
    faMessage,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import clsx from "clsx";
import {
    Menu,
    MenuButton,
    MenuItems,
} from "@ecotoken/ui/components/HeadlessUI";

import Avatar from "./avatar";

// const dropdownItems: {
//     href?: string | UrlObject;
//     onClick?: () => void;
//     label?: string;
//     icon?: IconProp;
// }[] = [
//     {
//         href: "/settings",
//         label: "Profile",
//         icon: faUser,
//     },
//     {
//         href: "/rewards",
//         label: "Rewards",
//         icon: faGift,
//     },
//     {
//         href: "/support",
//         label: "Support Center",
//         icon: faCircleQuestion,
//     },
//     {
//         href: "/contact",
//         label: "Contact Us",
//         icon: faMessage,
//     },
// ];

const UserDropdown = () => {
    return (
        <Menu className="mt-1 flex h-[54px] items-center py-1">
            <MenuButton intent="none">
                {/* <Avatar className="w-10" /> */}
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                        icon={faCircleUser}
                        size="3x"
                        className="opacity-50"
                    />
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        size="1x"
                        aria-hidden="true"
                    />
                </div>
            </MenuButton>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <MenuItems align="right" className="z-50">
                    {/* {dropdownItems.map(
                        ({ href, icon, label, onClick }, index) => (
                            <HeadlessMenu.Item key={`${label}_${index}`}>
                                <Link
                                    href={href ?? ""}
                                    className="ui-active:bg-slate-200 group flex w-full items-center space-x-2 rounded-md p-2 text-gray-900"
                                >
                                    {icon && (
                                        <FontAwesomeIcon
                                            icon={icon}
                                            aria-hidden="true"
                                        />
                                    )}
                                    <span>{label}</span>
                                </Link>
                            </HeadlessMenu.Item>
                        ),
                    )} */}
                    <HeadlessMenu.Item key="Logout">
                        <LogoutItem />
                    </HeadlessMenu.Item>
                </MenuItems>
            </Transition>
        </Menu>
    );
};

const LogoutItem = () => {
    const { disconnect } = useWallet();

    const { mutateAsync: logout } = trpc.userAuth.logout.useMutation({});

    return (
        <div
            onClick={async () => {
                logout();
                await disconnect();
            }}
            className="ui-active:bg-slate-200 group flex w-full cursor-pointer items-center space-x-2 rounded-md p-2 text-gray-900"
        >
            <FontAwesomeIcon icon={faExternalLink} aria-hidden="true" />
            <span>Logout</span>
        </div>
    );
};

export default UserDropdown;
