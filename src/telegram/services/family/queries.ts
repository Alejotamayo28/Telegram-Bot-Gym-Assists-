import { onSession } from "../../../database/dataAccessLayer";
import { ClientCredentialsAndFamily } from "../../../model/client";
import { getUserFamily, UserFamilyResponse, userState } from "../../../userState";
import { FamilyResponse } from "./buildFamilyInline";

export class FamilyQueries {
  static async getFamiliesById(userId: number): Promise<UserFamilyResponse[]> {
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
WHERE c.id = $1`, [userId])
      return response.rows
    })
    return response
  }
  static async getFamiliesMemberById(userId: number): Promise<ClientCredentialsAndFamily[]> {
    const response = await onSession(async (clientTransaction) => {
      const { family_id } = getUserFamily(userId)
      console.log('family_id: ', family_id)
      const response = await clientTransaction.query(
        `SELECT
c.id,
c.nickname
FROM client c
JOIN family_member fm on c.id = fm.client_id
WHERE family_id = $1`, [family_id])
      return response.rows
    })
    return response
  }
}
