import { createAssociatedTokenAccountInstruction, createMintToInstruction, createTransferInstruction, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";
import { ProgramTestContext } from "solana-bankrun";

export async function getTransferTokenTransaction({
    context, fromAta, toAta, amount, decimals, owner
}: {
    context: ProgramTestContext;
    fromAta: PublicKey;
    owner: PublicKey; //Always the context payer
    toAta: PublicKey;
    amount: number;
    decimals: number;
}): Promise<Transaction> {

    const ix = createTransferInstruction(
        fromAta,
        toAta,
        owner,
        amount * (10 ** decimals)
    );

    const transaction = new Transaction().add(ix);

    const blockhash = context.lastBlockhash;
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = context.payer.publicKey;
    transaction.sign(context.payer);

    return transaction;
};