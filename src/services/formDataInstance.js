import AsyncStorage from "@react-native-async-storage/async-storage";

export const formDataInstance = async (url, payload, method = "POST") => {
  try {
    const storageData = await AsyncStorage.getItem("auth-storage");
    let token = null;

    if (storageData) {
      const parsed = JSON.parse(storageData);
      token = parsed?.state?.token;
    }

    const response = await fetch(url, {
      method,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: payload,
    });

    const res = await response.json();
    return res;

  } catch (error) {
    console.log("FormData API Error:", error);
    throw error;
  }
};