const BASE_URL = "https://join--projekt-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Fetches data asynchronously from the specified API endpoint.
 *
 * @param {string} path - The relative path to the data (without the .json extension).
 * @returns {Promise<Object>} - A promise that resolves to the JSON data fetched from the server.
 * If an error occurs, an error message is logged.
 */
async function getData(path = "") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        let responseAsJson = await response.json();
        return responseAsJson;
    } catch (error) {
        console.error("Error", error);
        return null;
    }
}
/**
 * Sends data to the specified API endpoint using a POST request.
 *
 * @param {string} path - The relative path to the endpoint (without the .json extension).
 * @param {Object} data - The data object to be sent in the POST request.
 * @returns {Promise<Object>} - A promise that resolves to the JSON response from the server.
 */
async function postData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    let responseToJson = await response.json();
    return responseToJson;
}

/**
 * Sends data to the specified API endpoint using a PUT request to update existing data.
 *
 * @param {string} path - The relative path to the endpoint (without the .json extension).
 * @param {Object} data - The data object to be sent in the PUT request.
 * @returns {Promise<Object>} - A promise that resolves to the JSON response from the server.
 */
async function putData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    let responseToJson = await response.json();
    return responseToJson;
}

/**
 * Deletes data from the specified API endpoint using a DELETE request.
 *
 * @param {string} path - The relative path to the endpoint (without the .json extension).
 * @returns {Promise<Object>} - A promise that resolves to the JSON response from the server.
 */
async function deleteData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    let responseToJson = await response.json();
    return responseToJson;
}
