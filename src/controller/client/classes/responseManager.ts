import { Response } from 'express';


export class ResponseClient {
  static login(res: Response, id: number, token: string): void {
    res.status(202).json({
      success: true,
      message: "Login Succesfully Completed", data: {
        id,
        token
      }
    })
  }
  static SingUp(res: Response): void {
    res.status(202).json({
      success: true,
      message: "SingUp Succesfully Completed",
    })
  }
  static passwordInvalid(res: Response): void {
    res.status(404).json({
      succes: false,
      message: "Password Invalid"
    })
  }
  static passwordIncorrect(res: Response): void {
    res.status(404).json({
      success: false,
      message: "Incorrect Password"
    })
  }
  static nicknameIncorrect(res: Response): void {
    res.status(400).json({
      succes: false,
      message: "Incorrect Nickname"
    })
  }
  static clientNotFound(res: Response): void {
    res.status(404).json({
      success: false,
      message: "Client not found"
    })
  }
  static clientData(res: Response, data: any): void {
    res.status(202).json({
      success: true,
      message: "Client Data Found",
      Data: data
    })
  }
  static clientUpdated(res: Response) {
    res.status(202).json({
      success: true,
      message: "Client Updated Succesfully"
    })
  }
  static clientDeleted(res: Response, id: any) {
    res.status(202).json({
      success: true,
      message: "Client Deleted Succesfully",
      id: id
    })
  }
  static clientNicknameUsed(res: Response) {
    res.status(402).json({
      success: false,
      message: "Nickname Already Used"
    })

  }
}
