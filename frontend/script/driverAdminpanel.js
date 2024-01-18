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
function getData(url, data_param, page) {
  fetch(
    `${baseURL}Driver/?page=${currentPage}&perPage=${itemsPerPage}`,
    {
      headers: {
        "Content-type": "application/json",
      },
    }
  )
  .then((res) => {
    let total = res.headers.get(("x-total-count"));
    let numberOfButtons = Math.ceil(total/ itemsPerPage);
    createButtons(numberOfButtons, data_param);
    return res.json();
  })
    .then((data) => {
      console.log(data.drivers_data);
      drivers = data.drivers_data;
      
      displayUsers(data);
    })
    .catch((err) => console.log(err));
}

function displayUsers(data) {
    
  const tableBody = document.querySelector("tbody");
  const drivers = data.drivers_data;

  drivers.forEach((driver, index) => {
    
      const newRow = document.createElement("tr");
      newRow.id = `tablerow_${index + 1}`;

      const entryNoCell = document.createElement("td");
      entryNoCell.textContent = index + 1;

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

function createButtons(number, query) {
    paginationWrapper.innerHTML = "";
    for (let i = 1; i <= number; i++) {
      const pageButtons = document.createElement("button");
      pageButtons.textContent = i;
      pageButtons.addEventListener("click", (e) => {
        getData(baseURL, query, i);
      })
      paginationWrapper.append(pageButtons);
    }
  }
function createIcon(iconSet, iconName, clickHandler) {
  const icon = document.createElement("span");
  icon.classList.add(iconSet, iconName);
  icon.addEventListener("click", clickHandler);
  return icon;
}

// Call getData initially to fetch and display the data
getData();

function editUser(userId) {
  // Logic for editing user with the given userId
  console.log("Edit user with ID:", userId);
}

function deleteUser(userId) {
  // Logic for deleting user with the given userId
  console.log("Delete user with ID:", userId);
}

// getData();
