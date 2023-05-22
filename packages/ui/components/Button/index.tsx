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

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import Spinner from "../Spinner";

const buttonStyles = cva(
    [
        "flex gap-2 items-center justify-center rounded-md disabled:cursor-not-allowed focus:ease-out focus:outline-none focus:ring-2 focus:ring-offset-1",
    ],
    {
        variants: {
            intent: {
                primary:
                    "text-slate-100 bg-slate-500 disabled:bg-slate-400 ring-slate-400 focus:ring-offset-slate-200",
                secondary:
                    "outline outline-1 -outline-offset-2 outline-slate-500 text-slate-500 ring-slate-400 disabled:outline-slate-400 disabled:text-slate-400",
                tertiary:
                    "text-slate-400  ring-slate-400 disabled:text-slate-300 underline underline-offset-2",
                "tertiary-no-underline":
                    "text-slate-400 ring-slate-400 disabled:text-slate-300",
                destructive:
                    "bg-rose-600 disabled:bg-rose-400 ring-rose-400 text-white",
                sky: " rounded text-white bg-[#00AEEF] disabled:bg-slate-400 ring-slate-400 focus:ring-offset-slate-200",
                skyfilled:
                    "text-[#00AEEF] bg-white border-[#00AEEF] border hover:text-white hover:bg-[#00AEEF] disabled:bg-slate-400 ring-slate-400 focus:ring-offset-slate-200 rounded",
                gray: "bg-white hover:bg-[#585858] hover:text-white border rounded border-gray-400 text-slate-500 ring-slate-400 disabled:outline-slate-400 disabled:text-slate-400",
                none: "",
            },
            size: {
                default: "px-4 py-2 text-sm",
                sm: "px-4 py-1 text-sm",
                lg: "text-[24px] px-10 py-2",
            },
            fullWidth: {
                true: "w-full",
            },
            animation: {
                true: "enabled:active:scale-95 scale-100 duration-100",
            },
        },
        defaultVariants: {
            intent: "primary",
            size: "default",
            fullWidth: false,
            animation: true,
        },
    },
);

export interface ButtonProps
    extends VariantProps<typeof buttonStyles>,
        React.ComponentProps<"button"> {
    /* Show loading spinner and disable button */
    loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            intent,
            fullWidth,
            className,
            loading,
            disabled,
            animation,
            children,
            ...props
        },
        ref,
    ) => (
        <button
            ref={ref}
            className={buttonStyles({
                intent,
                fullWidth,
                animation,
                class: className,
            })}
            {...props}
            disabled={loading || disabled}
        >
            {loading && <Spinner />}
            {children}
        </button>
    ),
);

export default Button;
