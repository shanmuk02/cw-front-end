import axios from "axios";
import { tokenUrl } from "../constants/serverConfig";
const qs = require("querystring");

const tokenInstance = axios.create();
const getToken = async (username, password) => {
  const token = await tokenInstance({
    method: "post",
    url: tokenUrl,
    data: qs.stringify({ grant_type: "password", username, password }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic dGFsazJhbWFyZXN3YXJhbjpteS1zZWNyZXQ=",
    },
  });
  return token.data;
};

export { getToken };
