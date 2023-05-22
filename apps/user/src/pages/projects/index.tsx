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

import { useEffect } from "react";
import Responsive from "@/components/dev-responsive";
import ProjectCard from "@/components/project/project-card";
import PublicLoading from "@/components/public/loading";
import ProjectsFeatured from "@/components/public/sections/home-banner";
import { trpc } from "@/utils/trpc";

import { formatCountryAndState } from "../../../../admin/src/utils/formatter";

// import BannerSection from "../sections/bannerSection";

const Projects = () => {
    const { data, hasNextPage, fetchNextPage } =
        trpc.ecoProjects.getAll.useInfiniteQuery({
            benefits: true,
            location: true,
            series: true,
        });
    useEffect(() => {
        const main = document.querySelector("main");
        const handleScroll = async (e: Event) => {
            const target = e.target as Element;
            if (
                target.scrollTop + 2 + window.innerHeight >
                    target.scrollHeight &&
                hasNextPage
            )
                await fetchNextPage();
        };
        main?.addEventListener("scroll", handleScroll);
        return () => main?.removeEventListener("scroll", handleScroll);
    }, [hasNextPage, fetchNextPage]);

    if (!data) return <PublicLoading />;
    return (
        <div className="w-full">
            {/* <BannerSection /> */}
            {/* <div
                className="relative flex h-[320px] w-full justify-center bg-cover bg-left md:h-[360px] lg:h-[420px]"
                style={{ backgroundImage: `url(${banner_image.src})` }}
            >
                <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-gradient-to-r from-black/70 to-transparent md:w-4/5"></div>
            </div> */}
            <ProjectsFeatured listBannerImage />
            {/* <Responsive /> */}
            <div className="mx-auto my-5 grid w-full max-w-[360px] grid-cols-1 content-start gap-8 px-10 md:max-w-[768px] md:grid-cols-2 lg:max-w-[1536px] lg:grid-cols-3 xl:grid-cols-4">
                {data.pages.flatMap(({ projects }) =>
                    projects.map(
                        ({
                            projectID,
                            title,
                            identifier,
                            location,
                            intro,
                            status,
                            fundAmount,
                            fundRecieved,
                            listImage,
                            nftSeries,
                        }) => (
                            <ProjectCard
                                key={projectID}
                                title={title}
                                identifier={identifier}
                                location={formatCountryAndState(
                                    location?.location ?? "",
                                    location?.cn ?? "",
                                    location?.st ?? "",
                                )}
                                intro={intro ?? undefined}
                                status={status}
                                fundAmount={fundAmount ?? undefined}
                                fundRecieved={fundRecieved ?? undefined}
                                listImage={listImage ?? undefined}
                                hasSeries={nftSeries?.isActive}
                            />
                        ),
                    ),
                )}
            </div>
        </div>
    );
};

export default Projects;
