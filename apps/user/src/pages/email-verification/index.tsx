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

import EmailVerificationCard from "@/components/dashboard/email-verification-card";
import { type NextPageWithLayout } from "../_app";

const EmailVerificationNotification: NextPageWithLayout = () => {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <EmailVerificationCard />
        </div>
    );
};

EmailVerificationNotification.getLayout = (page) => <>{page}</>;

export default EmailVerificationNotification;
