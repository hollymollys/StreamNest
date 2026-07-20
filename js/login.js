/*
====================================================
StreamNest Login
====================================================
*/

"use strict";

/*
====================================================
Wait For Page
====================================================
*/

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    const loginButton = loginForm.querySelector("button[type='submit']");

    loginForm.addEventListener("submit", loginUser);

});

/*
====================================================
Login User
====================================================
*/

async function loginUser(event) {

    event.preventDefault();

    const loginButton = document.querySelector(
        "#loginForm button[type='submit']"
    );

    const email = document
        .getElementById("email")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value;

    if (!email || !password) {

        showMessage(
            "loginMessage",
            "Please enter your email and password.",
            "error"
        );

        return;

    }

    try {

        setButtonLoading(
            loginButton,
            '<i class="fa-solid fa-spinner fa-spin"></i> Signing In...'
        );

        const response = await apiRequest(

            "/auth/login",

            "POST",

            {

                email,

                password

            }

        );

        /*
        ============================================
        Save Authentication
        ============================================
        */

        saveToken(response.token);

        saveCurrentUser(response.user);

        showMessage(

            "loginMessage",

            "Login successful. Redirecting..."

        );

        setTimeout(() => {

            window.location.href = "home.html";

        }, 1200);

    }

    catch (error) {

        showMessage(

            "loginMessage",

            error.message,

            "error"

        );

    }

    finally {

        resetButton(loginButton);

    }

}
