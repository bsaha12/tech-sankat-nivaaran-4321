const baseURL = `http://localhost:8080/`

// side bar photo
const profile = document.getElementById("profile");
const profilePhoto = document.getElementById("profileimg");

const imagephoto = document.createElement("img");
imagephoto.src = localStorage.getItem("image") || "../images/default.jpg";

const adminname = document.createElement("h4");
adminname.innerText = localStorage.getItem("name");

const position = document.createElement("small");
position.innerText = localStorage.getItem("position") || "admin";

profilePhoto.append(imagephoto);
profile.append(profilePhoto, adminname, position);

// navBar photo
const profilePhoto1 = document.getElementById("profileimg1");

const imagephoto1 = document.createElement("img");
imagephoto1.src = localStorage.getItem("image") || "../images/default.jpg";

profilePhoto1.append(imagephoto1);

let currentPage = 1;
const itemsPerPage = 10;
let paginationWrapper = document.getElementById("pagination");

function getData() {
    
    fetch("http://localhost:8080/carData/", {
      headers: {
        "Content-type": "application/json",
      //   authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        displayService(data);
      })
      .catch((err) => console.log(err));
  
  }
  function displayService(data) {
    
    const tableBody = document.querySelector("tbody");
    const services = data.cars_data;
    tableBody.innerHTML = "";
    services.forEach((service, index) => {
      
        const newRow = document.createElement("tr");
        const displayedIndex = (currentPage - 1) * itemsPerPage + index + 1; // Calculate the correct index
  
      newRow.id = `tablerow_${displayedIndex}`;
  
        const entryNoCell = document.createElement("td");
        entryNoCell.textContent = displayedIndex;
  
        const serviceInfoCell = document.createElement("td");
        serviceInfoCell.classList.add("u_info");
  
        const serviceinfo = document.createElement("div");
        serviceinfo.classList.add("client");
  
        const imageDiv = document.createElement("div");
        imageDiv.classList.add("client-img", "bg-img");
  
        const userImage = document.createElement("img");
        userImage.src = service.image || "../images/default.jpg";
  
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("client-info");
  
        const userName = document.createElement("h4");
        userName.textContent = service.name;
  
        // const userEmail = document.createElement("small");
        // userEmail.textContent = service.email;
  
        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = service.description;
  
        const reasonCell = document.createElement("td");
        reasonCell.textContent = service.reason;
  
        const regDateCell = document.createElement("td");
        regDateCell.textContent = service.registeredDate;
  
        // const experienceCell = document.createElement("td");
        // experienceCell.textContent = `${service.experience} years`;
  
        const typeCell = document.createElement("td");
        typeCell.textContent = service.type;
  
        const actionsCell = document.createElement("td");
        actionsCell.classList.add("actions");
  
        const editIcon = createIcon('la', 'la-edit', () => editUser(driver._id));
        const deleteIcon = createIcon("la", "la-trash-alt", () =>
          deleteUser(service._id)
        );
        const ellipsisIcon = createIcon("las", "la-ellipsis-v");
  
        // actionsCell.append(deleteIcon, ellipsisIcon);
        actionsCell.append(editIcon, deleteIcon);
        imageDiv.appendChild(userImage);
        infoDiv.append(userName);
        serviceInfoCell.append(serviceinfo);
        serviceinfo.append(imageDiv, infoDiv);
  
        newRow.append(
          entryNoCell,
          serviceInfoCell,
          descriptionCell,
          reasonCell,

          regDateCell,
          typeCell,
        //   experienceCell,
          actionsCell
        );
  
        tableBody.appendChild(newRow);
      
    });
  //   createPaginationControls();
  }

  function createIcon(iconSet, iconName, clickHandler) {
    const icon = document.createElement("span");
    icon.classList.add(iconSet, iconName);
    icon.addEventListener("click", clickHandler);
    return icon;
  }
  
  getData();


  function deleteUser(carId) {
    if (confirm("Are you sure you want to delete this user?")) {
      fetch(`${baseURL}carData/delete/${carId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else if (res.status === 404) {
            throw new Error("Driver not found");
          } else {
            throw new Error("Delete operation failed");
          }
        })
        .then((data) => {
          // Handle success
          getData();
        })
        .catch((err) => console.error("Error during delete operation:", err.message));
    }
  }

  const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener('click', (e) => {

    e.preventDefault();

    const accessToken = localStorage.getItem("token");
    
    fetch(`${baseURL}users/logout`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        
    })
    .then((response) => {
        if (response.ok) {
            localStorage.removeItem("token")
            return response.json();
            
        } else {
            throw new Error(`Logout failed: ${response.statusText}`);
        }
    })
    .then((result) => {
        console.log(result.msg); 
        location.href = '../view/index.html';
    })
    .catch((error) => {
        console.error(error);
    });
});