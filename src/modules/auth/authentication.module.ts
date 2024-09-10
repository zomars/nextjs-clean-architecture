import { ContainerModule, interfaces } from "inversify";

import { AuthenticationService } from "./authentication.service";
import { IAuthenticationService } from "./authentication.service.interface";
import { MockAuthenticationService } from "./authentication.service.mock";

import { DI_SYMBOLS } from "@/di/types";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IAuthenticationService>(DI_SYMBOLS.IAuthenticationService).to(
      MockAuthenticationService
    );
  } else {
    bind<IAuthenticationService>(DI_SYMBOLS.IAuthenticationService).to(
      AuthenticationService
    );
  }
};

export const AuthenticationModule = new ContainerModule(initializeModule);
