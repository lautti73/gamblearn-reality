import { rmSync } from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import {conn} from '../../utils/database'
import {APISecurity} from '../../../.env.js';

// type Data = {
//   name: string
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const {method, body, headers} = req
    const base64 = Buffer.from(`${APISecurity.username}:${APISecurity.password}`, 'utf-8').toString('base64')
    const auth = 'Basic ' + base64;
    if(headers.authorization === auth) {
        switch (method) {
            case 'POST': {
                if(body.bet) {
                    const {account, bet, isowner} = body
                    const query = 'INSERT INTO rel_eoa_bets (account, bet, isowner, creation_date) VALUES ($1, $2, $3, now()) RETURNING *'
                    const values = [account, bet, isowner]
                    const response = await conn.query(query, values)
                    return res.status(200).json(response.rows[0])
                } 
                const {account} = body
                const query = 'SELECT * FROM rel_eoa_bets WHERE account = $1'
                const values = [account]
                const response = await conn.query(query, values)
                return res.status(200).json(response.rows) 
            }
            default:
                return res.status(405).json("Method Not Allowed")
        }
    }
    return res.status(401).json("You don't have permissions")
}