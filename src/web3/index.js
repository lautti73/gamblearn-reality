import { ethers } from 'ethers';
import { INFURA_ID } from '../../.env';

export const factoryContractAddress = '0x589E92be44d824C904B80bB3B5c5579C93A27e9c';

export default (() => {
    const projectId = INFURA_ID;
    let provider;
    if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
    // We are on the server *OR* the user is not running metamask 
    provider = new ethers.providers.InfuraProvider('rinkeby', projectId)
    }
    return provider
}) ()
