// const baseURL = `https://tech-sankat-nivaaran-4321.onrender.com/`;

fetch(`${baseURL}users/profile`, {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}`, // Replace with your actual authentication token
    "Content-Type": "application/json",
  },
})
  .then(response => response.json())
  .then(admin => {
    // side bar photo
    const profile = document.getElementById("profile");
    const profilePhoto = document.getElementById("profileimg");

    const imagephoto = document.createElement("img");
    if (!admin.image) {
      imagephoto.src = "../images/default.jpg";
    } else {
      imagephoto.src = `${baseURL}${admin.image}`;
    }

    const adminname = document.createElement("h4");
    adminname.innerText = admin.username; // Assuming the property name is "name"

    const position = document.createElement("small");
    position.innerText = admin.designation; // Assuming the property name is "destination"

    profilePhoto.innerHTML = ""; // Clear the existing content
    profilePhoto.append(imagephoto);
    profile.append(profilePhoto, adminname, position);

    // navBar photo
    const profilePhoto1 = document.getElementById("profileimg1");

    const imagephoto1 = document.createElement("img");
    if (!admin.image) {
      imagephoto1.src = "../images/default.jpg";
    } else {
      imagephoto1.src = `${baseURL}${admin.image}`;
    }
    profilePhoto1.innerHTML = ""; // Clear the existing content
    profilePhoto1.append(imagephoto1);
  })
  .catch(error => {
    console.error("Error fetching user profile:", error);
  });