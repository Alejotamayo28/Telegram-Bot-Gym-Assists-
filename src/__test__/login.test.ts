jest.mock(`../bot/functions/index`, () => ({
  deleteLastMessage: jest.fn()
}))

jest.mock(`../userState`, () => ({
  updateUserState: jest.fn(),
  UserStateManager: {
    updateData: jest.fn()
  },
  userSession: {
    setPassword: jest.fn()
  }
}))

import { mockContext } from "../__helpers__";
import { deleteLastMessage } from "../bot/functions/index";
import * as loginModule from "../bot/functions/login";
import { updateUserState, userSession, UserStateManager } from "../userState";

jest.spyOn(loginModule, `findUserByNickname`)
jest.spyOn(loginModule, `handleUserNotFound`)

describe(`HANDLE LOGIN`, () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it(`should handle a valid user and prompt for password`, async () => {
    (loginModule.findUserByNickname as jest.Mock).mockResolvedValueOnce(mockContext)

    await loginModule.handleLoginNickname(mockContext)

    expect(deleteLastMessage).toHaveBeenCalledWith(mockContext)
    expect(loginModule.findUserByNickname).toHaveBeenCalledWith('Test message')
    expect(userSession.setPassword).toHaveBeenCalledWith(undefined)
    expect(updateUserState).toHaveBeenCalledWith(mockContext.from!.id,
      { stage: `login_password` })
    expect(mockContext.deleteMessage).toHaveBeenCalledWith()
    expect(mockContext.reply).toHaveBeenCalledWith(
      'Por favor, proporciona tu contraseña')
  })
  it(`should handle user not found`, async () => {

    (loginModule.findUserByNickname as jest.Mock).mockResolvedValueOnce(null)

    await loginModule.handleLoginNickname(mockContext)
    expect(deleteLastMessage).toHaveBeenCalledWith(mockContext);
    expect(loginModule.findUserByNickname).toHaveBeenCalledWith('Test message');
    expect(loginModule.handleUserNotFound).toHaveBeenCalledWith(mockContext);
    expect(mockContext.deleteMessage).toHaveBeenCalled();
    expect(mockContext.reply).toHaveBeenCalledWith(
      `Usuario no encontrado, vuelve a escribir tu nickname: .`);
    expect(updateUserState).toHaveBeenCalledWith(mockContext.from!.id,
      { stage: `login_nickname` })
  })
})


