import createApi from "../instance";
import { useApiRoutesStore } from "../../store/useApiRoutesStore";

const api = createApi();


export const GetLoginHistory = async () => {
    try {
        const { routes } = useApiRoutesStore.getState();
        const response = await api.post(routes?.login_history);
        return response
    } catch (error) {
        console.error(error);
    }
};


export const LogoutAllDevices = async (url) => {
    try {
        const response = await api.post(url);
        return response
    } catch (error) {
        console.error(error);
    }
};
export const LogoutCurrentDevice = async (url) => {
    try {
        const response = await api.post(url);
        return response
    } catch (error) {
        console.error(error);
    }
};
export const GetEmployeeDetails = async (url) => {
    try {
        const response = await api.post(url);
        return response
    } catch (error) {
        console.error(error);
    }
};
export const EmployeePasswordUpdate = async (body) => {
    try {
        const { routes } = useApiRoutesStore.getState();
        const response = await api.post(routes?.employee_password_update, body);
        return response
    } catch (error) {
        console.error(error);
    }
};


