/*
====================================================
StreamNest
Shared Application Functions
====================================================
*/

'use strict';

/*
====================================================
Token Management
====================================================
*/

function saveToken(token) {

    localStorage.setItem(
        CONFIG.TOKEN_KEY,
        token
    );

}

function getToken() {

    return localStorage.getItem(
        CONFIG.TOKEN_KEY
    );

}

function removeToken() {

    localStorage.removeItem(
        CONFIG.TOKEN_KEY
    );

}

/*
====================================================
Current User
====================================================
*/

function saveCurrentUser(user) {

    localStorage.setItem(
        CONFIG.USER_KEY,
        JSON.stringify(user)
    );

}

function getCurrentUser() {

    const user = localStorage.getItem(
        CONFIG.USER_KEY
    );

    return user ? JSON.parse(user) : null;

}

function removeCurrentUser() {

    localStorage.removeItem(
        CONFIG.USER_KEY
    );

}

/*
====================================================
Authentication
====================================================
*/

function isAuthenticated() {

    return !!getToken();

}

function redirectIfNotLoggedIn() {

    if (!isAuthenticated()) {

        window.location.href = "login.html";

    }

}

function logout() {

    removeToken();

    removeCurrentUser();

    window.location.href = "login.html";

}

/*
====================================================
API Request Helper
====================================================
*/

async function apiRequest(

    endpoint,

    method = "GET",

    body = null,

    isFormData = false

) {

    const headers = {};

    const token = getToken();

    if (!isFormData) {

        headers["Content-Type"] = "application/json";

    }

    if (token) {

        headers["Authorization"] = `Bearer ${token}`;

    }

    const options = {

        method,

        headers

    };

    if (body) {

        options.body = isFormData

            ? body

            : JSON.stringify(body);

    }

    const response = await fetch(

        CONFIG.API_BASE_URL + endpoint,

        options

    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(

            data.message || "Request failed."

        );

    }

    return data;

}

/*
====================================================
Messages
====================================================
*/

function showMessage(

    elementId,

    message,

    type = "success"

) {

    const element = document.getElementById(

        elementId

    );

    if (!element) return;

    element.textContent = message;

    element.className = "form-message";

    if (type === "error") {

        element.style.color = "#dc2626";

    } else {

        element.style.color = "#16a34a";

    }

}

/*
====================================================
Loading Buttons
====================================================
*/

function setButtonLoading(

    button,

    loadingText = "Loading..."

) {

    if (!button) return;

    button.disabled = true;

    button.dataset.originalText = button.innerHTML;

    button.innerHTML = loadingText;

}

function resetButton(

    button

) {

    if (!button) return;

    button.disabled = false;

    button.innerHTML =

        button.dataset.originalText;

}

/*
====================================================
Format Date
====================================================
*/

function formatDate(dateString) {

    return new Date(dateString)

        .toLocaleDateString(

            "en-US",

            {

                year: "numeric",

                month: "long",

                day: "numeric"

            }

        );

}

/*
====================================================
Page Startup
====================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        const logoutButton = document.getElementById(

            "logoutButton"

        );

        if (logoutButton) {

            logoutButton.addEventListener(

                "click",

                (event) => {

                    event.preventDefault();

                    logout();

                }

            );

        }

    }

);
