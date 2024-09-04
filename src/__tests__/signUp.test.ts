//Creando prueba integracion login de un usuario
import { before, lt } from "lodash";
import { Pool } from "pg";
import { handleSignUpEmail, handleSignUpNickname, handleSignUpPassword } from "../telegram/services/singUp/functions";
import { Message } from "telegraf/typings/core/types/typegram";
import { Context } from "telegraf";

const EnvConfigTest = {
  env: process.env.NODE_ENV,
  testPortPort: process.env.TEST_PORT_PORT,
  testUser: process.env.TEST_USER,
  testPassword: process.env.TEST_PASSWORD,
  testHost: process.env.TEST_HOST,
  testName: process.env.TEST_NAME,
  testPort: process.env.TEST_PORT
}

const user = encodeURIComponent(EnvConfigTest.testUser ?? "");

const password = encodeURIComponent(EnvConfigTest.testPassword ?? "");

const URI = `postgres://${user}:${password}@${EnvConfigTest.testHost}:${EnvConfigTest.testPort}/${EnvConfigTest.testName}`

const poolTesting = new Pool({
  connectionString: URI
})

describe("Sign-Up Integration Test", () => {
  beforeAll(async () => {
    await poolTesting.query(`DELETE FROM test_client WHERE nickname = 'newuser`)
  })
  afterAll(async () => {
    await poolTesting.query(`DELETE FROM test_client WHERE nickname = 'newuser`)
    await poolTesting.end()
  })

  it('should succesfully sign up a new user', async () => {
    const ctx = {
      message: { text: '' },
      from: { id: 1234 },
      reply: jest.fn(),
      deleteMessage: jest.fn(),
    } as unknown as Context;

    jest.mock('./helpers',  () => ({
      deleteLastMessage: jest.fn(),
      findUserByNickname: jest.fn().mockResolvedValue(null),
      handleNicknameNotAvailable: jest.fn(),
    }));

    (ctx.message as Message.TextMessage).text = `newuser`
    await handleSignUpNickname(ctx as any);
    expect(ctx.reply).toHaveBeenCalledWith(`¡Nickname guardado! Ahora, por favor ingresa tu contraseña.`);

    (ctx.message as Message.TextMessage).text = 'securepassword';
    await handleSignUpPassword(ctx as any);
    expect(ctx.reply).toHaveBeenCalledWith('¡Contraseña guardada! Ahora, por favor ingresa tu email.');

    (ctx.message as Message.TextMessage).text = 'newuser@example.com';
    await handleSignUpEmail(ctx);
    expect(ctx.reply).toHaveBeenCalledWith('¡Registro completo!');
  })
})
