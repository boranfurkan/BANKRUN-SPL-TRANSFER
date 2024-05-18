import { createInitializeMint2Instruction, createMint, getMinimumBalanceForRentExemptMint, getOrCreateAssociatedTokenAccount, MINT_SIZE, mintTo, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { ProgramTestContext } from "solana-bankrun";

export async function getInitializeMintTransaction({
    mintDecimals,
    context
}: {
    mintDecimals: number;
    context: ProgramTestContext;
}): Promise<[Transaction, Keypair]> {
    const lamports = Number((await context.banksClient.getRent()).minimumBalance(
        BigInt(MINT_SIZE)
    ));


    const mintKeypair = Keypair.generate();

    const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: context.payer.publicKey,
            newAccountPubkey: mintKeypair.publicKey,
            space: MINT_SIZE,
            lamports,
            programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMint2Instruction(
            mintKeypair.publicKey,
            mintDecimals,
            context.payer.publicKey,
            context.payer.publicKey,
            TOKEN_PROGRAM_ID
        )
    );



    const blockhash = context.lastBlockhash;
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = context.payer.publicKey;
    transaction.sign(mintKeypair, context.payer);

    return [transaction, mintKeypair];
}