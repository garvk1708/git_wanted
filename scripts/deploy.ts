
import { ethers } from "hardhat";

async function main() {
  const BountyContract = await ethers.getContractFactory("BountyContract");
  const bountyContract = await BountyContract.deploy();

  await bountyContract.waitForDeployment();
  
  const address = await bountyContract.getAddress();
  console.log("BountyContract deployed to:", address);
  
  // Write the address to contract.ts
  // You'll need to manually copy this address to server/contract.ts
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
