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

import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { type NextPageWithLayout } from "./_app";

const Logout: NextPageWithLayout = () => {
    const router = useRouter();
    trpc.adminAuth.logout.useQuery(undefined, {
        async onSuccess() {
            await router.replace("/login");
        },
    });
    return <></>;
};

Logout.getLayout = (page) => <>{page}</>;
export default Logout;
