const map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 6,
  minZoom: 3,
}).addTo(map);

let stateLayer;

fetch('us-states.geojson')
  .then(res => res.json())
  .then(data => {
    stateLayer = L.geoJSON(data, {
      style: feature => ({
        color: "#555",
        weight: 1,
        fillColor: getColor(getStatus(feature.properties.name)),
        fillOpacity: 0.7
      }),
      onEachFeature: (feature, layer) => {
        layer.on('click', () => openPopup(feature, layer));
      }
    }).addTo(map);
  });

// --- Utility functions ---

function getColor(status) {
  switch (status) {
    case "Home": return "#1b5e20";
    case "Overnight": return "#4caf50";
    case "Day Trip": return "#81c784";
    case "Drive-Through": return "#ffb300";
    case "Layover": return "#ff7043";
    default: return "#e0e0e0";
  }
}

function getStatus(stateName) {
  return localStorage.getItem(`travel-${stateName}`) || "None";
}

function saveStatus(stateName, newStatus, layer) {
  // Save to localStorage
  localStorage.setItem(`travel-${stateName}`, newStatus);

  // Update layer color instantly
  layer.setStyle({ fillColor: getColor(newStatus) });

  // Close popup (optional)
  layer.closePopup();
}

// --- Popup builder ---

function openPopup(feature, layer) {
  const stateName = feature.properties.name;
  const current = getStatus(stateName);

  const popupDiv = document.createElement("div");
  popupDiv.classList.add("popup-form");

  popupDiv.innerHTML = `
    <h3>${stateName}</h3>
    <label>Travel Type:</label><br>
    <select id="status-select">
      <option value="None"${current === "None" ? " selected" : ""}>Not Visited</option>
      <option value="Home"${current === "Home" ? " selected" : ""}>Home State</option>
      <option value="Overnight"${current === "Overnight" ? " selected" : ""}>Stayed Overnight</option>
      <option value="Day Trip"${current === "Day Trip" ? " selected" : ""}>Day Trip</option>
      <option value="Drive-Through"${current === "Drive-Through" ? " selected" : ""}>Drove Through</option>
      <option value="Layover"${current === "Layover" ? " selected" : ""}>Airport Layover Only</option>
    </select><br>
    <button id="save-btn">💾 Save</button>
  `;

  // Bind popup HTML to layer
  layer.bindPopup(popupDiv).openPopup();

  // Add live event listener to the save button
  popupDiv.querySelector("#save-btn").addEventListener("click", () => {
    const selectedValue = popupDiv.querySelector("#status-select").value;
    saveStatus(stateName, selectedValue, layer);
  });
}
