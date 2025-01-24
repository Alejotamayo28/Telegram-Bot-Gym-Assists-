import { Context, Telegraf } from "telegraf";
import { TelegramSignUpHandler } from "../bot/stages/signUp";
import { ClientQueryFetcher } from "../database/queries/clientQueries";
import { BotUtils } from "../utils/botUtils";
import { Update } from "telegraf/typings/core/types/typegram";
import { botMessages } from "../telegram/messages";
import {
  BotStage,
  deleteUserMessage,
  getUserCredentials,
  updateUserState,
} from "../userState";
import { encrypt } from "../middlewares/jsonWebToken/enCryptHelper";
import { signUpVerificationController } from "../telegram/services/clientSignUpService/clientRegisterController";

jest.mock(
  "../telegram/services/clientSignUpService/clientRegisterController",
  () => ({
    signUpVerificationController: jest.fn(),
  }),
);

jest.mock("../middlewares/jsonWebToken/enCryptHelper", () => ({
  encrypt: jest.fn(),
}));

jest.mock("../userState", () => ({
  getUserCredentials: jest.fn(),
  updateUserState: jest.fn(),
  deleteUserMessage: jest.fn(),
  BotStage: {
    Register: {
      PASSWORD: "SIGN_UP_PASSWORD",
      EMAIL: "SIGN_UP_EMAIL",
    },
  },
}));

jest.mock("../database/queries/clientQueries", () => ({
  ClientQueryFetcher: {
    getClientCredentialsByNickname: jest.fn(),
  },
}));

jest.mock("../utils/botUtils", () => ({
  BotUtils: {
    sendBotMessage: jest.fn(),
  },
}));

const mockCtx: Partial<Context<Update>> = {
  from: { id: 123, is_bot: false, first_name: "Test" },
  reply: jest.fn(),
};

const mockBot = {};

describe("SignUp", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("Should send an error message if the nickname is already use", async () => {
    (deleteUserMessage as jest.Mock).mockResolvedValue(null);
    (
      ClientQueryFetcher.getClientCredentialsByNickname as jest.Mock
    ).mockResolvedValue({ nickname: "Alice" });
    (BotUtils.sendBotMessage as jest.Mock).mockResolvedValue(null);
    await TelegramSignUpHandler.stageRegister.NICKNAME({
      ctx: mockCtx as Context<Update>,
      userMessage: "Alice",
    });
    expect(deleteUserMessage).toHaveBeenCalledWith(mockCtx as Context<Update>);
    expect(
      ClientQueryFetcher.getClientCredentialsByNickname,
    ).toHaveBeenCalledWith("Alice".toLowerCase());
    expect(BotUtils.sendBotMessage).toHaveBeenCalledWith(
      mockCtx as Context<Update>,
      botMessages.inputRequest.auth.errors.invalidNickname,
    );
    expect(updateUserState).not.toHaveBeenCalled();
  });
  it("Should request the password if the nickname is not already use", async () => {
    (deleteUserMessage as jest.Mock).mockResolvedValue(null);
    (
      ClientQueryFetcher.getClientCredentialsByNickname as jest.Mock
    ).mockResolvedValue(null);
    (BotUtils.sendBotMessage as jest.Mock).mockResolvedValue(null);
    (updateUserState as jest.Mock).mockResolvedValue(null);

    await TelegramSignUpHandler.stageRegister.NICKNAME({
      ctx: mockCtx as Context<Update>,
      userMessage: "Alice",
    });

    expect(deleteUserMessage).toHaveBeenCalledWith(mockCtx as Context<Update>);
    expect(
      ClientQueryFetcher.getClientCredentialsByNickname,
    ).toHaveBeenCalledWith("Alice".toLowerCase());
    expect(BotUtils.sendBotMessage).toHaveBeenCalledWith(
      mockCtx as Context<Update>,
      botMessages.inputRequest.register.password,
    );
    expect(updateUserState).toHaveBeenCalledWith(mockCtx.from!.id, {
      stage: BotStage.Register.PASSWORD,
      data: {
        credentials: {
          nickname: "Alice",
        },
      },
    });
  });
  it("Should request the email when the user enter the password", async () => {
    (deleteUserMessage as jest.Mock).mockResolvedValue(null);
    (BotUtils.sendBotMessage as jest.Mock).mockResolvedValue(null);
    (updateUserState as jest.Mock).mockResolvedValue(null);

    await TelegramSignUpHandler.stageRegister.PASSWORD({
      ctx: mockCtx as Context<Update>,
      userMessage: "password",
    });

    expect(deleteUserMessage).toHaveBeenCalledWith(mockCtx as Context<Update>);
    expect(BotUtils.sendBotMessage).toHaveBeenCalledWith(
      mockCtx as Context<Update>,
      botMessages.inputRequest.register.email,
    );
    expect(updateUserState).toHaveBeenCalledWith(mockCtx.from!.id, {
      stage: BotStage.Register.EMAIL,
      data: {
        credentials: {
          password: "password",
        },
      },
    });
  });
  it("Should display the main menu page when the user enter the email", async () => {
    (deleteUserMessage as jest.Mock).mockResolvedValue(null);
    (updateUserState as jest.Mock).mockResolvedValue(null);
    (getUserCredentials as jest.Mock).mockReturnValue({ password: "password" });
    (encrypt as jest.Mock).mockResolvedValue("passwordHash");
    (signUpVerificationController as jest.Mock).mockResolvedValue(null);

    await TelegramSignUpHandler.stageRegister.EMAIL({
      ctx: mockCtx as Context<Update>,
      userMessage: "email",
      bot: mockBot as Telegraf<Context<Update>>,
    });

    expect(deleteUserMessage).toHaveBeenCalledWith(mockCtx as Context<Update>);
    expect(updateUserState).toHaveBeenCalledWith(mockCtx.from!.id, {
      data: {
        credentials: {
          email: "email",
        },
      },
    });
    expect(getUserCredentials).toHaveBeenCalledWith(mockCtx.from!.id);
    expect(encrypt).toHaveBeenCalledWith("password");
    expect(signUpVerificationController).toHaveBeenCalledWith(
      mockCtx as Context<Update>,
      mockBot as Telegraf<Context<Update>>,
      "passwordHash",
    );
  });
});
