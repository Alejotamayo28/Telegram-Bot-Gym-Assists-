import { Context, Telegraf } from "telegraf";
import { exercisePostFlow } from "../../workoutPostService/exercisePostController";
import { fetchExerciseController } from "../../workoutFetchService/exerciseFetchController";
import { WorkoutFetchHandler } from "../../workoutFetchService/ExerciseFetchServiceHandler";
import { FamilyFlow } from "../../familyManagementService/familyController";
import { ProfileOptionsInlineKeyboard } from "../../ProfileManagementService/keyboards/ProfileInlineKeyboard";
import { regexPattern, setUpKeyboardIteration } from "../../utils";
import { exerciseUpdateFlow } from "../../workoutUpdateService/exerciseUpdateFlow";
import { exerciseDeleteFlow } from "../../workoutDeleteService/exerciseDeleteFlow";
import { ProfileMenuModel } from "../../../../model/profileMenuModel";

export class MainMenuCallbackHandler {
  async handlePostExerciseMenu(ctx: Context, bot: Telegraf) {
    return await exercisePostFlow(ctx, bot);
  }
  async handleUpdateExerciseMenu(ctx: Context, bot: Telegraf) {
    return await exerciseUpdateFlow(ctx, bot);
  }
  async hanleFetchExerciseMenu(ctx: Context, bot: Telegraf) {
    return await fetchExerciseController(ctx, bot);
  }
  async handleFetchExerciseRecord(ctx: Context, bot: Telegraf) {
    return await WorkoutFetchHandler.getAllTimeExercise(ctx, bot);
  }
  async handleDeleteExercise(ctx: Context, bot: Telegraf) {
    return await exerciseDeleteFlow(ctx, bot);
  }
  async handleRoutineMenu() {
    console.log("not implemeted yet");
  }
  async handlerFamiyMenu(ctx: Context, bot: Telegraf) {
    return await FamilyFlow(ctx, bot);
  }
  async handleProfileMenu(ctx: Context, bot: Telegraf) {
    const response = new ProfileOptionsInlineKeyboard(ctx);
    return await setUpKeyboardIteration(ctx, response, bot, {
      callbackPattern: regexPattern(ProfileMenuModel.Callback),
    });
  }
}
