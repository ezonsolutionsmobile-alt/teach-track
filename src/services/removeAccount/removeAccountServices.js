import createApi from "../instance";
import { useApiRoutesStore } from "../../store/useApiRoutesStore";

const api = createApi();


export const DeactivateAccount = async () => {
    try {
           const { routes } = useApiRoutesStore.getState();
        const response = await api.post(routes?.deactive);
        return response
    } catch (error) {
        console.error(error);
    }
};