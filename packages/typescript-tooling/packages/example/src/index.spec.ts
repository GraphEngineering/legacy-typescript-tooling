import { message } from "./index";

test("greeting includes provided name", () => {
  expect(message("World")).toBe("Hello, World!");
});
