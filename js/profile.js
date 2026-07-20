/*
====================================================
StreamNest Profile
profile.js
====================================================
*/

"use strict";

document.addEventListener("DOMContentLoaded", initializeProfile);

/*
====================================================
Initialize Profile
====================================================
*/

async function initializeProfile() {

    redirectIfNotLoggedIn();

    loadProfile();

    setupProfileForm();

}

/*
====================================================
Load Profile
====================================================
*/

function loadProfile() {

    const user = getCurrentUser();

    if (!user) return;

    /*
    ----------------------------------------------
    Sidebar
    ----------------------------------------------
    */

    document.getElementById("profileName").textContent =
        user.fullname;

    document.getElementById("profileRole").textContent =
        "Creator";

    /*
    ----------------------------------------------
    Main Profile
    ----------------------------------------------
    */

    document.getElementById("displayFullname").value =
        user.fullname || "";

    document.getElementById("displayUsername").value =
        user.username || "";

    document.getElementById("displayEmail").value =
        user.email || "";

}

/*
====================================================
Update Profile
====================================================
*/

function setupProfileForm() {

    const profileForm = document.getElementById("profileForm");

    if (!profileForm) return;

    profileForm.addEventListener(

        "submit",

        updateProfile

    );

}

async function updateProfile(event) {

    event.preventDefault();

    const saveButton = document.querySelector(

        "#profileForm button[type='submit']"

    );

    try {

        setButtonLoading(

            saveButton,

            '<i class="fa-solid fa-spinner fa-spin"></i> Saving...'

        );

        const fullname = document
            .getElementById("displayFullname")
            .value
            .trim();

        const username = document
            .getElementById("displayUsername")
            .value
            .trim();

        const email = document
            .getElementById("displayEmail")
            .value
            .trim();

        /*
        ============================================
        FUTURE API

        PUT /api/users/me

        await apiRequest(

            "/users/me",

            "PUT",

            {

                fullname,
                username,
                email

            }

        );

        ============================================
        */

        const user = getCurrentUser();

        user.fullname = fullname;
        user.username = username;
        user.email = email;

        saveCurrentUser(user);

        showMessage(

            "profileMessage",

            "Profile updated successfully."

        );

    }

    catch (error) {

        showMessage(

            "profileMessage",

            error.message,

            "error"

        );

    }

    finally {

        resetButton(saveButton);

    }

}

/*
====================================================
Logout
====================================================
*/

const logoutButton = document.getElementById(

    "logoutButton"

);

if (logoutButton) {

    logoutButton.addEventListener(

        "click",

        function(event) {

            event.preventDefault();

            logout();

        }

    );

}
