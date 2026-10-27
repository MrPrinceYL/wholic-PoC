// Buchungsstrecke: Formular füllen, Preis live anzeigen.
import { SERVICES, calculatePrice, formatEuro } from "./pricing.js";

const form = document.getElementById("bookingForm");
const serviceSelect = document.getElementById("service");
const quantityInput = document.getElementById("quantity");
const extrasBox = document.getElementById("extras");
const priceTable = document.getElementById("priceTable");

// Service-Auswahl aus der Preisliste füllen
for (const [id, service] of Object.entries(SERVICES)) {
    serviceSelect.add(new Option(service.name, id));
}

// Frühester Termin ist morgen
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
document.getElementById("date").min = tomorrow.toISOString().slice(0, 10);

// Checkboxen für die Extras des gewählten Services anzeigen
function renderExtras() {
    const service = SERVICES[serviceSelect.value];
    document.getElementById("unit").textContent = service.unit;
    extrasBox.replaceChildren();
    for (const [id, extra] of Object.entries(service.extras)) {
        const label = document.createElement("label");
        label.className = "option";
        label.innerHTML = `<input type="checkbox" name="extra" value="${id}">`;
        label.append(`${extra.name} (+${formatEuro(extra.price)} / ${service.unit})`);
        extrasBox.append(label);
    }
}

function selectedExtras() {
    return [...form.querySelectorAll("input[name=extra]:checked")].map((box) => box.value);
}

// Preistabelle neu aufbauen; gibt den Preis zurück (oder null bei ungültiger Menge)
function renderPrice() {
    const quantity = Number(quantityInput.value);
    if (!(quantity > 0)) {
        priceTable.innerHTML = "<tr><td>Bitte einen Umfang angeben.</td></tr>";
        return null;
    }
    const price = calculatePrice(serviceSelect.value, quantity, selectedExtras());
    const rows = price.lines.map((line) => [line.label, line.amount]);
    rows.push(["Summe netto", price.net], ["MwSt. 19 %", price.vat]);

    priceTable.replaceChildren();
    for (const [label, amount] of rows) {
        priceTable.insertRow().append(cell(label), cell(formatEuro(amount)));
    }
    const total = priceTable.insertRow();
    total.className = "total";
    total.append(cell("Gesamt"), cell(formatEuro(price.gross)));
    return price;
}

function cell(text) {
    const td = document.createElement("td");
    td.textContent = text;
    return td;
}

serviceSelect.addEventListener("change", () => {
    renderExtras();
    renderPrice();
});
form.addEventListener("input", renderPrice);

renderExtras();
renderPrice();
