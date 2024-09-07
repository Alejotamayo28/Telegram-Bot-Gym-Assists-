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
    (compare as jest.Mock).mockResolvedValueOnce(true);
    const result = await verifyPassword('inputPassword', 'storedPassword');
    expect(result).toBe(true);
    expect(compare).toHaveBeenCalledWith('inputPassword', 'storedPassword');
  });

  it('should return false when the password does not match', async () => {
    (compare as jest.Mock).mockResolvedValueOnce(false);
    const result = await verifyPassword('wrongPassword', 'storedPassword');
    expect(result).toBe(false);
    expect(compare).toHaveBeenCalledWith('wrongPassword', 'storedPassword');  
  });

  it('should throw an error if compare fails', async () => {
    (compare as jest.Mock).mockRejectedValueOnce(new Error('Comparison failed'));
    await expect(verifyPassword('inputPassword', 'storedPassword')).rejects.toThrow('Comparison failed');
  });
})
