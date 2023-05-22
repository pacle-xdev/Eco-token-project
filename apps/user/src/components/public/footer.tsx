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
import Link from "next/link";
import {
    faDiscord,
    faLinkedinIn,
    faTelegram,
    faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import white_bevel from "@ecotoken/ui/assets/brand/bevel_white_lg.png";
import bkgd_wave from "@ecotoken/ui/assets/brand/bkgd_wave.png";
import logo from "@ecotoken/ui/assets/brand/logo_ecotoken-wm-600.png";
import Button from "@ecotoken/ui/components/Button";

const PublicFooter = () => {
    return (
        <>
            <div className="relative flex w-full flex-col content-end border">
                <div
                    className="relative mt-[110px] h-[275px] w-full bg-slate-600 bg-cover bg-right-bottom"
                    style={{ backgroundImage: `url(${bkgd_wave.src})` }}
                >
                    <div
                        className="absolute left-0 bottom-[225px] flex h-[140px] w-[90%] flex-row justify-end  bg-right-top sm:bottom-[20%] sm:h-[120%] sm:w-[50%]"
                        style={{ backgroundImage: `url(${white_bevel.src})` }}
                    >
                        <div className="relative w-full max-w-[600px] px-8 pt-[10px] sm:px-16 sm:pt-[16px] sm:pt-[40px]">
                            <Image
                                src={logo}
                                alt="ecoToken System"
                                className={
                                    "w-[240px] transition-all sm:w-[300px]"
                                }
                            />
                            <div className="w-80% flex gap-4 py-1 pl-2 sm:py-4">
                                <Link
                                    href="https://twitter.com/THEecoToken"
                                    target="_new"
                                    className="h-[44px] w-[44px] rounded-[24px] bg-ecoblue-500 pt-[7px] text-center"
                                >
                                    <FontAwesomeIcon
                                        icon={faTwitter}
                                        size="2x"
                                        className="text-white"
                                    />
                                </Link>
                                <Link
                                    href="https://t.me/ecosystemtoken"
                                    target="_new"
                                    className="relative h-[44px] w-[44px] rounded-[24px] border-4 border-ecoblue-500 bg-white text-center"
                                >
                                    <FontAwesomeIcon
                                        icon={faTelegram}
                                        size="3x"
                                        className="relative -left-[2px] -top-[3px] m-0 text-ecoblue-500"
                                    />
                                </Link>
                                <Link
                                    href="https://discord.gg/wBEBh3FYZ7"
                                    target="_new"
                                    className="h-[44px] w-[44px] rounded-[24px] bg-ecoblue-500 pt-[7px] text-center"
                                >
                                    <FontAwesomeIcon
                                        icon={faDiscord}
                                        size="2x"
                                        className="text-white"
                                    />
                                </Link>
                                <Link
                                    href="https://www.linkedin.com/company/the-ecotoken/about/"
                                    target="_new"
                                    className="h-[44px] w-[44px] rounded-[24px] bg-ecoblue-500 pt-[7px] pl-[2px] text-center"
                                >
                                    <FontAwesomeIcon
                                        icon={faLinkedinIn}
                                        size="2x"
                                        className="text-white"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="relative left-[5%] top-[40px] flex  h-full w-[90%] max-w-[500px] flex-col justify-start pr-4 pt-8 sm:absolute sm:left-[50%] sm:top-[10px] sm:w-[50%]">
                        <h2 className="text-shadow font-head text-[32px] font-medium text-white sm:text-[36px]">
                            Get in touch!
                        </h2>
                        <p className="mt-[18px] text-sm text-white">
                            If you would like to know more about how the
                            ecoToken System promotes environmental initiatives
                            or other ways you can help us bring health to the
                            planet, please contact us.
                        </p>
                        <div className="mt-4 flex w-[90%]">
                            <input
                                type={"email"}
                                className="w-full rounded-l-xl rounded-r-none border border-r-0 border-slate-300 bg-slate-900/50 px-[18px] py-[12px]"
                                placeholder="Email Address"
                            />
                            <Button
                                className="whitespace-nowrap rounded-l-none rounded-r-xl bg-ecoblue-500"
                                intent="destructive"
                            >
                                Subscribe Now
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="w-full bg-ecoblue-500 py-3 text-center text-xs text-white">
                    Copyright 2023. All Right Reserved
                </div>
            </div>
        </>
    );
};

export default PublicFooter;
