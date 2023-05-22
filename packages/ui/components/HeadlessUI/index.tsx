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

import React, { Fragment, forwardRef } from "react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { cva, cx, type VariantProps } from "class-variance-authority";
import Button, { type ButtonProps } from "../Button";

const menuStyles = cva(["relative"], {
    variants: {
        alignButton: {
            left: "text-left",
            right: " text-right",
        },
        inline: {
            true: "inline-block",
        },
    },
    defaultVariants: {
        alignButton: "right",
    },
});

export interface MenuProps
    extends VariantProps<typeof menuStyles>,
        Omit<React.ComponentProps<"div">, "ref"> {}
// eslint-disable-next-line react/display-name
const Menu: React.FC<MenuProps> = forwardRef<HTMLElement, MenuProps>(
    ({ className, alignButton, inline, children, ...props }, ref) => {
        return (
            <HeadlessMenu
                as="div"
                className={menuStyles({
                    alignButton,
                    class: className,
                    inline,
                })}
                ref={ref}
                {...props}
            >
                {children}
            </HeadlessMenu>
        );
    },
);

const menuButtonStyles = cva([""], {
    variants: {
        intent: {
            none: "",
        },
    },
});

export interface MenuButtonProps
    extends Omit<ButtonProps, "animation" | "ref" | "intent">,
        VariantProps<typeof menuButtonStyles> {}

const MenuButton = React.forwardRef<HTMLButtonElement, MenuButtonProps>(
    ({ className, children, intent = "none", ...props }, ref) => (
        <HeadlessMenu.Button as={Fragment}>
            <Button
                ref={ref}
                animation={false}
                intent={intent}
                className={cx(
                    className,
                    menuButtonStyles({ class: className }),
                )}
                {...props}
            >
                {children}
            </Button>
        </HeadlessMenu.Button>
    ),
);

const menuItemsStyles = cva(["absolute w-56 shadow-md rounded-md border"], {
    variants: {
        intent: {
            primary: "border-slate-200 bg-slate-100",
        },
        align: {
            left: "left-0 origin-top-left ml-2",
            right: "right-0 origin-top-right mr-2",
        },
    },
    defaultVariants: {
        align: "left",
        intent: "primary",
    },
});

export interface MenuItemsProps
    extends VariantProps<typeof menuItemsStyles>,
        React.ComponentProps<"div"> {}
const MenuItems = React.forwardRef<HTMLDivElement, MenuItemsProps>(
    ({ className, align, children }, ref) => (
        <HeadlessMenu.Items
            as="div"
            className={cx(menuItemsStyles({ class: className, align }))}
            ref={ref}
        >
            {children}
        </HeadlessMenu.Items>
    ),
);

export { Menu, MenuButton, MenuItems };
