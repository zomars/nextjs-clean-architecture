import { ContainerModule, interfaces } from "inversify";

import { UsersRepository } from "./users.repository";
import { IUsersRepository } from "./users.repository.interface";
import { MockUsersRepository } from "./users.repository.mock";

import { DI_SYMBOLS } from "@/di/types";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IUsersRepository>(DI_SYMBOLS.IUsersRepository).to(MockUsersRepository);
  } else {
    bind<IUsersRepository>(DI_SYMBOLS.IUsersRepository).to(UsersRepository);
  }
};

export const UsersModule = new ContainerModule(initializeModule);
