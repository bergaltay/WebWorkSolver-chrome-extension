// background.js
// URL to send the webhook
const url = "https://webworkextension-production.up.railway.app/webhook"; // Replace with your webhook URL

const sendMessageToPopup = (message) => {
    chrome.runtime.sendMessage({ text: message });
};
const sendTicketToPopup = (ticketCount) => {
    chrome.runtime.sendMessage({ ticket: ticketCount });
};
// Function to send the webhook
function sendWebhook() {
    // Retrieve data from chrome.storage.local
    chrome.storage.local.get(['problemPath', 'randomSeed', 'userid'], (data) => {
        // Use the retrieved data or set default values if not available
        const problemPath = data.problemPath || 'defaultProblemPath';
        const randomSeed = data.randomSeed || 'defaultRandomSeed';
        const userid = data.userid || 'defaultUser';


        // Data to send in the webhook
        const payload = {
            "filePath" : problemPath,
            "problemSeed" : randomSeed,
            "userid" : userid
        };
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(response => {
                // Check if the response status is OK
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();  // Return the parsed JSON response
            })
            .then(result => {
                // Handle the result here
                if (result.answers) {
                    sendMessageToPopup(result.answers.join(", ")); // Join answers array into a string
                }if (result.ticket) {
                    sendTicketToPopup(result.ticket); // Send ticket value to the popup
                } else if (result.errorCode) {
                    sendMessageToPopup("Webwork account is diffrent");
                }
            })
            .catch(error => {
                console.error('Error sending webhook:', error);
                throw error; // Rethrow error for further handling if necessary
            });

});
}

// Listener to handle messages from the popup or other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "sendWebhook") {
        sendWebhook();
        sendResponse({status: "Webhook sent"});
    }
});
