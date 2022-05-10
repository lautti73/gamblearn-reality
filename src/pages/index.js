import dynamic from 'next/dynamic';
import Head from 'next/head'
import { Layout } from '../components/Layout';

const Home = () => {

	const bets = [{id: 1, type: "Sports"}, {id: 2, type: "Sports"}, {id: 3, type: "ESports"}]
	const filters = ['Sports'];

	const filterType = (bets, filters) => {
		let filteredBets = []
		for (const type of filters) {
			const array = bets.filter( (bet) =>
				bet.type === type
			)
			filteredBets = [...array];
			console.log('1', filteredBets)
		}
		console.log('2', filteredBets)
	}

	return (
		<Layout>
			<div>Hola</div>
			<button onClick={filterType(bets, filters)}>Click</button>
		</Layout>
	)
}

export default Home
