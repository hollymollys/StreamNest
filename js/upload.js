/*
====================================================
StreamNest Upload
upload.js
====================================================
*/

"use strict";

document.addEventListener("DOMContentLoaded", initializeUpload);

/*
====================================================
Initialize Upload Page
====================================================
*/

function initializeUpload() {

    redirectIfNotLoggedIn();

    loadCurrentUser();

    const uploadForm = document.getElementById("uploadForm");
    const mediaInput = document.getElementById("mediaFile");

    if (mediaInput) {

        mediaInput.addEventListener("change", previewMedia);

    }

    if (uploadForm) {

        uploadForm.addEventListener("submit", uploadContent);

    }

}

/*
====================================================
Load Current User
====================================================
*/

function loadCurrentUser() {

    const user = getCurrentUser();

    if (!user) return;

    const profileName = document.getElementById("profileName");
    const profileRole = document.getElementById("profileRole");

    if (profileName)
        profileName.textContent = user.fullname;

    if (profileRole)
        profileRole.textContent = "Creator";

}

/*
====================================================
Preview Selected File
====================================================
*/

function previewMedia(event) {

    const file = event.target.files[0];

    if (!file) return;

    const previewBox = document.getElementById("previewBox");

    const reader = new FileReader();

    reader.onload = function(e) {

        if (file.type.startsWith("image")) {

            previewBox.innerHTML = `

                <img
                    src="${e.target.result}"
                    class="preview-image"
                    alt="Preview">

            `;

        }

        else {

            previewBox.innerHTML = `

                <video
                    controls
                    class="preview-video">

                    <source
                        src="${e.target.result}">

                </video>

            `;

        }

    };

    reader.readAsDataURL(file);

}

/*
====================================================
Upload Content
====================================================
*/

async function uploadContent(event) {

    event.preventDefault();

    const uploadButton = document.querySelector(
        "#uploadForm button[type='submit']"
    );

    const mediaFile = document.getElementById("mediaFile").files[0];

    const title = document.getElementById("title").value.trim();

    const description = document.getElementById("description").value.trim();

    const category = document.getElementById("category").value;

    const visibility = document.getElementById("visibility").value;

    const uploadType = document.getElementById("uploadType").value;

    if (!mediaFile) {

        showMessage(
            "uploadMessage",
            "Please select a file.",
            "error"
        );

        return;

    }

    try {

        setButtonLoading(

            uploadButton,

            '<i class="fa-solid fa-spinner fa-spin"></i> Uploading...'

        );

        /*
        ============================================
        Build FormData
        ============================================
        */

        const formData = new FormData();

        formData.append("media", mediaFile);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("visibility", visibility);
        formData.append("uploadType", uploadType);

        /*
        ============================================
        Backend API
        ============================================

        POST /api/videos/upload

        (Enable later)

        const response = await apiRequest(
            "/videos/upload",
            "POST",
            formData,
            true
        );

        ============================================
        */

        simulateProgress();

        setTimeout(() => {

            showMessage(

                "uploadMessage",

                "Upload completed successfully."

            );

            document.getElementById("uploadForm").reset();

        }, 2500);

    }

    catch (error) {

        showMessage(

            "uploadMessage",

            error.message,

            "error"

        );

    }

    finally {

        setTimeout(() => {

            resetButton(uploadButton);

        }, 2500);

    }

}

/*
====================================================
Upload Progress
====================================================
*/

function simulateProgress() {

    const progressFill = document.getElementById("progressFill");
    const progressPercent = document.getElementById("progressPercent");

    if (!progressFill || !progressPercent)
        return;

    let progress = 0;

    const timer = setInterval(() => {

        progress += 5;

        progressFill.style.width = progress + "%";

        progressPercent.textContent = progress + "%";

        if (progress >= 100) {

            clearInterval(timer);

        }

    }, 100);

}
