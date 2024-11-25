// Get the form and response div elements
const form = document.getElementById('upload-form');
const responseMessage = document.getElementById('response-message');

// Add event listener to the form for async submission
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Create FormData from the form
    const formData = new FormData(form);

    try {
        // Send the form data asynchronously using fetch
        const response = await fetch('/api/store-image', {
            method: 'POST',
            body: formData
        });

        // Check if the request was successful
        if (response.ok) {
            const data = await response.text(); // Use text() to handle plain text response
            // Display the success message
            responseMessage.innerHTML = `${data}`;
            responseMessage.style.color = 'green';
        } else {
            const errorData = await response.text();
            // Display the error message
            responseMessage.innerHTML = `<p>Error: ${errorData}</p>`;
            responseMessage.style.color = 'red';
        }
    } catch (error) {
        // Handle network or other errors
        responseMessage.innerHTML = `<p>There was an error processing your request.</p>`;
        responseMessage.style.color = 'red';
    }
});