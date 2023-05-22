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
import { trpc } from "@/utils/trpc";
import Input from "@ecotoken/ui/components/Input";

const StakeProject = () => {
    const router = useRouter();
    if (router.query.id) {
        const { data } = trpc.ecoProjects.get.useQuery({
            identifier: router.query.id as string,
        });
        if (!data) return <div>Loading...</div>;

        return (
            <div className="flex w-full flex-col gap-8">
                {/* <div className="text-2xl font-medium">{data.title}</div>
                <div>{data.outcome}</div> */}
                <div className="flex w-full flex-col space-y-2">
                    <div className="relative h-64 w-full">
                        <Image
                            src={
                                data.headImage?.startsWith("https")
                                    ? data.headImage
                                    : `${process.env.NEXT_PUBLIC_CDN_URL}/${data.headImage}`
                            }
                            priority
                            alt="EcoProject head 1"
                            className="w-full rounded-md object-cover"
                            fill
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="text-2xl font-semibold">
                            {data.title}
                        </div>
                        <div>{data.intro}</div>
                    </div>
                </div>
                <div className="h-fit flex-1 rounded-md">
                    <div className="text-lg font-semibold">Stake</div>
                    <Input />
                </div>
            </div>
        );
    } else {
        return <div>Project not found.</div>;
    }
};

export default StakeProject;
