import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { familyInterface } from "../../../model/family";
import { createButton} from "../utils";
import { ClientCredentialsAndFamily } from "../../../model/client";

const familiesBuildInline = {
  viewFamilies: 'ViewFamilies',
  viewFamiliesMember: 'ViewFamiliesMember'
}

interface familiesQueryData {
  viewFamilies: familyInterface[]
  viewFamiiles: ClientCredentialsAndFamily[]
}

export class BuildFamilyInline {
  constructor(method: keyof typeof familiesBuildInline) { }
  static optionsBuild: { [key in keyof typeof familiesBuildInline]: (options: {
    nickname?: string,
    name?: string,
    id?: number,
  }) => InlineKeyboardButton } = {
      viewFamiliesMember: function({ ...options }): InlineKeyboardButton {
        const button = createButton(`• ${options.nickname!.toUpperCase()}`, { action: `member_${options.nickname}` });
        return button
      },
      viewFamilies: function({ ...options }): InlineKeyboardButton {
        const button = createButton(`• Nombre: ${options.name!.toUpperCase()}`, { action: `family_${options.id}` });
        return button
      }
    }
  static createInlineKeyboard<T extends keyof familiesQueryData>(
    method: keyof typeof familiesBuildInline,
    data: familiesQueryData[T]) {
    const response = data.reduce((rows: InlineKeyboardButton[][], family: any, index: number) => {
      const button = this.optionsBuild[method]({ nickname: family.nickname, name: family.name, id: family.id })
      if (index % 2 === 0) {
        rows.push([button]);
      } else {
        rows[rows.length - 1].push(button);
      }
      return rows
    },
      [])
    return response
  }
}

