import { Context } from "telegraf"
import { getUserSelectedMember } from "../../../../userState"
import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram"
import { MessageTemplate } from "../../../../template/message"
import { ViewFamilyMemberCallback } from "../models"

//Menu de iteraccion con otro usuario -> (Perfil)(Historial Ejercicios)(Ejercicios Semana Pasada)
export class ViewFamilyMemberDataInlineKeyboard extends MessageTemplate {
    constructor(private ctx: Context) {
        super()
    }
    protected prepareMessage() {
        const { nickname } = getUserSelectedMember(this.ctx.from!.id)
        const message = `📂 _Estás viendo el perfil de: ${nickname.toUpperCase()}_.\n\n¿Qué te gustaría hacer a continuación?`
        const keyboard: InlineKeyboardMarkup = {
            inline_keyboard: [
                [
                    this.createButton(`Historial Ejercicios`, { action: ViewFamilyMemberCallback.HistorialEjercicios }),
                    this.createButton(`Ejercicios Semana Pasada`, { action: ViewFamilyMemberCallback.EjerciciosSemanaPasada })
                ],
                [
                    this.createButton(`Perfil`, { action: ViewFamilyMemberCallback.Perfil })
                ]
            ]
        }
        return { message, keyboard }
    }
    async handleOptions(_: Context, __: Message, action: string) {
        const handlers: { [key: string]: () => Promise<void> } = {
            [ViewFamilyMemberCallback.HistorialEjercicios]: this.handleExeriseHistory.bind(this),
            [ViewFamilyMemberCallback.EjerciciosSemanaPasada]: this.handleExerciseLastWeek.bind(this),
            [ViewFamilyMemberCallback.Perfil]: this.handleClientPerfil.bind(this)
        }
        if (handlers[action]) {
            return await handlers[action]()
        }
    }
    private async handleExeriseHistory() {
        await this.ctx.reply(`handleExerciseHistory on development`)
    }
    private async handleExerciseLastWeek() {
        await this.ctx.reply(`handleExerciseLastWeek on development`)
    }
    private async handleClientPerfil() {
        await this.ctx.reply(`handleClientPerfil on development`)
    }
}