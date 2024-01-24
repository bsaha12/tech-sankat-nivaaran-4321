document.addEventListener("DOMContentLoaded", () => {
  // Driver status toggle
  const statusElement = document.getElementById("status");
  const toggleStatusButton = document.getElementById("toggle-status");

  toggleStatusButton.addEventListener("click", () => {
    const currentStatus = statusElement.textContent;
    const newStatus =
      currentStatus === "Available" ? "Unavailable" : "Available";
    statusElement.textContent = newStatus;
    const ridediv = document.getElementById("ride-requests");
    if (newStatus === "Available") {
      flag = true;
      const h2 = document.createElement("h2");
      h2.innerHTML = "Ride Requests";
      const ul = document.createElement("ul");
      ul.id = "ride-list";
      ridediv.innerHTML = "";
      ridediv.append(h2, ul);
      getrequests();
    } else if (newStatus === "Unavailable") {
      flag = false;
      ridediv.innerHTML = "";
    }
    // Update driver marker on the map based on status
    // rideRequests.forEach((request) => {
    //   if (request.userId === 1) {
    //     // Assuming the driver has user id 1
    //     const driverMarker = map.markers.find(
    //       (marker) => marker.getTitle() === `Driver ${request.userId}`
    //     );
    //     driverMarker.setPosition(request.driverLocation);
    //   }
    // });
  });
});

// getting list of available riders
var nearbyRideRequests = [];
let flag = false;
var driver_lat = 22.572645;
var driver_lng = 88.363892;
var driverpos = { lat: driver_lat, lng: driver_lng };
const baseurl = "https://tech-sankat-nivaaran-4321.onrender.com";
async function getrequests() {
  try {
    const res = await fetch(`${baseurl}/users/rides`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const { rideRequests } = await res.json();
    nearbyRideRequests = [];
    rideRequests.forEach((item) => {
      const { startLocation, username } = item;
      const { lat: source_lat, lng: source_lng } = JSON.parse(startLocation);
      const radius = 2;
      var check1 =
        source_lat <= driver_lat + radius && source_lng <= driver_lng + radius;
      var check2 =
        source_lat >= driver_lat - radius && source_lng >= driver_lng - radius;
      if (check1 && check2) {
        nearbyRideRequests.push({
          startLocation: JSON.parse(startLocation),
          username,
        });
      }
    });
    // initMap();
    addToMap(nearbyRideRequests);
    addRiders(nearbyRideRequests);
  } catch (error) {
    console.log(error);
  }
}

function addRiders(nearbyRideRequests) {
  // Display ride requests
  const rideList = document.getElementById("ride-list");
  rideList.innerHTML = "";
  nearbyRideRequests.forEach((item, i) => {
    const { startLocation: loc, username } = item;
    const listItem = document.createElement("li");
    listItem.textContent = `${username}'s request`;
    const acceptbtn = document.createElement("button");
    acceptbtn.innerHTML = "Accept";
    // acceptbtn.id = "ride-accept";
    listItem.append(acceptbtn);
    acceptbtn.addEventListener("click", () => {
      flag = false;
      rideList.innerHTML = "";
      rideList.append(listItem);
      acceptbtn.innerHTML = "";
      acceptbtn.innerHTML = `<span class="material-symbols-outlined">
      check_circle
      </span>`;
      acceptbtn.classList.add("back-color-white");
      nearbyRideRequests = [item];
      roadmap({ source: driverpos, destination: loc });
      addToMap(nearbyRideRequests);
    });
    rideList.append(listItem);
  });
}

let map; // Make map a global variable so it can be accessed later
// adding riders location to map
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 22.572645, lng: 88.363892 },
    zoom: 10,
  });
  //display driver location
  new google.maps.Marker({
    position: driverpos,
    map: map,
    title: `Driver`,
    draggable: false,
    icon: "../icons/caricon.png",
    animation: google.maps.Animation.DROP,
  });
}

// add icon to map
function addToMap(nearbyRideRequests) {
  //   Display Riders markers on the map
  nearbyRideRequests.forEach((item, i) => {
    const { startLocation: loc, username } = item;
    const marker = new google.maps.Marker({
      position: loc,
      map: map,
      title: username,
      draggable: false,
      icon: "../images/ridericon.png",
      animation: google.maps.Animation.DROP,
    });
  });
}

// map function to generate road
function roadmap({ source, destination }) {
  // Rendering Direction
  let directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer({
    polylineOptions: {
      strokeColor: "#000000",
    },
  });
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 22.572645, lng: 88.363892 },
    zoom: 10,
  });
  //display driver location
  new google.maps.Marker({
    position: driverpos,
    map: map,
    title: `Driver`,
    draggable: false,
    icon: "../icons/caricon.png",
    animation: google.maps.Animation.DROP,
  });
  directionsRenderer.setMap(map);
  const request = {
    origin: source,
    destination: destination,
    travelMode: "DRIVING",
  };

  directionsService.route(request, function (result, status) {
    if (status === "OK") {
      directionsRenderer.setDirections(result);
      // const distance = result.routes[0].legs[0].distance.text;
      // const source = startMarker.getPosition().toJSON();
      // const destination = destinationMarker.getPosition().toJSON();
      // showCarsPanel(source, destination, distance);
    } else {
      console.error("Directions request failed with status:", status);
    }
  });
}

// function always listening for riders
// async function lookRiders() {
//   try {
//     setInterval(() => {
//       if (flag) getrequests();
//     }, 10000);
//   } catch (error) {
//     console.log(error);
//   }
// }
// lookRiders();
