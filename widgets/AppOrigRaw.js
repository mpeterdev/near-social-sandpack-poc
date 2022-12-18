import { useEffect, useState } from 'react';
import * as nearAPI from 'near-api-js';
const { Contract, keyStores, WalletConnection } = nearAPI;
import RedDiv from './social-widgets/RedDiv';
import SandpackWidget from './social-widgets/michaelpeter.near/SandpackWidget';

// import { setupWalletSelector } from '@near-wallet-selector/core';
// import { setupNearWallet } from '@near-wallet-selector/near-wallet';
// import { setupModal } from "@near-wallet-selector/modal-ui";
// import "@near-wallet-selector/modal-ui/styles.css";

// creates keyStore using private key in local storage
const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();
const { connect } = nearAPI;

const connectionConfig = {
  networkId: 'mainnet',
  keyStore: myKeyStore, // first create a key store
  nodeUrl: 'https://rpc.mainnet.near.org',
  walletUrl: 'https://wallet.mainnet.near.org',
  helperUrl: 'https://helper.mainnet.near.org',
  explorerUrl: 'https://explorer.mainnet.near.org',
};

// demonstrates how to query the state without setting
// up an account. (View methods only)
const { providers } = nearAPI;
//network config (replace testnet with mainnet or betanet)
const provider = new providers.JsonRpcProvider('https://rpc.mainnet.near.org');

async function getSocial() {
  const rawResult = await provider.query({
    request_type: 'call_function',
    account_id: 'social.near',
    method_name: 'get',
    args_base64:
      'eyJrZXlzIjpbIm1pY2hhZWxwZXRlci5uZWFyL3dpZGdldC9HZW5pZUFuc3dlclZvdGUiXX0K',
    finality: 'optimistic',
  });

  // format result
  const res = JSON.parse(Buffer.from(rawResult.result).toString());
  return res;
}

export default function App() {
  const [socialInfo, setSocialInfo] = useState();
  const [nearConnection, setNearConnection] = useState();
  const [walletConnection, setWalletConnection] = useState();
  const [checkpoint, setCheckpoint] = useState('none');
  // const [modal, setModal] = useState();

  // const initWallet = async () => {
  //   // NEAR Wallet for Wallet Selector can be setup without any params or it can take two optional params.
  //   const selector = await setupWalletSelector({
  //     network: 'mainnet',
  //     modules: [setupNearWallet()],
  //   });
  //   const modal = setupModal(selector, {
  //     contractId: 'social.near',
  //   });
  //   setModal(modal);
  // };

  // useEffect(() => {
  //   initWallet();
  // }, []);

  const connectIt = async () => {
    setCheckpoint('connecting');
    const nearConnectionNew = await connect(connectionConfig);
    setNearConnection(nearConnectionNew);
    // create wallet connection
    const walletConnectionNew = new WalletConnection(nearConnectionNew);
    setWalletConnection(walletConnectionNew);
  };
  useEffect(() => {
    connectIt();
  }, []);

  const fetchIt = async () => {
    setCheckpoint('fetching');
    // const contract = new Contract(
    //   walletConnection.account(), // the account object that is connecting
    //   'social.near',
    //   {
    //     // name of contract you're connecting to
    //     viewMethods: ['get'],
    //   }
    // );
    // const response = await contract.get({ keys: ['michaelpeter.near/**'] });
    // setSocialInfo(JSON.stringify(response));
    setSocialInfo(await getSocial());
  };

  useEffect(() => {
    if (!nearConnection || !walletConnection) {
      return;
    }
    fetchIt();
  }, [nearConnection]);
  return (
    <div>
      {/* <button onClick={modal?.show}>Wallet Selector</button> */}
      {/*<h1>{JSON.stringify(socialInfo)}</h1>*/}
      <RedDiv />
    </div>
  );
}
