const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container-1");

// Animations
sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

const register_btn = document.querySelector("#register");
const login_btn = document.querySelector("#log-in");

register_btn.addEventListener("click", registerUser);
login_btn.addEventListener("click", loginUser);

// BaseURL
const baseURL = "https://tech-sankat-nivaaran-4321.onrender.com";

// handling registration
async function registerUser() {
  //getting elements
  const username_input = document.getElementById("sign-in-username");
  const password_input = document.getElementById("sign-in-password");
  const email_input = document.getElementById("sign-in-email");
  //getting values
  const username = username_input.value;
  const password = password_input.value;
  const email = email_input.value;
  if (username && password && email) {
    const res = await fetch(`${baseURL}/driver/register`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ username, password, email }),
    });
    // const data = await res.json();
    if (res.status == 200) {
      container.classList.remove("sign-up-mode");
    } else {
      checkCredentials("Invalid Credentials");
    }
  } else {
    checkCredentials("Empty Fields!!");
  }
}

// Handling login
async function loginUser() {
  // getting elements
  const username_input = document.getElementById("log-in-username");
  const password_input = document.getElementById("log-in-password");
  // getting values
  const username = username_input.value;
  const password = password_input.value;
  if (username && password) {
    const res = await fetch(`${baseURL}/driver/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (res.status == 200) {
      const data = await res.json();
      console.log(data)
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", username)
      location.href = "../view/appdriverPanel.html"
    } else {
      checkCredentials("Invalid Credentials");
    }
  } else {
    checkCredentials("Empty Fields!!");
  }
}

/// function to handle Invalid credentials
async function checkCredentials(message) {
  const invalidspan = document.getElementById("invalid-text");
  const invaliddiv = document.getElementById("invalid");
  invalidspan.innerHTML = message;
  invaliddiv.classList.remove("invalid-invisible");
  setTimeout(() => {
    invaliddiv.classList.add("invalid-invisible");
  }, 1500);
}
