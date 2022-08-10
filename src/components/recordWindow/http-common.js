import axios from "axios";
import { genericUrl } from "../../constants/serverConfig";

let localToken = JSON.parse(localStorage.getItem("authTokens"));
export default axios.create({
  baseURL: genericUrl,
  headers: {
    "Content-type": "application/json",
    'Authorization': `bearer ${localToken}`
  }
});