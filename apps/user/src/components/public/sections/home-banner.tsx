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

import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import list_banner_image from "@ecotoken/ui/assets/brand/head_listimages-01.jpg";
import banner_image from "@ecotoken/ui/assets/brand/head_nftsite-01.jpg";
import Button from "@ecotoken/ui/components/Button";

const ProjectsFeatured = ({
    listBannerImage,
}: {
    listBannerImage?: boolean;
}) => {
    return (
        <div
            className="relative flex h-[320px] w-full justify-center bg-cover bg-left md:h-[360px] lg:h-[420px]"
            style={{
                backgroundImage: `url(${
                    listBannerImage ? list_banner_image.src : banner_image.src
                })`,
            }}
        >
            <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-gradient-to-r from-black/70 to-transparent md:w-4/5"></div>
            <div className="relative flex min-h-[100px] w-full max-w-[1280px] justify-start align-bottom">
                <div className="relative flex min-h-[50px] w-full flex-col-reverse md:w-[90%] lg:w-[75%]">
                    <div className="relative inline-block pl-4 mb-8">
                        <h1 className="text-shadow p-0 text-center font-head text-3xl font-bold uppercase leading-none text-ecoblue-400 md:text-left md:text-5xl lg:text-6xl">
                            NFT impact offsetting
                        </h1>
                        <h1 className="text-shadow m-0 p-0 text-center font-head text-3xl font-bold uppercase leading-normal text-white md:text-left md:text-5xl lg:text-6xl">
                            With Regen ecocredits
                        </h1>
                        <p className="text-shadow mb-0 mt-2 text-center text-xl font-medium leading-[1.2] text-white md:text-left md:text-2xl lg:text-3xl">
                            Verifiable cross chain ecocredit retirement on
                            Solana with Carbon, Water, and Habitat&nbsp;credits
                        </p>
                        {/* <div className="relative flex w-[100%] justify-center md:justify-start">
                            <div className="flex">
                                <Button
                                    intent={"sky"}
                                    className="mt-4 mb-8 w-36 md:w-40 lg:w-44"
                                >
                                    <span className="flex items-center gap-3 px-1 py-1 font-head text-lg font-medium md:text-xl lg:text-2xl">
                                        <span className="whitespace-nowrap">
                                            LOG IN
                                        </span>
                                        <FontAwesomeIcon
                                            icon={faCircleArrowRight}
                                            size="xl"
                                            className="m-0 text-white"
                                        />
                                    </span>
                                </Button>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectsFeatured;
