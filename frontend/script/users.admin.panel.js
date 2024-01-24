const baseURL = `https://tech-sankat-nivaaran-4321.onrender.com/`


let currentPage = 1;
const itemsPerPage = 10;
let paginationWrapper = document.getElementById("pagination");

function getData() {
  fetch(
    `${baseURL}users/riders?page=${currentPage}&perPage=${itemsPerPage}`,
    {
      headers: {
        "Content-type": "application/json",
        "Authorization":`Bearer ${localStorage.getItem("token")}`
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data.users_data);
      displayAdmin(data);
      createPaginationControls(data.totalAdmin);
    })
    .catch((err) => console.log(err));
}

function displayAdmin(data) {
    
  const tableBody = document.querySelector("tbody");
  console.log(data)
  const admins = data.users_data;
  tableBody.innerHTML = "";
  admins.forEach((admin, index) => {
    
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
      userImage.src = admin.image || "../images/default.jpg";

      const infoDiv = document.createElement("div");
      infoDiv.classList.add("client-info");

      const userName = document.createElement("h4");
      userName.textContent = admin.name;

      const userEmail = document.createElement("small");
      userEmail.textContent = admin.email;

      const usernameCell = document.createElement("td");
      usernameCell.textContent = admin.username;

      const mobileNoCell = document.createElement("td");
      mobileNoCell.textContent = admin.number;

      const regDateCell = document.createElement("td");
      regDateCell.textContent = admin.registeredDate;

      const roleCell = document.createElement("td");
      roleCell.textContent = admin.role;

      const designationCell = document.createElement("td");
      designationCell.textContent = admin.bio;

      const DoBCell = document.createElement("td");
      DoBCell.textContent = admin.birthday;

      const actionsCell = document.createElement("td");
      actionsCell.classList.add("actions");

      // const editIcon = createIcon('la', 'la-edit', () => editUser(driver._id));
      const deleteIcon = createIcon("la", "la-trash-alt", () =>
        deleteUser(admin._id)
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
        roleCell,
        designationCell,
        DoBCell,
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
    fetch(`${baseURL}users/delete/${userId}`, {
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
        location.href = '../index.html';
    })
    .catch((error) => {
        console.error(error);
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const table = document.getElementById("userTable");

    if (table) {
        const headers = table.querySelectorAll("th[data-sort]");

        headers.forEach(header => {
            header.addEventListener("click", () => {
                const sortOrder = header.getAttribute("data-sort-order") || "asc";
                const sortBy = header.getAttribute("data-sort");

                // Make a request to the backend API with the sort parameters
                fetchData(sortBy, sortOrder)
                    .then(data => {
                        // Update the table with the sorted data
                        updateTable(table, data);

                        // Toggle the sort order for the clicked column
                        header.setAttribute("data-sort-order", sortOrder === "asc" ? "desc" : "asc");
                    })
                    .catch(error => {
                        console.error("Error fetching data:", error);
                    });
            });
        });
    }
});

function fetchData(sortBy, sortOrder) {
    const url = `${baseURL}users/admin?sortBy=${sortBy}&sortOrder=${sortOrder}`;

    return fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization":`Bearer ${localStorage.getItem("token")}`
            // Include any necessary headers, such as authentication headers
        },
    })
        .then(response => response.json())
        .then(data => data.users_data)
        .catch(error => {
            throw error;
        });
}

// Function to update the table with the sorted data
function updateTable(table, data) {
    const tbody = table.querySelector("tbody");

    if (tbody) {
        tbody.innerHTML = "";

        data.forEach(item => {
            const row = document.createElement("tr");

            // Create and append td elements for each property in your data
            // Modify this part according to your data structure
            Object.values(item).forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            tbody.appendChild(row);
        });
    }
}