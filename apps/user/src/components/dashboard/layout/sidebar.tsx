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

import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import type { UrlObject } from "url";

type SidebarItemProps = {
	expanded?: boolean;
	name?: string;
	icon?: IconProp | (() => JSX.Element);
	path?: string | UrlObject;
};

export const SidebarItem: React.FC<
	React.ComponentProps<"div"> & SidebarItemProps
> = ({ className, path = "", name = "", icon, expanded, ...props }) => {
	return (
		<div
			className={clsx(
				"whitespace-nowrap rounded-md px-4 py-2 transition-all ease-out",
				className
			)}
			{...props}
		>
			<Link href={path} className={`${expanded && "space-x-2"}`}>
				<>
					{typeof icon === "function"
						? icon()
						: icon && <FontAwesomeIcon icon={icon} />}
					<Transition
						as="span"
						show={expanded}
						enter="transition-all ease-in-out duration-200"
						enterFrom="opacity-0 w-0"
						enterTo="opacity-100 w-full"
						leave="transition-all ease-in-out duration-200"
						leaveFrom="opacity-100 w-full"
						leaveTo="opacity-0 w-0"
					>
						{name}
					</Transition>
				</>
			</Link>
		</div>
	);
};

type SidebarProps = {
	expanded: boolean;
};

const Sidebar: React.FC<React.ComponentProps<"div"> & SidebarProps> = ({
	className,
	children,
	expanded,
	...props
}) => {
	return (
		<div
			className={clsx(
				"relative flex flex-col space-y-2 overflow-hidden bg-slate-200 p-2 transition-all duration-200 ease-in-out",
				{ "w-64": expanded },
				{ "w-16 items-center": !expanded },
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
};

export default Sidebar;
