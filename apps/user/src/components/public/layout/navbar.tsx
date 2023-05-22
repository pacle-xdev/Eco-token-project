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

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
// import { getRouteName } from "@/utils/route";
// import { useRouter } from "next/router";
import Link from "next/link";
import UserDropdown from "@/components/user-dropdown";
import { trpc } from "@/utils/trpc";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { toast } from "react-hot-toast";
import white_bevel_sm from "@ecotoken/ui/assets/brand/bevel_white_sm.png";
import logo from "@ecotoken/ui/assets/brand/logo_ecotoken-300.png";
import wordmark from "@ecotoken/ui/assets/brand/logo_ecotoken-wm-600.png";

const WalletMultiButtonDynamic = dynamic(
    async () =>
        (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false },
);

const PublicNavbar = () => {
    const { publicKey, signMessage, connected } = useWallet();

    const { data: isLoggedIn, isLoading } = trpc.userAuth.isLoggedIn.useQuery();

    const { mutateAsync } = trpc.userAuth.login.useMutation({
        retry: false,
        onSuccess() {
            toast.success("Login success.");
        },
        onError(e) {
            toast.error(e.message);
        },
    });

    useEffect(() => {
        const main = async () => {
            if (isLoggedIn && connected || isLoading) return;
            try {
                // `publicKey` will be null if the wallet isn't connected
                if (!publicKey || !connected)
                    throw new WalletNotConnectedError();

                // `signMessage` will be undefined if the wallet doesn't support it
                if (!signMessage)
                    throw new Error(
                        "Wallet does not support signing messages.",
                    );

                // Encode anything as bytes
                const message = new TextEncoder().encode(
                    `ecotokens.net wants you to sign in with your Solana account: ${publicKey} Clicking Sign or Approve only means you have proved this wallet is owned by you. This request will not trigger any blockchain transaction or cost any gas fee.`,
                );
                // Sign the bytes using the wallet
                const signature = await signMessage(message);

                await mutateAsync({
                    publicKey: publicKey.toBase58(),
                    messageSignature: bs58.encode(signature),
                    message: bs58.encode(message),
                });

                // console.log(`Message signature: ${bs58.encode(signature)}`);
            } catch (error: any) {
                console.log(`Signing failed: ${error?.message}`);
            }
        };
        main();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [publicKey, connected, isLoggedIn, isLoading]);

    return (
        <div className="fixed top-0 z-30 flex h-16 w-full items-start justify-between border-b border-slate-400 bg-ecoblue-500">
            <div
                className="flex h-full w-1/4 min-w-[120px] items-center justify-end bg-right-top md:w-1/3"
                style={{ backgroundImage: `url(${white_bevel_sm.src})` }}
            >
                <Link href="/" className="w-full">
                    <div className="flex w-full justify-center pr-4 md:hidden">
                        <Image
                            src={logo}
                            alt="ecoToken System"
                            className="h-auto w-[75%] max-w-[54px]"
                        />
                    </div>
                    <div className="p relative hidden w-full max-w-[360px] px-16 md:flex ">
                        <Image
                            src={wordmark}
                            alt="ecoToken System"
                            className="w-full min-w-[150px] max-w-[200px]"
                        />
                    </div>
                </Link>
            </div>
            <div className="flex h-full w-3/4 max-w-[600px] justify-between md:w-2/3 lg:w-1/2">
                <nav className="flex w-3/5 items-end justify-around text-center leading-4 text-white">
                    <Link
                        href="/"
                        className="mb-4 inline border-b-4 border-ecoblue-500 px-1 py-1 hover:border-ecogreen-500 sm:inline"
                    >
                        HOME
                    </Link>

                    <Link
                        href="/projects"
                        className="ml-2 mb-4 inline border-b-4 border-ecoblue-500 px-1 py-1 hover:border-ecogreen-500"
                    >
                        PROJECTS
                    </Link>
                    {/* <Link
                        href="/contactus"
                        className="ml-2 mb-4 inline border-b-4 border-ecoblue-500 px-1 py-1 hover:border-ecogreen-500"
                    >
                        CONTACT US
                    </Link> */}
                    {/* {!publicKey && (
                        <Button
                            className="mb-3 inline"
                            intent="skyfilled"
                            onClick={onClick}
                        >
                            CONNECT WALLET
                        </Button>
                    )} */}
                </nav>
                <div className="mr-4 flex h-full items-center">
                    {publicKey ? (
                        <div className="px-10">
                            <UserDropdown />
                        </div>
                    ) : (
                            <WalletMultiButtonDynamic />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicNavbar;
