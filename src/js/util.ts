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

function stockCurrencyConverter(stockRelatedValue, entry, currency) {
    // TODO fetch realtime currency in the future 
    switch (currency) {

      case 'DKK': {
        switch (entry.stock.currency) {
          case 'DKK': {
            return stockRelatedValue * entry.quantity;
          }
          case 'SEK': {
            return stockRelatedValue * entry.quantity * 0.65; //1 dkk = 0,65 sek for 05/12-2024 

          }
          case 'NOK': {
            return stockRelatedValue * entry.quantity * 0.65; //1 dkk = 0,71 sek for 05/12-2024 

          }
        }
        break;
      }

      case 'SEK': {
        switch (entry.stock.currency) {
          case 'DKK': {
            return stockRelatedValue * entry.quantity * 1.54;

          }
          case 'SEK': {
            return stockRelatedValue * entry.quantity; //1 dkk = 0,65 sek for 05/12-2024 

          }
          case 'NOK': {
            return stockRelatedValue * entry.quantity * 0.99; //1 dkk = 0,71 sek for 05/12-2024 

          }
        }
        break;
      }

      case 'NOK': {
        switch (entry.stock.currency) {
          case 'DKK': {
            return stockRelatedValue * entry.quantity * 1.41;

          }
          case 'SEK': {
            return stockRelatedValue * entry.quantity * 0.94;

          }
          case 'NOK': {
            return stockRelatedValue * entry.quantity;

          }
        }
      }

    }
  }

export { checkHttpsErrors, makeOption, makeAuthOption, stockCurrencyConverter };

