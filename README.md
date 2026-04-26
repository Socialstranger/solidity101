# Solidity 101

## Introduction
Welcome to **Solidity 101**, a comprehensive guide to understanding and developing smart contracts using the **Solidity** programming language. This project utilizes the **Hardhat** framework and supports **Solidity version 0.8.28**.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Installation](#installation)
3. [Creating a Smart Contract](#creating-a-smart-contract)
4. [Testing Smart Contracts](#testing-smart-contracts)
5. [Deploying Contracts](#deploying-contracts)
6. [Conclusion](#conclusion)

## Getting Started
This project is tailored towards developers who wish to learn about the basics of Solidity and smart contract development. Ensure you have the following installed:
- Node.js (version 12.x or newer)  
- npm (Node package manager)

## Installation
To set up the development environment, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Socialstranger/solidity101.git
   cd solidity101
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Install Hardhat:
   ```bash
   npx hardhat
   ```

## Creating a Smart Contract
1. Create a new contract file in the `contracts` directory:
   ```solidity
   pragma solidity ^0.8.28;
   
   contract MyContract {
       string public greeting;
       
       constructor(string memory _greeting) {
           greeting = _greeting;
       }
   }
   ```

## Testing Smart Contracts
Testing is crucial. In the `test` directory, create a new test file:

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyContract", function () {
    it("Should return the correct greeting", async function () {
        const MyContract = await ethers.getContractFactory("MyContract");
        const myContract = await MyContract.deploy("Hello, Solidity!");
        await myContract.deployed();
        expect(await myContract.greeting()).to.equal("Hello, Solidity!");
    });
});
```

## Deploying Contracts
To deploy your contract, create a deployment script in the `scripts` folder:

```javascript
async function main() {
    const MyContract = await ethers.getContractFactory("MyContract");
    const myContract = await MyContract.deploy("Hello, Solidity!");
    await myContract.deployed();
    console.log(`Contract deployed to: ${myContract.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```

## Conclusion
This project aims to provide a basic understanding of Solidity, including smart contract creation, testing, and deployment using Hardhat. For more advanced topics, consider exploring further resources, tutorials, and the official Solidity documentation. Happy coding!