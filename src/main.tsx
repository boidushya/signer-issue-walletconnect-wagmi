import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WagmiConfig, configureChains, createClient, mainnet } from "wagmi";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { polygon } from "wagmi/chains";

const { provider } = configureChains([mainnet, polygon], [publicProvider()]);
const WALLET_CONNECT_PROJECT_ID = "3f930f8e56336b44761655d8a270144c";

const client = createClient({
  autoConnect: true,
  provider,
  connectors: [
    new WalletConnectConnector({
      chains: [mainnet, polygon],
      options: {
        projectId: WALLET_CONNECT_PROJECT_ID,
        showQrModal: true,
      },
    }),
    new MetaMaskConnector({
      chains: [mainnet, polygon],
    }),
  ],
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <App />
    </WagmiConfig>
  </React.StrictMode>
);
