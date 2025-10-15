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
        // Store state name directly on layer for easy access later
        layer.stateName = feature.properties.name;

        // Show popup on click
        layer.on('click', () => openPopup(layer));
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

function saveStatus(layer, newStatus) {
  const stateName = layer.stateName;
  localStorage.setItem(`travel-${stateName}`, newStatus);

  // Update the color immediately
  layer.setStyle({ fillColor: getColor(newStatus) });

  // Optional: close the popup
  layer.closePopup();
}

// --- Popup builder ---

function openPopup(layer) {
  const stateName = layer.stateName;
  const current = getStatus(stateName);

  // ✅ Give each select element a unique id
  const selectId = `status-select-${stateName.replace(/\s/g, '-')}`;

  const popupDiv = document.createElement("div");
  popupDiv.classList.add("popup-form");

  popupDiv.innerHTML = `
    <h3>${stateName}</h3>
    <label>Travel Type:</label><br>
    <select id="${selectId}">
      <option value="None"${current === "None" ? " selected" : ""}>Not Visited</option>
      <option value="Home"${current === "Home" ? " selected" : ""}>Home State</option>
      <option value="Overnight"${current === "Overnight" ? " selected" : ""}>Stayed Overnight</option>
      <option value="Day Trip"${current === "Day Trip" ? " selected" : ""}>Day Trip</option>
      <option value="Drive-Through"${current === "Drive-Through" ? " selected" : ""}>Drove Through</option>
      <option value="Layover"${current === "Layover" ? " selected" : ""}>Airport Layover Only</option>
    </select><br>
    <button id="save-btn-${stateName.replace(/\s/g, '-')}">💾 Save</button>
  `;

  // Bind popup and open it
  layer.bindPopup(popupDiv).openPopup();

  // Attach event listener safely
  const saveBtn = popupDiv.querySelector(`#save-btn-${stateName.replace(/\s/g, '-')}`);
  const selectEl = popupDiv.querySelector(`#${selectId}`);

  saveBtn.addEventListener("click", () => {
    const newVal = selectEl.value;
    saveStatus(layer, newVal);
  });
}
