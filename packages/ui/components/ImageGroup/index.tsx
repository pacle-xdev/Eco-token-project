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

import clsx from "clsx";
import Avatar from "../Avatar";

const ImageGroup: React.FC<{
    images: string[];
    vertical?: boolean;
}> = ({ images, vertical }) => {
    return (
        <div
            className={clsx("flex", {
                "flex-col space-y-2": vertical,
                "space-x-2": !vertical,
            })}
        >
            {images.map((image) => (
                <Avatar
                    key={image}
                    src={image}
                    alt="Image preview"
                    style="rectangle"
                    size="lg"
                />
            ))}
        </div>
    );
};

export default ImageGroup;
