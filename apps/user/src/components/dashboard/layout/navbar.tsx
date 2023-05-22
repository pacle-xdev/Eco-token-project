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
// import { getRouteName } from "@/utils/route";
// import { useRouter } from "next/router";
import type { NextPage } from "next";
import Image from "next/image";
import logo from "@ecotoken/ui/assets/brand/logo-header.png";
import clsx from "clsx";

const Navbar: NextPage<React.PropsWithChildren> = ({ children }) => {
    return (
        <div className="fixed top-0 z-30 flex h-16 w-full items-center border-b border-slate-300 bg-slate-200">
            <div className="flex-1 justify-start">
                {/* <div className="capitalize">{getRouteName(router.route)}</div> */}
                {/* <div>
					Wallet Address{" "}
					<span className="rounded-md bg-slate-300 px-2 py-1">
						{web3auth.loginInfo?.walletAddress}
					</span>{" "}
				</div> */}
                <Image
                    src={logo}
                    alt="ecoToken System"
                    className={clsx("h-10 w-auto pl-6 transition-all")}
                />
            </div>
            <div className="flex h-full w-2/3 justify-between bg-[#00AEEF] before:ml-0 before:block before:h-full  before:overflow-hidden  before:border-l-[20px] before:border-t-[31px] before:border-r-[20px]  before:border-b-[32px] before:border-l-slate-200 before:border-r-[#00AEEF] before:border-t-slate-200 before:border-b-[#00AEEF] before:content-['']">
                {children}
                <div className="px-10">
                    <UserDropdown />
                </div>
            </div>
        </div>
    );
};

export default Navbar;
