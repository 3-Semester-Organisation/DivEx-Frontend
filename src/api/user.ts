import { checkHttpsErrors } from "@/js/util";
import { makeAuthOption } from "@/js/util";
import { toast } from "sonner";

async function getUserDetails() {

    const token = localStorage.getItem("token");
    if (!token) {
        return null;
    }

    try {
        const getOption = makeAuthOption("GET", token);
        const res = await fetch("http://localhost:8080/api/v1/user", getOption);
        await checkHttpsErrors(res);
        const user = await res.json();
        console.log("user: ", user);
        return user;

    } catch (error) {
        console.error("Fetch user error", error);
        toast.error(error.message);
    }

}

export { getUserDetails };