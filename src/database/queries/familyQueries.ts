import {
  getUserFamily,
  UserCredentials,
  UserFamilyResponse,
} from "../../userState";
import { onSession } from "../dataAccessLayer";

export class FamilyQueryFetch {
  static async getFamiliesByUserId(
    userId: number,
  ): Promise<UserFamilyResponse[]> {
    const response = await onSession(async (clientTransaction) => {
      const response = await clientTransaction.query(
        `SELECT 
          c.id,
          c.nickname,
          f.family_id,
          f.family_name,
          fm.role,
          fm.joined_at
          FROM "client" c
          JOIN family_member fm on c.id = fm.client_id
          JOIN family f on fm.family_id = f.family_id
          WHERE c.id = $1`,
        [userId],
      );
      return response.rows;
    });
    return response;
  }
  static async getFamilyMemberByFamliyId(
    userId: number,
  ): Promise<UserCredentials[]> {
    const response = await onSession(async (clientTransaction) => {
      const { family_id } = getUserFamily(userId);
      console.log("family_id: ", family_id);
      const response = await clientTransaction.query(
        `SELECT
          c.id,
          c.nickname
          FROM client c
          JOIN family_member fm on c.id = fm.client_id
          WHERE family_id = $1`,
        [family_id],
      );
      return response.rows;
    });
    return response;
  }
}
