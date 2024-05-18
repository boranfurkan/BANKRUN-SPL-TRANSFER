import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";
import { ProgramTestContext } from "solana-bankrun";

export async function getCreateAtaTransaction({
    context, mint, owner
}: {
    context: ProgramTestContext;
    owner: PublicKey;
    mint: PublicKey;
}): Promise<[Transaction, PublicKey]> {
    const ataAddress = getAssociatedTokenAddressSync(
        mint,
        owner
    );

    const ix = createAssociatedTokenAccountInstruction(
        context.payer.publicKey,
        ataAddress,
        owner,
        mint
    );

    const transaction = new Transaction().add(ix);

    const blockhash = context.lastBlockhash;
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = context.payer.publicKey;
    transaction.sign(context.payer);

    return [transaction, ataAddress];
};