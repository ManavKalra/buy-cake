const hre = require("hardhat");

async function main() {
    const cake=await hre.ethers.getContractFactory("cake");
    const contract=await cake.deploy(); //instance of contract

    await contract.deployed();
    console.log("Address of contract: ", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });