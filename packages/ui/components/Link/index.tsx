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

import { type VariantProps, cva } from "class-variance-authority";
import { type LinkProps as NextLinkProps } from "next/link";
import NextLink from "next/link";

const linkStyles = cva("", {
    variants: {
        intent: {
            primary: "text-slate-700 disabled:text-slate-400",
        },
        underline: {
            true: "underline",
        },
    },
    defaultVariants: {
        intent: "primary",
        underline: true,
    },
});

export interface LinkProps
    extends VariantProps<typeof linkStyles>,
        Omit<
            React.AnchorHTMLAttributes<HTMLAnchorElement>,
            keyof NextLinkProps
        >,
        NextLinkProps {}
const Link: React.FC<LinkProps> = ({
    className,
    intent,
    underline,
    ...props
}) => {
    return (
        <NextLink
            className={linkStyles({ intent, underline, class: className })}
            {...props}
        />
    );
};

export default Link;
