import Head from 'next/head';
import React from 'react';
import { CreateBetForm } from '../components/CreateBetForm';
import { Layout } from '../components/Layout';

const CreateBet = () => {
    return (
        <>
        <Head>
            <title>Create Bet</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <Layout>
        
        <main className='mt-8 mb-24 container sm:container mx-auto'>
            <CreateBetForm 
                
            />
        </main>
        </Layout>
        </>
    )
};

export default CreateBet;
