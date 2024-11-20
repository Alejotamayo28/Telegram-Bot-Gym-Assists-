import { Telegraf } from "telegraf"
import dotenv from 'dotenv'
import {  setUpHolaCommand} from "./commands/start"

dotenv.config()

export const bot = new Telegraf(process.env.TELEGRAM_TOKEN!)
setUpHolaCommand(bot)

