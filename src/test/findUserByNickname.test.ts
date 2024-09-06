import { findUserByNickname } from "../bot/functions/login";
import { pool } from "../database/database";

jest.mock("../database/database", () => ({
  pool: {
    query: jest.fn()
  }
}))
it("should return the user when found", async () => {
  const mockQueryResult = {
    rowCount: 1,
    rows: [{ nickname: "testuser", password: "hashedpassword" }]
  };
  (pool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult)
  const user = await findUserByNickname('testuser');
  expect(user).toEqual({ nickname: 'testuser', password: 'hashedpassword' });
  expect(pool.query).toHaveBeenCalledWith(
    'SELECT nickname, password FROM client WHERE nickname = $1',
    ['testuser']
  );
})
it('should return null when user is not found', async () => {
  // Mockear respuesta de la base de datos con ningún usuario encontrado
  const mockQueryResult = {
    rowCount: 0,
    rows: [],
  };
  (pool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult);

  // Llamar a la función
  const user = await findUserByNickname('nonexistentuser');

  // Verificar el resultado
  expect(user).toBeNull();
  expect(pool.query).toHaveBeenCalledWith(
    'SELECT nickname, password FROM client WHERE nickname = $1',
    ['nonexistentuser']
  );
});

it('should throw an error if the query fails', async () => {
  // Mockear un error en la consulta
  (pool.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

  // Verificar que la función arroje un error
  await expect(findUserByNickname('testuser')).rejects.toThrow('Database error');
});
