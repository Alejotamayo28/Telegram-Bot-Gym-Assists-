import { Context, Telegraf } from "telegraf"
import { deleteUserMessage, saveBotMessage, userStageSignUp, userState, userStateUpdateEmail, userStateUpdateNickname, userStateUpdatePassword, userStateUpdateStage } from "../../../userState"
import { encrypt } from "../../../middlewares/jsonWebToken/enCryptHelper"
import { signUpVerificationController } from "."
import { botMessages } from "../../messages"
import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram"
import { validExercises } from "../utils"
import { UserQueryFetcher } from "../login/queries"

export class BotUtils {
  public static async sendBotMessage(ctx: Context, message: string, keyboard?: InlineKeyboardMarkup) {
    if (keyboard) {
      const response = await ctx.reply(message, { parse_mode: "Markdown", reply_markup: keyboard })
      saveBotMessage(ctx, response.message_id)
    } else {
      const response = await ctx.reply(message, { parse_mode: "Markdown" })
      saveBotMessage(ctx, response.message_id)
    }
  }

}

class TrieNode { // Representa un nodo en el arbol trie
  children: Map<string, TrieNode> // Map, almacena los nodos hijos, la clave es una letra, valor otro TrieNode (conexiones entre caracteres)
  isEndOfWord: boolean // inicador, si el nodo actual marca el fin de una palabra
  constructor() {
    this.children = new Map()
    this.isEndOfWord = false
  }
}

class Trie { // Representa el trie completo
  root: TrieNode // Raiz del arbol, hijos se conectan a partir de este nodo
  constructor() {
    this.root = new TrieNode() // Representa un nodo en el arbol
  }
  public insert(word: string): void {
    let current = this.root // Inserta una palabra en el Trie
    for (const char of word) {
      if (!current.children.has(char)) { // Verifica si existe un hijo en el mapa de children correspondiente a ese caracter
        current.children.set(char, new TrieNode()) // Si no existe, crea un nuevo nodo y lo agrega al mapa
      }
      current = current.children.get(char)!  // Mueve current al hijo correspondiente (el nuevo nodo o el existente)
    }
    current.isEndOfWord = true // cuando termina de iterar, marca el nodo actual como el fin de la palabra
    // `press plano`, marca el nodo `o` como el isEndOfWord
  }
  public search(word: string): boolean {
    let current = this.root // Apunta inicialmente al nodo raiz
    for (const char of word) {
      if (!current.children.has(char)) { // Verifica si existe un hijo en mapa de children correspondiente a ese caracter
        return false // Si no existe, devuelve false (la palabra no esta en el trie
      }
      current = current.children.get(char)! // Si existe, mueve el current al nodo hijo
    }
    return current.isEndOfWord // si 'current.isEndOfWord' es true, terminaste en un nodo valido y es el final de una palabra completa
  }
  public suggest(prefix: string): string[] {
    const suggestions: string[] = [] // crea un arreglo de strings vacios
    let current = this.root //Apuntamos al nodo raiz
    for (const char of prefix) { // itera sobre los caracteres del  prefijo
      if (!current.children.has(char)) { // verifica si el caracter actual tiene un nodo hijo en el mapa 'children'
        return suggestions // Si no existe, retorne el array vacio
      }
      current = current.children.get(char)! // si existe, mueve el current al nodo hijo (siguiente nodo)
    }
    const dfs = (node: TrieNode, path: string) => {
      if (node.isEndOfWord) { // si el nodo actual es el final de una palabra
        suggestions.push(path)  // agrega la palabra a 'suggestions'
        // asegura que las palabras completas que comienzan con el prefijo se guarden como sugerencias
      }
      for (const [char, child] of node.children) { // recorre todos los nodos hijos del nodo actual
        dfs(child, path + char) // para cada hijo
        // llama recursivamente al DFS
        // actualiza el 'path' agergando el caracter correspondiente (path + char)
        // Nos permite explorar cada posible continuacion de la palabra desde el prefijo
      }
    }
    dfs(current, prefix)
    return suggestions
  }
}

export const testingDataStructures = async (ctx: Context, word: string) => {
  const trie = new Trie()
  for (const exercises of validExercises) {
    trie.insert(exercises)
  }
  const inputUser = word
  if (trie.search(inputUser)) {
  } else {
    const sugerencias = trie.suggest(inputUser.split(" ")[0])
    if (sugerencias.length > 0) {
      await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.prompts.postMethod.outPut.exerciseSuggestions(sugerencias))
    }
    else {
      console.log(`ejericicio no encotrado`)
    }
  }
}

export class RegisterHandler {
  private static async handleRegistrationError(ctx: Context, errorType: keyof typeof botMessages.inputRequest.register.errors): Promise<void> {
    const errorMessage = botMessages.inputRequest.register.errors[errorType]
    await BotUtils.sendBotMessage(ctx, errorMessage)
    userStateUpdateStage(ctx, userStageSignUp.SIGN_UP_NICKNAME)
  }
  static async registerNickname(ctx: Context, userMessage: string): Promise<void> {
    await deleteUserMessage(ctx)
    const user = await UserQueryFetcher.userNicknamePasswordByNickname(userMessage.toLowerCase())
    if (user) {
      await this.handleRegistrationError(ctx, "invalidNickname")
      return
    }
    userStateUpdateNickname(ctx, userMessage, userStageSignUp.SIGN_UP_PASSWORD)
    await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.register.password)
  }
  static async registerPassword(ctx: Context, userMessage: string): Promise<void> {
    await deleteUserMessage(ctx)
    userStateUpdatePassword(ctx, userMessage, userStageSignUp.SIGN_UP_EMAIL)
    await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.register.email)
  }
  static async registerEmail(ctx: Context, bot: Telegraf, userMessage: string): Promise<void> {
    await deleteUserMessage(ctx)
    userStateUpdateEmail(ctx, userMessage)
    const password = userState[ctx.from!.id].password
    const passwordHash = await encrypt(password)
    await signUpVerificationController(ctx, bot, passwordHash)
  }
}


