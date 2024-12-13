import { checkHttpsErrors } from "@/js/util";
import { makeAuthOption } from "@/js/util";
import { toast } from "sonner";


const apiUrl = import.meta.env.VITE_API_URL;

async function getUserDetails() {

    const token = localStorage.getItem("token");
    if (!token) {
        return null;
    }

    try {
        const getOption = makeAuthOption("GET", token);
        const res = await fetch(`${apiUrl}user`, getOption);
        await checkHttpsErrors(res);
        const user = await res.json();
        return user;

    } catch (error) {
        console.error("Fetch user error", error);
        toast.error(error.message);
    }
}

async function updateUserDetails(user: any) {
    const token = localStorage.getItem("token");
    if (!token) {
        return null;
    }
    try {
        const putOption = makeAuthOption("PUT", token, user);
        await fetch(`${apiUrl}user`, putOption);
    } catch (error) {
        console.error("Update user error", error);
        toast.error(error.message);
    }
}

async function updatePassword(password: any) {
    const token = localStorage.getItem("token");
    if (!token) {
        return null;
    }
    try {
        const putOption = makeAuthOption("PUT", token, password);
        console.log(password);
        await fetch(`${apiUrl}user/password`, putOption);
    } catch (error) {
        console.error("Update password error", error);
        toast.error(error.message);
    }
}



async function deleteUser() {
    try {
        const token = localStorage.getItem("token");
        const deleteOption = makeAuthOption("DELETE", token)
        const response = await fetch(`${apiUrl}user`, deleteOption);
        checkHttpsErrors(response);

        let isDeleted = false;
        if (response.status === 204) {
            isDeleted = true;
            return isDeleted;

        } else {
            return isDeleted
        }
        
    } catch (error) {
        console.error(error);
    }
}

export { getUserDetails, updateUserDetails, updatePassword, deleteUser };