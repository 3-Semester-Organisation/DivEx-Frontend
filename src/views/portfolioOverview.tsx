import * as React from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { makeAuthOption, checkHttpsErrors } from "@/js/util";

import { PortfolioSelect } from "@/components/ui/custom/portfolioSelect";
import { CreatePortfolioButton } from "@/components/ui/custom/createPortfolioButton";

import { AuthContext } from "@/js/AuthContext";

const URL = "http://localhost:8080/api/v1/portfolio";

const formSchema = z.object({
  portfolioName: z
    .string()
    .min(1, { message: "Name must be at least 1 character long" }),
});

export default function PortfolioOverview() {
  const [selectedPortfolio, setSelectedPortfolio] = React.useState(() => {
    return localStorage.getItem("selectedPortfolio") || "";
  });
  const [portfolios, setPortfolios] = React.useState([]);
  const { subscriptionType } = React.useContext(AuthContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      portfolioName: "",
    },
  });

  // limit amount of portfolios based on subscription type
  function handleCreateButtonClick() {
    if (portfolios.length >= 1 && subscriptionType === "FREE") {
      toast.error("Free users can only have one portfolio.");
      return false;
    }
    else if (portfolios.length >= 10 && subscriptionType === "PREMIUM") {
      toast.error("Premium users can only have up to 10 portfolios.");
      return false;
    }
  }

  async function fetchPortfolios() {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return [];
    }
    try {
      const getOption = makeAuthOption("GET", null, token);
      const res = await fetch(URL, getOption);
      await checkHttpsErrors(res);
      const data = await res.json();
      const portfolioList = data.map((portfolio) => ({
        id: portfolio.id.toString(),
        name: portfolio.name,
      }));
      return portfolioList;
    } catch (error) {
      console.error("Fetch portfolios error", error);
      toast.error(error.message);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }
    try {
      const postOption = makeAuthOption("POST", values, token);
      const res = await fetch(URL, postOption);
      await checkHttpsErrors(res);

      toast.success("Portfolio created.");

      // Add new portfolio to the list without fetching all portfolios again
      const newPortfolio = await res.json();
      setPortfolios((prevPortfolios) => [
        ...prevPortfolios,
        { id: newPortfolio.id.toString(), name: newPortfolio.name },
      ]);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error(error.message);
    }
  }

  React.useEffect(() => {
    async function loadPortfolios() {
      const data = await fetchPortfolios();
      setPortfolios(data || []);
    }
    loadPortfolios();
  }, []);

  return (
    <>
      <div className="flex flex-row">
        <h1 className="text-semibold text-5xl">Portfolio</h1>

        <div className="ml-10 content-center mt-2">
          <PortfolioSelect
            portfolioList={portfolios}
            selectedPortfolio={selectedPortfolio}
            setSelectedPortfolio={setSelectedPortfolio}
          />
        </div>
        <div className="ml-1 content-center mt-2">

          <CreatePortfolioButton
            onSubmit={onSubmit}
            handleCreateButtonClick={handleCreateButtonClick}
          />
        </div>
      </div>
      <p>Selected portfolio id: {selectedPortfolio}</p>{/* This is just for debugging */}

    </>
  );
}
