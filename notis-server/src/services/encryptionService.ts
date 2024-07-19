import bcrypt from "bcrypt";

export class EncryptionService {
  static async encryptPassword(password: string): Promise<string> {
    try {
      const hashPassword = await bcrypt.hash(password, 10);
      return hashPassword;
    } catch (error) {
      throw error;
    }
  }
}
