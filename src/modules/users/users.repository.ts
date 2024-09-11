import { captureException, startSpan } from "@sentry/nextjs";
import { eq } from "drizzle-orm";
import { injectable } from "inversify";

import { db } from "@/drizzle";
import { users } from "@/drizzle/schema";
import { DatabaseOperationError } from "~/common/common.error";
import { User } from "./user.model";
import { IUsersRepository } from "./users.repository.interface";

@injectable()
export class UsersRepository implements IUsersRepository {
  async getUser(id: string): Promise<User | undefined> {
    return await startSpan({ name: "UsersRepository > getUser" }, async () => {
      try {
        const query = db.query.users.findFirst({
          where: eq(users.id, id),
        });

        const user = await startSpan(
          {
            name: query.toSQL().sql,
            op: "db.query",
            attributes: { "db.system": "sqlite" },
          },
          () => query.execute()
        );

        return user;
      } catch (err) {
        captureException(err);
        throw err; // TODO: convert to Entities error
      }
    });
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    return await startSpan(
      { name: "UsersRepository > getUserByUsername" },
      async () => {
        try {
          const query = db.query.users.findFirst({
            where: eq(users.username, username),
          });

          const user = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "sqlite" },
            },
            () => query.execute()
          );

          return user;
        } catch (err) {
          captureException(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }
  async createUser(input: User): Promise<User> {
    return await startSpan(
      { name: "UsersRepository > createUser" },
      async () => {
        try {
          const query = db.insert(users).values(input).returning();

          const [created] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "sqlite" },
            },
            () => query.execute()
          );

          if (created) {
            return created;
          } else {
            throw new DatabaseOperationError("Cannot create user.");
          }
        } catch (err) {
          captureException(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }
}
