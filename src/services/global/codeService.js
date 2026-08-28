
import globalApi from './globalInstance';

export const GetEmployeeAppRouteList = async (body) => {
    try {
        const response = await globalApi.post('get_employee_app_route_list', body);
        return response
    } catch (error) {
        console.error(error);
    }
};

export const GetSchoolCode = async (name) => {
    try {
        const response = await globalApi.get(`https://urschooling.com/sms_global/public/api/get_school_code/${name}`);
        return response
    } catch (error) {
        console.error(error);
    }
};