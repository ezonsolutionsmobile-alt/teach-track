import createApi from "../instance";
import { useApiRoutesStore } from "../../store/useApiRoutesStore";

const api = createApi();



export const GetBulkStudentAttendanceList = async (body) => {
    try {
        const { routes } = useApiRoutesStore.getState();
        const response = await api.post(routes?.get_bulk_student_attendance_list, body);
        return response
    } catch (error) {
        console.error(error);
    }
};
export const BulkStudentAttendanceSave = async (body) => {
    try {
        const { routes } = useApiRoutesStore.getState();
        const response = await api.post(routes?.bulk_student_attendance_save, body);
        return response
    } catch (error) {
        console.error(error);
    }
};