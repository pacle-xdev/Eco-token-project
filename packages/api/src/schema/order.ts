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

import { decimal } from "./utils";

export const createEcoOrderSchema = z.object({
    nftSeriesID: z
        .string()
        .cuid()
        .min(1, "A project series is required to create an order."),
    userID: z.string().optional(),
    retireBy: z.string().min(1, "Please enter your name."),
    userWallet: z.string(),
    creditsPurchased: decimal(12, 6),
    currency: z.enum(["SOL", "USDC"]),
    payAmount: z.number(),
    payFee: decimal(12, 6),
    payHash: z.string(),
    image: z.string()
});

export const ecoOrderStatus = z.object({
    orderStatus: z.enum([
        "PROCESSING",
        "FUNDS_RECIEVED",
        "REQUEST_TO_RETIRE",
        "CREDITS_RETIRED",
        "NFT_BEING_MINTED",
        "NFT_IN_YOUR_WALLET",
        "ORDER_COMPLETE",
    ]),
});

export const updateEcoOrderSchema = z.object({
    ecoOrderID: z.string().cuid(),
    retireHash: z.string().nullish(),
    retireFee: z.number().nullish(),
    orderStatus: ecoOrderStatus.shape.orderStatus.optional(),
});
