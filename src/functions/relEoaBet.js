import axios from "axios"
import { APISecurity } from "../../.env"

const submitRel = async(body) => {
    const url = 'http://localhost:3000/api/my-bets'
    const {data} = await axios.post(url, body, { auth: APISecurity })
    console.log(data);
}