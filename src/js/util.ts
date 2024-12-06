// Check for HTTP errors in the response
async function checkHttpsErrors(response: Response): Promise<Response> {
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

// Create a fetch options object for a given method and optional body
function makeOption(method: string, body?: any): RequestInit {
    const option: RequestInit = {
        method: method.toUpperCase(),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    };
    if (body) {
        option.body = JSON.stringify(body);
    }
    return option;
}

// Create a fetch options object with authentication token
function makeAuthOption(method: string, token: string, body?: any): RequestInit {
    const option: RequestInit = {
        method: method.toUpperCase(),
        headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + token,
        }
    };
    if (body) {
        option.body = JSON.stringify(body);
    }
    return option;
}

export { checkHttpsErrors, makeOption, makeAuthOption };

