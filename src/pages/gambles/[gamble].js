import React from 'react';
import { ethers } from 'ethers';
import Head from 'next/head';
import betjson from '../../../artifacts/contracts/GambleGame.sol/Bet.json';
import { GambleBody } from '../../components/GambleBody';
import { Layout } from '../../components/Layout';
import provider from '../../web3'


const gamble = ({ betSerialized }) => {

    return (
        <>
        <Head>
            <title>{`${betSerialized.firstTeam} vs ${betSerialized.secondTeam}`}</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <Layout>
            <GambleBody 
                bet={betSerialized}
            />
        </Layout>
        </>
    )
};

export async function getServerSideProps(context) {

        const betAddress = context.params.gamble;
        const betInstance = new ethers.Contract(
            betAddress,
            betjson.abi,
            provider
        )
        const firstTeam = await betInstance.firstTeam();
        const secondTeam = await betInstance.secondTeam();
        const description = await betInstance.betDesc();
        const players = await betInstance.getGambles();
        const balanceBigInt = await betInstance.getContractBalance();
        const balance = balanceBigInt.toNumber();
        const manager = await betInstance.manager();
        const betState = await betInstance.betState();
        const winner = await betInstance.winner();
        const type = await betInstance.betType();
        const subtype = await betInstance.betSubtype();
        const acceptTie = await betInstance.acceptsTie();
        const matchTimestampBigInt = await betInstance.matchTimestamp();
        const matchTimestamp = matchTimestampBigInt.toNumber();
        const bet = {
            betAddress,
            firstTeam,
            secondTeam,
            description,
            players,
            balance,
            manager,
            betState,
            winner,
            type,
            subtype,
            acceptTie,
            matchTimestamp
        }
        const betSerialized = JSON.parse(JSON.stringify(bet));
        
 
    return {
      props: { 
        betSerialized,
    } // will be passed to the page component as props
    }
  }

export default gamble;
