import { ethers } from 'ethers';
import { INFURA_ID } from '../../.env';

export const factoryContractAddress = '0x075266bC4DF63f93dB064DAE5D65efcF6365e549';

export default (() => {
    const projectId = INFURA_ID;
    let provider;
    if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
    // We are on the server *OR* the user is not running metamask 
    provider = new ethers.providers.InfuraProvider('rinkeby', projectId)
    }
    return provider
}) ()
