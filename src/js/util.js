async function checkHttpsErrors(response) {
    if (!response.ok) {
        let errorMessage = `HTTP error! Status: ${response.status}`;
        try {
            const errorResponse = await response.json();
            errorMessage = errorResponse.errorMessage || errorMessage;
        } catch (e) {
            // If response is not JSON or cannot be parsed
            console.error('Error parsing response:', e);
        }
        throw new Error(errorMessage);
    }
    return response;
}

function makeOption(method, body) { 
    const option = {
        method: method.toUpperCase(),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    }
    if(body) {
        option.body = JSON.stringify(body);
    }
    return option;
}

function makeAuthOption(method, body, token) {
    const option = {
        method: method.toUpperCase(),
        headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + token
        }
    }
    if (body) {
        option.body = JSON.stringify(body);
    }
    return option;
}

export { checkHttpsErrors, makeOption, makeAuthOption }