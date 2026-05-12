import { useApiRoutesStore } from "../../store/useApiRoutesStore";
import createAuthApi from "./authInstance";

const authApi = createAuthApi();

export const loginService = async (url,body) => {
    try {
        const response = await authApi.post(url, body);
        return response
    } catch (error) {
        console.error(error);
    }
};

export const ResetCodeGenerate = async (body) => {
    try {
        const { routes } = useApiRoutesStore.getState();
        const response = await authApi.post(routes?.reset_code_generate, body);
        return response
    } catch (error) {
        console.error(error);
    }
};
export const ResetCodeCheck = async (body) => {
    try {
        const { routes } = useApiRoutesStore.getState();
        const response = await authApi.post(routes?.reset_code_check, body);
        return response
    } catch (error) {
        console.error(error);
    }
};
export const PasswordReset = async (body) => {
    try {
        const { routes } = useApiRoutesStore.getState();
        const response = await authApi.post(routes?.password_reset, body);
        return response
    } catch (error) {
        console.error(error);
    }
};


