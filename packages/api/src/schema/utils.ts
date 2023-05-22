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

import OfficialDecimal from "decimal.js";
import { ZodIssueCode, z } from "zod";

export const decimal = (
    precision: number,
    decimals: OfficialDecimal.Rounding,
) => {
    const Decimal = OfficialDecimal.clone({ precision, rounding: decimals });
    return z
        .instanceof(Decimal)
        .or(z.string())
        .or(z.number())
        .refine((value) => {
            try {
                return new Decimal(value);
            } catch (error) {
                return false;
            }
        })
        .transform((value) => new Decimal(value));
};

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
    const field = issue.path[issue.path.length - 1]?.toString() ?? "";
    const capitialField = field?.charAt(0).toUpperCase() + field?.slice(1);
    switch (issue.code) {
        case ZodIssueCode.too_small: {
            return {
                message: `${capitialField} must be at least ${issue.minimum} characters.`,
            };
        }
        default: {
            return { message: ctx.defaultError };
        }
    }
};

export const useCustomErrorMap = () => z.setErrorMap(customErrorMap);
