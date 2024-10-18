document.getElementById('loginBtn').addEventListener('click', () => {
    chrome.action.setPopup({ popup: "popup.html" });
    window.location.href = "popup.html";});