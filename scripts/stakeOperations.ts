import { Address, OpenedContract, ProviderRpcClient } from '@ton/core';
import { KeyPair } from '@ton/crypto'; // Import KeyPair if needed

const provider = new ProviderRpcClient();

async function stakeOperations() {
  const abi = { /* ABI details */ };
  const contractAddress = Address.parse('your_contract_address_here');

  // Open the contract
  const contract: OpenedContract = provider.open(abi, contractAddress);

  // Example: Get total staked
  const totalStaked = await contract.methods.getTotalStaked().call();
  console.log('Total staked:', totalStaked);

  // Example: Perform a staking operation
  const walletKey: KeyPair = { publicKey: '...', secretKey: '...' };
  await contract.methods.stake({
    amount: 100,
    from: Address.parse(walletKey.publicKey), // Adjust here
  }).send();
}

stakeOperations().catch(console.error);
