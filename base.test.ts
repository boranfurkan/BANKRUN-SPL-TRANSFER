import { BanksClient, ProgramTestContext, start } from "solana-bankrun";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Keypair } from "@solana/web3.js";
import { getInitializeMintTransaction } from "./initializeMint";
import { getCreateAtaTransaction } from "./createAta";
import { getMintToTransaction } from "./mintTo";
import { AccountLayout } from "@solana/spl-token";
import { getTransferTokenTransaction } from "./transferToken";

describe("Transfer mint", () => {
    let context: ProgramTestContext,
        client: BanksClient,
        payer: Keypair,
        mintKeypair: Keypair,
        payerAta: PublicKey,
        receiver: Keypair,
        receiverAta: PublicKey;

    const mintDecimals = 9;

    beforeAll(async () => {
        context = await start([], []);
        client = context.banksClient;
        payer = context.payer;
    });

    test("Initialize mint", async () => {
        const [initMintTx, keypair] = await getInitializeMintTransaction({
            mintDecimals,
            context,
        });
        mintKeypair = keypair;
        const initMintResult = await client.tryProcessTransaction(initMintTx);
        // Check that the transaction was successful. Null means success.
        expect(initMintResult.result).toBeNull();
    });

    test("Create payer Associated Token Account", async () => {
        const [initPayerAtaTx, ata] = await getCreateAtaTransaction({
            context,
            mint: mintKeypair.publicKey,
            owner: payer.publicKey
        })
        payerAta = ata;
        const initPayerAtaResult = await client.tryProcessTransaction(initPayerAtaTx);
        expect(initPayerAtaResult.result).toBeNull();
    });

    test("Create receiver Associated Token Account", async () => {
        receiver = Keypair.generate();
        const [initReceiverAtaTx, ata] = await getCreateAtaTransaction({
            context,
            mint: mintKeypair.publicKey,
            owner: receiver.publicKey
        })
        receiverAta = ata;
        const initReceiverAtaResult = await client.tryProcessTransaction(initReceiverAtaTx);
        expect(initReceiverAtaResult.result).toBeNull();
    });

    test("Mint token to payer", async () => {
        const mintAmount = 100000;
        const transaction = await getMintToTransaction({
            context,
            mint: mintKeypair.publicKey,
            mintToATA: payerAta,
            amount: mintAmount,
            decimals: mintDecimals
        });

        await client.tryProcessTransaction(transaction);

        const ata = await client.getAccount(payerAta);
        const rawAtaData = AccountLayout.decode(ata!.data);

        //Check if correct amount was minted successfully
        expect(
            Number(rawAtaData.amount)
        ).toEqual(mintAmount * (10 ** mintDecimals));
    });

    test("Transfer tokens to receiver", async () => {
        const transferAmount = 3333;
        const transaction = await getTransferTokenTransaction({
            context,
            fromAta: payerAta,
            owner: payer.publicKey,
            toAta: receiverAta,
            amount: transferAmount,
            decimals: mintDecimals
        });

        await client.tryProcessTransaction(transaction);

        const ata = await client.getAccount(receiverAta);
        const rawAtaData = AccountLayout.decode(ata!.data);

        //Check if correct amount was transferred successfully
        expect(
            Number(rawAtaData.amount)
        ).toEqual(transferAmount * (10 ** mintDecimals));
    });
});