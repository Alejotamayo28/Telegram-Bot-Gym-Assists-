import { QueryResult } from "pg";
import { Context } from "telegraf";
import { Message } from "telegraf/typings/core/types/typegram";

export const mockContext = {
  from: {
    id: 123,
    is_bot: false,
    first_name: `newuser`,
  },
  message: {
    text: "Test message",
    message_id: 10,
  } as Message.TextMessage,
  reply: jest.fn(),
  deleteMessage: jest.fn(),
} as unknown as Context;

export const mockQueryResult: Partial<QueryResult> = {
  rowCount: 1,
  rows: [
    {
      nickname: `testuser`,
      password: `hashedpassword`,
    },
  ],
};

export const mockEmptyQueryResult: Partial<QueryResult> = {
  rowCount: 0,
  rows: [],
};
