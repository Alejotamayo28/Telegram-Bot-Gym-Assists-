import { compare } from "bcryptjs"
import { Client, QueryResult } from "pg"
import { Context } from "telegraf"
import { Message } from "telegraf/typings/core/types/typegram"
import { deleteLastMessage } from "../utils"
import { pool } from "../../../database/database"
import { userStateData } from "../../../model/client"
import { updateUserState, userSession, userState, UserStateManager } from "../../../userState"
import { bot } from "../../bot"
import { mainMenuPage } from "../../mainMenu"


export const findUserByNickname = async (nickname: string): Promise<Client | undefined> => {
    const response: QueryResult = await pool.query(
        `SELECT nickname, password FROM client WHERE nickname = $1`, [nickname])
    return response.rowCount ? response.rows[0] : null
}

export const handleUserNotFound = async (ctx: Context) => {
    await ctx.reply(`Usuario no encontrado, vuelve a escribir tu nickname: .`)
    updateUserState(ctx.from!.id, { stage: `login_nickname` })
}

export const handleLoginNickname = async (ctx: Context) => {
    await deleteLastMessage(ctx)
    const message = ctx.message as Message.TextMessage | undefined
    const userMessage = message!.text
    const user = await findUserByNickname(userMessage!)
    if (!user) {
        await handleUserNotFound(ctx)
        await ctx.deleteMessage()
        return
    }
    await ctx.deleteMessage();
    userSession.setPassword(user.password!);
    updateUserState(ctx.from!.id, { stage: 'login_password' })
    await ctx.reply('Por favor, proporciona tu contraseña');
}

export const handleLoginPassword = async (ctx: Context) => {
    await deleteLastMessage(ctx)
    const message = ctx.message as Message.TextMessage | undefined
    const userMessage = message!.text
    const userManager = new UserStateManager<userStateData>(ctx.from!.id)
    userManager.updateData({ password: userMessage })
    const isPasswordIncorrect = await verifyPassword(userManager.getUserData().password!, userSession.getPassword())
    if (!isPasswordIncorrect) {
        await handleIncorrectPassword(ctx)
        await ctx.deleteMessage()
        return
    }
    await ctx.deleteMessage()
    delete userState[ctx.from!.id]
    await mainMenuPage(bot, ctx)
}

export const verifyPassword = async (inputPassword: string, storedPassword: string) => {
    return compare(inputPassword, storedPassword)
}

export const handleIncorrectPassword = async (ctx: Context) => {
    await ctx.reply('Contraseña incorrecta, vuelve a escribirla!');
    updateUserState(ctx.from!.id, { stage: 'login_password' })
}
