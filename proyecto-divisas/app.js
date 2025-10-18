// app.js - Lógica del convertidor de divisas

// Tasas definidas localmente (base: USD = 1). 
// NOTA: en un proyecto real actualizarías estas tasas desde una API.
const rates = {
  USD: 1,
  EUR: 0.95,
  GBP: 0.82,
  JPY: 149.3,
  CNY: 7.22,
  CAD: 1.36,
  AUD: 1.53,
  CHF: 0.88,
  MXN: 18.75,
  BRL: 5.10,
  KRW: 1330,
  INR: 83.5,
  RUB: 98.2,
  ARS: 375.0,
  CLP: 820.0,
  COP: 4120,
  SEK: 11.5,
  NOK: 10.9,
  ZAR: 18.0,
  TRY: 37.2
};

// Mapa para mostrar banderas (uso de emojis para simplicidad)
const flags = {
  USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", JPY: "🇯🇵", CNY: "🇨🇳",
  CAD: "🇨🇦", AUD: "🇦🇺", CHF: "🇨🇭", MXN: "🇲🇽", BRL: "🇧🇷",
  KRW: "🇰🇷", INR: "🇮🇳", RUB: "🇷🇺", ARS: "🇦🇷", CLP: "🇨🇱",
  COP: "🇨🇴", SEK: "🇸🇪", NOK: "🇳🇴", ZAR: "🇿🇦", TRY: "🇹🇷"
};

// --- Elementos del DOM ---
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const amountInput = document.getElementById("amount");
const convertBtn = document.getElementById("convertBtn");
const resultCard = document.getElementById("resultCard");
const resultText = document.getElementById("resultText");
const metaP = document.getElementById("meta");
const swapBtn = document.getElementById("swapBtn");
const clearBtn = document.getElementById("clearBtn");
const aboutBtn = document.getElementById("aboutBtn");
const aboutCard = document.getElementById("aboutCard");

// Rellenar selects con las monedas del objeto rates
function populateSelects() {
  const keys = Object.keys(rates);
  keys.forEach(code => {
    const optFrom = document.createElement("option");
    optFrom.value = code;
    optFrom.textContent = `${flags[code] ?? ""} ${code}`;
    fromSelect.appendChild(optFrom);

    const optTo = document.createElement("option");
    optTo.value = code;
    optTo.textContent = `${flags[code] ?? ""} ${code}`;
    toSelect.appendChild(optTo);
  });

  // Valores por defecto
  fromSelect.value = "USD";
  toSelect.value = "COP";
}
populateSelects();

// Formato de fecha/hora legible
function formatDateTime(date = new Date()){
  return date.toLocaleString("es-CO", {
    year:"numeric",month:"short",day:"numeric",
    hour:"2-digit",minute:"2-digit",second:"2-digit"
  });
}

// Validación básica
function validateInput(amount, from, to) {
  const errors = [];
  if (amount === "" || amount === null) errors.push("Ingresa un monto.");
  if (isNaN(amount)) errors.push("El monto debe ser numérico.");
  if (Number(amount) < 0) errors.push("El monto no puede ser negativo.");
  if (!rates[from]) errors.push("Moneda de origen inválida.");
  if (!rates[to]) errors.push("Moneda destino inválida.");
  return errors;
}

// Función de conversión según la fórmula
function convert(amount, from, to) {
  // resultado = (monto / tasaOrigen) * tasaDestino;
  const rateFrom = rates[from];
  const rateTo = rates[to];
  const result = (Number(amount) / rateFrom) * rateTo;
  return result;
}

// Mostrar resultado con meta (tasa usada y fecha)
function showResult(amount, from, to, converted) {
  resultText.textContent = `${flags[to] ?? ""} ${to} ${converted.toFixed(2)}`;
  const usedRate = (rates[to] / rates[from]).toFixed(6);
  metaP.textContent = `Equivalencia: 1 ${from} = ${usedRate} ${to} · ${formatDateTime()}`;
  resultCard.classList.remove("hidden");

  // permitir copiar el resultado con doble click
  resultText.ondblclick = () => {
    navigator.clipboard?.writeText(`${converted.toFixed(2)} ${to}`).then(() => {
      metaP.textContent = "Resultado copiado al portapapeles ✅";
      setTimeout(() => metaP.textContent = `Equivalencia: 1 ${from} = ${usedRate} ${to} · ${formatDateTime()}`, 1500);
    }).catch(()=>{/* ignore */});
  };
}

// Eventos
convertBtn.addEventListener("click", () => {
  const amount = amountInput.value.trim();
  const from = fromSelect.value;
  const to = toSelect.value;

  const errors = validateInput(amount, from, to);
  if (errors.length) {
    alert(errors.join("\n"));
    return;
  }

  const converted = convert(amount, from, to);
  showResult(amount, from, to, converted);
});

swapBtn.addEventListener("click", () => {
  const a = fromSelect.value;
  const b = toSelect.value;
  fromSelect.value = b;
  toSelect.value = a;
});

clearBtn.addEventListener("click", () => {
  amountInput.value = "";
  resultCard.classList.add("hidden");
});

// Mostrar / ocultar sección "Acerca de"
aboutBtn.addEventListener("click", () => {
  aboutCard.classList.toggle("hidden");
  // hacer scroll si se muestra
  if (!aboutCard.classList.contains("hidden")) aboutCard.scrollIntoView({behavior:"smooth"});
});

// Atajo Enter para convertir
amountInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") convertBtn.click();
});

// Inicial: si quieres convertir automáticamente al cambiar selects, puedes habilitar esto:
// fromSelect.addEventListener("change", () => convertBtn.click());
// toSelect.addEventListener("change", () => convertBtn.click());
