import axios from "axios";
import { baseURL } from "../baseUrls";

const createAuthApi = (dynamicBaseURL) => {
  return axios.create({
    baseURL: dynamicBaseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default createAuthApi;



// import axios from "axios";
// import { baseURL } from "../baseUrls";

// const authApi = axios.create({
//   baseURL,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default authApi;

