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

import { useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { faFileImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cva, type VariantProps } from "class-variance-authority";

import CropImageModal from "./crop-modal";

const pickerStyles = cva("relative bg-slate-200 rounded-md overflow-hidden", {
    variants: {
        border: {
            solid: "",
            dashed: "border-dashed",
            dotted: "border-dotted",
            none: "",
        },
        size: {
            xl: "h-96",
            lg: "h-72",
            md: "h-48",
            sm: "h-32",
            xs: "h-20",
        },
        style: {
            square: "",
            rectange: "",
            circle: "rounded-full",
        },
    },
    compoundVariants: [
        {
            border: ["solid", "dashed", "dotted"],
            class: "border-2 border-slate-400 disabled:border-slate-300",
        },
        {
            style: "rectange",
            size: "xs",
            class: "w-40",
        },
        {
            style: "rectange",
            size: "sm",
            class: "w-64",
        },
        {
            style: "rectange",
            size: "md",
            class: "w-96",
        },
        {
            style: "rectange",
            size: "lg",
            class: "w-[36rem]",
        },
        {
            style: "rectange",
            size: "lg",
            class: "w-[48rem]",
        },
        {
            style: ["circle", "square"],
            size: "xs",
            class: "w-20",
        },
        {
            style: ["circle", "square"],
            size: "sm",
            class: "w-32",
        },
        {
            style: ["circle", "square"],
            size: "md",
            class: "w-48",
        },
        {
            style: ["circle", "square"],
            size: "lg",
            class: "w-72",
        },
        {
            style: ["circle", "square"],
            size: "lg",
            class: "w-96",
        },
    ],
    defaultVariants: {
        border: "solid",
        style: "square",
        size: "md",
    },
});

export interface ImagePickerProps
    extends VariantProps<typeof pickerStyles>,
        Omit<React.ComponentProps<"div">, "style"> {
    width?: number;
    height?: number;
    aspect?: number;
    setImage?: (value?: string) => void;
}
const ImagePicker: React.FC<ImagePickerProps> = ({
    width,
    height,
    border,
    style,
    size,
    aspect,
    setImage,
    ...props
}) => {
    const [source, setSource] = useState<string>();
    const [image, setStateImage] = useState<string>();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const ref = useRef<HTMLInputElement>(null);

    const handleImageLoad = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            ref.current?.blur();
            if (source) URL.revokeObjectURL(source);
            setSource(URL.createObjectURL(files[0]));
            setDialogOpen(!isDialogOpen);
        }
    };

    return (
        <>
            <CropImageModal
                aspect={aspect}
                image={source}
                setImage={(image) => {
                    setStateImage(image);
                    if (setImage) setImage(image);
                }}
                isOpen={isDialogOpen}
                setIsOpen={setDialogOpen}
            />
            <div
                className={pickerStyles({ border, style, size })}
                onClick={() => ref.current?.click()}
                {...props}
            >
                <input
                    type="file"
                    name="Choose image"
                    className="absolute hidden"
                    onChange={handleImageLoad}
                    ref={ref}
                    disabled={isDialogOpen}
                />
                {image ? (
                    <Image
                        src={image}
                        alt="NFT image"
                        {...(!width && !height
                            ? { fill: true }
                            : { width, height })}
                        className="pointer-events-none select-none"
                        style={{ objectFit: "cover" }}
                    />
                ) : (
                    <FontAwesomeIcon
                        icon={faFileImage}
                        size="xl"
                        className="absolute left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] text-slate-500"
                    />
                )}
            </div>
        </>
    );
};

export default ImagePicker;
