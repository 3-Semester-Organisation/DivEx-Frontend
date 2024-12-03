import { checkHttpsErrors } from "@/js/util";

async function fetchSubscriptionChange(
  newSubscriptionType: string,
  token: string
) {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/subscription/upgrade`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newSubscriptionType })
    });
    checkHttpsErrors(response);

    return response;
    
    
  } catch (error) {
    console.log(error);
  }
}

export { fetchSubscriptionChange };
