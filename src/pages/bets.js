import React, { useContext, useEffect } from 'react'
import { ethers } from 'ethers';
import factoryJSON from '../../artifacts/contracts/GambleGame.sol/BetFactory.json';
import betJSON from '../../artifacts/contracts/GambleGame.sol/Bet.json';
import provider, { factoryContractAddress } from '../web3';
import { Layout } from '../components/Layout';
import { BetPagination } from '../components/BetPagination';
import { FilterBets } from '../components/FilterBets';
import { StoreContext } from '../store/storeProvider';



const Bets = ({bets}) => {

    const [{bets: betsGlobal},, {loadBets}] = useContext(StoreContext);

    useEffect(() => {
        loadBets(bets)
    }, [])
    

    return (
        <Layout>

            <main className='sm:container sm:mx-auto mx-5 mt-8 mb-24 flex flex-col lg:flex-row'>
                <FilterBets />
                
                <div className='flex flex-col flex-1'>
                    {betsGlobal.length == 0  && <p className='font-semibold text-center text-lg'>There is no bets</p>}
                    <BetPagination />
                </div>
            </main>

        </Layout>
    )
}

export async function getServerSideProps() {
    const factory = new ethers.Contract(
        factoryContractAddress,
        factoryJSON.abi,
        provider
    )
    const deployedBets = await factory.getDeployedBets();

    const bets = await Promise.all(deployedBets.map( async( bet ) => {
        const betAddress = bet;
        const betInstance = new ethers.Contract(
            betAddress,
            betJSON.abi,
            provider
        )
        const firstTeam = await betInstance.firstTeam();
        const secondTeam = await betInstance.secondTeam();
        const players = await betInstance.getGambles();
        const balance = await betInstance.getContractBalance();
        const betState = await betInstance.betState();
        const type = await betInstance.betType();
        const subtype = await betInstance.betSubtype();
        const object = {
            betAddress,
            firstTeam,
            secondTeam,
            players,
            balance,
            betState,
            type,
            subtype
        }
        return (JSON.parse(JSON.stringify(object)))
    }))

    return {
      props: { 
          bets
    } // will be passed to the page component as props
    }
  }

export default Bets