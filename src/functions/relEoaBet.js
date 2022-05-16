import axios from "axios"
import { APISecurity } from "../../.env.js"

export const submitRel = async(body) => {
    try{
        const url = 'http://localhost:3000/api/my-bets'
        const {data} = await axios.post(url, body, { auth: APISecurity })
    } catch (err) {
        console.log(err)
    }
}