import { User } from "../entity/user.entity";

export interface UserRepository {
  findById(id: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  getAllUser(): Promise<User[]>;

  // updatePassword( id: string, hashedPassword: string ): Promise<User | null>;
}