// ==========================================
// Configurable Mock REST API
// ==========================================

const STATUS_BY_REQUEST_ID = {
    "REQ-400": 400,
    "REQ-401": 401,
    "REQ-404": 404,
    "REQ-409": 409,
    "REQ-500": 500
};

const ERROR_MESSAGES_BY_STATUS = {
    400: "400 Bad Request – Required or invalid data was provided.",
    401: "401 Unauthorized – Authentication is required or the authentication token is invalid.",
    404: "404 Not Found – The requested resource or Request ID was not found.",
    409: "409 Conflict – The Request ID already exists or conflicts with an existing submission.",
    500: "500 Internal Server Error – An unexpected server error occurred."
};


// ==========================================
// DOM Elements
// ==========================================

const form = document.getElementById("documentForm");

const employeeName = document.getElementById("employeeName");
const requestId = document.getElementById("requestId");
const documentType = document.getElementById("documentType");
const submissionDate = document.getElementById("submissionDate");
const documentInput = document.getElementById("document");
const consent = document.getElementById("consent");

const employeeNameError = document.getElementById("employeeNameError");
const requestIdError = document.getElementById("requestIdError");
const documentTypeError = document.getElementById("documentTypeError");
const submissionDateError = document.getElementById("submissionDateError");
const documentError = document.getElementById("documentError");
const consentError = document.getElementById("consentError");

const validationArea = document.getElementById("validationArea");
const validationText = document.getElementById("validationText");
const validationMessages = document.getElementById("validationMessages");

const fileName = document.getElementById("fileName");

const submitButton = document.getElementById("submitButton");
const resetButton = document.getElementById("resetButton");

const submissionSummary = document.getElementById("submissionSummary");


// ==========================================
// Prevent Duplicate Submission
// ==========================================

let isSubmitting = false;


// ==========================================
// Populate Document Type Dropdown
// ==========================================

const documentTypes = [
    "Select document type",
    "Aadhaar Card",
    "PAN Card",
    "Passport",
    "Degree Certificate",
    "Experience Letter",
    "Other"
];

documentTypes.forEach((type, index) => {

    const option = document.createElement("option");

    option.value = index === 0 ? "" : type;
    option.textContent = type;

    if (index === 0) {
        option.disabled = true;
        option.selected = true;
    }

    documentType.appendChild(option);
});


// ==========================================
// File Name Display
// ==========================================

documentInput.addEventListener("change", function () {

    if (documentInput.files.length > 0) {

        fileName.textContent = documentInput.files[0].name;

    } else {

        fileName.textContent = "No file selected";

    }
});


// ==========================================
// Validation Function
// ==========================================

function validateForm() {

    const errors = [];

    // Clear previous field errors
    clearFieldErrors();

    // Employee Name
    if (employeeName.value.trim() === "") {

        employeeNameError.textContent = "Employee name is required.";

        employeeName.classList.add("input-error");

        errors.push("Employee name is required.");
    }


    // Request ID
    if (requestId.value.trim() === "") {

        requestIdError.textContent = "Request ID is required.";

        requestId.classList.add("input-error");

        errors.push("Request ID is required.");
    }


    // Document Type
    if (documentType.value === "") {

        documentTypeError.textContent = "Please select a document type.";

        documentType.classList.add("input-error");

        errors.push("Document type is required.");
    }


    // Submission Date
    if (submissionDate.value === "") {

        submissionDateError.textContent = "Submission date is required.";

        submissionDate.classList.add("input-error");

        errors.push("Submission date is required.");
    }


    // File
    if (documentInput.files.length === 0) {

        documentError.textContent = "Please upload a document.";

        documentInput.classList.add("input-error");

        errors.push("Document upload is required.");

    } else {

        const file = documentInput.files[0];

        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {

            documentError.textContent =
                "Only PDF, DOC, and DOCX files are allowed.";

            documentInput.classList.add("input-error");

            errors.push("Invalid document format.");

        }

        if (file.size > maxSize) {

            documentError.textContent =
                "File size must not exceed 5MB.";

            documentInput.classList.add("input-error");

            errors.push("Document size exceeds 5MB.");
        }
    }


    // Consent
    if (!consent.checked) {

        consentError.textContent =
            "You must confirm the information before submitting.";

        errors.push("Consent confirmation is required.");
    }


    return errors;
}


// ==========================================
// Clear Field Errors
// ==========================================

function clearFieldErrors() {

    employeeNameError.textContent = "";
    requestIdError.textContent = "";
    documentTypeError.textContent = "";
    submissionDateError.textContent = "";
    documentError.textContent = "";
    consentError.textContent = "";

    employeeName.classList.remove("input-error");
    requestId.classList.remove("input-error");
    documentType.classList.remove("input-error");
    submissionDate.classList.remove("input-error");
    documentInput.classList.remove("input-error");
}


// ==========================================
// Show Validation Errors
// ==========================================

function showValidationErrors(errors) {

    validationArea.classList.remove("has-success");
    validationArea.classList.add("has-errors");

    validationText.textContent =
        "Please fix the following errors before submitting:";

    validationMessages.innerHTML = "";

    errors.forEach(function (error) {

        const li = document.createElement("li");

        li.textContent = error;

        validationMessages.appendChild(li);
    });
}


// ==========================================
// Show Loading State
// ==========================================

function showLoadingState() {

    validationArea.classList.remove("has-errors", "has-success");

    validationText.textContent =
        "Your document is being submitted. Please wait.";

    validationMessages.innerHTML = "";

    submitButton.disabled = true;
    resetButton.disabled = true;

    submitButton.textContent = "Submitting...";

    isSubmitting = true;
}


// ==========================================
// Show Success State
// ==========================================

function showSuccessState() {

    validationArea.classList.remove("has-errors");

    validationArea.classList.add("has-success");

    validationText.textContent =
        "Your document has been submitted successfully.";

    validationMessages.innerHTML = "";

    submissionSummary.classList.remove("hidden");

    submissionSummary.innerHTML = `
        <div class="summary-header">
            <span class="success-icon">✓</span>

            <h2>Submission Successful</h2>
        </div>

        <div class="summary-content">

            <div class="summary-row">
                <span>Employee Name</span>
                <strong>${escapeHTML(employeeName.value.trim())}</strong>
            </div>

            <div class="summary-row">
                <span>Request ID</span>
                <strong>${escapeHTML(requestId.value.trim())}</strong>
            </div>

            <div class="summary-row">
                <span>Document Type</span>
                <strong>${escapeHTML(documentType.value)}</strong>
            </div>

            <div class="summary-row">
                <span>Submission Date</span>
                <strong>${escapeHTML(submissionDate.value)}</strong>
            </div>

            <div class="summary-row">
                <span>File</span>
                <strong>${escapeHTML(documentInput.files[0].name)}</strong>
            </div>

            <div class="summary-row">
                <span>Status</span>
                <strong class="status-success">Submitted</strong>
            </div>

        </div>
    `;
}


// ==========================================
// Show Server Error
// ==========================================

function showServerError(message) {

    validationArea.classList.remove("has-success");

    validationArea.classList.add("has-errors");

    validationText.textContent =
        "The server could not process your submission.";

    validationMessages.innerHTML = "";

    const li = document.createElement("li");

    li.textContent = message;

    validationMessages.appendChild(li);

    submissionSummary.classList.add("hidden");
}


// ==========================================
// Escape HTML
// ==========================================

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


// ==========================================
// Submit Form
// ==========================================

form.addEventListener("submit", async function (event) {

    event.preventDefault();


    // Prevent duplicate submission
    if (isSubmitting) {

        return;
    }


    // Validate form
    const errors = validateForm();


    if (errors.length > 0) {

        showValidationErrors(errors);

        return;
    }


    // Show loading state
    showLoadingState();


    try {

        // Create FormData
        const formData = new FormData();

        formData.append(
            "employeeName",
            employeeName.value.trim()
        );

        formData.append(
            "requestId",
            requestId.value.trim()
        );

        formData.append(
            "documentType",
            documentType.value
        );

        formData.append(
            "submissionDate",
            submissionDate.value
        );

        formData.append(
            "document",
            documentInput.files[0]
        );

        formData.append(
            "consent",
            consent.checked
        );


        // ==========================================
        // Determine Mock Status & Endpoint
        // ==========================================

        const enteredRequestId = requestId.value.trim();
        const statusCode = STATUS_BY_REQUEST_ID[enteredRequestId] || 200;
        const apiUrl = `https://httpbin.org/status/${statusCode}`;


        // ==========================================
        // Fetch API
        // ==========================================

        const response = await fetch(apiUrl, {

            method: "POST",

            body: formData

        });


        // ==========================================
        // Handle Non-2xx Responses
        // ==========================================

        if (!response.ok) {

            const errorMessage =
                ERROR_MESSAGES_BY_STATUS[response.status] ||
                `${response.status} ${response.statusText || "Error"} – An unexpected server error occurred.`;

            throw new Error(errorMessage);
        }


        // Success
        showSuccessState();


    } catch (error) {

        console.error("Submission error:", error);

        showServerError(
            error.message ||
            "An unexpected error occurred while submitting the form."
        );


    } finally {

        // Allow another submission after request finishes
        isSubmitting = false;

        submitButton.disabled = false;
        resetButton.disabled = false;

        submitButton.textContent = "Submit";
    }

});


// ==========================================
// Reset Form
// ==========================================

form.addEventListener("reset", function () {

    setTimeout(function () {

        clearFieldErrors();

        validationArea.classList.remove(
            "has-errors",
            "has-success"
        );

        validationText.textContent =
            "Please complete all required fields before submitting.";

        validationMessages.innerHTML = "";

        fileName.textContent =
            "No file selected";

        submissionSummary.classList.add("hidden");

        submissionSummary.innerHTML = "";

        isSubmitting = false;

        submitButton.disabled = false;
        resetButton.disabled = false;

        submitButton.textContent = "Submit";

    }, 0);

});
