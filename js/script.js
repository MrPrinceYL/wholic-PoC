// Login per E-Mail-Code (Proof of Concept).
// Achtung: Der Code wird nur im Browser (sessionStorage) geprüft. Für echten Einsatz
// muss ein Backend den Code erzeugen, verschicken und prüfen.

// 6-stelligen Code generieren
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Code per EmailJS an die eingegebene Adresse senden
function sendEmail(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const code = generateCode();
    sessionStorage.setItem("enteredEmail", email);
    sessionStorage.setItem("generatedCode", code);

    emailjs.send("service_dv5gtsk", "template_6zy8j2q", { to_email: email, code: code })
        .then(() => {
            window.location.href = "login_success.html";
        })
        .catch((error) => {
            console.error("Fehler beim Senden der E-Mail:", error);
            alert("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
        });
}

// Eingegebenen Code mit dem gesendeten vergleichen
function verifyCode(event) {
    event.preventDefault();
    const userCode = document.getElementById("code").value;
    if (userCode === sessionStorage.getItem("generatedCode")) {
        sessionStorage.setItem("loggedIn", "true");
        window.location.href = "welcome.html";
    } else {
        window.location.href = "verify_code_fail.html";
    }
}

// Event-Listener nur auf den Seiten setzen, die den Button haben
document.getElementById("submit")?.addEventListener("click", sendEmail);
document.getElementById("submitCode")?.addEventListener("click", verifyCode);
