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

import Image from "next/image";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import blue_bevel from "@ecotoken/ui/assets/brand/bevel_blue_lg.png";
import nfts_created_image from "@ecotoken/ui/assets/ecoproject/nfts_created.png";
import bkgdComputer from "@ecotoken/ui/assets/ecoproject/nfts_mint_process.jpg";
import sky_triangle_image from "@ecotoken/ui/assets/ecoproject/triangle-sky.png";
import check_white_icon from "@ecotoken/ui/assets/icons/check_white.svg";

const nftsCreated = [
    "Project Supported (Determines Background)",
    "Amount of Credits Purchased (No Minimum)",
    "Currency (USDC or SOL)",
    "Retiree's Names (Chosen)",
    "Retiree's Location (Chosen)",
];

const CreatedByYou = () => {
    return (
        <div className="relative flex min-h-[400px] w-full justify-center sm:min-h-[400px] lg:min-h-[440px]">
            <div
                className="absolute top-0 right-0 h-full w-[100%] bg-cover sm:w-[64%] md:w-[62%] lg:w-[60%]"
                style={{ backgroundImage: `url(${bkgdComputer.src})` }}
            ></div>
            <div
                className="absolute left-0 top-0 hidden h-[75%] w-[85%] min-w-[480px] justify-end bg-right-top sm:flex sm:h-full lg:w-[64%]"
                style={{ backgroundImage: `url(${blue_bevel.src})` }}
            >
                <div className="relative mr-8 flex h-full w-[100%] items-start pl-4 sm:mr-24 sm:pl-[25px] md:mr-28 md:items-center md:pl-[75px]">
                    <div className="relative flex w-[100%] flex-col pt-2 sm:pt-2">
                        <h2 className="mb-2 font-head text-[1.75rem] font-semibold leading-[.9] text-white sm:mb-2 sm:text-[1.75rem] md:mb-2 md:text-[2rem] lg:text-[2.5rem]">
                            NFTs are created by you
                        </h2>
                        <div className=" leading-[1.2]">
                            {nftsCreated.map((desc: string, index: number) => {
                                return (
                                    <div
                                        className="my-2 flex items-start gap-2 text-[1.0rem] text-white sm:items-center sm:text-[1.125rem] md:text-[1.25rem] lg:text-[1.4375rem]"
                                        key={"nfts-created" + index}
                                    >
                                        <FontAwesomeIcon
                                            icon={faCircleCheck}
                                            size="lg"
                                            className="mt-0.5 text-ecoblue-700"
                                        />
                                        {desc}
                                    </div>
                                );
                            })}
                        </div>
                        <div>
                            <p className="lg:text-[1.4375rem]] mb-4 mt-3 pr-[100px] pl-0.5 text-[1.125rem] leading-[1.25] text-white sm:mt-5 sm:pr-[50px] sm:text-[1.125rem] md:pr-[100px] md:text-[1.375rem]">
                                The User connects their Wallet and completes
                                the&nbsp;transaction
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatedByYou;
