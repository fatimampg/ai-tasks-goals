// Store the token in local storage:
export const storeTokenInLocalStorage = (token: string): void => {
  localStorage.setItem("token", token);
};

// Create authorization header object (including token) to be sent as header in http requests:
export const authHeader = (token: string): { [key: string]: string } => {
  if (token) {
    console.log("authHeader added", token);
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
};

// Handle unauthorized responses:
export const handleResponse = async (response: Response): Promise<any> => {
  // Promise that resolves to a value of type any
  try {
    const text: string = await response.text();

    const data = text && JSON.parse(text); // convert JSON into JScript obj

    if (!response.ok) {
      if (
        [401, 403].includes(response.status) &&
        localStorage.getItem("token")
      ) {
        console.log("Unauthorized response, logging out.");
      }
      const error = (data && data.message) || response.statusText; //if data doesn't contain message, use the status text from the http response.
      throw error;
    }

    return data;
  } catch (error) {
    console.log("Ooops...", error);
    return error;
  }
};
