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

import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Commitment, Connection, PublicKey } from "@solana/web3.js";

export enum AccountState {
    Uninitialized = 0,
    Initialized = 1,
    Frozen = 2,
}

export async function getAccountInfo(
    connection: Connection,
    address: PublicKey,
    commitment?: Commitment,
    programId = TOKEN_PROGRAM_ID,
) {
    const info = await connection.getAccountInfo(address, commitment);
    if (!info) throw new Error("TokenAccountNotFoundError");
    if (!info.owner.equals(programId))
        throw new Error("TokenInvalidAccountOwnerError");
    if (info.data.length != AccountLayout.span)
        throw new Error("TokenInvalidAccountSizeError");

    const rawAccount = AccountLayout.decode(Buffer.from(info.data));

    return {
        address,
        mint: rawAccount.mint,
        owner: rawAccount.owner,
        amount: rawAccount.amount,
        delegate: rawAccount.delegateOption ? rawAccount.delegate : null,
        delegatedAmount: rawAccount.delegatedAmount,
        isInitialized: rawAccount.state !== AccountState.Uninitialized,
        isFrozen: rawAccount.state === AccountState.Frozen,
        isNative: !!rawAccount.isNativeOption,
        rentExemptReserve: rawAccount.isNativeOption
            ? rawAccount.isNative
            : null,
        closeAuthority: rawAccount.closeAuthorityOption
            ? rawAccount.closeAuthority
            : null,
    };
}
