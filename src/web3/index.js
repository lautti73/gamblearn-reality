import { ethers } from 'ethers';
import { INFURA_ID } from '../../.env.json';

export const factoryContractAddress = '0x07320C57333A09feD8Bf639586187Fc336eaC424';

export default (() => {
    const projectId = INFURA_ID;
    let provider;
    if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
    // We are on the server *OR* the user is not running metamask 
    provider = new ethers.providers.InfuraProvider('rinkeby', projectId)
    }
    return provider
}) ()
