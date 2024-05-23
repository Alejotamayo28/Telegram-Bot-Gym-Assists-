import { Request, Response, NextFunction } from "express";
import { generateToken, verifyToken } from "../jsonWebToken/jwtHelper";
import { JwtPayload } from "jsonwebtoken";
import { GENERAL_ERROR_HANDLER } from "../../errors";
import { getClientEmail } from "../../model/classes/clientManager";
import { pool } from "../../database/database";
import { ResponseHandler } from "../../model/classes/responseManager";
import { QueryResult } from "pg";
import { parseJsonConfigFileContent } from "typescript";
import { encrypt } from "./enCryptHelper";
import { compare } from "bcryptjs";

interface RequestExt extends Request {
  user?: string | JwtPayload,
  email?: string
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
      req.email = isUser.email
      next()
    }
  } catch (e) {
    res.status(404).send('SESSION_INVALIDED')
  }
}

export const userJWT = async ({ params, body }: Request, res: Response, user: any) => {
  let client
  try {
    client = await pool.connect()
    const { email } = body
    const { id } = params
    const response = await (getClientEmail(client, res, email))
    if (response!.rowCount === 0) {
      return res.status(400).json({
        ERROR: ResponseHandler.sendIdNotFound(res)
      })
    } else {
      const data: QueryResult = await client.query(`
      SELECT * FROM client WHERE id = $1`, [id])
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

interface RequestExt extends Request {
  user?: string | JwtPayload,
  email?: string
}


export const getClientDataTESTING = async (req: RequestExt, res: Response) => {
  try {
    const { email } = req
    await userJWT(req, res, email)

  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res)
  }
}

export const postClientTESTING = async ({ body }: Request, res: Response) => {
  let client
  try {
    client = await pool.connect()
    const { password, nickname } = body
    const passwordHash = await encrypt(password)
    const response: QueryResult = await client.query(`
    INSERT INTO client (nickname, password) VALUES ($1, $2) RETURNING id`, [nickname, passwordHash])
    const data: QueryResult = await client.query(`
    SELECT * FROM client WHERE id = $1`, [response.rows[0].id])
    res.status(200).json({
      Message: 'Everything worked',
      Data: data.rows,
    })
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res)
    console.error(e)
  }
}

export const loginUserTESTING = async ({ body }: Request, res: Response) => {
  let client
  try {
    client = await pool.connect()
    const { nickname, password } = body
    const responseNickname: QueryResult = await client.query(`
    SELECT * FROM client WHERE nickname = $1`, [nickname])
    if (responseNickname.rowCount === 0) {
      return res.status(404).json({
        MESSAGE: 'user not found',
      })
    }
    const checkPassword = await compare(password, responseNickname.rows[0].password)
    if (checkPassword) {
      const token = generateToken(nickname)
      return res.status(200).json({
        id: responseNickname.rows[0].id,
        Token: token,
      })
    }
    else {
      return res.status(401).json({ Message: 'INVALID_PARAMETERS' })
    }
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res)
    console.error(e)
  }
}













