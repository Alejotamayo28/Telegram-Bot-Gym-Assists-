import { TelegramLoginHandler } from "../bot/stages/login";
import { ClientQueryFetcher } from "../database/queries/clientQueries";
import { BotUtils } from "../utils/botUtils";
import { BotStage, getUserCredentials, updateUserState } from "../userState";
import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { botMessages } from "../telegram/messages";
import { compare } from "bcryptjs";
import { mainMenuPage } from "../telegram/services/menus/mainMenuHandler/mainMenuController";

jest.mock("../database/queries/clientQueries", () => ({
  ClientQueryFetcher: {
    getClientCredentialsByNickname: jest.fn(), // Simula el método estático
  },
}));

jest.mock("../utils/botUtils", () => ({
  BotUtils: {
    sendBotMessage: jest.fn(),
  },
}));

jest.mock("../userState", () => ({
  deleteUserMessage: jest.fn(),
  updateUserState: jest.fn(),
  // Simuala el namespace con su repectivo Enum
  BotStage: {
    Auth: {
      PASSWORD: "LOGIN_PASSWORD",
    },
  },
  getUserCredentials: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

jest.mock(
  "../telegram/services/menus/mainMenuHandler/mainMenuController",
  () => ({
    mainMenuPage: jest.fn(),
  }),
);

//Simula el ctx de forma parcial
const mockCtx: Partial<Context<Update>> = {
  from: { id: 123, is_bot: false, first_name: "Test" },
  reply: jest.fn(),
};

const mockBot = {};

describe("Login", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("Should send an error message if the nickname does not exists", async () => {
    (
      ClientQueryFetcher.getClientCredentialsByNickname as jest.Mock
    ).mockResolvedValue(null);
    await TelegramLoginHandler.stageRegister.NICKNAME({
      ctx: mockCtx as Context<Update>,
      userMessage: "unknown",
    });
    expect(BotUtils.sendBotMessage).toHaveBeenCalledWith(
      mockCtx,
      botMessages.inputRequest.auth.errors.invalidNickname,
    );
    expect(updateUserState).not.toHaveBeenCalled();
  });

  it("Should request the password and update the user state if the nickname exists", async () => {
    (
      ClientQueryFetcher.getClientCredentialsByNickname as jest.Mock
    ).mockResolvedValue({
      nickname: "alice",
      password: "123",
    });
    await TelegramLoginHandler.stageRegister.NICKNAME({
      ctx: mockCtx as Context<Update>,
      userMessage: "alice",
    });
    expect(BotUtils.sendBotMessage).toHaveBeenCalledWith(
      mockCtx,
      botMessages.inputRequest.auth.password,
    );
    expect(updateUserState).toHaveBeenCalledWith(123, {
      stage: BotStage.Auth.PASSWORD,
      data: {
        credentials: {
          nickname: "alice",
          password: "123",
        },
      },
    });
  });

  it("should send the main menu if the password is correct", async () => {
    (getUserCredentials as jest.Mock).mockResolvedValue({ password: "123" });
    (compare as jest.Mock).mockResolvedValue(true);

    await TelegramLoginHandler.stageRegister.PASSWORD({
      ctx: mockCtx as Context<Update>,
      userMessage: "123",
      bot: mockBot as Telegraf<Context<Update>>,
    });

    expect(mainMenuPage).toHaveBeenCalledWith(mockCtx, mockBot);
  });

  it("should send an error message if the password is incorrect", async () => {
    (getUserCredentials as jest.Mock).mockReturnValue({ password: "1111" });
    (compare as jest.Mock).mockResolvedValue(false);

    await TelegramLoginHandler.stageRegister.PASSWORD({
      ctx: mockCtx as Context<Update>,
      userMessage: "wrongpassword",
      bot: mockBot as Telegraf<Context<Update>>,
    });

    expect(getUserCredentials).toHaveBeenCalledWith(mockCtx.from!.id);
    expect(compare).toHaveBeenCalledWith("wrongpassword", "1111");
    expect(BotUtils.sendBotMessage).toHaveBeenCalledWith(
      mockCtx,
      botMessages.inputRequest.auth.errors.invalidPassword,
    );
    expect(mainMenuPage).not.toHaveBeenCalled();
  });
});
