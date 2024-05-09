import { Pool } from 'pg'
import { Envconfig } from './postgresql'


const USER = encodeURIComponent(Envconfig.dbUser!)
const PASSWORD = encodeURIComponent(Envconfig.dbPassword!)

const URI = `postgres://${USER}:${PASSWORD}@${Envconfig.dbHost}:${Envconfig.dbPort}/${Envconfig.dbName}`

export const pool = new Pool({ connectionString: URI })
