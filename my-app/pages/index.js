import Head from "next/head";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { providers, Contract } from "ethers";
import Web3Modal from "web3modal";
import styles from "../styles/Home.module.css";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  const web3ModalRef = useRef(null);

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();

    if (chainId !== 4) {
      window.alert("Please connect to the Rinkeby test network");
      throw new Error("Please connect to Rinkeby network");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }

    return web3Provider;
  };

  const addAddressToWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);

      const contract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);
      const tx = await contract.addAddressToWhitelist();
      setLoading(true);

      await tx.wait();

      setLoading(false);

      await getNumberOfWhitelisted();

      setJoinedWhitelist(true);
    } catch (e) {
      console.error(e);
    }
  };

  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner();

      const contract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, provider);
      const newValue = await contract.numAddressesWhitelisted();

      setNumberOfWhitelisted(newValue);
    } catch (e) {
      console.error(e);
    }
  };

  const checkIfAddressIsWhitelisted = async () => {
    try {
      const signer = await getProviderOrSigner(true);

      const contract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);
      const address = await signer.getAddress();
      const isWhitelisted = await contract.whitelistedAddresses(address);

      setJoinedWhitelist(isWhitelisted);
    } catch (e) {
      console.error(e);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner(true);

      setWalletConnected(true);
      await checkIfAddressIsWhitelisted();
      await getNumberOfWhitelisted();
    } catch (e) {
      console.error(e);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>
            Thanks for joining the Whitelist!
          </div>
        );
      } else if (loading) {
        return (
          <button className={styles.button} disabled>
            Loading...
          </button>
        );
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your Wallet
        </button>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Whitelist dApp</title>
        <meta name="description" content="Whitelist dApp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Whitelist dApp</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numberOfWhitelisted} people have joined the whitelist so far.
          </div>
          {renderButton()}
        </div>
        <div>
          <Image src="/crypto-devs.svg" width={500} height={500} />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  );
}
