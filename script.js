// ---- CONFIG ----
const API_KEY = "AIzaSyA-tFOh76uAzEWHiBO04vF6hA1VSn2GQo0";

// ---- LAAD VOORTGANG ----
let history = JSON.parse(localStorage.getItem("voortgang")) || [];

// Toon bestaande voortgang
window.onload = () => {
    const output = document.getElementById("output");
    history.forEach(msg => {
        const p = document.createElement("p");
        p.innerHTML = msg;
        output.appendChild(p);
    });
};

// ---- BERCIHT VERSTUREN ----
async function sendMessage() {
    const input = document.getElementById("input").value;
    if (!input) return;

    addToChat("👤 " + input);

    const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: buildPrompt(input) }] }]
            })
        }
    );

    const data = await response.json();

    const aiMessage =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "[Geen antwoord ontvangen]";

    addToChat("🤖 " + aiMessage);

    document.getElementById("input").value = "";
}


// ---- PROMPT MET VOORTGANGSCODE ----
function buildPrompt(input) {
    return `
Je bent een studievaardigheden-trainer. Je helpt leerlingen met:
- samenvatten
- plannen
- leren leren
- kritisch lezen
- begrijpend studeren

Je gebruikt een VOORTGANGSCODE-SYSTEEM:

1. Als de leerling vraagt om te stoppen:
   - Genereer een Base64-code die JSON bevat met module, vraag, stap, antwoorden.
2. Als de leerling zegt: "voortgangscode invoeren: CODE":
   - Decodeer de Base64 JSON
   - Ga verder vanaf dat punt.
3. Houd de uitleg eenvoudig.

Leerling zegt: "${input}"
    `;
}


// ---- BERICHT TOEVOEGEN + OPSLAAN ----
function addToChat(message) {
    const output = document.getElementById("output");

    const p = document.createElement("p");
    p.innerHTML = message;

    output.appendChild(p);

    history.push(message);
    localStorage.setItem("voortgang", JSON.stringify(history));

    // Automatisch naar onder scrollen
    output.scrollTop = output.scrollHeight;
}


// ---- WISSEN VAN VOORTGANG ----
function clearProgress() {
    if (confirm("Weet je zeker dat je je voortgang wilt wissen?")) {
        localStorage.removeItem("voortgang");
        history = [];
        document.getElementById("output").innerHTML = "";
    }
}
