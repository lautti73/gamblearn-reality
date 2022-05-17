import React, { useContext, useEffect } from 'react'
import { ethers } from 'ethers';
import factoryJSON from '../../artifacts/contracts/GambleGame.sol/BetFactory.json';
import betJSON from '../../artifacts/contracts/GambleGame.sol/Bet.json';
import provider, { factoryContractAddress } from '../web3';
import { Layout } from '../components/Layout';
import { BetPagination } from '../components/BetPagination';
import { FilterBets } from '../components/FilterBets';
import { StoreContext } from '../store/storeProvider';
import { useAccount } from 'wagmi';
import axios from 'axios';
import { APISecurity } from '../../.env.js';
import { FilterOwner } from '../components/FilterOwner';

const MyBets = ({bets}) => {
    const [{logged, bets: betsGlobal}, setConnect, {loadBets}] = useContext(StoreContext);
    const [{ data: account}] = useAccount();

    useEffect(() => {
        const getData = async () => {
            const url = 'http://localhost:3000/api/my-bets'
            const body = {account: account.address}
            try {
                const { data } = await axios.post(url, body, { auth: APISecurity })
                const myBetsList = data.map( (el) => el.bet);
                const myBets = bets.filter( (bet) => myBetsList.includes(bet.betAddress));
                loadBets(myBets);
            } catch (err) {
                console.log(err)
            }
        }
        if(account) {
            getData()
        }
    }, [logged])
    
    
    return (
        <Layout>

            <main className='sm:container sm:mx-auto mx-5 mt-8 mb-24 flex flex-col lg:flex-row'>
                <FilterBets />
                
                <div className='flex flex-col flex-1'>
                    {!account && <p className='font-semibold text-center text-lg'>Please login to continue</p>}
                    {(betsGlobal.length == 0 && account) && <p className='font-semibold text-center text-lg'>There is no bets for your account</p>}
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
        const manager = await betInstance.manager();
        const object = {
            betAddress,
            firstTeam,
            secondTeam,
            players,
            balance,
            betState,
            type,
            subtype,
            manager
        }
        return (JSON.parse(JSON.stringify(object)))
    }))

    return {
      props: { 
          bets
    } // will be passed to the page component as props
    }
  }

export default MyBets