
import globalApi from './globalInstance';

export const GetEmployeeAppRouteList = async (body) => {
    try {
        const response = await globalApi.post('get_employee_app_route_list', body);
        return response
    } catch (error) {
        console.error(error);
    }
};