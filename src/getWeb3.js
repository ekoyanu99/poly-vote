import Web3 from "web3";

const getWeb3 = () =>
    new Promise((resolve, reject) => {
        // Wait for loading completion to avoid race conditions with web3 injection timing.
        window.addEventListener("load", async () => {
            // Modern dapp browsers...
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                try {
                    // Request account access if needed
                    await window.ethereum.enable();
                    // Acccounts now exposed
                    resolve(web3);
                } catch (error) {
                    reject(error);
                }
            }
            // Legacy dapp browsers...
            else if (window.web3) {
                // Use Mist/MetaMask's provider.
                const web3 = window.web3;
                console.log("Injected web3 detected.");
                resolve(web3);
            }
            // Fallback to localhost; use dev console port by default...
            else {
                const provider = new Web3.providers.HttpProvider(
                    // "https://polygon-mumbai.g.alchemy.com/v2/pZtMYFAth5mw1UecE_l_TZucPxFMYnzF"
                    "https://rpc.ankr.com/polygon_mumbai"
                    // "https://arb-goerli.g.alchemy.com/v2/IEyAkqlSD2ZldTR8BUTlMtPJVv5riLiQ"
                    // "https://eth-goerli.g.alchemy.com/v2/MRRdG0d-MJXVwl5ogBT_pkUHlbWcqxkl"
                );
                const web3 = new Web3(provider);
                console.log("No web3 instance injected, using Local web3.");
                resolve(web3);
            }
        });
    });

export default getWeb3;
