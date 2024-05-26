import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../jsonWebToken/jwtHelper";
import { JwtPayload } from "jsonwebtoken";
import { GENERAL_ERROR_HANDLER } from "../../errors";
import { pool } from "../../database/database";
import { ResponseClient } from "../../controller/client/classes/responseManager";
import { verifyNickname } from "../../queries/clientQueries";

export interface RequestExt extends Request {
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
    const response = await verifyNickname(client, nickname)
    if (response!.rowCount === 0) {
      return res.status(400).json({
        ERROR: ResponseClient.clientNotFound(res)
      })
    } else {
      res.status(200).json({
        JWT: user,
        userJWT: response.rows
      })
    }
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res)
    console.error(e)
  }
}









