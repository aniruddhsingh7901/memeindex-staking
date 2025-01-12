// import { useState, useEffect } from 'react';
// import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
// import { Address, toNano } from '@ton/core';
// import { MemeIndexStaking } from '../contracts/MemeIndexStaking';

// const CONTRACT_ADDRESS = 'kQAsdlff9YXVjUrYwH7LtetUAJ2K8YhtBxpsQRB5fhVyiqCr';

// export default function Home() {
//   const [stakeAmount, setStakeAmount] = useState('');
//   const [userStake, setUserStake] = useState('0');
//   const [totalSupply, setTotalSupply] = useState('0');
//   const [loading, setLoading] = useState(false);
  
//   const userAddress = useTonAddress();
//   const connected = !!userAddress;

//   const contract = new MemeIndexStaking(Address.parse(CONTRACT_ADDRESS));

//   useEffect(() => {
//     if (connected && userAddress) {
//       fetchUserStake();
//       fetchTotalSupply();
//     }
//   }, [connected, userAddress]);

//   const fetchUserStake = async () => {
//     if (!userAddress) return;
//     try {
//       const stake = await contract.getStake(Address.parse(userAddress));
//       setUserStake(stake.toString());
//     } catch (error) {
//       console.error('Error fetching stake:', error);
//     }
//   };

//   const fetchTotalSupply = async () => {
//     try {
//       const supply = await contract.getCurrentSupply();
//       setTotalSupply(supply.toString());
//     } catch (error) {
//       console.error('Error fetching supply:', error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 p-4">
//       <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-xl p-6">
//         <h1 className="text-3xl font-bold text-center text-white mb-8">MemeIndex Staking</h1>

//         {!connected ? (
//           <div className="flex justify-center">
//             <TonConnectButton />
//           </div>
//         ) : (
//           <div className="space-y-6">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-white/5 p-4 rounded-lg">
//                 <p className="text-sm text-gray-300">Your Stake</p>
//                 <p className="text-xl font-bold text-white">{userStake} $MIDAO</p>
//               </div>
//               <div className="bg-white/5 p-4 rounded-lg">
//                 <p className="text-sm text-gray-300">Total Supply</p>
//                 <p className="text-xl font-bold text-white">{totalSupply} $MIDAO</p>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <input
//                 type="number"
//                 value={stakeAmount}
//                 onChange={(e) => setStakeAmount(e.target.value)}
//                 placeholder="Enter amount to stake"
//                 className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400"
//                 disabled={loading}
//               />

//               <div className="grid grid-cols-2 gap-4">
//                 <button
//                   onClick={() => {/* Implement stake */}}
//                   disabled={loading || !stakeAmount}
//                   className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold disabled:opacity-50 text-white transition-colors"
//                 >
//                   {loading ? 'Processing...' : 'Stake'}
//                 </button>
//                 <button
//                   onClick={() => {/* Implement withdraw */}}
//                   disabled={loading}
//                   className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold disabled:opacity-50 text-white transition-colors"
//                 >
//                   {loading ? 'Processing...' : 'Withdraw'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { TonConnectButton, useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { Address, toNano, fromNano } from '@ton/core';
import { MemeIndexStaking } from '../contracts/MemeIndexStaking';
import { notification } from '../utils/notification';  // You'll need to create this

const CONTRACT_ADDRESS = 'kQAsdlff9YXVjUrYwH7LtetUAJ2K8YhtBxpsQRB5fhVyiqCr';

export default function Home() {
  // State Management
  const [stakeAmount, setStakeAmount] = useState('');
  const [userStake, setUserStake] = useState('0');
  const [totalSupply, setTotalSupply] = useState('0');
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // TON Connect
  const userAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const connected = !!userAddress;

  // Contract Instance
  const contract = new MemeIndexStaking(Address.parse(CONTRACT_ADDRESS));

  // Data Fetching
  useEffect(() => {
    if (connected && userAddress) {
      fetchUserStake();
      fetchTotalSupply();
    }
  }, [connected, userAddress, refreshTrigger]);

  const fetchUserStake = async () => {
    if (!userAddress) return;
    try {
      const stake = await contract.getStake(Address.parse(userAddress));
      setUserStake(fromNano(stake).toString());
    } catch (error) {
      console.error('Error fetching stake:', error);
      notification.error('Failed to fetch stake balance');
    }
  };

  const fetchTotalSupply = async () => {
    try {
      const supply = await contract.getCurrentSupply();
      setTotalSupply(fromNano(supply).toString());
    } catch (error) {
      console.error('Error fetching supply:', error);
      notification.error('Failed to fetch total supply');
    }
  };

  // Transaction Handlers
  const handleStake = async () => {
    if (!connected || !stakeAmount) return;
    setLoading(true);
    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60, // 1 minute
        messages: [
          {
            address: CONTRACT_ADDRESS,
            amount: toNano(stakeAmount),
            payload: 'stake',
          },
        ],
      };

      await tonConnectUI.sendTransaction(transaction);
      notification.success('Staking transaction sent');
      setStakeAmount('');
      // Refresh data after a short delay to allow transaction to process
      setTimeout(() => setRefreshTrigger(prev => prev + 1), 3000);
    } catch (error) {
      console.error('Staking error:', error);
      notification.error('Failed to stake tokens');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!connected) return;
    setLoading(true);
    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [
          {
            address: CONTRACT_ADDRESS,
            amount: toNano('0.1'),
            payload: 'withdraw',
          },
        ],
      };

      await tonConnectUI.sendTransaction(transaction);
      notification.success('Withdrawal transaction sent');
      setTimeout(() => setRefreshTrigger(prev => prev + 1), 3000);
    } catch (error) {
      console.error('Withdrawal error:', error);
      notification.error('Failed to withdraw tokens');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 p-4">
      <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">MemeIndex Staking</h1>
          <TonConnectButton />
        </div>

        {connected && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-sm text-gray-300">Your Stake</p>
                <p className="text-xl font-bold text-white">{userStake} $MIDAO</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-sm text-gray-300">Total Supply</p>
                <p className="text-xl font-bold text-white">{totalSupply} $MIDAO</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="Enter amount to stake"
                  className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 pr-16"
                  disabled={loading}
                />
                <button
                  onClick={() => setStakeAmount(userStake)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:text-blue-300"
                >
                  MAX
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleStake}
                  disabled={loading || !stakeAmount || Number(stakeAmount) <= 0}
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold disabled:opacity-50 text-white transition-colors"
                >
                  {loading ? 'Processing...' : 'Stake'}
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={loading || Number(userStake) <= 0}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold disabled:opacity-50 text-white transition-colors"
                >
                  {loading ? 'Processing...' : 'Withdraw'}
                </button>
              </div>
            </div>

            {loading && (
              <div className="text-center text-sm text-gray-300 animate-pulse">
                Transaction in progress...
              </div>
            )}
          </div>
        )}

        {!connected && (
          <div className="text-center text-gray-300 mt-4">
            Connect your wallet to start staking
          </div>
        )}
      </div>
    </div>
  );
}