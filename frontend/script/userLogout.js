function setActiveLink(link) {
    // Remove the 'active' class from all nav-links
    document.querySelectorAll('.nav-link').forEach(navLink => {
        navLink.classList.remove('active');
    });

    // Add the 'active' class to the clicked nav-link
    link.classList.add('active');
}

function goToProfile() {
    window.location.href = "../view/profile.html";
}

function logout() {
    const accessToken = localStorage.getItem("token");

    fetch(`https://wild-jade-fish-cap.cyclic.app/users/logout`, {
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
}