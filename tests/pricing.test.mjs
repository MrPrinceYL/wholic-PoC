// Ausführen mit: node --test
import { test } from "node:test";
import assert from "node:assert/strict";
import { calculatePrice, formatEuro, TRAVEL_FEE } from "../js/pricing.js";

test("Laminat 20 m² ohne Extras", () => {
    const p = calculatePrice("laminat", 20);
    assert.equal(p.net, 20 * 1890 + TRAVEL_FEE); // 40.700 Cent
    assert.equal(p.vat, Math.round(p.net * 0.19));
    assert.equal(p.gross, p.net + p.vat);
});

test("Extras werden pro m² berechnet", () => {
    const p = calculatePrice("laminat", 10, ["daemmung", "altbelag"]);
    assert.equal(p.lines.length, 4);
    assert.equal(p.net, 10 * (1890 + 350 + 590) + TRAVEL_FEE);
});

test("Kommamengen ergeben ganze Cent", () => {
    const p = calculatePrice("reinigung", 12.5);
    assert.ok(Number.isInteger(p.net) && Number.isInteger(p.vat));
});

test("Ungültige Eingaben werfen Fehler", () => {
    assert.throws(() => calculatePrice("dachdecker", 1));
    assert.throws(() => calculatePrice("laminat", 0));
    assert.throws(() => calculatePrice("laminat", NaN));
});

test("Euro-Format", () => {
    assert.equal(formatEuro(123456).replace(/\s/g, " "), "1.234,56 €");
});
