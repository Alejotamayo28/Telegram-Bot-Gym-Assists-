import { findUserByNickname, handleUserNotFound } from "../bot/functions/login";
import { pool } from "../database/database";
import { updateUserState } from "../userState";
import { mockContext, mockEmptyQueryResult, mockQueryResult } from "../__helpers__";

jest.mock("../database/database", () => ({
  pool: {
    query: jest.fn()
  }
}))
jest.mock('../userState', () => ({
  updateUserState: jest.fn()
}))

describe('findUserByNickname', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it("should return the user when found", async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult)
    const user = await findUserByNickname('testuser');
    expect(user).toEqual({ nickname: 'testuser', password: 'hashedpassword' });
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT nickname, password FROM client WHERE nickname = $1',
      ['testuser']
    );
  })
  it('should return null when user is not found', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce(mockEmptyQueryResult);
    const user = await findUserByNickname('nonexistentuser');
    expect(user).toBeNull();
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT nickname, password FROM client WHERE nickname = $1',
      ['nonexistentuser']
    );
  });
  it(`should reply with the correct message and update user state`, async () => {
    await handleUserNotFound(mockContext)
    expect(mockContext.reply).toHaveBeenCalledWith(
      `Usuario no encontrado, vuelve a escribir tu nickname: .`)
    expect(updateUserState).toHaveBeenCalledWith(123, { stage: `login_nickname` })
  })
  it('should throw an error if the query fails', async () => {
    (pool.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
    await expect(findUserByNickname('testuser')).rejects.toThrow('Database error');
  })
});
