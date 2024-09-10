import { ContainerModule, interfaces } from "inversify";

import { TodosRepository } from "./todos.repository";
import { ITodosRepository } from "./todos.repository.interface";
import { MockTodosRepository } from "./todos.repository.mock";

import { DI_SYMBOLS } from "@/di/types";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<ITodosRepository>(DI_SYMBOLS.ITodosRepository).to(MockTodosRepository);
  } else {
    bind<ITodosRepository>(DI_SYMBOLS.ITodosRepository).to(TodosRepository);
  }
};

export const TodosModule = new ContainerModule(initializeModule);
