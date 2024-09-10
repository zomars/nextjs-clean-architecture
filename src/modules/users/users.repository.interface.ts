import type { User } from "./user.model";

export interface IUsersRepository {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(input: User): Promise<User>;
}
