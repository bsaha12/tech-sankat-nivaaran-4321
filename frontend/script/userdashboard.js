const parent = document.getElementById("profileimg1");

const header1 = document.createElement("h4");
header1.innerText = `Hello ${localStorage.getItem("name")}!`;
parent.append(header1);

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 20.5937, lng: 78.9629 },
    zoom: 13,
  });

  const startInput = document.getElementById("startLocation");
  const destinationInput = document.getElementById("destinationLocation");

  const startSearchBox = new google.maps.places.SearchBox(startInput);
  const destinationSearchBox = new google.maps.places.SearchBox(
    destinationInput
  );

  map.addListener("bounds_changed", function () {
    startSearchBox.setBounds(map.getBounds());
    destinationSearchBox.setBounds(map.getBounds());
  });

  let startMarker;
  let destinationMarker;

  startSearchBox.addListener("places_changed", function () {
    const places = startSearchBox.getPlaces();
    if (places.length === 0) return;

    if (startMarker) {
      startMarker.setMap(null);
      startMarker = null;
    }

    startMarker = new google.maps.Marker({
      map: map,
      title: places[0].name,
      position: places[0].geometry.location,
      draggable: false,
      icon: "../icons/riding.png",
      animation: google.maps.Animation.DROP,
    });

    calculateAndDisplayRoute();
  });

  destinationSearchBox.addListener("places_changed", function () {
    const places = destinationSearchBox.getPlaces();
    if (places.length === 0) return;

    if (destinationMarker) {
      destinationMarker.setMap(null);
    }

    destinationMarker = new google.maps.Marker({
      map: map,
      title: places[0].name,
      position: places[0].geometry.location,
      draggable: false,
      icon: "../icons/cabstand.png",
      animation: google.maps.Animation.DROP,
    });

    calculateAndDisplayRoute();
  });

  // Rendering Direction
  let directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer({
    polylineOptions: {
      strokeColor: "#000000",
    },
  });
  directionsRenderer.setMap(map);

  /// displaying route
  function calculateAndDisplayRoute() {
    if (startMarker && destinationMarker) {
      const request = {
        origin: startMarker.getPosition(),
        destination: destinationMarker.getPosition(),
        travelMode: "DRIVING",
      };

      directionsService.route(request, function (result, status) {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
          const distance = result.routes[0].legs[0].distance.text;
          const source = startMarker.getPosition().toJSON();
          const destination = destinationMarker.getPosition().toJSON();
          showCarsPanel(source, destination, distance);
        } else {
          console.error("Directions request failed with status:", status);
        }
      });
    }
  }
}

// initMap();

async function showCarsPanel(source, destination, distance) {
  const confirmbtn = document.getElementById("confirm");
  confirmbtn.classList.add("confirm-fill");
  confirmbtn.removeEventListener("click", myfunction);
  confirmbtn.addEventListener("click", myfunction);
  function myfunction() {
    const carspanel = document.getElementById("cars-panel");
    carspanel.innerHTML = "";
    distance = Number.parseInt(distance);
    carspanel.classList.toggle("cars-panel-invisible");
    addcars(source, destination, distance);
    var btnvalue = confirmbtn.value;
    if (btnvalue == "Confirm") confirmbtn.value = "Cancel";
    else if (btnvalue == "Cancel") confirmbtn.value = "Confirm";
  }
}

const baseurl = "https://tech-sankat-nivaaran-4321.onrender.com";
// const baseurl = "https://jealous-umbrella-moth.cyclic.app";
async function addcars(source, destination, distance) {
  try {
    const carspanel = document.getElementById("cars-panel");
    carspanel.innerHTML = "";
    const res = await fetch(`${baseurl}/carData`);
    const { cars_data: cars } = await res.json();
    cars.forEach((item, i, arr) => {
      const { image, name, price } = item;
      const totalfare = distance * 25 + Number(price);
      const paneldiv = document.createElement("div");
      paneldiv.classList.add("cars-panel-item");
      paneldiv.classList.add(`panel-item-${i + 1}`);
      paneldiv.addEventListener("click", () => {
        const bookbutton = document.getElementById("book-ride");
        bookbutton.innerHTML = `Request ${name}`;
        removemarkerfrompanelitems();
        paneldiv.classList.add("cars-panel-border-color");
      });
      const carimage = document.createElement("img");
      carimage.src = image;
      const cartype = document.createElement("span");
      cartype.innerHTML = name;
      const fare = document.createElement("span");
      fare.innerHTML = `₹${totalfare}`;
      paneldiv.append(carimage, cartype, fare);
      carspanel.append(paneldiv);
    });
    const bookbtn = document.createElement("button");
    bookbtn.id = "book-ride";
    bookbtn.innerHTML = `Choose Ride`;
    bookbtn.addEventListener("click", () => {
      sendRequest(source, destination);
      const section = document.querySelector("#popup");
      const container = document.querySelector("#container");
      setTimeout(() => {
        section.classList.add("active");
        section.classList.remove("contact-invisible");
        container.classList.add("dashboard-opacity");
      }, 4000);
    });
    carspanel.append(bookbtn);
  } catch (error) {
    console.log(error);
  }
}

// removing markers
function removemarkerfrompanelitems() {
  const panelItems = document.getElementsByClassName("cars-panel-item");
  const panelItemsarray = Array.prototype.slice.call(panelItems);
  panelItemsarray.forEach((item) => {
    item.classList.remove("cars-panel-border-color");
  });
}

//sendNotification to driver
async function sendRequest(source, destination) {
  const username = localStorage.getItem("name")|| "shradhha" ;
  try {
    await fetch(`${baseurl}/users/requestRide`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        username,
        startLocation: JSON.stringify(source),
        destinationLocation: JSON.stringify(destination),
      }),

      
    });
    // window.location.href = "../view/index.html"
  } catch (error) {
    console.log(error);
  }
}
