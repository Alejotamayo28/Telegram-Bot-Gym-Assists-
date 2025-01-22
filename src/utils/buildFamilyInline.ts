import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import {
  UserFamilyMemberResponse,
  UserFamilyResponse,
} from "../userState";
import { createButton } from "./buildExerciseInline";

//Validate methods
const familyMethod = {
  viewFamilies: "ViewFamilies",
  viewFamiliesMember: "ViewFamiliesMember",
};

//Validate QueryResultReponses inside a interface
export interface FamilyResponse {
  userFamilyResponse: UserFamilyResponse[];
  userFamilyMemberResponse: UserFamilyMemberResponse[];
}

interface BuildOptions {
  nickname: string;
  family_name: string;
  family_id: number;
}

/*
Somehow it work's, just creat InlineKeybaord, got two methods.
-1. View the familes the use belongs to
-2. View the members of a selected family
*/

export class BuildFamilyInline {
  static optionsBuild: {
    [key in keyof typeof familyMethod]: (
      options: Partial<BuildOptions>,
    ) => InlineKeyboardButton;
  } = {
      viewFamilies: function ({ ...options }): InlineKeyboardButton {
        const button = createButton(`• Nombre: ${options.family_name!}`, {
          action: `family_${options.family_id}`,
        });
        return button;
      },
      viewFamiliesMember: function ({ ...options }): InlineKeyboardButton {
        const button = createButton(`• ${options.nickname!.toUpperCase()}`, {
          action: `member_${options.nickname}`,
        });
        return button;
      },
    };
  static createInlineKeyboard<T>(method: keyof typeof familyMethod, data: T[]) {
    const response = data.reduce(
      (rows: InlineKeyboardButton[][], family: any, index: number) => {
        const button = this.optionsBuild[method]({
          nickname: family.nickname,
          family_name: family.family_name,
          family_id: family.family_id,
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
    return response;
  }
}
