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
let flag = true;
var driver_lat = 22.572645;
var driver_lng = 88.363892;
var driverpos = { lat: driver_lat, lng: driver_lng };
const baseurl = "http://localhost:8080";
async function getrequests() {
  try {
    const res = await fetch(`${baseurl}/users/rides`);
    const { rideRequests } = await res.json();
    nearbyRideRequests = [];
    rideRequests.forEach((item) => {
      const { startLocation } = item;
      const { lat: source_lat, lng: source_lng } = JSON.parse(startLocation);
      const radius = 2;
      var check1 =
        source_lat <= driver_lat + radius && source_lng <= driver_lng + radius;
      var check2 =
        source_lat >= driver_lat - radius && source_lng >= driver_lng - radius;
      if (check1 && check2) {
        nearbyRideRequests.push(JSON.parse(startLocation));
      }
    });
    initMap();
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
  nearbyRideRequests.forEach((loc, i) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Rider : ${i + 1}`;
    const acceptbtn = document.createElement("button");
    acceptbtn.innerHTML = "Accept";
    // acceptbtn.id = "ride-accept";
    listItem.append(acceptbtn);
    acceptbtn.addEventListener("click", () => {
      flag = false;
      rideList.innerHTML = "";
      rideList.append(listItem);
      nearbyRideRequests = [loc];
      initMap();
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
  nearbyRideRequests.forEach((loc, i) => {
    const marker = new google.maps.Marker({
      position: loc,
      map: map,
      title: `User ${i + 1}`,
      draggable: false,
      icon: "../images/ridericon.png",
      animation: google.maps.Animation.DROP,
    });
  });
}

// function always listening for riders
async function lookRiders() {
  try {
    setInterval(() => {
      if (flag) getrequests();
    }, 10000);
  } catch (error) {
    console.log(error);
  }
}
lookRiders();
