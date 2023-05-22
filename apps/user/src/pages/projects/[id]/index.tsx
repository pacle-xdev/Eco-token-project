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
import { useRouter } from "next/router";
import DetailCard from "@/components/project/detail-card";
import ProjectCard from "@/components/project/project-card";
import PublicLoading from "@/components/public/loading";
import { trpc } from "@/utils/trpc";
import credit_icon from "@ecotoken/ui/assets/icons/credits.svg";
import Button from "@ecotoken/ui/components/Button";

import { formatCountryAndState } from "../../../../../admin/src/utils/formatter";

const ProjectDetails = () => {
    const router = useRouter();
    const { id } = router.query;

    const { data: project } = trpc.ecoProjects.get.useQuery(
        {
            identifier: id as string,
            series: true,
        },
        { enabled: !!id },
    );

    const { data: projects } = trpc.ecoProjects.getAll.useInfiniteQuery({
        limit: 3,
        benefits: true,
        location: true,
        series: true,
    });
    if (!project) return <PublicLoading />;

    return (
        <div className="w-full">
            <div className="relative">
                <div
                    className="h-100 min-h-[600px] w-full object-cover"
                    style={{
                        backgroundImage: `url(
                            ${
                                project.listImage?.startsWith("https")
                                    ? project.listImage
                                    : `${process.env.NEXT_PUBLIC_CDN_URL}/${project.listImage}`
                            }
                        )`,
                        backgroundSize: "cover",
                    }}
                ></div>
                <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-gradient-to-r from-black/70 to-transparent md:w-4/5"></div>
                {project.nftSeries?.isActive && (
                    <Button
                        intent={"sky"}
                        className="absolute bottom-10 right-6 uppercase"
                        onClick={() => {
                            router.push(`/projects/${id}/purchase`);
                        }}
                    >
                        <Image
                            src={credit_icon}
                            alt="Credit Icon"
                            className="h-[30px] w-[30px]"
                            quality={100}
                        />
                        Buy Credits
                    </Button>
                )}
            </div>

            <div className="mx-4 mt-7 flex flex-col gap-10 sm:mx-[10em] md:flex-row">
                <div className="w-full space-y-6 md:w-2/3">
                    <div className="space-y-2 leading-none">
                        <h1 className="text-5xl font-bold text-slate-800">
                            {project.title}
                        </h1>
                        <h3 className="text-xl font-semibold text-slate-600">
                            {formatCountryAndState(
                                project.location?.location ?? "",
                                project.location?.cn ?? "",
                                project.location?.st ?? "",
                            )}
                        </h3>
                    </div>
                    <div
                        className="text-[#7E7E7E]"
                        dangerouslySetInnerHTML={{
                            __html: project.project ?? "",
                        }}
                    ></div>
                    <p
                        dangerouslySetInnerHTML={{
                            __html: project.overview ?? "",
                        }}
                    ></p>
                    {project.nftSeries?.isActive && (
                        <div className="flex w-[300px] justify-between">
                            <div className="flex flex-col gap-5">
                                <div className="flex flex-col">
                                    <span className="text-[#7E7E7E]">
                                        Credit Type
                                    </span>
                                    <span className="text-[18px] font-semibold">
                                        {project.nftSeries?.seriesType}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#7E7E7E]">
                                        Price Per Ton
                                    </span>
                                    <span className="text-[18px] font-semibold">
                                        {`$${project.nftSeries?.creditPrice}`}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-5">
                                {project.nftSeries?.setAmount && (
                                    <div className="flex flex-col">
                                        <span className="text-[#7E7E7E]">
                                            Credits Available
                                        </span>
                                        <span className="text-[18px] font-semibold">
                                            {project.nftSeries?.setAmount?.toString() ??
                                                0}
                                        </span>
                                    </div>
                                )}
                                {project.nftSeries?.totalCredits &&
                                    project.nftSeries?.setAmount && (
                                        <div className="flex flex-col">
                                            <span className="text-[#7E7E7E]">
                                                Credits Retired
                                            </span>
                                            <span className="text-[18px] font-semibold">
                                                {(
                                                    Number(
                                                        project.nftSeries
                                                            ?.totalCredits,
                                                    ) -
                                                    Number(
                                                        project.nftSeries
                                                            ?.setAmount,
                                                    )
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                            </div>
                        </div>
                    )}
                    {project.nftSeries?.isActive && (
                        <Button
                            intent={"sky"}
                            className="mt-10 uppercase"
                            onClick={() => {
                                router.push(`/projects/${id}/purchase`);
                            }}
                        >
                            <Image
                                src={credit_icon}
                                alt="Credit Icon"
                                className="h-[30px] w-[30px]"
                            />
                            Buy Credits
                        </Button>
                    )}
                </div>
                <div className="sm:mt-4 mt-20 w-full md:w-1/3">
                    {" "}
                    <DetailCard projectData={project} />
                </div>
            </div>
            {/* <Responsive /> */}
            {projects && (
                <div className="mt-[13em]">
                    <div className="mx-5 border-4 border-slate-300"></div>
                    <h1 className="mt-8 text-center font-head text-[36px] font-semibold uppercase leading-none text-slate-600">
                        Other projects for you to explore
                    </h1>
                    <div className="grid w-full grid-cols-1 content-start gap-7 py-[5em]  px-8 sm:grid-cols-3 sm:px-[7em]">
                        {projects.pages.flatMap(({ projects }) => {
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
                                    nftSeries,
                                }) => (
                                    <ProjectCard
                                        key={projectID}
                                        status={status}
                                        title={title}
                                        identifier={identifier}
                                        listImage={listImage ?? undefined}
                                        location={formatCountryAndState(
                                            project.location?.location ?? "",
                                            project.location?.cn ?? "",
                                            project.location?.st ?? "",
                                        )}
                                        intro={intro ?? undefined}
                                        fundAmount={fundAmount ?? undefined}
                                        fundRecieved={fundRecieved ?? undefined}
                                        hasSeries={nftSeries?.isActive}
                                    />
                                ),
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetails;
