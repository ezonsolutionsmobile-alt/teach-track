

import createApi from "../instance";
import { useApiRoutesStore } from "../../store/useApiRoutesStore";

const api = createApi();


export const GetFenceAndLastCheckDetails = async () => {
    try {
        const { routes } = useApiRoutesStore.getState();
        const response = await api.post( routes?.get_fence_and_last_check_details);
        return response
    } catch (error) {
        console.error(error);
    }
};
export const AttCheckin = async (body) => {
    try {
        const { routes } = useApiRoutesStore.getState();
        const response = await api.post( routes?.employee_attendance_update, body);
        return response
    } catch (error) {
        console.error(error);
    }
}; 
export const GetEmployeeAttendanceHistory = async (body) => {
    try {
        const { routes } = useApiRoutesStore.getState();
        const response = await api.post( "https://www.urschooling.com/sms_n/qvms/sms_employee_n/api/get_employee_attendance_history", body);
        // const response = await api.post( routes?.get_employee_attendance_history, body);
        return response
    } catch (error) { 
        console.error(error);
    }
};
export const GetEmployeeAttendanceHistoryDetails = async (body) => {
    try {
        const { routes } = useApiRoutesStore.getState();
        const response = await api.post( "https://www.urschoo÷ling.com/sms_n/qvms/sms_employee_n/api/get_employee_attendance_history_details", body);
    //   const response = await api.post( routes?.get_employee_attendance_history_details, body);
        return response
    } catch (error) { 
        console.error(error);
    }
};
