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

import { useEffect, useState } from "react";

interface StatusSelectorProps {
    datas: { key: string; title: string }[];
    multiSelect: boolean;
    label: string;
    defaultStatuses?: string[];
    getSelectedStatuses: (arg: string[]) => void;
}
const StatusSelector = ({
    datas,
    multiSelect,
    label,
    defaultStatuses,
    getSelectedStatuses,
}: StatusSelectorProps) => {
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

    useEffect(() => {
        if (defaultStatuses) {
            if (multiSelect) {
                setSelectedStatuses(defaultStatuses);
            } else {
                if (defaultStatuses.length > 0) {
                    setSelectedStatus(defaultStatuses?.at(0) ?? "");
                }
            }
        }
    }, []);

    const onStatusClicked = (eve: any, key: string) => {
        if (multiSelect) {
            const newStatuses = [...selectedStatuses];
            if (newStatuses.includes(key)) {
                const index = newStatuses.indexOf(key);
                newStatuses.splice(index, 1);
            } else {
                newStatuses.push(key);
            }
            setSelectedStatuses(newStatuses);
            getSelectedStatuses(selectedStatuses);
        } else {
            setSelectedStatus(key);
            getSelectedStatuses([key]);
        }
    };

    return (
        <div>
            <label className="inline-block min-w-[10em] text-black">
                {label}
            </label>
            {datas.map(
                (data: { key: string; title: string }, index: number) => {
                    return (
                        <button
                            key={`status-${index}`}
                            type="button"
                            className={`inline-block   bg-[#acacac] p-3 ${
                                (multiSelect
                                    ? selectedStatuses.includes(data.key)
                                    : selectedStatus == data.key) &&
                                "bg-[#63fa7c]"
                            }`}
                            onClick={(eve) => onStatusClicked(eve, data.key)}
                        >
                            {data.title}
                        </button>
                    );
                },
            )}
        </div>
    );
};

export default StatusSelector;
