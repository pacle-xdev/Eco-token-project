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

import { Fragment, forwardRef, useState } from "react";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Combobox as HeadlessCombobox, Transition } from "@headlessui/react";

import Input, { type InputProps } from "../Input";

declare module "react" {
    // eslint-disable-next-line @typescript-eslint/ban-types
    function forwardRef<T, P = {}>(
        render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
    ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export type ItemFields = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
};

export type ComboboxProps<T, K extends ItemFields> = {
    items: K[];
    value: T;
    onChange: (value: T) => void;
    displayValue: (filteredItems: K[], currValue: T) => string;
    filterComparison: (item: K, query: string) => boolean;
    mainText: keyof K;
    mainValue: keyof K;
    key: keyof K;
} & Omit<InputProps, "ref" | "value" | "onChange">;
export const Combobox = <T, K extends ItemFields>(
    {
        key,
        items,
        value,
        onChange,
        // displayValue,
        filterComparison,
        mainText,
        mainValue,
    }: // ...props
    ComboboxProps<T, K>,
    ref: React.Ref<HTMLDivElement>,
) => {
    const [query, setQuery] = useState("");

    const filteredItems =
        query === ""
            ? items
            : items.filter((item) => filterComparison(item, query));

    return (
        <HeadlessCombobox
            as="div"
            className="space-y-2"
            value={value}
            onChange={onChange}
            ref={ref}
        >
            <div className="relative w-full">
                {/* <HeadlessCombobox.Input
                    as={Input}
                    size="full"
                    onChange={(event) => setQuery(event.target.value)}
                    displayValue={(value: string) => {
                        return displayValue(filteredItems, value);
                    }}
                    {...props}
                    // disabled={disabled}
                /> */}
                <HeadlessCombobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        className="h-5 w-5 text-slate-600"
                        aria-hidden="true"
                    />
                </HeadlessCombobox.Button>
            </div>
            <Transition
                appear
                enter="ease-out duration-100"
                enterFrom="opacity-0 -translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-2"
                as={Fragment}
                afterLeave={() => setQuery("")}
            >
                <HeadlessCombobox.Options className="max-h-96 max-w-full overflow-hidden overflow-y-auto rounded-md border border-slate-600">
                    {filteredItems?.map((item) => (
                        <HeadlessCombobox.Option
                            key={item[key]}
                            value={item[mainValue]}
                            className="ui-active:bg-slate-300 ui-not-active:bg-slate-200 space-x-2 border-slate-400 px-4 py-2"
                        >
                            {item[mainText]}
                        </HeadlessCombobox.Option>
                    ))}
                </HeadlessCombobox.Options>
            </Transition>
        </HeadlessCombobox>
    );
};

export default forwardRef(Combobox);
