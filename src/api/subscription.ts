import { checkHttpsErrors } from "@/js/util";

const apiUrl = import.meta.env.VITE_API_URL;

async function fetchSubscriptionChange(
  newSubscriptionType: string,
  token: string
) {
  try {
    const response = await fetch(`${apiUrl}subscription/upgrade`, {
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
