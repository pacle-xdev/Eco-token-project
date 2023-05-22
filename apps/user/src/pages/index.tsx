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

import Responsive from "@/components/dev-responsive";
import Grassroots from "@/components/project/home-support";
import HomeBanner from "@/components/public/sections/home-banner";
import CreatedByYou from "@/components/public/sections/home-created";
import AllCredits from "@/components/public/sections/home-credits";
import RetireSection from "@/components/public/sections/home-how";
import ProjectsFeatured from "@/components/public/sections/projects-featured";

const HomePage = () => {
    return (
        <div className="flex h-full w-full flex-col">
            <HomeBanner />
            <ProjectsFeatured />
            <RetireSection />
            <AllCredits />
            <CreatedByYou />
            <Grassroots />
            {/* <Responsive /> */}
        </div>
    );
};

export default HomePage;
