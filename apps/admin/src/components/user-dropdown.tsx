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

import {
	Menu,
	MenuButton,
	MenuItems
} from "@ecotoken/ui/components/HeadlessUI";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
	faChevronDown,
	faCircleQuestion,
	faExternalLink,
	faGift,
	faMessage,
	faUser
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import { Fragment } from "react";
import type { UrlObject } from "url";

import Avatar from "./avatar";

const dropdownItems: {
	href?: string | UrlObject;
	label?: string;
	icon?: IconProp;
}[] = [
	{
		href: "/settings",
		label: "Profile",
		icon: faUser
	},
	{
		href: "/rewards",
		label: "Rewards",
		icon: faGift
	},
	{
		href: "/support",
		label: "Support Center",
		icon: faCircleQuestion
	},
	{
		href: "/contact",
		label: "Contact Us",
		icon: faMessage
	},
	{
		href: "/logout",
		label: "Logout",
		icon: faExternalLink
	}
];

const UserDropdown = () => {
	return (
		<Menu>
			<MenuButton intent="none">
				<Avatar className="w-10" />
				<FontAwesomeIcon
					icon={faChevronDown}
					className="h-4 w-4"
					aria-hidden="true"
				/>
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
					{dropdownItems.map((props, index) => (
						<HeadlessMenu.Item key={index}>
							{({ active }) => (
								<Link
									href={props?.href ?? ""}
									className={clsx(
										"group flex w-full items-center space-x-2 rounded-md p-2 text-gray-900",
										{ "bg-slate-200": active }
									)}
								>
									{props.icon && (
										<FontAwesomeIcon
											icon={props.icon}
											aria-hidden="true"
										/>
									)}
									<span>{props.label}</span>
								</Link>
							)}
						</HeadlessMenu.Item>
					))}
				</MenuItems>
			</Transition>
		</Menu>
	);
};
export default UserDropdown;
