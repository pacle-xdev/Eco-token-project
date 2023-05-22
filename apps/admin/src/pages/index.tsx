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
import FileUpload from "@ecotoken/ui/components/FileUpload";
import ImageGroup from "@ecotoken/ui/components/ImageGroup";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { trpc } from "@/utils/trpc";
import { clientEnv } from "@/env/schema.mjs";

const Home: NextPage = () => {
    const context = trpc.useContext();
    const { data: imageURLs } = trpc.spaces.listObjects.useQuery(
        {
            prefix: "eco-projects/cleqa5ak90000356wgtfk1106",
        },
        {
            retry: false,
            onSuccess() {
                context.spaces.listObjects.setData(
                    { prefix: "eco-projects/cleqa5ak90000356wgtfk1106" },
                    (data) =>
                        data?.map((url) => {
                            return `${clientEnv.NEXT_PUBLIC_CDN_URL}/${url}`;
                        }),
                );
            },
        },
    );

    return (
        <div className="w-full space-y-4">
            <div className="block w-fit bg-cyan-400 p-4">
                Dashboard (index.tsx)
            </div>
            <FileUpload defaultIcon={faImage} />
            {imageURLs && (
                <div className="rounded-lg border border-slate-400 bg-slate-200 p-2 w-fit space-y-2">
                    <div className="text-lg">Project Images</div>
                    <ImageGroup images={imageURLs} />
                </div>
            )}
        </div>
    );
};

export default Home;
