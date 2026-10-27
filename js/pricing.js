// Preise und Preisberechnung für die Buchungsstrecke.
// Alle Beträge werden in Cent gerechnet, damit keine Rundungsfehler
// durch Kommazahlen entstehen (0.1 + 0.2 !== 0.3 in JavaScript).

export const VAT_RATE = 0.19;
export const TRAVEL_FEE = 2900; // Anfahrtspauschale in Cent

// Beispielpreise für den Proof of Concept (netto, in Cent pro Einheit)
export const SERVICES = {
    laminat: {
        name: "Laminat verlegen",
        unit: "m²",
        price: 1890,
        extras: {
            daemmung: { name: "Trittschalldämmung verlegen", price: 350 },
            altbelag: { name: "Altbelag entfernen", price: 590 },
        },
    },
    elektriker: { name: "Elektriker", unit: "Std.", price: 6500, extras: {} },
    reinigung: { name: "Reinigung", unit: "m²", price: 290, extras: {} },
    gaertner: { name: "Gärtner", unit: "Std.", price: 4500, extras: {} },
    container: { name: "Container (7 m³) inkl. Abholung", unit: "Stk.", price: 34900, extras: {} },
};

// Berechnet alle Positionen und die Summen einer Buchung.
// extraIds: Liste der gewählten Zusatzleistungen, die pro Einheit berechnet werden.
export function calculatePrice(serviceId, quantity, extraIds = []) {
    const service = SERVICES[serviceId];
    if (!service) {
        throw new Error(`Unbekannter Service: ${serviceId}`);
    }
    if (!(quantity > 0)) {
        throw new Error("Die Menge muss größer als 0 sein");
    }

    const lines = [
        { label: `${service.name} (${quantity} ${service.unit})`, amount: Math.round(service.price * quantity) },
    ];
    for (const id of extraIds) {
        const extra = service.extras[id];
        if (extra) {
            lines.push({ label: `${extra.name} (${quantity} ${service.unit})`, amount: Math.round(extra.price * quantity) });
        }
    }
    lines.push({ label: "Anfahrtspauschale", amount: TRAVEL_FEE });

    const net = lines.reduce((sum, line) => sum + line.amount, 0);
    const vat = Math.round(net * VAT_RATE);
    return { lines, net, vat, gross: net + vat };
}

// 123456 -> "1.234,56 €"
export function formatEuro(cents) {
    return (cents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" });
}
