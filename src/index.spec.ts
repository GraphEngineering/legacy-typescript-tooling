import * as Config from "~/Config";

test("if jest is working", () => {
  console.log(Config);

  expect(1 + 1).toBe(2);
});
