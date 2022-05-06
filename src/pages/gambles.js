import React from 'react'
import { useContract, useProvider } from 'wagmi';
import { ethers } from 'ethers';
import factoryJSON from '../../artifacts/contracts/GambleGame.sol/BetFactory.json';
import betJSON from '../../artifacts/contracts/GambleGame.sol/Bet.json';
import provider, { factoryContractAddress } from '../web3';
import { Layout } from '../components/Layout';
import { GambleContainer } from '../components/GambleContainer';



const gambles = ({bets}) => {
    return (
        <Layout>

            <main className='sm:container sm:mx-auto mx-5 mt-8 mb-24 flex flex-col lg:flex-row'>
                {
                    bets?.map( bet => 
                        <GambleContainer 
                            key={bet.betAddress}
                            bets={bet}
                        />
                    )
                }
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
        const balanceBigInt = await betInstance.getContractBalance();
        const balance = balanceBigInt.toNumber();
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

export default gambles