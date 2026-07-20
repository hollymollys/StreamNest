/*
====================================================
StreamNest Configuration
Shared by all JavaScript files
====================================================
*/

/*
|--------------------------------------------------------------------------
| API Configuration
|--------------------------------------------------------------------------
|
| Change ONLY this value when moving between
| development, EC2, or production.
|
*/

// Local Development
// const API_BASE_URL = "http://localhost:5000/api";

// AWS EC2 Development
const API_BASE_URL = "http://YOUR_EC2_PUBLIC_IP:5000/api";

// Production Example
// const API_BASE_URL = "https://api.streamnest.com/api";

/*
|--------------------------------------------------------------------------
| Application Settings
|--------------------------------------------------------------------------
*/

const APP_NAME = "StreamNest";

const TOKEN_KEY = "streamnest_token";

const USER_KEY = "streamnest_user";

/*
|--------------------------------------------------------------------------
| Default Request Headers
|--------------------------------------------------------------------------
*/

const DEFAULT_HEADERS = {
    "Content-Type": "application/json"
};

/*
|--------------------------------------------------------------------------
| Export Configuration
|--------------------------------------------------------------------------
|
| These variables are available to all other
| JavaScript files after including config.js.
|
*/

window.CONFIG = {
    API_BASE_URL,
    APP_NAME,
    TOKEN_KEY,
    USER_KEY,
    DEFAULT_HEADERS
};
