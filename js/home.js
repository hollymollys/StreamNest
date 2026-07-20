/*
====================================================
StreamNest Dashboard
home.js
====================================================
*/

"use strict";

document.addEventListener("DOMContentLoaded", initializeDashboard);

/*
====================================================
Initialize Dashboard
====================================================
*/

async function initializeDashboard() {

    redirectIfNotLoggedIn();

    loadCurrentUser();

    await loadDashboardStats();

    await loadVideos();

    await loadRecentActivity();

}

/*
====================================================
Current User
====================================================
*/

function loadCurrentUser() {

    const user = getCurrentUser();

    if (!user) return;

    const userName = document.getElementById("userName");
    const profileName = document.getElementById("profileName");
    const profileRole = document.getElementById("profileRole");

    if (userName)
        userName.textContent = user.fullname;

    if (profileName)
        profileName.textContent = user.fullname;

    if (profileRole)
        profileRole.textContent = "Creator";

}

/*
====================================================
Dashboard Statistics
====================================================
*/

async function loadDashboardStats() {

    try {

        /*
        This will become:

        GET /api/dashboard/stats
        */

        const stats = {

            videos: 12,
            views: "5.6K",
            followers: 340,
            storage: "1.4 GB"

        };

        document.getElementById("videoCount").textContent =
            stats.videos;

        document.getElementById("viewCount").textContent =
            stats.views;

        document.getElementById("followerCount").textContent =
            stats.followers;

        document.getElementById("storageCount").textContent =
            stats.storage;

    }

    catch (error) {

        console.error(error);

    }

}

/*
====================================================
Videos
====================================================
*/

async function loadVideos() {

    try {

        /*
        Later this becomes

        GET /api/videos
        */

        const videos = [

            {

                title: "AWS Deployment",

                thumbnail: "images/video1.jpg",

                views: "2.5K Views"

            },

            {

                title: "Docker Basics",

                thumbnail: "images/video2.jpg",

                views: "900 Views"

            }

        ];

        const gallery = document.getElementById("videoGallery");

        if (!gallery) return;

        gallery.innerHTML = "";

        videos.forEach(video => {

            gallery.innerHTML += `

                <div class="video-card">

                    <img src="${video.thumbnail}" alt="${video.title}">

                    <div class="video-info">

                        <h4>${video.title}</h4>

                        <span>${video.views}</span>

                    </div>

                </div>

            `;

        });

    }

    catch (error) {

        console.error(error);

    }

}

/*
====================================================
Recent Activity
====================================================
*/

async function loadRecentActivity() {

    try {

        /*
        Later

        GET /api/activity
        */

        const activity = [

            "Uploaded AWS Architecture",

            "Received 20 new followers",

            "Video reached 2,000 views"

        ];

        const activityList = document.getElementById("activityList");

        if (!activityList) return;

        activityList.innerHTML = "";

        activity.forEach(item => {

            activityList.innerHTML += `

                <div class="activity-item">

                    <i class="fa-solid fa-circle-check"></i>

                    <p>${item}</p>

                </div>

            `;

        });

    }

    catch (error) {

        console.error(error);

    }

}
