const url = "https://webworkextension-production.up.railway.app/webhook";

const sendMessageToPopup = (message) => {
    chrome.runtime.sendMessage({ text: message });
};
const sendTicketToPopup = (ticketCount) => {
    chrome.runtime.sendMessage({ ticket: ticketCount });
};
const sendErrorToPopup = (error) => {
    chrome.runtime.sendMessage({ error: error });
};
// Function to send the webhook
function sendWebhook() {
    // Retrieve data from chrome.storage.local
    chrome.storage.local.get(['problemPath', 'randomSeed', 'userid'], (data) => {
        // Use the retrieved data or set default values if not available
        const problemPath = data.problemPath || 'defaultProblemPath';
        const randomSeed = data.randomSeed || 'defaultRandomSeed';
        const userid = data.userid || 'defaultUser';

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
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(result => {
                // Handle the result here
                if (result.error) {
                    sendErrorToPopup(result.error)
                    console.error(result.error)
                }
                if (result.answers) {
                    sendMessageToPopup(result.answers.join(", ")); // Join answers array into a string
                }if (result.ticket) {
                    sendTicketToPopup(result.ticket); // Send ticket value to the popup
                } else if (result.errorCode) {
                    sendMessageToPopup("Webwork account is diffrent"); // ps Old version remove later
                }
            })
            .catch(error => {
                console.error('Error sending webhook:', error);
                throw error; // bugfix purpose
            });

});
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "sendWebhook") {
        sendWebhook();
        sendResponse({status: "Webhook sent"});
    }
});
