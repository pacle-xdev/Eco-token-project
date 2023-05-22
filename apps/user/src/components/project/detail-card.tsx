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
import { formatEnum } from "../../../../admin/src/utils/formatter";

const DetailCard = ({ projectData }: { projectData: any }) => {
    return (
        <div className="flex flex-col gap-5 rounded-md bg-white p-5 shadow-2xl">
            {/* <div className="flex flex-col gap-1">
                <h1 className="text-[18px] font-semibold uppercase">
                    Project Details
                </h1>
                <span className="text-[16px] text-[#7E7E7E]">Overview</span>
            </div> */}
            {projectData.status && (
                <div className="flex flex-col gap-1">
                    <h1 className="text-[18px] font-semibold uppercase">
                        project activity
                    </h1>
                    <span className="text-[16px] text-[#7E7E7E]">
                        {formatEnum(projectData.status)}
                    </span>
                </div>
            )}
            {/* <div className="flex flex-col gap-1">
                <h1 className="text-[18px] font-semibold uppercase">
                    project type
                </h1>
                <span className="text-[16px] text-[#7E7E7E]">
                    Agriculture Forestry and Other Land Use
                </span>
            </div> */}
            <div className="flex flex-col gap-1">
                <h1 className="text-[18px] font-semibold uppercase">
                    Reference ID (CFC Project id)
                </h1>
                <span className="text-[16px] text-[#7E7E7E]">
                    {projectData.producerID}
                </span>
            </div>
            <div className="flex flex-col gap-1">
                <h1 className="text-[18px] font-semibold uppercase">
                    Project Start Date
                </h1>
                <span className="text-[16px] text-[#7E7E7E]">
                    {projectData.dateStart?.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </span>
            </div>
            {projectData.dateEnd && (
                <div className="flex flex-col gap-1">
                    <h1 className="text-[18px] font-semibold uppercase">
                        Project End Date
                    </h1>
                    <span className="text-[16px] text-[#7E7E7E]">
                        {projectData.dateEnd?.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",  
                            year: "numeric",
                        })}
                    </span>
                </div>
            )}
        </div>
    );
};
export default DetailCard;
