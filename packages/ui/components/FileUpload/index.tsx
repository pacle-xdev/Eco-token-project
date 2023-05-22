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

import {
    faFileArrowUp,
    type IconDefinition,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cva, type VariantProps } from "class-variance-authority";
import { useCallback, useState, forwardRef } from "react";
import { type Accept, useDropzone } from "react-dropzone";
import Avatar, { type AvatarProps } from "../Avatar";
import Button from "../Button";

const uploadStyles = cva("relative rounded-md overflow-hidden", {
    variants: {
        border: {
            solid: "",
            dashed: "border-dashed",
            dotted: "border-dotted",
        },
        size: {
            xl: "w-[48rem] h-96",
            lg: "w-[36rem] h-72",
            md: "w-96 h-48",
            sm: "w-64 h-32",
            xs: "w-40 h-20",
            full: "w-full",
        },
    },
    compoundVariants: [
        {
            border: ["solid", "dashed", "dotted"],
            class: "border-2 border-slate-400 disabled:border-slate-300 focus:border-slate-600 outline-none",
        },
    ],
    defaultVariants: {
        border: "dashed",
        size: "xl",
    },
});

type FileUploadProps = {
    defaultIcon?: IconDefinition;
    accept?: Accept;
    onUpload?: (files: File[]) => void;
} & VariantProps<typeof uploadStyles> &
    React.ComponentProps<"div">;

const FileUpload: React.FC<FileUploadProps> = ({
    border,
    size,
    accept,
    defaultIcon = faFileArrowUp,
    className,
    onUpload,
    ...props
}) => {
    // const [objectURLs, setObjectURLs] = useState<string[]>([]);
    const [files, setFiles] = useState<{ file: File; preview: string }[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((updatedFiles) => [
            ...acceptedFiles
                .filter(
                    (acceptedFile) =>
                        !updatedFiles
                            .map((file) => file.file.name)
                            .includes(acceptedFile.name),
                )
                .map((file) => ({
                    file,
                    preview: URL.createObjectURL(file),
                })),
            ...updatedFiles,
        ]);
    }, []);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        noClick: true,
        accept,
    });

    const removeImage = (file: File) => {
        setFiles(files.filter((filteredFile) => filteredFile.file !== file));
    };

    return (
        <div
            className={uploadStyles({ border, size, class: className })}
            {...getRootProps({
                ...props,
            })}
        >
            <input
                {...getInputProps({
                    className: "absolute hidden",
                    name: "Drag & drop files to upload",
                })}
            />
            {files.length > 0 ? (
                <div className="flex h-full w-full flex-col">
                    <div className="m-4 flex flex-1 flex-wrap gap-2 overflow-y-auto p-4">
                        {files.map((file, index) => (
                            <Image
                                src={file.preview}
                                key={file.preview}
                                alt="Uploadable image"
                                style="rectangle"
                                size="lg"
                                onLoad={() => {
                                    URL.revokeObjectURL(file.preview);
                                }}
                                onClick={() => removeImage(file.file)}
                                tabIndex={index}
                            />
                        ))}
                    </div>
                    <div className="flex w-full items-end">
                        <div className="flex w-full bg-slate-200 p-4">
                            <Button
                                intent="tertiary-no-underline"
                                onClick={open}
                            >
                                Add more files
                            </Button>
                            <div className="flex flex-1 justify-end space-x-2">
                                <Button
                                    intent="secondary"
                                    onClick={() => setFiles([])}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (onUpload)
                                            onUpload(
                                                files.map((file) => file.file),
                                            );
                                    }}
                                >
                                    Upload{" "}
                                    {files.length > 1
                                        ? `${files.length} files`
                                        : files.length > 0
                                        ? `${files.length} file`
                                        : ""}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex h-full w-full flex-col items-center justify-center space-y-4 text-slate-500 transition-none [&>*]:transition-none">
                    {isDragActive ? (
                        <FontAwesomeIcon icon={faFileArrowUp} size="2xl" />
                    ) : (
                        <FontAwesomeIcon icon={defaultIcon} size="2xl" />
                    )}
                    {isDragActive ? (
                        <div className="text-xl font-bold">
                            Drop your file(s) to upload
                        </div>
                    ) : (
                        <div className="text-xl font-bold">
                            Drag & drop files or{" "}
                            <button
                                onClick={open}
                                className="underline underline-offset-2"
                            >
                                browse
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const Image = forwardRef<
    Omit<HTMLDivElement, "onClick">,
    AvatarProps & { onClick?: () => void }
>(({ onClick, key, ...props }, ref) => {
    return (
        <div
            className="relative h-fit w-fit select-none text-inherit"
            ref={ref}
            key={key}
        >
            <Avatar
                {...props}
                quality={30}
                className="pointer-events-none select-none"
            />
            <FontAwesomeIcon
                icon={faTrashAlt}
                size="xl"
                className="absolute bottom-2 right-2 scale-100 cursor-pointer rounded-xl bg-black/90 px-3 py-2.5 text-red-500 active:scale-95"
                onClick={onClick}
            />
        </div>
    );
});

export default FileUpload;
