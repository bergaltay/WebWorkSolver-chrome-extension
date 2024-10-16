document.getElementById('loginBtn').addEventListener('click', () => {
    // Redirect to main page
    chrome.action.setPopup({ popup: "popup.html" });
    window.location.href = "popup.html";});