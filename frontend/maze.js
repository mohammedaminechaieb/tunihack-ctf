const API = "http://localhost:5000/api";

const maze = document.getElementById("maze");
const challengeBox = document.getElementById("challengeBox");

// CHANGE THIS: username must come from your signup/login logic
const username = localStorage.getItem("username");

let challenges = [];
let completedGates = [];

if (!username) {
  alert("Please signup/login first");
   window.location.href = "signup.html";
}

// ---------------- LOAD DATA ----------------

async function loadMaze() {
  const chRes = await fetch(`${API}/challenges`);
  challenges = await chRes.json();

  const stRes = await fetch(`${API}/gates-status/${username}`);
  const states = await stRes.json();
  completedGates = states.map(s => s.gateId);

  renderMaze();
}

// ---------------- RENDER MAZE ----------------

function renderMaze() {
  maze.innerHTML = "";

  challenges.forEach((ch, i) => {
    const gateId = i + 1;
    const div = document.createElement("div");
    div.className = "gate";

    if (completedGates.includes(gateId)) {
      div.classList.add("completed");
    }

    // LOCK LOGIC (guided path)
    if (gateId !== 1 && !completedGates.includes(gateId - 1)) {
      div.classList.add("locked");
    }

    div.innerHTML = `
      <h3>Gate ${gateId}</h3>
      <small>${ch.category}</small>
    `;

    div.onclick = () => openGate(gateId, ch);
    maze.appendChild(div);
  });
}

// ---------------- OPEN GATE ----------------

function openGate(gateId, ch) {
  challengeBox.style.display = "block";
  challengeBox.innerHTML = `
    <h2>${ch.name}</h2>
    <p>${ch.description}</p>

    <input id="flagInput" placeholder="TUNIHACK{...}">
    <button onclick="submitFlag(${gateId})">Submit Flag</button>
  `;

  // WEB TRAPS
  if (gateId === 6) {
    console.log("Check the JS logic carefully 👀");
  }

  if (gateId === 7) {
    localStorage.setItem("final_hint", "Previous flags matter.");
  }
}

// ---------------- SUBMIT FLAG ----------------

async function submitFlag(gateId) {
  const flag = document.getElementById("flagInput").value.trim();

  const res = await fetch(`${API}/submit-flag`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: username, gateId, flag })
  });

  const data = await res.json();

  if (data.success) {
    alert("✅ Correct flag!");
    completedGates.push(gateId);
    challengeBox.style.display = "none";
    renderMaze();
  } else {
    alert("❌ Wrong flag");
  }
}

// ---------------- START ----------------
loadMaze();
