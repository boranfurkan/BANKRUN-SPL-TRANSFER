import { createAssociatedTokenAccountInstruction, createMintToInstruction, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";
import { ProgramTestContext } from "solana-bankrun";

export async function getMintToTransaction({
    context, mint, mintToATA, amount, decimals
}: {
    context: ProgramTestContext;
    mintToATA: PublicKey;
    mint: PublicKey;
    amount: number;
    decimals: number;
}): Promise<Transaction> {

    const ix = createMintToInstruction(
        mint,
        mintToATA,
        context.payer.publicKey, //Assuming payer is always the authority
        amount * LAMPORTS_PER_SOL
    );

    const transaction = new Transaction().add(ix);

    const blockhash = context.lastBlockhash;
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = context.payer.publicKey;
    transaction.sign(context.payer);

    return transaction;
};