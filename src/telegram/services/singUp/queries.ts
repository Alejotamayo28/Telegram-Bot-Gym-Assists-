import { PoolClient } from "pg";
import { clientData } from "../../../model/client";
import { Context } from "telegraf";

export const insertClientQuery = async (ctx: Context, clientData: clientData, passwordHash: string, client: PoolClient) => {
  await client.query(
    `INSERT INTO client (id, nickname, password, email) VALUES ($1, $2, $3, $4)`,
    [ctx.from!.id, clientData.nickname, passwordHash, clientData.email]
  );
}
