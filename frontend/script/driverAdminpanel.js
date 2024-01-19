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
  fetch(
    `${baseURL}Driver/?page=${currentPage}&perPage=${itemsPerPage}`,
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
      usernameCell.textContent = driver.drivername;

      const mobileNoCell = document.createElement("td");
      mobileNoCell.textContent = driver.phoneNumber;

      const regDateCell = document.createElement("td");
      regDateCell.textContent = driver.registeredDate;

      const experienceCell = document.createElement("td");
      experienceCell.textContent = `${driver.experience} years`;

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
  console.log("Delete user with ID:", userId);
}

