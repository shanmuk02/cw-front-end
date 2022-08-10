import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Col, Spin, Row } from "antd";
import { UserOutlined, LockOutlined, LoadingOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useGlobalContext } from "../../lib/storage";
import { getToken } from "../../services/token.js";
import { getUser, get360MenuList, getUserPreferencesData, updateLocalToken } from "../../services/generic";
import { updateCustomLocalToken } from "../../services/custom";
import loginLogo from "../../assets/images/cwSuiteLogo.png";
import "antd/dist/antd.css";
import "../../styles/app.css";
import ThemeJson from "../../constants/UIServer.json";

const Login = (props) => {
  const [loading, setLoading] = useState({ status: false, message: "" });
  const { globalStore, setGlobalStore } = useGlobalContext();
  const history = useHistory();

  useEffect(() => {
    const { authTokens } = globalStore;
    if (authTokens) {
      history.push("/");
    }
  }, []);

  const onLogin = async (values) => {
    setLoading({ status: true, message: "" });
    const username = values.username.trim();
    const password = values.password.trim();
    localStorage.clear();
    setGlobalStore({ authTokens: null, userData: null, sideMenuData: null, userPreferences: null, windowTabs: [] });
    try {
      const resTokenData = await getToken(username, password);
      localStorage.setItem("authTokens", JSON.stringify(resTokenData));
      updateLocalToken();
      updateCustomLocalToken();

      const userDataResponse = await getUser(username);
      userDataResponse.username = username
      if(!userDataResponse){
        throw new Error("Invalid User Data Response");
      }

      if (userDataResponse.CW360_V2_UI === null || userDataResponse.CW360_V2_UI === undefined) {
        userDataResponse.CW360_V2_UI = ThemeJson;
      } else {
        userDataResponse.CW360_V2_UI = JSON.parse(userDataResponse.CW360_V2_UI);
      }
      
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        userDataResponse.CW360_V2_UI = ThemeJson;
      }
      localStorage.setItem("userData", JSON.stringify(userDataResponse));

      const userPreferencesResponse = await getUserPreferencesData();
      localStorage.setItem("userPreferences", JSON.stringify(userPreferencesResponse));

      const menuDataResponse = await get360MenuList(userDataResponse.role_id);
      localStorage.setItem("sideMenuData", JSON.stringify(menuDataResponse));

      setGlobalStore({ authTokens: resTokenData, userData: userDataResponse, sideMenuData: menuDataResponse, userPreferences: userPreferencesResponse });
      setLoading({ status: false, message: "" });

      const refState = props.location.state;

      if (refState !== undefined && refState.referer.pathname !== "/login") {
        history.push(props.location.state.referer.pathname);
      } else {
        history.push("/");
      }
    } catch (error) {
      console.error("Login Failed:", error);
      if (JSON.parse(JSON.stringify(error)).message === "Request failed with status code 400") {
        message.error("Bad credentials, try again");
      } else {
        message.error("Some thing went wrong, Try again later");
      }
      localStorage.clear();
      setGlobalStore({ authTokens: null, userData: null, sideMenuData: null, userPreferences: null, windowTabs: []});
      setLoading({ status: false, message: "" });
    }
  };

  const onLoginInvalid = (error) => {
    console.error("Login Failed:", error);
  };

  const responsiveDesignForColumn = {
    xxl: 12,
    xl: 7,
    lg: 8,
    xs: 0,
    sm: 8,
    md: 10,
  };

  const responsiveDesignForDiv = {
    xxl: 8,
    xl: 7,
    lg: 8,
    xs: 24,
    sm: 13,
    md: 10,
  };

  const responsiveDesignFor = {
    xxl: 4,
    xl: 10,
    lg: 8,
    xs: 0,
    sm: 3,
    md: 4,
  };
  const responsiveDesignForDivFor = {
    xxl: 6,
    xl: 6,
    lg: 6,
    xs: 6,
    sm: 7,
    md: 6,
  };

  const responsiveDesign = {
    xxl: 2,
    xl: 2,
    lg: 2,
    xs: 2,
    sm: 2,
    md: 2,
  };

  return (
    <div
      style={{
        background: 'url("https://cwpublicresources.s3.ap-south-1.amazonaws.com/IMG/login.png")',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
        height: "auto",
      }}
    >
      <div className="block">
        <Row style={{ display: "-webkit-flex", WebkitFlexWrap: "wrap", flexWrap: "wrap", marginRight: "-15px", marginLeft: "-15px" }}>
          <Col {...responsiveDesignForColumn}>
            <div className="textinner">
              <h1 style={{ color: "white", fontWeight: "600", fontSize: "30px" }}>Modern age business solution built for the future!</h1>
              <p style={{ fontSize: "19px", color: "white" }}>When technology meets simplicity everything that follows is a breeze!</p>
            </div>
          </Col>
          <Col {...responsiveDesignFor} />
          <Col {...responsiveDesignForDiv}>
            <Spin indicator={<LoadingOutlined className="spinLoader" style={{ fontSize: "52px", color: "#1648aa" }} />} spinning={loading.status} tip={loading.message}>
              <div className="inner">
                <div className="loginText">
                  <img src={loginLogo} alt="" style={{ height: "50px", width: "150px" }} />
                </div>
                <Form layout="vertical" style={{ marginTop: "8%", padding: "10px" }} onFinish={onLogin} onFinishFailed={onLoginInvalid}>
                  <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <div className="form-group">
                        <Form.Item
                          label="Username"
                          style={{ marginBottom: "6%", padding: "0px" }}
                          name="username"
                          rules={[{ required: true, message: "Please input your Username!" }]}
                        >
                          <Input size="large" style={{ fontWeight: "500" }} placeholder="Username" prefix={<UserOutlined />} />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <div className="form-group">
                        <Form.Item
                          label="Password"
                          name="password"
                          style={{ marginBottom: "6%", padding: "0px" }}
                          rules={[{ required: true, message: "Please input your Password" }]}
                        >
                          <Input.Password type="password" size="large" style={{ fontWeight: "500" }} placeholder="Password" prefix={<LockOutlined />} />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{ marginTop: "3%" }}>
                      <Button type="primary" size="large" className="loginPageButton" htmlType="submit">
                        Login
                      </Button>
                    </div>
                  </div>
                </Form>
              </div>
            </Spin>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Login;
