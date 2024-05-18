# Bankrun Playground

## Overview

Bankrun Playground is a TypeScript project designed to handle various blockchain token operations using the Solana blockchain. This project includes functionality for minting tokens, transferring tokens, and creating associated token accounts (ATAs).

## Prerequisites

- Node.js
- Yarn
- Solana CLI (optional for blockchain interactions)

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/bankrun-playground.git
   ```
2. Navigate to the project directory:
   ```bash
   cd bankrun-playground
   ```
3. Install dependencies:
   ```bash
   yarn install
   ```

## Usage

This project includes several scripts to interact with the Solana blockchain. Here are a few examples:

### Mint Tokens

To mint new tokens to a specific wallet:

```bash
ts-node mintTo.ts --wallet <WALLET_ADDRESS> --amount <AMOUNT>
```

### Transfer Tokens

To transfer tokens from one wallet to another:

```bash
ts-node transferToken.ts --from <SOURCE_WALLET_ADDRESS> --to <DESTINATION_WALLET_ADDRESS> --amount <AMOUNT>
```

### Create ATA

To create an associated token account for a wallet:

```bash
ts-node createAta.ts --wallet <WALLET_ADDRESS>
```

## Testing

Run the tests to ensure everything is working as expected:

```bash
yarn test
```

## Contributing

Contributions are welcome! Please feel free to submit pull requests or create issues for bugs and feature requests.
