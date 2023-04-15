import Web3Modal from 'web3modal';
import Web3 from 'web3';

const getWeb3 = async () => {
    const web3Modal = new Web3Modal({
        disableModalBackdrop: true
    });

    // Get a provider instance
    const provider = await web3Modal.connect();

    // Create a Web3 instance using the provider
    const web3 = new Web3(provider);

    return web3;
};

export default getWeb3;
