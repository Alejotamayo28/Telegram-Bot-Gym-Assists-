import { UserCredentials, UserProfile } from "../../userState";
import { onSession, onTransaction } from "../dataAccessLayer";

export class ClientQueryFetcher {
  static async getClientCredentialsByNickname(
    nickname: string,
  ): Promise<UserCredentials> {
    const response = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(
        `SELECT nickname, password FROM client WHERE nickname = $1`,
        [nickname],
      );
    });
    return response.rows[0];
  }
  static async getUserProfileById(userId: number): Promise<UserProfile> {
    const response = await onSession(
      async (clientTransaction): Promise<UserProfile> => {
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
          c.id = $1`,
          [userId],
        );
        return response.rows[0];
      },
    );
    return response;
  }
}

export class ClientQueryInsert {
  static async insertClientCredentials(
    userId: number,
    clientData: Partial<UserCredentials>,
    passwordHash: string,
  ) {
    const { nickname, email } = clientData;
    await onTransaction(async (clientTransaction): Promise<void> => {
      await clientTransaction.query(
        `INSERT INTO client (id, nickname, 
        password, email) VALUES($1, $2, $3, $4)`,
        [userId, nickname, passwordHash, email],
      );
    });
  }
}
