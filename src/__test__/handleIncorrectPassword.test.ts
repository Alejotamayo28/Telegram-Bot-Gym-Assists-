import { updateUserState } from "../userState";
import { mockContext } from "../__helpers__";
import { handleIncorrectPassword } from "../telegram/services/clientLoginService/functions";

jest.mock("../userState", () => ({
  updateUserState: jest.fn(),
}));

describe(`handlePasswordIncorrect`, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it(`should reply with the correct message and update user state`, async () => {
    await handleIncorrectPassword(mockContext);
    expect(mockContext.reply).toHaveBeenCalledWith(
      `Contraseña incorrecta, vuelve a escribirla!`,
    );
    expect(updateUserState).toHaveBeenCalledWith(mockContext.from!.id, {
      stage: "login_password",
    });
  });
});
