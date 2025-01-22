import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { CallbackData } from "../template/message";
import { Exercise } from "../userState";

export const createButton = (
  text: string,
  callbackData: CallbackData,
): InlineKeyboardButton => {
  return {
    text,
    callback_data: callbackData.action,
  };
};
export const lastButton = createButton(`• Continuar`, { action: `continuar` });

export const groupedButtonsFunction = (data: Exercise[]) => {
  const response = data.reduce(
    (rows: InlineKeyboardButton[][], exercise: Exercise, index: number) => {
      const button = createButton(`• Id: ${exercise.id} | ${exercise.name}`, {
        action: `${exercise.id}`,
      });
      if (index % 2 === 0) {
        rows.push([button]);
      } else {
        rows[rows.length - 1].push(button);
      }
      return rows;
    },
    [],
  );
  response.push([lastButton]);
  return response;
};
