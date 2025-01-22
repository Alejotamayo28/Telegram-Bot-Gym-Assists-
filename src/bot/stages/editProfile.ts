import { Context, Telegraf } from "telegraf";
import { getUserEditProfile } from "../../userState";
import { onTransaction } from "../../database/dataAccessLayer";
import { botMessages } from "../../telegram/messages";
import { mainMenuPage } from "../../telegram/services/menus/mainMenuHandler/mainMenuController";
import { deleteLastMessage } from "../../telegram/services/utils";

type ClientField = "nickname" | "password" | "email";
type ClientInfoField = "name" | "lastname" | "age" | "weight" | "height";
type EditableField = ClientField | ClientInfoField;

interface ProfileEditConfig {
  table: "client" | "clientinfo";
  requiresNumericValue: boolean;
}
const FIELD_CONFIG: Record<EditableField, ProfileEditConfig> = {
  nickname: { table: "client", requiresNumericValue: false },
  password: { table: "client", requiresNumericValue: false },
  email: { table: "client", requiresNumericValue: false },
  name: { table: "clientinfo", requiresNumericValue: false },
  lastname: { table: "clientinfo", requiresNumericValue: false },
  age: { table: "clientinfo", requiresNumericValue: true },
  weight: { table: "clientinfo", requiresNumericValue: true },
  height: { table: "clientinfo", requiresNumericValue: true },
};

export async function handleProfileEdit(
  ctx: Context,
  bot: Telegraf,
  userMessage: string,
) {
  try {
    await deleteLastMessage(ctx);
    const { action } = getUserEditProfile(ctx.from!.id);
    const field = action.toLowerCase() as EditableField;
    const config = FIELD_CONFIG[field];
    if (!config) throw new Error(`Invalid field ${field}`);
    const value = config.requiresNumericValue
      ? Number(userMessage)
      : userMessage;
    await onTransaction(async (clientTransaction) => {
      return await clientTransaction.query(
        `UPDATE ${config.table} SET ${field} = $1 WHERE id = $2`,
        [value, ctx.from!.id],
      );
    });
    return await mainMenuPage(
      ctx,
      bot,
      botMessages.inputRequest.prompts.editProfile.editSuccesfull,
    );
  } catch (error) {
    console.error("Error: ", error);
  }
}
