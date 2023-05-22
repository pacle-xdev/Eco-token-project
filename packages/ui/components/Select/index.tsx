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
import { type ComponentProps, forwardRef } from "react";

const styles = cva(
    [
        "rounded-md p-1.5 duration-100 ease-in focus:ease-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-200",
    ],
    {
        variants: {
            size: {
                md: "w-36",
                lg: "w-64",
                xl: "w-72",
                "2xl": "w-96",
                full: "w-full",
                default: "",
            },
            intent: {
                primary: "bg-slate-200 border border-slate-600 ring-slate-400",
            },
        },
        defaultVariants: {
            intent: "primary",
            size: "default",
        },
    },
);

export interface Props
    extends Omit<ComponentProps<"select">, "size">,
        VariantProps<typeof styles> {}
const Select = forwardRef<HTMLSelectElement, Props>(
    ({ intent, size, className, ...props }, ref) => (
        <select
            {...props}
            className={styles({
                intent,
                size,
                class: className,
            })}
            ref={ref}
        />
    ),
);

export default Select;
