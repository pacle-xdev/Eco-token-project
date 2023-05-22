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

import { useRouter } from "next/router";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import white_bevel_md from "@ecotoken/ui/assets/brand/bevel_white_md.png";
import globeHands from "@ecotoken/ui/assets/page/bkgd_globehands02.jpg";
import Button from "@ecotoken/ui/components/Button";

const leftItems = [
    "Open ecocredit markets",
    "Incentive local action",
    "Co-benefits",
];
const rightItems = [
    "High verification standards",
    "More than just carbon",
    "Incredible opportunity for real change",
];
const Grassroots = () => {
    const router = useRouter();

    return (
        <div className="relative mt-12 mb-16 flex min-h-[480px] w-full justify-center">
            <div
                className="absolute top-0 left-0 h-[320px] w-full bg-cover bg-center sm:h-full sm:w-[36%] md:w-[50%]"
                style={{ backgroundImage: `url(${globeHands.src})` }}
            ></div>
            <div
                className="absolute top-[25px] right-0 h-[50px] w-[75%] opacity-[35%] sm:w-[62%] sm:opacity-100 md:w-[46%]"
                style={{ backgroundImage: `url(${white_bevel_md.src})` }}
            ></div>

            <div className="relative mt-[240px] flex w-[100%] max-w-[1280px] justify-center sm:mt-0">
                <div className="relative z-10 mx-2 inline w-[100%] sm:absolute sm:top-[90px] sm:right-0 sm:w-[60%] md:w-[46%]">
                    <h1 className=" semibold w-[100%] text-center font-head text-[28px]  font-semibold leading-[1.5]  text-white sm:text-left sm:text-ecoblue-500">
                        <span className="text-shadow mb-[25px] inline-block sm:hidden">
                            Support decentralized grassroots environmental
                            innovation
                        </span>
                        <span className="hidden sm:inline-block">
                            Support decentralized grassroots environmental
                            innovation
                        </span>
                    </h1>
                    <div className="flex w-[100%]">
                        <div className="mr-[2%] inline w-[49%] align-top sm:w-[48%] md:w-[44%]">
                            {leftItems.map((item, index) => {
                                return (
                                    <div
                                        key={`left-items_${index}`}
                                        className="my-3 flex items-start gap-2 text-[18px] text-slate-600"
                                    >
                                        <FontAwesomeIcon
                                            icon={faCircleCheck}
                                            size="lg"
                                            className="mt-0.5 text-ecoblue-500"
                                        />
                                        {item}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="inline w-[49%] align-top sm:w-[50%] lg:mr-[2%]">
                            {rightItems.map((item, index) => {
                                return (
                                    <div
                                        key={`right-items_${index}`}
                                        className="my-3 flex items-start gap-2 text-[18px] text-slate-600"
                                    >
                                        <FontAwesomeIcon
                                            icon={faCircleCheck}
                                            size="lg"
                                            className="mt-0.5 text-ecoblue-500"
                                        />
                                        {item}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="w-100% mt-5 flex justify-center sm:justify-start">
                        <Button
                            intent="sky"
                            className="p-5"
                            onClick={() => router.push(`/projects`)}
                        >
                            <span className="m-2 font-head text-[24px] font-semibold">
                                EXPLORE ALL PROJECTS
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Grassroots;
