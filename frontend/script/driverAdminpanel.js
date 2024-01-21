const baseURL = `https://wild-jade-fish-cap.cyclic.app/`



let currentPage = 1;
const itemsPerPage = 10;
let paginationWrapper = document.getElementById("pagination");

function getData() {
  fetch(
    `${baseURL}driver/?page=${currentPage}&perPage=${itemsPerPage}`,
    {
      headers: {
        "Content-type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data.drivers_data);
      displayUsers(data);
      createPaginationControls(data.totalDrivers);
    })
    .catch((err) => console.log(err));
}

function displayUsers(data) {
    
  const tableBody = document.querySelector("tbody");
  const drivers = data.drivers_data;
  tableBody.innerHTML = "";
  drivers.forEach((driver, index) => {
    
      const newRow = document.createElement("tr");
      const displayedIndex = (currentPage - 1) * itemsPerPage + index + 1; // Calculate the correct index

    newRow.id = `tablerow_${displayedIndex}`;

      const entryNoCell = document.createElement("td");
      entryNoCell.textContent = displayedIndex;

      const userInfoCell = document.createElement("td");
      userInfoCell.classList.add("u_info");

      const driverinfo = document.createElement("div");
      driverinfo.classList.add("client");

      const imageDiv = document.createElement("div");
      imageDiv.classList.add("client-img", "bg-img");

      const userImage = document.createElement("img");
      userImage.src = driver.image || "../images/default.jpg";

      const infoDiv = document.createElement("div");
      infoDiv.classList.add("client-info");

      const userName = document.createElement("h4");
      userName.textContent = driver.drivername;

      const userEmail = document.createElement("small");
      userEmail.textContent = driver.email;

      const usernameCell = document.createElement("td");
      usernameCell.textContent = driver.username;

      const mobileNoCell = document.createElement("td");
      mobileNoCell.textContent = driver.phoneNumber;

      const regDateCell = document.createElement("td");
      regDateCell.textContent = driver.registeredDate;

      const experienceCell = document.createElement("td");
      if (driver.experience !== undefined && driver.experience !== null) {
        experienceCell.textContent = `${driver.experience} years`;
    } else {
        experienceCell.textContent = "not defined";
    }

      const totalridesCell = document.createElement("td");
      totalridesCell.textContent = driver.totalrides;

      const actionsCell = document.createElement("td");
      actionsCell.classList.add("actions");

      // const editIcon = createIcon('la', 'la-edit', () => editUser(driver._id));
      const deleteIcon = createIcon("la", "la-trash-alt", () =>
        deleteUser(driver._id)
      );
      const ellipsisIcon = createIcon("las", "la-ellipsis-v");

      actionsCell.append(deleteIcon, ellipsisIcon);
      // actionsCell.append(editIcon, deleteIcon, ellipsisIcon);
      imageDiv.appendChild(userImage);
      infoDiv.append(userName, userEmail);
      userInfoCell.append(driverinfo);
      driverinfo.append(imageDiv, infoDiv);

      newRow.append(
        entryNoCell,
        userInfoCell,
        usernameCell,
        mobileNoCell,
        regDateCell,
        experienceCell,
        totalridesCell,
        actionsCell
      );

      tableBody.appendChild(newRow);
    
  });
//   createPaginationControls();
}
function createPaginationControls(totalDrivers) {
  const totalPages = Math.ceil(totalDrivers / itemsPerPage);

  paginationWrapper.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.addEventListener("click", () => {
      currentPage = i;
      getData();
    });
    paginationWrapper.appendChild(button);
  }
}

function createIcon(iconSet, iconName, clickHandler) {
  const icon = document.createElement("span");
  icon.classList.add(iconSet, iconName);
  icon.addEventListener("click", clickHandler);
  return icon;
}

getData();

function editUser(userId) {
  console.log("Edit user with ID:", userId);
}

function deleteUser(userId) {
  if (confirm("Are you sure you want to delete this user?")) {
    fetch(`${baseURL}driver/delete/${userId}`, {
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


