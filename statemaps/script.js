const map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 6,
  minZoom: 3,
}).addTo(map);

fetch('us-states.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      onEachFeature: (feature, layer) => {
        layer.on('click', () => {
          const state = feature.properties.name;
          const info = localStorage.getItem(state) || '';
          const popupContent = `
            <div class="popup-form">
              <h3>${state}</h3>
              <textarea id="text-${state}" placeholder="Enter your family memories here...">${info}</textarea>
              <button onclick="saveState('${state}')">💾 Save</button>
            </div>
          `;
          layer.bindPopup(popupContent).openPopup();
        });
      },
      style: {
        color: "#333",
        weight: 1,
        fillColor: "#aad3df",
        fillOpacity: 0.7,
      }
    }).addTo(map);
  });

function saveState(state) {
  const text = document.getElementById(`text-${state}`).value;
  localStorage.setItem(state, text);
  alert(`Saved info for ${state}!`);
}