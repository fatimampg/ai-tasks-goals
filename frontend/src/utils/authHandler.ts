// Store the token in local storage:
export const storeTokenInLocalStorage = (token: string): void => {
  localStorage.setItem("token", token);
};

// Create authorization header object (including token) to be sent as header in http requests:
export const authHeader = (token: string): { [key: string]: string } => {
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
};

// Handle unauthorized responses:
export const handleResponse = async (response: Response): Promise<any> => {
  try {
    const text: string = await response.text();

    const data = text && JSON.parse(text);

    if (!response.ok) {
      if (
        [401, 403].includes(response.status) &&
        localStorage.getItem("token")
      ) {
        console.log("Unauthorized response, logging out.");
      }
      const error = (data && data.message) || response.statusText;
      throw error;
    }

    return data;
  } catch (error) {
    console.log("There was an error...", error);
    return error;
  }
};
