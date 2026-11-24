import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../components/settings/account.js", import.meta.url), "utf8");
const { validateAccount, normalizeAccount } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
const account = { name: "홍길동", birthDate: "1997-12-21", phone: "010-1234-5678", gender: "male" };

test("accepts valid required fields and normalizes display dates for storage", () => {
  const input = { ...account, name: " 홍길동 ", birthDate: "1997. 12. 21" };
  assert.equal(validateAccount(input), "");
  assert.equal(normalizeAccount(input).name, "홍길동");
  assert.equal(normalizeAccount(input).birthDate, "1997-12-21");
  assert.equal(input.name, " 홍길동 ");
});
test("rejects empty fields, invalid dates and future births", () => {
  for (const change of [{name:" "}, {birthDate:"2023-02-29"}, {birthDate:"1997-13-01"}, {birthDate:"1997-12"}, {birthDate:"2999-01-01"}, {phone:""}, {phone:"0101234abcd"}, {gender:""}]) {
    assert.notEqual(validateAccount({ ...account, ...change }), "");
  }
  assert.equal(validateAccount({ ...account, birthDate:"2000-02-29" }), "");
});
