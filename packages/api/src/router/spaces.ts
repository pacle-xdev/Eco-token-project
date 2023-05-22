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

import { adminAuthedProcedure, authedProcedure, router } from "../trpc";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3Client } from "../utils/s3";

import { z } from "zod";
import { TRPCError } from "@trpc/server";

const requiredPresignedUrlInput = z.object({
    key: z.string(),
    contentType: z.string(),
    expiresIn: z
        .number()
        .min(5)
        .max(3600)
        .default(2.5 * 60), // 5 minutes
    acl: z.union([z.literal("private"), z.literal("public-read")]).optional(),
});

const createPutBucketCommand = (
    key: string,
    contentType: string,
    acl?: string,
) =>
    new PutObjectCommand({
        Bucket: process.env.SPACES_BUCKET as string,
        Key: key,
        ContentType: contentType,
        ACL: acl,
    });

const createListObjectCommand = ({
    prefix,
    limit,
    startAfterKey,
}: {
    prefix?: string;
    limit?: number;
    startAfterKey?: string;
}) =>
    new ListObjectsV2Command({
        Bucket: process.env.SPACES_BUCKET as string,
        MaxKeys: limit,
        Prefix: prefix,
        StartAfter: startAfterKey,
    });

export const spacesRouter = router({
    createPresignedUrls: authedProcedure
        .input(
            z.union([
                requiredPresignedUrlInput,
                requiredPresignedUrlInput.array().max(20),
            ]),
        )
        .mutation(async ({ input }) => {
            if (!Array.isArray(input)) {
                // change type of input to a single object as it is not an array
                const url = await getSignedUrl(
                    // @ts-ignore
                    s3Client,
                    createPutBucketCommand(
                        input.key,
                        input.contentType,
                        input.acl,
                    ),
                    {
                        expiresIn: input.expiresIn,
                    },
                );
                return url;
            } else {
                const promises = input.map((singleInput) => {
                    return getSignedUrl(
                        // @ts-ignore
                        s3Client,
                        createPutBucketCommand(
                            singleInput.key,
                            singleInput.contentType,
                            singleInput.acl,
                        ),
                        {
                            expiresIn: singleInput.expiresIn,
                        },
                    );
                });
                return await Promise.all(promises);
            }
        }),
    listObjects: adminAuthedProcedure
        .input(
            z.object({
                prefix: z.string().optional(),
                limit: z.number().min(1).max(100).default(30),
                startAfterKey: z.string().optional(),
            }),
        )
        .query(async ({ input }) => {
            const objects = await s3Client.send(
                createListObjectCommand({ ...input }),
            );
            if (!objects || !objects.Contents)
                throw new TRPCError({
                    message: "No objects found.",
                    code: "NOT_FOUND",
                });

            // remove the folder from the urls
            objects.Contents.shift();
            const keys = objects.Contents.map((key) => key.Key ?? "");
            return keys;
        }),
});
