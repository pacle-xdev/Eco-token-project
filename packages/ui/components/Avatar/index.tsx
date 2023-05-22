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

import { cva, type VariantProps } from "class-variance-authority";
import Image, { type ImageProps } from "next/image";

const avatarStyles = cva("overflow-hidden relative", {
    variants: {
        style: {
            rectangle: "rounded-md",
            circle: "rounded-full",
        },
        border: {
            true: "border",
        },
        size: {
            sm: "w-10 h-10",
            md: "w-16 h-16",
            lg: "w-24 h-24",
            xl: "w-32 h-32",
        },
    },
    defaultVariants: {
        style: "circle",
        border: true,
        size: "sm",
    },
});

export interface AvatarProps
    extends Omit<ImageProps, "fill" | "style">,
        VariantProps<typeof avatarStyles> {}

const Avatar: React.FC<AvatarProps> = ({
    border,
    style,
    alt,
    size,
    ...props
}) => {
    return (
        <div className={avatarStyles({ border, style, size })}>
            <Image {...props} alt={alt} fill style={{ objectFit: "cover" }} />
        </div>
    );
};

export default Avatar;
