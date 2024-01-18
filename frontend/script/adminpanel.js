function getData() {
    fetch("https://note-app-2fp7.onrender.com/users", {
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.user_data);
        displayUser(data);
      })
      .catch((err) => console.log(err));
  }
  
  function displayUser(data) {
    const userList = document.getElementById("user-card-list");
    const users = data.user_data;
  
    users.forEach((user) => {
      const userCard = document.createElement("div");
      userCard.classList.add("user-card");
  
      const name = document.createElement("h4");
      name.innerText = `username: ${user.username}`;
  
      const email = document.createElement("p");
      email.innerText = `email: ${user.email}`;
        
      const role = document.createElement("p");
      role.innerText = `role: ${user.role}`;
      
  
      userCard.append(name, email, role);
      
  
      userList.appendChild(userCard);
    });
  }
  
  getData();