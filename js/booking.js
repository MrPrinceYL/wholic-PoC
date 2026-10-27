// Buchungsstrecke: Formular füllen, Preis live anzeigen, Vertrag + Zahlung, bestellen.
import { SERVICES, calculatePrice, formatEuro } from "./pricing.js";
import { isValidIban } from "./iban.js";

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

// IBAN-Felder nur bei SEPA, PayPal-Hinweis nur bei PayPal zeigen
function renderPaymentFields() {
    const payment = form.payment.value;
    document.getElementById("sepaFields").classList.toggle("hidden", payment !== "sepa");
    document.getElementById("paypalHint").classList.toggle("hidden", payment !== "paypal");
}

function showError(message) {
    const box = document.getElementById("formError");
    box.textContent = message;
    box.classList.remove("hidden");
}

// Bestellung prüfen, in sessionStorage ablegen und zur Bestätigung weiterleiten.
// Im echten Produkt würde hier ein Request an das Backend gehen.
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const price = renderPrice();
    if (!price || !form.reportValidity()) {
        return;
    }
    const payment = form.payment.value;
    if (payment === "sepa") {
        if (!isValidIban(form.iban.value)) {
            showError("Die IBAN ist ungültig. Bitte prüfen Sie Ihre Eingabe.");
            return;
        }
        if (!form.sepaMandate.checked) {
            showError("Für die Lastschrift brauchen wir Ihr SEPA-Mandat.");
            return;
        }
    }

    const order = {
        number: "WH-" + Date.now().toString().slice(-8),
        service: SERVICES[serviceSelect.value].name,
        date: form.date.value,
        address: form.address.value,
        payment: payment,
        // nur die letzten 4 Stellen der IBAN merken
        ibanEnd: payment === "sepa" ? form.iban.value.replace(/\s+/g, "").slice(-4) : null,
        price: price,
    };
    sessionStorage.setItem("lastOrder", JSON.stringify(order));
    window.location.href = "danke.html";
});

form.addEventListener("change", renderPaymentFields);
serviceSelect.addEventListener("change", () => {
    renderExtras();
    renderPrice();
});
form.addEventListener("input", renderPrice);

renderExtras();
renderPrice();
