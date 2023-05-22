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

import UserDropdown from "@/components/user-dropdown";
import { getRouteName } from "@/utils/route";
import clsx from "clsx";
import { useRouter } from "next/router";

const Navbar: React.FC<React.ComponentProps<"div">> = ({
	className,
	...props
}) => {
	const router = useRouter();
	return (
		<div
			id="navbar"
			className={clsx("m-0 items-center", className)}
			{...props}
		>
			<div className="flex-1 justify-start">
				<div className="capitalize">{getRouteName(router.route)}</div>
			</div>
			<div className="flex justify-end space-x-2">
				<UserDropdown />
			</div>
		</div>
	);
};

export default Navbar;
