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

import { TRPCError } from "@trpc/server";
import bs58 from "bs58";
import { unsealData } from "iron-session";
import { sign } from "tweetnacl";
import { z } from "zod";
import { User } from "@ecotoken/db";

import {
    loginUserSchema,
    type emailVerificationSchema,
} from "../../schema/user";
import { publicProcedure, router } from "../../trpc";

export const userAuthRouter = router({
    isLoggedIn: publicProcedure.query(({ ctx }) => !!ctx.session?.user?.id),
    emailVerification: publicProcedure
        .input(
            z.object({
                token: z.string(),
            }),
        )
        .query(async ({ input, ctx }) => {
            const unsealedData = await unsealData<
                z.infer<typeof emailVerificationSchema>
            >(atob(input.token), {
                password: process.env.IRON_SESSION_PASSWORD as string,
                ttl:
                    60 *
                    60 *
                    Number(process.env.EMAIL_VERIFICATION_EXPIRE_TIME),
            });

            if (!unsealedData.email || !unsealedData.userID)
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    cause: "invalid",
                    message: "Email verification token is invalid.",
                });

            // check if user has already been created and their email already exists in the database
            if (
                await ctx.prisma.user.findUnique({
                    where: {
                        userID: unsealedData.userID,
                    },
                })
            )
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    cause: "expired",
                    message: "Email verification token has expired.",
                });

            // const usersRouterInterface = usersRouter.createCaller(ctx);
            // await usersRouterInterface.create({
            //     ...unsealedData,
            // });

            return 200;
        }),
    login: publicProcedure
        .input(loginUserSchema)
        .mutation(
            async ({
                ctx,
                input: { message, messageSignature, publicKey },
            }) => {
                const decodedMessage = bs58.decode(message);
                const decodedSignature = bs58.decode(messageSignature);
                const decodedPublicKey = bs58.decode(publicKey);

                if (
                    !sign.detached.verify(
                        decodedMessage,
                        decodedSignature,
                        decodedPublicKey,
                    )
                )
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "Signature invalid.",
                    });

                const role = await ctx.prisma.role.findFirst({
                    where: {
                        role: "User",
                        OR: [
                            {
                                sites: {
                                    some: {
                                        siteID: ctx.selectedSite?.siteID,
                                    },
                                },
                                scope: "SITE",
                            },
                            {
                                domain: {
                                    equals: "USER",
                                },
                                scope: "DEFAULT",
                            },
                        ],
                    },
                    include: {
                        permissions: true,
                    },
                });

                let user = await ctx.prisma.user.findFirst({
                    where: {
                        walletAddress: publicKey,
                        site: {
                            siteID: ctx.currentSite.siteID,
                        },
                    },
                });

                if (!user)
                    user = await ctx.prisma.user.create({
                        data: {
                            walletAddress: publicKey,
                            siteID: ctx.currentSite.siteID,
                            roleID: role?.roleID ?? "",
                        },
                    });

                ctx.session!.user = {
                    type: "user",
                    id: user.userID,
                    permissions: role?.permissions,
                    ipAddress:
                        process.env.NODE_ENV === "production"
                            ? (ctx.req.headers["x-real-ip"] as string) ?? ""
                            : undefined,
                };
                await ctx.session!.save();
            },
        ),
    // register: publicProcedure
    //     .input(createUserSchema)
    //     .mutation(async ({ input, ctx }) => {
    //         const sealedData = await sealData(
    //             { ...input },
    //             {
    //                 password: process.env.IRON_SESSION_PASSWORD as string,
    //                 ttl:
    //                     60 *
    //                     60 *
    //                     Number(process.env.EMAIL_VERIFICATION_EXPIRE_TIME),
    //             },
    //         );

    //         if (!!process.env.DISABLE_EMAIL_VERIFICATION) {
    //             const usersRouterInterface = usersRouter.createCaller(ctx);
    //             await usersRouterInterface.create({
    //                 ...input,
    //             });
    //         } else {
    //             await transporter.verify();
    //             await transporter.sendMail({
    //                 from: process.env.EMAIL_VERIFICATION_EMAIL_ADDRESS,
    //                 to: input.email,
    //                 subject: "ecoToken - Verify your email",
    //                 html: `
    //             <h1 style="margin-bottom: 8px;">Verify your email address</h1>
    //             <h3 style="margin-bottom: 16px;">
    //                 To continue setting up your ecoToken account, please verify your
    //                 email address.
    //             </h3>
    //             <a href="${getBaseUrl()}/email-verification/${btoa(
    //                     sealedData,
    //                 )}">Verify email address</a>
    //             `,
    //             });
    //         }
    //     }),
    logout: publicProcedure.mutation(({ ctx }) => {
        if (ctx.session) ctx.session.destroy();
        return 200;
    }),
});
