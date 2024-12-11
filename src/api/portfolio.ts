import { Portfolio, PortfolioEntryRequest } from "@/divextypes/types";
import { checkHttpsErrors, makeAuthOption } from "@/js/util"
import { toast } from "sonner";
import { z } from "zod";

async function addStockToPortfolio(portfolioEntryRequest: PortfolioEntryRequest) {
    try {
        const token = localStorage.getItem("token");
        const postOption = makeAuthOption("POST", token, portfolioEntryRequest);

        const response = await fetch("http://localhost:8080/api/v1/portfolioentry", postOption);
        checkHttpsErrors(response);
        const data = await response.json();

        if (data) {
            return true;

        } else {
            throw new Error('Data mismatch: Portfolio entry data does not match request');
        }

    } catch (error) {
        // Check if the error is an instance of Error and throw a custom error message
        if (error instanceof Error) {
            throw new Error(`Error during portfolio entry request: ${error.message}`);

        } else {
            throw new Error('An unknown error occurred during portfolio entry request');
        }
    }

}

async function fetchPortfolios() {
    const token = localStorage.getItem("token");
    if (!token) {
        toast.error("No token found. Please log in.");
        return [];
    }

    try {
        const getOption = makeAuthOption("GET", token);
        const res = await fetch("http://localhost:8080/api/v1/portfolio", getOption);
        await checkHttpsErrors(res);
        const portfolios: Portfolio[] = await res.json();

        return portfolios;

    } catch (error) {
        console.error("Fetch portfolios error", error);
        toast.error(error.message);
    }
}



const formSchema = z.object({
    portfolioName: z
        .string()
        .min(1, { message: "Name must be at least 1 character long" }),
});

async function createPortfolio(values: z.infer<typeof formSchema>) {
    const token = localStorage.getItem("token");
    if (!token) {
        toast.error("No token found. Please log in.");
        return;
    }
    try {
        const postOption = makeAuthOption("POST", token, values);
        const res = await fetch("http://localhost:8080/api/v1/portfolio", postOption);
        await checkHttpsErrors(res);

        toast.success("Portfolio created.");

        // Add new portfolio to the list without fetching all portfolios again
        const newPortfolio = await res.json();
        return newPortfolio;
        
    } catch (error) {
        console.error("Form submission error", error);
        toast.error(error.message);
    }
}

async function updatePortfolioName(
    portfolioName: string,
    portfolioId: number,
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
    const data = await response.json();
    
    return data;
    
  } catch (error) {
    console.log(error);
  }
}


export { addStockToPortfolio, fetchPortfolios, createPortfolio, updatePortfolioName as fetchUpdatePortfolioName }