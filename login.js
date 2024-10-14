document.getElementById('loginBtn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const url = "https://webworkextension-production.up.railway.app/userLogin"; // Replace with your webhook URL

    const payload = {
        "email" : username,
        "password" : password,
    };
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
        .then(response => {
            return response.json();
        })
        .then(result => {
            // Handle the result here
            if (result.loginStatus === "pass") {
                chrome.storage.local.set({ loggedIn: true }, () => {
                    // Redirect to main page
                    chrome.action.setPopup({ popup: "popup.html" });
                    window.location.href = "popup.html";
                });

            } else {
                document.getElementById('message').textContent = "User not found or subscription ended";
                throw new Error("User not found");
            }
        })
        .catch(error => {
            console.error('Error sending webhook:', error);
            throw error; // Rethrow error for further handling if necessary
        });
});
