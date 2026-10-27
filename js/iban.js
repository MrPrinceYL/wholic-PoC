// IBAN-Prüfung nach ISO 13616 (Prüfziffer Modulo 97).
// Fängt Tippfehler ab; ob das Konto wirklich existiert, kann nur die Bank sagen.

export function isValidIban(input) {
    const iban = input.replace(/\s+/g, "").toUpperCase();
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) {
        return false;
    }
    if (iban.startsWith("DE") && iban.length !== 22) {
        return false;
    }
    // Die ersten 4 Zeichen nach hinten, Buchstaben durch Zahlen ersetzen (A=10 ... Z=35)
    const digits = (iban.slice(4) + iban.slice(0, 4)).replace(/[A-Z]/g, (ch) => ch.charCodeAt(0) - 55);
    // Stückweise rechnen, weil die Zahl für normale JavaScript-Zahlen zu groß ist
    let rest = 0;
    for (const digit of digits) {
        rest = (rest * 10 + Number(digit)) % 97;
    }
    return rest === 1;
}
