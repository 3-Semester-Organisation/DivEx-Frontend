async function checkHttpsErrors(response) {
    if(!response.ok) {
        const errorResponse = response.json();
        const error = new Error(errorResponse.message);
        error.apiMessage = errorResponse;
        throw error;
    }
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