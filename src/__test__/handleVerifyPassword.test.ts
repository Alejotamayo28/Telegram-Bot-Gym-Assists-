jest.mock(`bcryptjs`, () => ({
  compare: jest.fn()
}))

import { compare } from "bcryptjs";
import { verifyPassword } from "../bot/functions/login";

describe(`verifyPassword`, () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should return true when the password matches', async () => {
    // Simulamos que 'compare' retorna true, indicando que las contraseñas coinciden
    (compare as jest.Mock).mockResolvedValueOnce(true);
    const result = await verifyPassword('inputPassword', 'storedPassword');
    expect(result).toBe(true);
    expect(compare).toHaveBeenCalledWith('inputPassword', 'storedPassword');  // Verificamos que se haya llamado correctamente
  });

  it('should return false when the password does not match', async () => {
    // Simulamos que 'compare' retorna false, indicando que las contraseñas no coinciden
    (compare as jest.Mock).mockResolvedValueOnce(false);
    const result = await verifyPassword('wrongPassword', 'storedPassword');
    expect(result).toBe(false);
    expect(compare).toHaveBeenCalledWith('wrongPassword', 'storedPassword');  // Verificamos que se haya llamado correctamente
  });

  it('should throw an error if compare fails', async () => {
    (compare as jest.Mock).mockRejectedValueOnce(new Error('Comparison failed'));
    await expect(verifyPassword('inputPassword', 'storedPassword')).rejects.toThrow('Comparison failed');
  });
})
