import { message } from "./index";

test("message function greets someone based on their name", () => {
  expect(message("Mr. Foo Bar")).toBe("Hello, Mr. Foo Bar!");
});
