import { onSession } from "../../../database/dataAccessLayer";
import { ClientCredentialsAndFamily } from "../../../model/client";
import { userState } from "../../../userState";

export class FamilyQueries {
  static async getFamiliesById(userId: number): Promise<ClientCredentialsAndFamily[]> {
    const response = await onSession(async (clientTransaction) => {
      const response = await clientTransaction.query(
        `SELECT
  f.id,
  f.name
FROM 
  family f
JOIN 
  client c 
ON 
  c.id = f.user_1
WHERE 
  c.id = $1;
      `, [userId])
      return response.rows
    })
    return response
  }
  static async getFamiliesMemberById(userId: number): Promise<ClientCredentialsAndFamily[]> {
    const response = await onSession(async (clientTransaction) => {
      const { familyId } = userState[userId]
      const response = await clientTransaction.query(
        `SELECT 
    c.nickname,
    c.id
FROM 
    family f
JOIN 
    client c
ON 
    c.id IN (f.user_1, f.user_2, f.user_3, f.user_4, f.user_5)
WHERE 
    f.id = $1;`, [familyId])
      return response.rows
    })
    return response
  }
}
