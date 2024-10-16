
document.getElementById("runFunction").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "sendWebhook" }, (response) => {
        console.log(response.status);
    });
    deleteContent()
});
//---------------------------------------------------------------------
// popup.js

// Function to load content from storage
function loadContent() {
    chrome.storage.local.get(['popupContent'], (result) => {
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = ''; // Clear existing content

        if (result.popupContent) {
            const answers = result.popupContent.split(','); // Split by comma to get each answer
            let i = 1;
            answers.forEach(answer => {
                const answerDiv = document.createElement('h1'); // Create a new div for each answer
                answerDiv.textContent = i + ":    " + answer.trim(); // Trim whitespace and set the text content
                contentDiv.appendChild(answerDiv); // Append the answer div to the content div
                i++;
            });
        }
    });
}

// Load content when the popup is opened
document.addEventListener('DOMContentLoaded', () => {
    loadContent(); // Load content from storage on popup open
});

// Function to save content to storage
function saveContent(text) {
    chrome.storage.local.set({ popupContent: text }, () => {
        console.log('Content saved:', text);
    });

    loadContent();
}

// Load content when the popup is opened
document.addEventListener('DOMContentLoaded', () => {
    loadContent(); // Load content from storage on popup open
    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        // Check if the message contains the text field
        if (request.text) {
            for (let i = 0;i<1;i++) {
                const contentDiv = document.getElementById('content');
                const answerDiv = document.createElement('h1'); // Create a new div for the incoming text
                answerDiv.textContent = request.text; // Set the text content to the incoming text
                contentDiv.appendChild(answerDiv); // Append to the content div
                saveContent(contentDiv.innerText);
            }
        }
        if (request.ticket) {
            // Display the ticket value in a specific HTML element
            document.getElementById('ticket').innerText = request.ticket;
        }

    });
});
function deleteContent() {
    chrome.storage.local.remove(['popupContent'], () => {
        console.log('Content deleted');
        loadContent(); // Reload the content to reflect the deletion
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = 'Loading...';
    });
}


//---------------------------------------------------------------------

