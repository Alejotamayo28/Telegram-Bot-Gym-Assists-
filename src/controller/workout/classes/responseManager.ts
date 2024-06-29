import { Response } from "express";

export class ResponseWorkout {
  static workoutInsert(res: Response) {
    res.status(202).json({
      success: true,
      message: "Workout Inserted Succesfully"
    })
  }
  static workoutData(res: Response, data: any, id: any) {
    res.status(202).json({
      id: id,
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
  static workoutUpdate(res: Response) {
    res.status(202).json({
      success: true,
      message: "Workout Updated Succesfully",
    })
  }
  static workoutDelete(res: Response) {
    res.status(202).json({
      success: true,
      message: "Workout Deleted Succesfully"
    })
  }
  static workoutAlreadyExists(res: Response) {
    res.status(401).json({
      success: false,
      message: "Workout Already Exists"
    })
  }
  static doesNotMatch(res: Response) {
    res.status(401).json({
      success: false,
      message: "The number of reps does not match the number of series"
    })
  }
}
