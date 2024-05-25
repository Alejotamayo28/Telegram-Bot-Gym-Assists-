import { Response } from "express";

export class ResponseWorkout {
  static workoutInsert(res: Response) {
    res.status(202).json({
      success: true,
      message: "Workout Inserted Succesfully"
    })
  }
  static workoutData(res: Response, data: any) {
    res.status(202).json({
      success: true,
      message: "Workout Data",
      data: data
    })
  }
  static workoutDataNotFound(res: Response) {
    res.status(404).json({
      success: false,
      message: "Workout Data not Found"
    })
  }
  static workoutUpdate(res: Response, id: any, day: any) {
    res.status(202).json({
      success: true,
      message: "Workout Updated Succesfully",
      id: id,
      day: day,
    })
  }
  static workoutDelete(res: Response, day: any, name: any) {
    res.status(202).json({
      success: true,
      message: "Workout Deleted Succesfully",
      day: day,
      name: name
    })
  }
  static workoutAlreadyExists(res: Response) {
    res.status(401).json({
      success: false,
      message: "Workout Already Exists"
    })
  }
}
