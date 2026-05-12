import createApi from "../instance";
import { useApiRoutesStore } from "../../store/useApiRoutesStore";

const api = createApi();



export const GetCampusShiftClassSectionDetails = async (url) => {
    try {
        const response = await api.post(url);
        return response
    } catch (error) {
        console.error(error);
    }
};
export const GetAllOptions = async (url, body) => {
    try {
        const response = await api.post(url, body);
        return response
    } catch (error) {
        console.error(error);
    }
};
export const GetAllHomework = async (body) => {
    try {
        const { routes } = useApiRoutesStore.getState();
        const response = await api.post(routes?.get_class_section_home_work_list, body);
        return response
    } catch (error) {
        console.error(error);
    }
};
export const homeWorkDelete = async (body) => {
    try {
        const { routes } = useApiRoutesStore.getState();
        const response = await api.post(routes?.home_work_delete, body);
        return response
    } catch (error) {
        console.error(error);
    }
};

