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

import ProjectCard from "@/components/project/project-card";
import { trpc } from "@/utils/trpc";

import { formatCountryAndState } from "../../../../../admin/src/utils/formatter";

const ProjectsFeatured = () => {
    const { data } = trpc.ecoProjects.getAll.useInfiniteQuery({
        limit: 3,
        benefits: true,
        location: true,
        series: true,
    });

    if (!data) return <></>;
    return (
        <div className="relative flex w-full justify-center">
            <div className="relative flex w-full max-w-[1280px] justify-center">
                <div className="mx-auto grid w-full grid-cols-1 content-center gap-7 px-5 pb-6 pt-6 md:grid-cols-3">
                    {data.pages.flatMap(({ projects }) => {
                        return projects.map(
                            ({
                                projectID,
                                title,
                                identifier,
                                intro,
                                listImage,
                                status,
                                fundAmount,
                                fundRecieved,
                                location,
                                nftSeries,
                            }) => (
                                <ProjectCard
                                    key={projectID}
                                    status={status}
                                    title={title}
                                    identifier={identifier}
                                    location={formatCountryAndState(
                                        location?.location ?? "",
                                        location?.cn ?? "",
                                        location?.st ?? "",
                                    )}
                                    intro={intro ?? undefined}
                                    listImage={listImage ?? undefined}
                                    fundAmount={fundAmount ?? undefined}
                                    fundRecieved={fundRecieved ?? undefined}
                                    hasSeries={nftSeries?.isActive}
                                />
                            ),
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProjectsFeatured;
