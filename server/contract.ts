
import { ethers } from 'ethers';
import { getEnv } from '../shared/env';

const env = getEnv();
const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${env.INFURA_API_KEY}`);

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // Add your deployed contract address here
const contractABI = [
  "function createBounty() public payable returns (uint256)",
  "function claimBounty(uint256 _bountyId) public",
  "function getBounty(uint256 _bountyId) public view returns (tuple(uint256 id, address creator, uint256 amount, bool claimed, address solver))",
  "function payBounty(uint256 _bountyId) public payable"
];

export const contract = new ethers.Contract(contractAddress, contractABI, provider);

export async function createBounty(amount: string) {
  const wallet = new ethers.Wallet(env.PRIVATE_KEY!, provider);
  const contractWithSigner = contract.connect(wallet);
  
  const tx = await contractWithSigner.createBounty({
    value: ethers.parseEther(amount)
  });
  
  return await tx.wait();
}

export async function payBounty(bountyId: number, amount: string) {
  const wallet = new ethers.Wallet(env.PRIVATE_KEY!, provider);
  const contractWithSigner = contract.connect(wallet);
  
  const tx = await contractWithSigner.payBounty(bountyId, {
    value: ethers.parseEther(amount)
  });
  
  return await tx.wait();
}

export async function claimBounty(bountyId: number) {
  const wallet = new ethers.Wallet(env.PRIVATE_KEY!, provider);
  const contractWithSigner = contract.connect(wallet);
  
  const tx = await contractWithSigner.claimBounty(bountyId);
  return await tx.wait();
}
