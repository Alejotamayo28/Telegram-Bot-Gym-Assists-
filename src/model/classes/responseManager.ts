import { Response } from 'express';

export class ResponseHandler {
  static sendSuccessMessage(res: Response, data?: Object): void {
    res.status(200).json({
      success: true,
      message: "Task successfully done",
      data: data
    });
  }
  static sendExerciseExists(res: Response): void {
    res.status(409).json({
      success: false,
      message: "Exercise already exists",
      data: null
    });
  }
  static sendUserNotFound(res: Response): void {
    res.status(404).json({
      success: false,
      message: "ID not found",
      data: null
    });
  }
  static sendIdFound(res: Response, data: any): void {
    res.status(202).json({
      success: true,
      message: "ID found",
      data: data
    });
  }
  static passwordIncorrect(res: Response): void {
    res.status(404).json({
      success: false,
      message: "Incorrect Password",
      data: null,
    })
  }
}
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
  static passwordIncorrect(res: Response): void {
    res.status(404).json({
      success: false,
      message: "Incorrect Password"
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
}
