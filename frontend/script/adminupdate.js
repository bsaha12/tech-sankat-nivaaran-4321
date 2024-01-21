const baseURL = `https://wild-jade-fish-cap.cyclic.app/`
 async function uploadFile() {
    const profileImageInput = document.getElementById('profileImage');
    const newadminnameInput = document.getElementById('newadminname');
    // const newEmailInput = document.getElementById('newEmail');
    const newPhoneInput = document.getElementById('newPhone');
    const newDesignationInput = document.getElementById('newDesignation');
    const newdateofBirthInput = document.getElementById('newdateofBirth');
    const uploadForm = document.getElementById('uploadForm');
    const uploadedImage = document.getElementById('uploadedImage');

    const formData = new FormData(uploadForm);

    try {
        const response = await fetch("https://wild-jade-fish-cap.cyclic.app/users/profile1", {
            method: 'PATCH',
            // mode: 'no-cors',
            body: formData,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                // 'Content-Type': 'application/json',

            },
        });

        if (response.ok) {
          
            const result = await response.json();
            const imageUrl = result.image;
            
            // Display the uploaded image
            uploadedImage.src = imageUrl;
        } else {
            console.error('Profile update failed');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
    }
}
