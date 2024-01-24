const baseurl = "https://tech-sankat-nivaaran-4321.onrender.com";
const username = localStorage.getItem("name") || "shraddha";
async function getuserdata() {
  try {
    const res = await fetch(`${baseurl}/users/profile/${username}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const {
      user: { email, name, bio, birthday, phone, website },
    } = await res.json();
    const profileUsername = document.getElementById("profile-username");
    const profileEmail = document.getElementById("profile-email");
    const profileName = document.getElementById("profile-name");
    const profileBio = document.getElementById("profile-bio");
    const profileBirthday = document.getElementById("profile-birthday");
    const profilePhone = document.getElementById("profile-phone");
    const profileWebsite = document.getElementById("profile-website");

    // putting values
    profileEmail.value = email;
    profileUsername.value = username;
    if (name) profileName.value = name;
    if (bio) profileBio.value = bio;
    if (birthday) profileBirthday.value = birthday;
    if (phone) profilePhone.value = phone;
    if (website) profileWebsite.value = website;
  } catch (error) {
    console.log(error);
  }
}

getuserdata();

const changeBtn = document.getElementById("profile-change-btn");
changeBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const profileName = document.getElementById("profile-name");
  const profileBio = document.getElementById("profile-bio");
  const profileBirthday = document.getElementById("profile-birthday");
  const profilePhone = document.getElementById("profile-phone");
  const profileWebsite = document.getElementById("profile-website");
  const payload = {
    name: profileName.value,
    bio: profileBio.value,
    birthday: profileBirthday.value,
    phone: profilePhone.value,
    website: profileWebsite.value,
  };
  //   console.log(payload)
  try {
    const res = await fetch(`${baseurl}/users/updateprofile/${username}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    location.reload();
  } catch (error) {
    console.log(error);
  }
});
