import { onSession } from "../../../database/dataAccessLayer";
import { UserData } from "../../../model/client";

export class UserQueryFetcher {
  static async userNicknamePasswordByNickname(nickname: string): Promise<UserData> {
    const response = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(`SELECT nickname, password FROM client WHERE nickname = $1`, [nickname])
    })
    return response.rows[0]
  }
}
