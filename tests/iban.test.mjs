import { test } from "node:test";
import assert from "node:assert/strict";
import { isValidIban } from "../js/iban.js";

test("gültige IBANs (mit und ohne Leerzeichen)", () => {
    assert.ok(isValidIban("DE89 3704 0044 0532 0130 00"));
    assert.ok(isValidIban("de89370400440532013000"));
    assert.ok(isValidIban("GB82WEST12345698765432"));
});

test("ungültige IBANs", () => {
    assert.ok(!isValidIban("DE89 3704 0044 0532 0130 01")); // falsche Prüfziffer
    assert.ok(!isValidIban("DE89 3704 0044 0532 0130")); // zu kurz für DE
    assert.ok(!isValidIban("1234"));
    assert.ok(!isValidIban(""));
});
