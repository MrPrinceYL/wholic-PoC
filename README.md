# wholic: Handwerker-App (Proof of Concept)

> **„Heute über wholic bestellt, morgen schon Handwerker gestellt!“**

Wholic verbindet Handwerksbetriebe und Privatpersonen. Statt auf Angebote zu warten, bucht man
einen Handwerker („Wholic“) direkt zum Festpreis und Wunschtermin, inklusive VOB-Vertrag und
Bezahlung. Dieses Repository ist ein klickbarer **Proof of Concept** der Web-Version: reines
HTML, CSS und JavaScript, ohne Framework und ohne Build-Schritt.

## Funktionen

| Bereich | Was der PoC zeigt |
|---|---|
| **Startseite** | Services (Laminat, Elektriker, Reinigung, Gärtner, Container), die 8 App-Vorteile, Ablauf, Kontakt |
| **Login** | Anmeldung per E-Mail und 6-stelligem Bestätigungscode, Versand über [EmailJS](https://www.emailjs.com/) |
| **Buchungsstrecke** | Leistung und Umfang wählen, Extras (z. B. Trittschalldämmung), Wunschtermin ab morgen, Adresse |
| **Transparente Preise** | Live-Preistabelle: Positionen, Anfahrt, netto, 19 % MwSt., Gesamt |
| **VOB-Vertrag** | Mustervertrag nach VOB/B, muss vor der Bestellung akzeptiert werden |
| **Zahlung** | Rechnung, SEPA-Lastschrift (mit IBAN-Prüfziffer und Mandat) oder PayPal (simuliert) |
| **Bestätigung** | Bestellübersicht mit Status „Zahlung erhalten → Handwerker ist unterwegs“ |

## Seitenablauf

```
index.html ──► login.html ──► login_success.html ──► verify_code.html ──► welcome.html
     │                                                     │ (falsch)
     │                                                     ▼
     │                                              verify_code_fail.html
     └──────────────► buchen.html ──► danke.html ◄──────── welcome.html
```

## Starten

Die Seiten nutzen JavaScript-Module. Die funktionieren nicht über `file://`, deshalb einen
lokalen Webserver starten:

```bash
git clone https://github.com/MrPrinceYL/wholic-PoC.git
cd wholic-PoC
python -m http.server 8000
```

Dann <http://localhost:8000> öffnen.

## Tests

Preisberechnung und IBAN-Prüfung haben Unit-Tests mit dem eingebauten Test-Runner von Node.js
(ab Version 22, keine Abhängigkeiten):

```bash
node --test
```

## Projektstruktur

```
index.html, buchen.html, danke.html     Startseite, Buchung, Bestätigung
login*.html, verify_code*.html,
welcome.html                            Login per E-Mail-Code
css/style.css                           alle Styles an einer Stelle
js/pricing.js                           Preisliste und Preisberechnung (in Cent)
js/iban.js                              IBAN-Prüfung (Modulo 97)
js/booking.js                           Logik der Buchungsseite
js/script.js                            Logik des Logins
tests/                                  node:test Unit-Tests
```

## Technische Entscheidungen

- **Beträge in Cent:** JavaScript rechnet mit Gleitkommazahlen (`0.1 + 0.2 !== 0.3`). Alle Preise
  sind deshalb ganze Cent-Beträge und werden erst bei der Anzeige formatiert.
- **Kein `innerHTML` mit Nutzereingaben:** Adresse, E-Mail usw. werden mit `textContent` eingefügt,
  damit eingegebenes HTML nicht ausgeführt wird (XSS).
- **IBAN:** nur die Prüfziffer wird geprüft, und auf der Bestätigungsseite erscheinen nur die
  letzten 4 Stellen.

## Grenzen des Proof of Concept

Das ist bewusst ein Frontend-Prototyp. Für den echten Betrieb fehlt vor allem ein Backend:

- **Login:** Der Code wird im Browser erzeugt und in `sessionStorage` geprüft. Wer die
  Entwicklertools öffnet, kann ihn auslesen. Erzeugen, Versand und Prüfung gehören auf den Server.
- **Bestellungen** liegen nur in `sessionStorage`, es gibt keine Datenbank und keine echte Zahlung.
- **Preise und Vertragstext** sind Beispielwerte bzw. ein Muster, keine Rechtsberatung.
- Registrierung per Telefonnummer, Echtzeit-Verfügbarkeit der Handwerker und die mobile App aus
  dem Konzept sind noch nicht umgesetzt.

## Nächste Schritte

1. Backend (z. B. Node.js/Express oder FastAPI) mit Datenbank für Nutzer, Aufträge und Betriebe
2. Login-Code serverseitig, mit Ablaufzeit und Versuchslimit
3. PayPal- und SEPA-Anbindung über einen Zahlungsdienstleister
4. Kalender mit echter Verfügbarkeit der Wholics
