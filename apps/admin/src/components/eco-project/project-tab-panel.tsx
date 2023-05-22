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
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

const ProjectTabPanel = ({
    children,
    index,
    projectId,
}: {
    children: React.ReactNode;
    index: number;
    projectId?: string | string[] | undefined;
}) => {
    const router = useRouter();
    const tabPanels = Array(9).fill(0);
    return (
        <>
            <Tabs
                defaultIndex={index}
                className="flex w-full"
            >
                <TabList>
                    {index === 0 ? (
                        <Tab>Project List</Tab>
                    ) : (
                        <Tab
                            onClick={() => {
                                router.push(`/eco-projects`);
                            }}
                        >
                            Project List
                        </Tab>
                    )}
                    {index === 1 ? (
                        <Tab>Summary</Tab>
                    ) : (
                        <Tab
                            onClick={() => {
                                router.push(`/eco-projects/${projectId}/edit`);
                            }}
                        >
                            Summary
                        </Tab>
                    )}
                    {index === 2 ? (
                        <Tab>Details</Tab>
                    ) : (
                        <Tab
                            onClick={() => {
                                router.push(
                                    `/eco-projects/${projectId}/edit/details`,
                                );
                            }}
                        >
                            Details
                        </Tab>
                    )}
                    {index === 3 ? (
                        <Tab>Images</Tab>
                    ) : (
                        <Tab
                            onClick={() => {
                                router.push(
                                    `/eco-projects/${projectId}/edit/images`,
                                );
                            }}
                        >
                            Images
                        </Tab>
                    )}
                    {index === 4 ? (
                        <Tab>Overview</Tab>
                    ) : (
                        <Tab
                            onClick={() => {
                                router.push(
                                    `/eco-projects/${projectId}/edit/overview`,
                                );
                            }}
                        >
                            Overview
                        </Tab>
                    )}
                    {index === 5 ? (
                        <Tab>Story</Tab>
                    ) : (
                        <Tab
                            onClick={() => {
                                router.push(
                                    `/eco-projects/${projectId}/edit/story`,
                                );
                            }}
                        >
                            Story
                        </Tab>
                    )}
                    {index === 6 ? (
                        <Tab>Process</Tab>
                    ) : (
                        <Tab
                            onClick={() => {
                                router.push(
                                    `/eco-projects/${projectId}/edit/process`,
                                );
                            }}
                        >
                            Process
                        </Tab>
                    )}
                    {index === 7 ? (
                        <Tab>NFT Series</Tab>
                    ) : (
                        <Tab
                            onClick={() => {
                                router.push(
                                    `/eco-projects/${projectId}/edit/series`,
                                );
                            }}
                        >
                            NFT Series
                        </Tab>
                    )}
                    {index === 8 ? (
                        <Tab>Orders</Tab>
                    ) : (
                        <Tab
                            onClick={() => {
                                router.push(
                                    `/eco-projects/${projectId}/edit/orders`,
                                );
                            }}
                        >
                            Orders
                        </Tab>
                    )}
                </TabList>
                {tabPanels.map((tab, index) => (
                    <TabPanel
                        key={`EmptyPanel-${index}`}
                        className={"w-0"}
                    ></TabPanel>
                ))}
                <div className="w-full">{children}</div>
            </Tabs>
        </>
    );
};

export default ProjectTabPanel;
