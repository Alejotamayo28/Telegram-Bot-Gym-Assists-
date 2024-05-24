import { Request, Response, NextFunction } from "express";
import {  verifyToken } from "../jsonWebToken/jwtHelper";
import { JwtPayload } from "jsonwebtoken";
import { GENERAL_ERROR_HANDLER } from "../../errors";
import { getClientNickname } from "../../model/classes/clientManager";
import { pool } from "../../database/database";
import { ResponseHandler } from "../../model/classes/responseManager";
import { QueryResult } from "pg";

interface RequestExt extends Request {
  user?: string | JwtPayload,
  nickname?: string
}

export const checkJwt = (req: RequestExt, res: Response, next: NextFunction) => {
  try {
    const jwtByUser = req.headers.authorization || ''
    const jwt = jwtByUser.split(" ").pop()
    const isUser = verifyToken(`${jwt}`)

    if (!isUser || typeof isUser === 'string') {
      res.status(400).json('NO_TIENES_UN_JWT_VALIDO')
    } else {
      req.user = isUser
      req.nickname = isUser.nickname
      next()
    }
  } catch (e) {
    res.status(404).send('SESSION_INVALIDED')
  }
}

export const userJWT = async ({ body }: Request, res: Response, user: any) => {
  let client
  try {
    client = await pool.connect()
    const { nickname } = body
    const response = await (getClientNickname(client, res, nickname))
    if (response!.rowCount === 0) {
      return res.status(400).json({
        ERROR: ResponseHandler.sendIdNotFound(res)
      })
    } else {
      const data: QueryResult = await client.query(`
      SELECT * FROM client WHERE nickname = $1`, [nickname])
      res.status(200).json({
        JWT: user,
        userJWT: data.rows
      })
    }
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res)
    console.error(e)
  }
}

export const getClientDataTESTING = async (req: RequestExt, res: Response) => {
  try {
    const { nickname } = req
    await userJWT(req, res, nickname)
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res)
  }
}














