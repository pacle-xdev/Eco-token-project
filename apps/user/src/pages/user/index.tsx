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

import { type NextPage } from "next";
import ProjectCard from "@/components/project/project-card";
import { trpc } from "@/utils/trpc";

import Support from "../../components/project/home-support";
import BannerSection from "../../components/public/sections/home-banner";
import CreatedByYou from "../../components/public/sections/home-created";
import Credits from "../../components/public/sections/home-credits";
import RetireSection from "../../components/public/sections/home-how";

const Home: NextPage = () => {
    const { data } = trpc.ecoProjects.getAll.useInfiniteQuery({
        limit: 3,
        benefits: true,
        location: true,
    });

    if (!data) return <div>Loading...</div>;

    return (
        <>
            <div className="mx-auto w-full">
                <BannerSection />

                <div className="grid w-full grid-cols-3 content-start gap-7 bg-[#F0F0F0] py-[5em] px-[7em]">
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
                            }) => (
                                <ProjectCard
                                    key={projectID}
                                    title={title}
                                    identifier={identifier}
                                    location={location?.location}
                                    intro={intro ?? undefined}
                                    status={status}
                                    fundAmount={fundAmount ?? undefined}
                                    fundRecieved={fundRecieved ?? undefined}
                                    listImage={listImage ?? undefined}
                                />
                            ),
                        ),
                    )}
                </div>

                <RetireSection />
                <Credits />
                <CreatedByYou />
                <Support />
            </div>
        </>
    );
};

export default Home;
