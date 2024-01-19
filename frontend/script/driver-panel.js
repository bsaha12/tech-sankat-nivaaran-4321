// Assuming your rideRequests include driver's location information
const rideRequests = [
    { userId: 1, startLocation: "A", destinationLocation: "B", driverLocation: { lat: 20.5937, lng: 78.9629 } },
    { userId: 2, startLocation: "C", destinationLocation: "D", driverLocation: { lat: 22.5937, lng: 77.9629 } },
    // Add more ride requests as needed
];

let map; // Make map a global variable so it can be accessed later

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 20.5937, lng: 78.9629 },
        zoom: 5,
    });

    // Display driver markers on the map
    rideRequests.forEach((request) => {
        const marker = new google.maps.Marker({
            position: request.driverLocation,
            map: map,
            title: `Driver ${request.userId}`,
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Display ride requests
    const rideList = document.getElementById("ride-list");
    rideRequests.forEach((request) => {
        const listItem = document.createElement("li");
        listItem.textContent = `User ${request.userId}: ${request.startLocation} to ${request.destinationLocation}`;
        rideList.appendChild(listItem);
    });

    // Driver status toggle
    const statusElement = document.getElementById("status");
    const toggleStatusButton = document.getElementById("toggle-status");

    toggleStatusButton.addEventListener("click", () => {
        const currentStatus = statusElement.textContent;
        const newStatus = currentStatus === "Available" ? "Unavailable" : "Available";
        statusElement.textContent = newStatus;

        // Update driver marker on the map based on status
        rideRequests.forEach((request) => {
            if (request.userId === 1) { // Assuming the driver has user id 1
                const driverMarker = map.markers.find(marker => marker.getTitle() === `Driver ${request.userId}`);
                driverMarker.setPosition(request.driverLocation);
            }
        });
    });
});
