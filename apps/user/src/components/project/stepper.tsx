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

import React from "react";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Stepper = ({ title, status }: { title: string; status: boolean }) => {
    return (
        <div
            className={`stepper mt-[18px] flex w-full max-w-[450px] cursor-pointer items-center rounded-md py-[12px] pl-[10px] text-[20px] text-black ${
                status
                    ? "bg-[#92C83E] hover:bg-[#6F9D02] hover:text-[white] "
                    : "unactive bg-[#D2D2D2]"
            }`}
        >
            <FontAwesomeIcon icon={faCaretRight} size="xl" className="mr-4 " />{" "}
            {title}
        </div>
    );
};

export default Stepper;
