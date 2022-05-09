import { ethers } from 'ethers';
import { INFURA_ID } from '../../.env';

export const factoryContractAddress = '0x918Bd25AA3A2953708c7584F02152A59690e39EE';

export default (() => {
    const projectId = INFURA_ID;
    let provider;
    if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
    // We are on the server *OR* the user is not running metamask 
    provider = new ethers.providers.InfuraProvider('rinkeby', projectId)
    }
    return provider
}) ()
