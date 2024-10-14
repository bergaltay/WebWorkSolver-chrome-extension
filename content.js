// Function to extract problemPath and randomSeed
function extractData() {
    let problemPath = null;
    let randomSeed  = null;
    let userid        = null;

    // Get the hidden input element
    const hiddenInput = document.querySelector('input[name="randomSeed"]');
    if (hiddenInput) {
        randomSeed = hiddenInput.value;
    } else {
        console.error("randomSeed not found");
    }


    const hiddenInput2 = document.querySelector('input[name="problemPath"]');
    if (hiddenInput2) {
        problemPath = hiddenInput2.value;
    } else {
        console.error("problemPath not found");
    }

    const hiddenInput3 = document.querySelector('input[name="user"]');
    if (hiddenInput3) {
        userid = hiddenInput3.value;
    } else {
        console.error("user not found");
    }


    // Log the extracted values for debugging
    console.log('Extracted:', { problemPath, randomSeed, userid });

    // Send the extracted data to storage
    chrome.storage.local.set({ problemPath, randomSeed, userid }, () => {
        console.log('Data stored:', { problemPath, randomSeed, userid });
    });
}
extractData();
