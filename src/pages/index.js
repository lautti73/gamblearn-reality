import dynamic from 'next/dynamic';
import Head from 'next/head'
import { Layout } from '../components/Layout';

const Home = () => {

	return (
		<Layout>
			<iframe src='https://reality.eth.link/app/#!/question/0xdf33060f476f8cff7511f806c72719394da1ad64-0xf58e296dcf4f75aa455ec3d57fa6a28b258149737e1cfb8fd45942743067239d'></iframe>
		</Layout>
	)
}

export default Home
