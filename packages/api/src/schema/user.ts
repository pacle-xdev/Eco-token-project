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

import { z } from "zod";

export const createUserSchema = z.object({
    roleID: z.string().cuid().min(1, "A role is required."),
    walletAddress: z.string().min(1, "Wallet address required."),
    companyName: z
        .string()
        .max(128, "Company name cannot be longer than 128 characters.")
        .nullish(),
    firstName: z
        .string()
        .min(1, "First name is required.")
        .max(32, "First name cannot be longer than 32 characters.")
        .nullish(),
    lastName: z
        .string()
        .max(32, "Last name cannot be longer than 32 characters.")
        .nullish(),
    email: z.string().email("You must specify a valid email.").nullish(),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters.")
        .nullish(),
});

export const emailVerificationSchema = z.object({
    email: z.string().email("An email is required."),
    userID: z.string().cuid("A user is required."),
});

export const updateUserSchema = z.object({
    userID: z.string().cuid(),
    roleID: z.string().cuid().optional().or(z.literal("")),
    walletAddress: z.string().optional().or(z.literal("")),
    companyName: z
        .string()
        .max(128, "Company name cannot be longer than 128 characters.")
        .nullish()
        .or(z.literal("")),
    firstName: z
        .string()
        .max(32, "First name cannot be longer than 32 characters.")
        .nullish()
        .or(z.literal("")),
    lastName: z
        .string()
        .max(32, "Last name cannot be longer than 32 characters.")
        .nullish()
        .or(z.literal("")),
    email: z
        .string()
        .email("You must specify a valid email.")
        .nullish()
        .or(z.literal("")),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters.")
        .nullish()
        .or(z.literal("")),
});

export const loginUserSchema = z.object({
    publicKey: z.string(),
    messageSignature: z
        .string()
        .min(
            1,
            "A message signature is required to verify ownership of wallet.",
        ),
    message: z
        .string()
        .min(1, "A message is required to verify ownership of wallet."),
});
