import { checkHttpsErrors } from "@/js/util";

async function fetchUpdatePortfolioName(
    portfolioName: string,
    portfolioId: string,
) {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/portfolio`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ portfolioName, portfolioId })
    });
    checkHttpsErrors(response);

    return response;
    
  } catch (error) {
    console.log(error);
  }
}

export { fetchUpdatePortfolioName };
