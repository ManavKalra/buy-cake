// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function getBalances(address){
  const balanceBigInt= await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function consoleBalances(addresses)
{
 let count=0;
 for (const address of addresses)
 {
   console.log(`Address ${count} balance: `, await getBalances(address));
   count ++;
 }
}

async function consoleMemos(memos)
{
 for(const memo of memos)
 {
  const timestamp=memo.timestamp;
  const name=memo.name;
  const message=memo.message;
  const addr=memo.from;
  console.log(`At ${timestamp} - name ${name} - message ${message} - Address ${addr}`);
 }
}

async function main() {
  const [owner,from1,from2,from3]=await hre.ethers.getSigners();
  const cake=await hre.ethers.getContractFactory("cake");
  const contract=await cake.deploy(); //instance of contract

  await contract.deployed();
  console.log("Address of contract: ", contract.address);

  const addresses=[owner.address, from1.address, from2.address, from3.address];
  console.log("Before buying cake");
  await consoleBalances(addresses);

  const amount={value:hre.ethers.utils.parseEther("1")};
  await contract.connect(from1).buyCake("from1","Very sweet cake",amount);
  await contract.connect(from2).buyCake("from2","Very sweet",amount);
  await contract.connect(from3).buyCake("from3","sweet cake",amount);

  console.log("After buying cake");
  await consoleBalances(addresses);

  const memos=await contract.getMemos();
  consoleMemos(memos);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
