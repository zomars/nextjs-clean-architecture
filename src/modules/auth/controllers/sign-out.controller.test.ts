import { afterEach, beforeEach, expect, it } from "vitest";

import { SESSION_COOKIE } from "@/config";
import { destroyContainer, initializeContainer } from "@/di";
import { InputParseError } from "~/common/common.error";
import { signInUseCase } from "../use-cases/sign-in.use-case";
import { signOutController } from "./sign-out.controller";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it("returns blank cookie", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  expect(signOutController(session.id)).resolves.toMatchObject({
    name: SESSION_COOKIE,
    value: "",
    attributes: {},
  });
});

it("throws for invalid input", () => {
  expect(signOutController(undefined)).rejects.toBeInstanceOf(InputParseError);
});
