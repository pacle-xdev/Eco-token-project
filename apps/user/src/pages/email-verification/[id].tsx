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
import { type NextPageWithLayout } from "../_app";
import EmailVerificationCard from "@/components/dashboard/email-verification-card";

const EmailVerification: NextPageWithLayout = () => {
    const router = useRouter();
    let { id } = router.query;
    if (typeof id !== "string" && typeof id !== "undefined") id = id[0];
    const { error, isLoading } = trpc.userAuth.emailVerification.useQuery(
        {
            token: id as string,
        },
        {
            enabled: !!id,
            refetchOnWindowFocus: false,
        },
    );

    return (
        <div className="flex h-full w-full items-center justify-center">
            <EmailVerificationCard
                hasToken={{
                    loading: isLoading,
                    error: error?.message,
                }}
            />
        </div>
    );
};

EmailVerification.getLayout = (page) => <>{page}</>;

export default EmailVerification;
