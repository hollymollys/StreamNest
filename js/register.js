/*
====================================================
StreamNest Registration
====================================================
*/

"use strict";

/*
====================================================
Wait For Page
====================================================
*/

document.addEventListener("DOMContentLoaded", () => {

    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", registerUser);

});

/*
====================================================
Register User
====================================================
*/

async function registerUser(event) {

    event.preventDefault();

    const registerButton = document.querySelector(
        "#registerForm button[type='submit']"
    );

    const fullname = document
        .getElementById("fullname")
        .value
        .trim();

    const username = document
        .getElementById("username")
        .value
        .trim();

    const email = document
        .getElementById("email")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value;

    const confirmPassword = document
        .getElementById("confirmPassword")
        .value;

    if (
        !fullname ||
        !username ||
        !email ||
        !password ||
        !confirmPassword
    ) {

        showMessage(
            "registerMessage",
            "Please complete all required fields.",
            "error"
        );

        return;

    }

    if (password !== confirmPassword) {

        showMessage(
            "registerMessage",
            "Passwords do not match.",
            "error"
        );

        return;

    }

    if (password.length < 8) {

        showMessage(
            "registerMessage",
            "Password must be at least 8 characters long.",
            "error"
        );

        return;

    }

    try {

        setButtonLoading(
            registerButton,
            '<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...'
        );

        const response = await apiRequest(

            "/auth/register",

            "POST",

            {

                fullname,

                username,

                email,

                password

            }

        );

        showMessage(

            "registerMessage",

            response.message ||
            "Account created successfully."

        );

        setTimeout(() => {

            window.location.href = "login.html";

        }, 1500);

    }

    catch (error) {

        showMessage(

            "registerMessage",

            error.message,

            "error"

        );

    }

    finally {

        resetButton(registerButton);

    }

}
