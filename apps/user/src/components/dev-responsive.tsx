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

const Responsive = () => {
    return (
        <div className="relative my-1 inline-block h-[24px] w-full bg-blue-800 font-mono text-white">
            <div className="absolute top-0 left-0 h-[24px] w-[1536px]  bg-yellow-800">
                <div className="absolute top-0 left-0 h-[24px] w-[1280px] bg-blue-800">
                    <div className="absolute top-0 left-0 h-[24px] w-[1024px]  bg-yellow-800">
                        <div className="absolute top-0 left-0 h-[24px] w-[768px]  bg-blue-800">
                            <div className="absolute top-0 left-0 h-[24px] w-[640px] bg-yellow-800">
                                <div className="absolute top-0 left-0 h-[24px] w-[480px] bg-blue-800 pt-0.5 pr-2 text-right">
                                    <div className="absolute top-0 left-0 h-[24px] w-[414px] bg-yellow-800 pt-0.5 pr-2 text-right">
                                        <div className="absolute top-0 left-0 h-[24px] w-[360px] bg-blue-800 pt-0.5 pr-2 text-right">
                                            360
                                        </div>
                                        <div className="absolute top-0 right-0 pt-0.5 pr-2">
                                            414
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 pt-0.5 pr-2">
                                        480
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 pt-0.5 pr-2">
                                    sm 640px
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 pt-0.5 pr-2">
                                md 768px
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 pt-0.5 pr-2">
                            lg 1024px
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 pt-0.5 pr-2">
                        xl 1280px
                    </div>
                </div>
                <div className="absolute top-0 right-0 pt-0.5 pr-2">
                    2xl 1536px
                </div>
            </div>
        </div>
    );
};

export default Responsive;
