import { PoolClient } from "pg";
import { Context } from "telegraf";
import { PartialUserProfile } from "../../../model/client";

export const insertClientQuery = async (ctx: Context, clientData: PartialUserProfile, passwordHash: string, client: PoolClient) => {
  await client.query(
    `INSERT INTO client (id, nickname, password, email) VALUES ($1, $2, $3, $4)`,
    [ctx.from!.id, clientData.nickname, passwordHash, clientData.email]
  );
}
