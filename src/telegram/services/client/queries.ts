import { onSession } from "../../../database/dataAccessLayer";
import { ClientCredentials, ClientInfo } from "../../../model/client";


export class ClientQueries {
  static async handleProfileUser(userId: number): Promise<ClientInfo> {
    const response = await onSession(async (clientTransaction): Promise<ClientInfo> => {
      const response = await clientTransaction.query(
        `SELECT
c.nickname AS nickname,
c.password as password,
c.email AS email,
ci.name AS name,
ci.lastname AS lastname,
ci.age AS age,
ci.weight AS weight,
ci.height AS height
FROM
  client AS c 
INNER JOIN 
  clientInfo AS ci
ON c.id = ci.id
WHERE
c.id = $1`, [userId])
      return response.rows[0]
    })
    return response
  }
}
