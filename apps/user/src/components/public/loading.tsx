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
import LoadingImage from "@ecotoken/ui/assets/brand/logo.png";

const PublicLoading = () => {
    return (
        <div className="fixed z-10 flex h-full w-full items-center justify-center bg-white">
            <Image
                className=""
                src={LoadingImage}
                alt="loading"
                width={200}
                height={200}
                quality={100}
            ></Image>
        </div>
    );
};

export default PublicLoading;
