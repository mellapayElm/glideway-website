<!DOCTYPE html>
<html>
<head>
  <title>GlideWay Ride Booking</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <style>
    * { box-sizing: border-box; font-family: Arial, sans-serif; }
    body { margin: 0; background: #f4f6f8; }

    .app {
      display: flex;
      height: 100vh;
      width: 100%;
    }

    .left-panel {
      width: 420px;
      background: #ffffff;
      padding: 22px;
      overflow-y: auto;
      box-shadow: 4px 0 20px rgba(0,0,0,0.12);
      z-index: 10;
    }

    .brand {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 6px;
    }

    .subtitle {
      color: #6b7280;
      margin-bottom: 20px;
    }

    .section {
      margin-bottom: 18px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    label {
      display: block;
      font-weight: bold;
      margin-bottom: 7px;
      color: #111827;
    }

    input, select, textarea {
      width: 100%;
      padding: 13px;
      border: 1px solid #d1d5db;
      border-radius: 12px;
      font-size: 15px;
      margin-bottom: 10px;
    }

    textarea { resize: none; height: 80px; }

    .mini-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }

    .mini-buttons button,
    .secondary-btn {
      background: #f3f4f6;
      color: #111827;
      border: none;
      padding: 12px;
      border-radius: 12px;
      cursor: pointer;
      font-weight: bold;
    }

    .ride-types {
      display: grid;
      gap: 10px;
    }

    .ride-card {
      border: 1px solid #e5e7eb;
      border-radius: 14px;
      padding: 14px;
      cursor: pointer;
      background: #fafafa;
    }

    .ride-card.active {
      border: 2px solid #000;
      background: #f9fafb;
    }

    .ride-title {
      font-weight: bold;
      font-size: 16px;
    }

    .ride-desc {
      color: #6b7280;
      font-size: 13px;
      margin-top: 3px;
    }

    .primary-btn {
      width: 100%;
      background: #000;
      color: white;
      border: none;
      padding: 15px;
      border-radius: 14px;
      font-size: 17px;
      cursor: pointer;
      font-weight: bold;
    }

    .safety-btn {
      background: #dc2626;
      color: white;
      border: none;
      width: 100%;
      padding: 13px;
      border-radius: 12px;
      font-weight: bold;
      cursor: pointer;
    }

    .summary {
      background: #f9fafb;
      border-radius: 14px;
      padding: 14px;
      line-height: 1.7;
      font-size: 14px;
    }

    .fare {
      font-size: 26px;
      color: #16a34a;
      font-weight: bold;
    }

    #map {
      flex: 1;
      height: 100vh;
    }

    @media (max-width: 800px) {
      .app { flex-direction: column; }
      .left-panel { width: 100%; height: 55vh; }
      #map { height: 45vh; }
    }
  </style>
</head>

<body>

<div class="app">

  <div class="left-panel">
    <div class="brand">GlideWay</div>
    <div class="subtitle">Ride smoothly, safely, and easily.</div>

    <div class="section">
      <label>Pickup Location</label>
      <input id="pickup" placeholder="Enter pickup location" />

      <div class="mini-buttons">
        <button onclick="useCurrentLocation()">📍 Current Location</button>
        <button onclick="enableMapPickup()">🗺 Set on Map</button>
      </div>

      <label>Dropoff Location</label>
      <input id="dropoff" placeholder="Enter destination" />
    </div>

    <div class="section">
      <label>Schedule Ride</label>
      <select id="scheduleType">
        <option value="now">Pickup Now</option>
        <option value="later">Schedule for Later</option>
      </select>

      <input id="scheduleTime" type="datetime-local" style="display:none;" />
    </div>

    <div class="section">
      <label>Rider</label>
      <select id="riderType">
        <option value="me">For Me</option>
        <option value="someone_else">Order Ride for Someone Else</option>
      </select>

      <input id="otherRiderName" placeholder="Passenger name" style="display:none;" />
      <input id="otherRiderPhone" placeholder="Passenger phone" style="display:none;" />
    </div>

    <div class="section">
      <label>Choose Ride Type</label>

      <div class="ride-types">
        <div class="ride-card active" onclick="selectRideType('economy', this)">
          <div class="ride-title">Economy</div>
          <div class="ride-desc">Affordable everyday ride</div>
        </div>

        <div class="ride-card" onclick="selectRideType('comfort', this)">
          <div class="ride-title">Comfort</div>
          <div class="ride-desc">More space and better comfort</div>
        </div>

        <div class="ride-card" onclick="selectRideType('xl', this)">
          <div class="ride-title">XL</div>
          <div class="ride-desc">Best for groups and families</div>
        </div>
      </div>
    </div>

    <div class="section">
      <label>Payment Method</label>
      <select id="payment">
        <option>Card ending in 4242</option>
        <option>Apple Pay</option>
        <option>Google Pay</option>
        <option>Cash</option>
      </select>

      <label>Promo Code</label>
      <input id="promo" placeholder="Enter promo code" />

      <label>Note for Driver</label>
      <textarea id="note" placeholder="Gate code, pickup instructions, accessibility needs, etc."></textarea>
    </div>

    <button class="primary-btn" onclick="calculateRide()">Search Ride</button>

    <br><br>

    <div class="summary" id="summary">
      Trip summary will appear here after you search.
    </div>

    <br>

    <button class="safety-btn" onclick="safetyHelp()">🛡 Safety Help</button>

    <br><br>

    <div class="summary">
      <strong>Cancel Policy:</strong><br>
      You may cancel at no charge before a driver accepts. Fees may apply after driver assignment or long wait time.
    </div>
  </div>

  <div id="map"></div>

</div>

<script>
  let map;
  let directionsService;
  let directionsRenderer;
  let selectedRideType = "economy";
  let mapPickupMode = false;

  function initMap() {
    const defaultLocation = { lat: 38.8339, lng: -104.8214 };

    map = new google.maps.Map(document.getElementById("map"), {
      center: defaultLocation,
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({ map });

    new google.maps.places.Autocomplete(document.getElementById("pickup"));
    new google.maps.places.Autocomplete(document.getElementById("dropoff"));

    map.addListener("click", function(event) {
      if (mapPickupMode) {
        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ location: event.latLng }, function(results, status) {
          if (status === "OK" && results[0]) {
            document.getElementById("pickup").value = results[0].formatted_address;
            mapPickupMode = false;
            alert("Pickup location set.");
          }
        });
      }
    });

    showNearbyDrivers(defaultLocation);
  }

  function showNearbyDrivers(center) {
    const drivers = [
      { lat: center.lat + 0.01, lng: center.lng + 0.01 },
      { lat: center.lat - 0.012, lng: center.lng + 0.008 },
      { lat: center.lat + 0.006, lng: center.lng - 0.014 }
    ];

    drivers.forEach((driver, index) => {
      new google.maps.Marker({
        position: driver,
        map,
        title: "Nearby GlideWay Driver " + (index + 1),
        label: "🚗"
      });
    });
  }

  function useCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        map.setCenter(userLocation);
        map.setZoom(15);

        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ location: userLocation }, function(results, status) {
          if (status === "OK" && results[0]) {
            document.getElementById("pickup").value = results[0].formatted_address;
          }
        });
      },
      function() {
        alert("Please allow location access.");
      }
    );
  }

  function enableMapPickup() {
    mapPickupMode = true;
    alert("Tap anywhere on the map to set your pickup location.");
  }

  function selectRideType(type, element) {
    selectedRideType = type;

    document.querySelectorAll(".ride-card").forEach(card => {
      card.classList.remove("active");
    });

    element.classList.add("active");
  }

  document.getElementById("scheduleType").addEventListener("change", function() {
    document.getElementById("scheduleTime").style.display =
      this.value === "later" ? "block" : "none";
  });

  document.getElementById("riderType").addEventListener("change", function() {
    const show = this.value === "someone_else";

    document.getElementById("otherRiderName").style.display = show ? "block" : "none";
    document.getElementById("otherRiderPhone").style.display = show ? "block" : "none";
  });

  function calculateRide() {
    const pickup = document.getElementById("pickup").value;
    const dropoff = document.getElementById("dropoff").value;

    if (!pickup || !dropoff) {
      alert("Please enter pickup and dropoff location.");
      return;
    }

    directionsService.route(
      {
        origin: pickup,
        destination: dropoff,
        travelMode: google.maps.TravelMode.DRIVING
      },
      function(response, status) {
        if (status === "OK") {
          directionsRenderer.setDirections(response);

          const leg = response.routes[0].legs[0];

          const miles = leg.distance.value / 1609.34;
          const minutes = leg.duration.value / 60;

          let base = 4.50;
          let perMile = 1.65;
          let perMinute = 0.35;

          if (selectedRideType === "comfort") {
            base = 6.50;
            perMile = 2.15;
            perMinute = 0.42;
          }

          if (selectedRideType === "xl") {
            base = 8.50;
            perMile = 2.85;
            perMinute = 0.55;
          }

          let fare = base + miles * perMile + minutes * perMinute + 1.25;
          fare = Math.max(fare, 7.00);

          const promo = document.getElementById("promo").value;
          if (promo.toLowerCase() === "glide10") {
            fare = fare * 0.90;
          }

          document.getElementById("summary").innerHTML = `
            <strong>Trip Summary</strong><br>
            Pickup: ${leg.start_address}<br>
            Dropoff: ${leg.end_address}<br>
            Distance: ${leg.distance.text}<br>
            ETA: ${leg.duration.text}<br>
            Ride Type: ${selectedRideType.toUpperCase()}<br>
            Driver Nearby: 3 drivers available<br>
            Payment: ${document.getElementById("payment").value}<br>
            <br>
            <span class="fare">$${fare.toFixed(2)}</span><br>
            <small>Fare may change based on traffic, tolls, wait time, or route changes.</small>
          `;
        } else {
          alert("Route could not be calculated: " + status);
        }
      }
    );
  }

  function safetyHelp() {
    alert("Safety Help: Call emergency services if you are in danger. GlideWay safety support will be added here.");
  }
</script>

<script
  src="https://maps.googleapis.com/maps/api/js?key=YOUR_NEW_GOOGLE_MAPS_API_KEY&libraries=places&callback=initMap"
  async
  defer>
</script>

</body>
</html>