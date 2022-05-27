import axios from "axios"
import { APISecurity } from "../../.env.js"

export const submitRel = async(body) => {
    try{
        const url = 'https://gamblearn-reality.herokuapp.com/api/my-bets'
        const {data} = await axios.post(url, body, { auth: APISecurity })
    } catch (err) {
        console.log(err)
    }
}