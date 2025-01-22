import { Context } from "telegraf";
import { deleteLastMessage } from "../telegram/services/utils";
import { mockContext } from "../__helpers__";

describe(`deleteLastMessage`, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it(`should delete the previous message`, async () => {
    await deleteLastMessage(mockContext);
    expect(mockContext.deleteMessage).toHaveBeenCalledWith(9);
  });
  it(`should not delete if there is no previous message`, async () => {
    const mockWithoutMessage = {
      ...mockContext,
      message: undefined,
    } as unknown as Context;
    await deleteLastMessage(mockWithoutMessage);
    expect(mockContext.deleteMessage).not.toHaveBeenCalled();
  });
});
