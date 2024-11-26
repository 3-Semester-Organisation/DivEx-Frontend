async function checkHttpsErrors(response) {
    if(!response.ok) {
        const errorResponse = response.json();
        const error = new Error(errorResponse.message);
        error.apiMessage = errorResponse;
        throw error;
    }
}

export { checkHttpsErrors }