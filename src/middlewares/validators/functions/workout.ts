import { workoutDay } from "../enums/workout";

export const verifyWorkoutDay = (day: string) => {
  if (Object.values(workoutDay).includes(day as workoutDay)) return true;
  throw new Error("Type the correct day");
};
