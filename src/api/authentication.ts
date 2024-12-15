import { checkHttpsErrors, makeOption } from "@/js/util";
import { toast } from "sonner";
import { z } from "zod";

const apiUrl = import.meta.env.VITE_API_URL;

async function authenticateLogin(loginCredentials) {
    const URL = `${apiUrl}login`

    try {
        const postOption = makeOption('POST', loginCredentials);
        const res = await fetch(URL, postOption);
        await checkHttpsErrors(res);
        const jwtToken = await res.json();
        const token = jwtToken.jwt;
        localStorage.setItem('token', token);


        if (jwtToken) {
            return true;
        }

    } catch (error) {
        console.error('Form submission error', error)
        toast.error(error.message)
    }
}



async function register(registrationInformation) {
    const URL = `${apiUrl}register`

    try {
        const postOption = makeOption('POST', registrationInformation);
        const res = await fetch(URL, postOption);
        await checkHttpsErrors(res);

        const jwtToken = await res.json();
        const token = jwtToken.jwt;
        localStorage.setItem('token', token);

        if(jwtToken) {
            return true;
        }

    } catch (error) {
        console.error('Form submission error', error)
        toast.error(error.message)
    }
}



export { authenticateLogin, register }