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
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import type { UrlObject } from "url";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export type SidebarItemProps = {
	expanded?: boolean;
	name?: string;
	icon?: IconProp | (() => JSX.Element);
	path?: string | UrlObject;
};

export const SidebarItem: React.FC<
	React.ComponentProps<"div"> & SidebarItemProps
> = ({
	className,
	path,
	name = "",
	icon,
	expanded = true,
	children,
	...props
}) => {
	const router = useRouter();
	return (
		<div
			className={clsx(
				"whitespace-nowrap rounded-md px-5 py-2 ease-out",
				className
			)}
			{...props}
		>
			<Link href={path ?? router.asPath}>
				{icon && (
					<div className="mr-2 inline-block h-6 w-6 text-center [&>svg]:text-slate-500">
						{typeof icon === "function"
							? icon()
							: icon && <FontAwesomeIcon icon={icon} />}
					</div>
				)}
				{(name || children) && (
					<Transition
						as="div"
						show={expanded}
						className="inline-block"
						enter="ease-in-out duration-200"
						enterFrom="opacity-0 w-0"
						enterTo="opacity-100 w-full"
						leave="ease-in-out duration-200"
						leaveFrom="opacity-100 w-full"
						leaveTo="opacity-0 w-0"
					>
						{name}
						{children}
					</Transition>
				)}
			</Link>
		</div>
	);
};

export type SidebarCategoryProps = {
	expanded?: boolean;
	name?: string;
	items?: SidebarItemProps[];
	icon?: IconProp | (() => JSX.Element);
};

export const SidebarCategory: React.FC<
	React.ComponentProps<"div"> & SidebarCategoryProps
> = ({ children, className, name, expanded, icon, ...props }) => {
	const [categoryExpanded, setCategoryExpanded] = useState(true);
	const categoryRef = useRef<HTMLDivElement | null>(null);

	const animateHeight = (elem: HTMLElement | null) => {
		if (!elem) return;
		// debugger;
		elem.style.height = "";
		elem.style.transition = "none";

		const startHeight = window.getComputedStyle(elem).height;

		// Remove the collapse class, and force a layout calculation to get the final height
		elem.classList.toggle("h-0");
		const expandedHeight = window.getComputedStyle(elem).height;

		// Set the start height to begin the transition
		elem.style.height = startHeight;

		// wait until the next frame so that everything has time to update before starting the transition
		requestAnimationFrame(() => {
			elem.style.transition = "";

			requestAnimationFrame(() => {
				elem.style.height = expandedHeight;
			});
		});

		// Clear the saved height values after the transition
		elem.addEventListener("transitionend", () => {
			elem.style.height = "";
		});

		elem.removeEventListener("transitionend", () => {
			elem.style.height = "";
		});
	};

	useEffect(
		() => animateHeight(categoryRef.current),
		[categoryRef, categoryExpanded]
	);

	return (
		<div {...props}>
			<SidebarItem
				name={name}
				icon={icon}
				expanded={expanded}
				onClick={() => setCategoryExpanded(!categoryExpanded)}
			>
				<FontAwesomeIcon
					icon={faChevronDown}
					size="sm"
					className={clsx(
						{ "rotate-180": !categoryExpanded },
						"ml-2"
					)}
				/>
			</SidebarItem>
			<div
				className={clsx("overflow-hidden", className)}
				ref={categoryRef}
			>
				<div className="ml-4">{children}</div>
			</div>
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
				"relative flex flex-col overflow-hidden bg-slate-200 duration-150 ease-in-out",
				{ "w-48": expanded },
				{ "w-16": !expanded },
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
};

export default Sidebar;
