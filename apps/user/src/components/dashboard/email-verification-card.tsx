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

import DefaultCard, {
	CardDescription,
	CardTitle
} from "@ecotoken/ui/components/Card";
import { faEnvelopeOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "@ecotoken/ui/components/Link";
import Spinner from "@ecotoken/ui/components/Spinner";

type EmailVerificationCardProps = {
	hasToken?: {
		loading: boolean;
		error?: string;
	};
};

const Message: React.FC<{ error?: string; sentToEmail?: boolean }> = ({
	error,
	sentToEmail
}) => {
	if (sentToEmail) {
		return (
			// only renders this if a token is not provided to the card (after register button pressed)
			<CardDescription>
				Check your email address for a verification link.
			</CardDescription>
		);
	} else {
		// check if we have an error that is invalid then render accordingly
		if (error?.includes("invalid")) {
			return <CardDescription>{error}</CardDescription>;
		} else if (error?.includes("expired")) {
			// check if we have an error that is expired then render accordingly
			return (
				<div className="space-y-4">
					<CardDescription>
						<div>
							<span className="mb-2 block font-medium">
								{error}
							</span>{" "}
							If this error continues to persist. Reach out{" "}
							<br className="hidden sm:block" />
							to our <Link href="/help">support team.</Link>
						</div>
					</CardDescription>
					<Link href="/register" className="inline-block">
						Back to register page
					</Link>
				</div>
			);
		} else
			return (
				<CardDescription>
					<span className="mb-2 block font-medium">
						Your email has been successfully verified.
					</span>
					<Link href="/login" className="block">
						Back to login page
					</Link>
				</CardDescription>
			);
	}
};

const EmailVerificationCard: React.FC<EmailVerificationCardProps> = ({
	hasToken
}) => {
	return (
		<DefaultCard
			intent="secondary"
			className="m-2 flex flex-col items-center justify-center space-y-2 px-16 py-8"
		>
			<FontAwesomeIcon
				icon={faEnvelopeOpen}
				size="3x"
				className="text-slate-600"
			/>
			<div className="mx-auto w-full space-y-2 text-center">
				<CardTitle>Email Verification</CardTitle>
				{hasToken?.loading ? (
					<Spinner className="mx-auto w-full" />
				) : (
					<Message error={hasToken?.error} sentToEmail={!hasToken} />
				)}
			</div>
		</DefaultCard>
	);
};

export default EmailVerificationCard;
