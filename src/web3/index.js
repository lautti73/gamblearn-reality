import { ethers } from 'ethers';
import { INFURA_ID } from '../../.env.json';

export const factoryContractAddress = '0x6ba8A7E675132f779e669C9b062A1aD5Df310E97';

export default (() => {
    const projectId = INFURA_ID;
    let provider;
    if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
    // We are on the server *OR* the user is not running metamask 
    provider = new ethers.providers.InfuraProvider('rinkeby', projectId)
    }
    return provider
}) ()
