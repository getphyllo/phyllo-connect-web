const PHYLLO_BASE_URL = "https://api-sandbox.getphyllo.com";
const URL_CREATE_USER_TOKEN = "/v1/sdk-tokens";
const URL_CREATE_USER = "/v1/users";

const PHYLLO_CLIENT_ID = "aaea7918-31a1-49b7-a201-d0034e5aa30d";
const PHYLLO_SECRET_ID = "eabcc3db-6b89-4bfe-a333-d38be888ab78";

const getAxiosInstance = () => {
  const api = axios.create({
    baseURL: PHYLLO_BASE_URL,
    auth: {
      username: PHYLLO_CLIENT_ID,
      password: PHYLLO_SECRET_ID,
    },
  });
  return api;
};
const createUser = async (name, externalId, isExistingUser) => {
  try {
    const userId = await localStorage.getItem("PHYLLO_USERID");
    if (isExistingUser) {
      return userId;
    } else if (!isExistingUser || !Boolean(userId)) {
      const api = getAxiosInstance();
      let response = await api.post(URL_CREATE_USER, {
        name: name,
        external_id: externalId,
      });
      await localStorage.setItem("PHYLLO_USERID", response.data.id);
      return response.data.id;
    }
  } catch (err) {
    console.error(`Error ${err} occurred while generating user token`);
    return err.body;
  }
};

const createUserToken = async (userId, redirectURL) => {
  if (!userId) {
    let err = new Error("User id cannot be blank or null");
    throw err;
  }
  try {
    const api = getAxiosInstance();
    let response = await api.post(URL_CREATE_USER_TOKEN, {
      user_id: userId,
      redirect_uri: redirectURL,
      products: ["IDENTITY", "ENGAGEMENT", "INCOME"],
    });
    return response.data.sdk_token;
  } catch (err) {
    console.error(`Error ${err} occurred while generating user token`);
    return err.body;
  }
};
