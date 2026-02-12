// DOM elements
const form = document.getElementById('upload-form');
const responseMessage = document.getElementById('response-message');
const responseText = document.getElementById('response-text');
const copyBtn = document.getElementById('copy-btn');
const fileInput = document.getElementById('image-input');
const fileNameDisplay = document.getElementById('file-name-display');

// Show selected file name
if (fileInput) {
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            fileNameDisplay.textContent = fileInput.files[0].name;
        } else {
            fileNameDisplay.textContent = '';
        }
    });
}

// Store the uploaded URL for copy functionality
let uploadedUrl = '';

// Copy to clipboard
function copyToClipboard() {
    if (uploadedUrl) {
        navigator.clipboard.writeText(uploadedUrl).then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy Link';
            }, 2000);
        });
    }
}

// Make copyToClipboard globally accessible
window.copyToClipboard = copyToClipboard;

// Form submission
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch('/api/store-image', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.text();
                uploadedUrl = data.trim();
                responseText.textContent = uploadedUrl;
                responseMessage.className = 'success';
                responseMessage.style.display = 'block';
                copyBtn.style.display = 'inline-block';
            } else {
                const errorData = await response.text();
                responseText.textContent = `Error: ${errorData}`;
                responseMessage.className = 'error';
                responseMessage.style.display = 'block';
                copyBtn.style.display = 'none';
            }
        } catch (error) {
            responseText.textContent = 'There was an error processing your request.';
            responseMessage.className = 'error';
            responseMessage.style.display = 'block';
            copyBtn.style.display = 'none';
        }
    });
}