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
import React from "react";

const labelStyles = cva([""], {
    variants: {
        size: {
            xs: "text-xs",
            sm: "text-sm",
            md: "text-md",
            lg: "text-lg",
            default: "text-base",
        },
        intent: {
            primary: "text-black",
        },
    },
    defaultVariants: {
        intent: "primary",
    },
});

interface InputProps
    extends VariantProps<typeof labelStyles>,
        React.ComponentProps<"label"> {}
const Label: React.FC<InputProps> = ({ intent, className, ...props }) => {
    return (
        <label
            className={labelStyles({
                intent,
                class: className,
            })}
            {...props}
        />
    );
};

export default Label;
