// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  useConnect,
  useSigner,
  useDisconnect,
  useAccount,
  useBalance,
  useContract,
} from "wagmi";
import { multicall } from "@wagmi/core";
import wagmiGotchiABI from "./contracts/wagmiGotchiABI.json";
import mLootABI from "./contracts/mLootABI.json";

const wagmigotchiContract = {
  address: "0xecb504d39723b0be0e3a9aa33d646642d1051ee1",
  abi: wagmiGotchiABI,
};
const mlootContract = {
  address: "0x1dfe7ca09e99d10835bf73044a23b73fc20623df",
  abi: mLootABI,
};

// const CHAIN_ID = 97;
// const RPC_URL =
//   "https://bsc-testnet.nodereal.io/v1/f9777f42cc9243f0a766937df1c6a5f3";

// const bscExplorer = {
//   name: "BscScan",
//   url: "https://testnet.bscscan.com",
// };

// const chain: Chain = {
//   id: CHAIN_ID,
//   name: "BSC Testnet",
//   network: "bsc-testnet",
//   rpcUrls: {
//     default: {
//       http: [RPC_URL],
//     },
//     public: {
//       http: [RPC_URL],
//     },
//   },
//   blockExplorers: {
//     default: bscExplorer,
//     etherscan: bscExplorer,
//   },
//   nativeCurrency: {
//     name: "BSC Native Token",
//     symbol: "BNB",
//     decimals: 18,
//   },
// };

function ConnectButton() {
  const { connectors, connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
  });
  const contract = useContract(wagmigotchiContract);

  const onConnect = () =>
    connectAsync({ connector: connectors[0], chainId: 1 });

  const handleMulticall = async () => {
    const data = await multicall({
      contracts: [
        {
          ...wagmigotchiContract,
          functionName: "getAlive",
        },
        {
          ...wagmigotchiContract,
          functionName: "getBoredom",
        },
        {
          ...mlootContract,
          functionName: "getChest",
          args: [69],
        },
        {
          ...mlootContract,
          functionName: "getWaist",
          args: [69],
        },
      ],
    });
    console.log(data);
  };

  const handleContract = async () => {
    const data = await contract.getAlive();
    console.log(data);
  };

  const fetchBalance = () => {
    console.log("Balance", balance);
    if (signer) {
      signer.getAddress().then((address) => {
        console.log("Address", address);
      });
      signer.getChainId().then((chainId) => {
        console.log("ChainId", chainId);
      });
      signer.getGasPrice().then((gasPrice) => {
        console.log("GasPrice", gasPrice);
      });
      signer.getBalance().then((balance) => {
        console.log("Balance from signer", balance);
      });
    }
  };

  return (
    <>
      {signer ? (
        <>
          <button onClick={fetchBalance}>Fetch balance</button>
          <button onClick={() => handleMulticall()}>MultiCall</button>
          <button onClick={() => handleContract()}>Contract</button>
          <button onClick={() => disconnectAsync()}>Disconnect</button>
        </>
      ) : (
        <button onClick={onConnect}>Connect</button>
      )}
    </>
  );
}

function App() {
  return <ConnectButton />;
}

export default App;
