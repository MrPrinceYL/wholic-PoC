// Importiere EmailJS-Bibliothek
// import * as emailjs from "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";

// EmailJS initialisieren
// emailjs.init("WjgWDyIfltKe2Brep"); // Public Key
var enteredEmail = "beispiel@domain.com";

// 6-stelligen Code generieren
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Funktion: E-Mail senden
function sendEmail(event) {
    console.log("test");
    event.preventDefault(); // Verhindert das Standard-Formularverhalten

    const emailInput = document.getElementById("email");
    enteredEmail = emailInput.value;
    sessionStorage.setItem("enteredEmail", enteredEmail);
    const generatedCode = generateCode(); // 6-stelligen Code generieren
    sessionStorage.setItem("generatedCode", generatedCode);
    console.log(sessionStorage.getItem("generatedCode"));

    const emailParams = {
        to_email: emailInput.value,
        code: generatedCode,
    };

    emailjs.send("service_dv5gtsk", "template_6zy8j2q", emailParams)
        .then(() => {
            console.log("E-Mail erfolgreich gesendet.");
            // Weiterleitung zur Erfolgsseite
            window.location.href = "login_success.html";
        })
        .catch((error) => {
            console.error("Fehler beim Senden der E-Mail:", error);
            alert("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
        });
}

// Event-Listener für das Formular hinzufügen
// document.getElementById("submit").addEventListener("click", () => sendEmail());
// document.addEventListener("DOMContentLoaded", () => {
//     const button = document.getElementById("submit");
//     button.addEventListener("click", (event) => {
//         event.preventDefault(); // Verhindert das Standardformularverhalten
//         sendEmail(event);             // Ruft die sendMail-Funktion auf
//     });
// });

// Funktion: Code überprüfen
function verifyCode(event) {
    event.preventDefault(); 
    const userCode = document.getElementById("code").value; // Eingabe des Nutzers
    const generatedCode = sessionStorage.getItem("generatedCode");
    console.log(userCode);
    console.log(sessionStorage.getItem("generatedCode"));

    if (userCode === generatedCode) {
        console.log(true);
        window.location.href = "welcome.html";
    } else {
        window.location.href = "verify_code_fail.html";
    }


    // const messageElement = document.getElementById("message"); // Nachrichtenelement

    // if (userCode === generatedCode) {
    //     messageElement.textContent = "Code ist richtig!";
    //     messageElement.style.color = "green";
    // } else {
    //     messageElement.textContent = "Code ist falsch!";
    //     messageElement.style.color = "red";
    // }
}

// Event-Listener für die Buttons
if (document.getElementById("submit") != null) {
    document.getElementById("submit").addEventListener("click", sendEmail);
}

if (document.getElementById("submitCode") != null) {
    document.getElementById("submitCode").addEventListener("click", verifyCode);
}

