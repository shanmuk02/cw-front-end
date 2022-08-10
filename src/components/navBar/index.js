import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import { Row, Col, Popover, Image, Button, Divider, Form, Select, Card, message, Menu, Tooltip, Input, Dropdown } from "antd";
import { useGlobalContext } from "../../lib/storage";
import {
  getAdminMenuList,
  getAdminMenuListForDynamicLogos,
  get360MenuList,
  getFavouritesMenuList,
  removeFavouriteMenu,
  createFavouriteMenu,
  getLoggedInUserRoles,
  getLoggedInBusinessUnits,
  updateRoles,
  getUser,
  getUserPreferencesData,
} from "../../services/generic";
import Logo from "../../assets/images/cwsuiteWhite.svg";
import Toggle from "../../assets/images/Menuicon.svg";
import Heart from "../../assets/images/Heart_outline_white.svg";
import Report from "../../assets/images/report.svg";
import Dashboards from "../../assets/images/dashboard.svg";
import Settings from "../../assets/images/settings.svg";
import Profile from "../../assets/images/blankImage.png";
import Yellowpin from "../../assets/images/Yellowpin.svg";
import MoreNavs from "../../assets/images/moreNavs.svg";
import UserIcon from "../../assets/images/userIcon.svg";
import DownArrow from "../../assets/images/downArrow.svg";
import ThemeJson from "../../constants/UIServer.json";
import LogoutIcon from "../../assets/images/logoutIcon.svg";
import HideMenuIconArrow from "../../assets/images/hideMenuIconArrow.svg";
import MenuToggler from "../../assets/images/menuToggler.svg";
import CollapseToggleIcon from "../../assets/images/collapseToggleIcon.svg"
import "antd/dist/antd.css";
import "../../styles/app.css";
import "../../styles/antd.css";
import "./style.css"

const { Option, OptGroup } = Select;
const { SubMenu } = Menu;

const NavBar = (props) => {
  const { globalStore, setGlobalStore } = useGlobalContext();
  const history = useHistory();
  const Themes = globalStore.userData.CW360_V2_UI;
  let usersData = JSON.parse(localStorage.getItem("userData"));
  const {showToggler,setShowToggler, setDrawerFlag, drawerFlag, setMenuToggle, menuToggle,setFullMenuToggle, fullMenuToggle } = props;
  const menuList = globalStore.sideMenuData;
  const [menuData, setMenuData] = useState([]);
  const [favouriteMenuData, setFavouriteMenuData] = useState([]);
  const [dashboardMenuData, setDashboardMenu] = useState([]);
  const [visible, setVisible] = useState(false);
  const [favouritesVisible, setFavouritesVisible] = useState(false);
  const [reportsVisible, setReportsVisible] = useState(false);
  const [dashBoardSearchInput, setDashBoardSearchInput] = useState("");
  const [initialDashboardMenuData, setInitialDashboardMenu] = useState([]);
  const [userRoleResposeData, setUserRoleResposeData] = useState([]);
  const [userBusinessUnitData, setUserBusinessUnitData] = useState([]);
  const [bunitId, setBunitId] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [cwLogo, setCWLogo] = useState(null);
  const [clientLogo, setClientLogo] = useState(null);
  const [form] = Form.useForm();
  
  /* let menuDataResponse = JSON.parse(localStorage.getItem("adminMenuData"));
  console.log("===meuDataRes===",menuDataResponse) */
  const data = {
    name: globalStore.userData.user,
    Email: globalStore.userData.email,
    Phone: 9876543210,
  };

  useEffect(() => {
    getCwLogos();
    getFaviouritesMenus();
    if (menuList) {
      try {
        menuList.sort((a, b) => (a.seqno != null ? parseInt(a.seqno) : Infinity) - (b.seqno != null ? parseInt(b.seqno) : Infinity));
        menuList.map((item, index) => {
          if (item.children && item.children.length > 0) {
            item.children.sort((a, b) => (a.seqno != null ? parseInt(a.seqno) : Infinity) - (b.seqno != null ? parseInt(b.seqno) : Infinity));
          }
          menuList[index] = item;
          return null;
        });
        setMenuData(menuList);
        // 
      } catch (error) {
        console.error("Failed to set menu data: ", JSON.stringify(error, null, 2));
      }
    }
    setBunitId(globalStore.userData.bunit_id);
    setRoleId(globalStore.userData.role_id);
  }, []);

  const logout = () => {
    setGlobalStore({ authTokens: null, userData: null, sideMenuData: null, userPreferences: null, windowTabs: [] });
    localStorage.clear();
    history.push("/login");
  };

  const goToHome = async () => {
    let menuDataResponse = JSON.parse(localStorage.getItem("sideMenuData"));
    if (menuDataResponse === null) {
      menuDataResponse = await get360MenuList(usersData.role_id);
      localStorage.setItem("sideMenuData", JSON.stringify(menuDataResponse));
    }
    setGlobalStore({ sideMenuData: menuDataResponse });
    history.replace("/");
  };

  const getCwLogos = async () =>{
    const logosResponse = await getAdminMenuListForDynamicLogos(usersData.role_id);
    const cwLogo = logosResponse.cwLogo
    const clientLogo = logosResponse.clientLogo
    setCWLogo(cwLogo)
    setClientLogo(clientLogo)
  }
  const getAdminMenus = async () => {
    let menuDataResponse = JSON.parse(localStorage.getItem("adminMenuData"));
    if (menuDataResponse === null) {
      menuDataResponse = await getAdminMenuList(usersData.role_id);
      localStorage.setItem("adminMenuData", JSON.stringify(menuDataResponse));
    }
    history.replace("/");
    setGlobalStore({ sideMenuData: menuDataResponse });
  };

  const getFaviouritesMenus = async () => {
    const favouritesMenuDataResponse = await getFavouritesMenuList();
    setFavouriteMenuData(favouritesMenuDataResponse);
  };

  const deleteFavourites = async (id) => {
    const removeFavouriteMenuResponse = await removeFavouriteMenu(id);
    message.success(removeFavouriteMenuResponse);
    getFaviouritesMenus();
  };

  const selectMenu = async (value, data) => {
    const valueData = value.split("@");
    const type = valueData[1];
    const addFavouritesResponse = await createFavouriteMenu(data.key, data.children, data.url, type, globalStore.userData.cs_client_id);
    message.success(addFavouritesResponse);
    getFaviouritesMenus();
  };

  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: "#c1c1c1",
      borderRadius: "5px",
      width: "8px",
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  const renderView = ({ style, ...props }) => {
    const viewStyle = {
      color: "#00000",
    };
    return <div className="box" style={{ ...style, ...viewStyle }} {...props} />;
  };

  const getFilteredMenuData = (menuParam, filterKey) => {
    return menuParam.filter((menu) => {
      if (menu.children) {
        const subChildren = menu.children.filter((c) => c.type === filterKey);
        return subChildren.length > 0;
      } else {
        return false;
      }
    });
  };

  const getFilteredSubMenuData = (menuParam, filterKey) => {
    return menuParam.filter((c) => c.type === filterKey);
  };

  const getDashboard = () => {
    let dashboardMenu = [];
    let undefinedParent = []
    const menuData1 = []
    for (let index = 0; index < menuData.length; index++) {
      const element = menuData[index].children;
      if(element === undefined || element === null){
        if(menuData[index].type === "Dashboard"){
          undefinedParent.push(menuData[index])
        }
      }else{
        menuData1.push(menuData[index])
      }
    }
    menuData1.map((menu) => {
      return menu.children.map((data) => {
        if (data.type === "Dashboard") {
          dashboardMenu.push(data);
          return null;
        } else {
          return null;
        }
      });
    });
    const allArray = dashboardMenu.concat(undefinedParent);
    setDashboardMenu(allArray);
    setInitialDashboardMenu(allArray);
  };

  useEffect(() => {
    if (dashBoardSearchInput !== "") {
      const dashBoardSearchResuts = initialDashboardMenuData.filter((m) => m.title.toLowerCase().search(dashBoardSearchInput.toLowerCase()) >= 0);
      setDashboardMenu([...dashBoardSearchResuts]);
    } else {
      getDashboard();
    }
  }, [dashBoardSearchInput, menuData]);

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  const handleFavouritesChange = (visible) => {
    setFavouritesVisible(visible);
  };
  const handleReportsChange = (visible) => {
    setReportsVisible(visible);
  };

  const dashBoardNavigate = (key) => {
    setVisible(false);
    history.push(`/analytics/dashboard/${key}`);
  };

  const onFavourites = (data) => {
    setFavouritesVisible(false);
    if (data.type === "Report") {
      history.push(`/reports/report/${data.menuId}`);
    } else if (data.type === "Dashboard") {
      history.push(`/analytics/dashboard/${data.menuId}`);
    } else if (data.type === "Generic") {
      history.push(`/window/list/${data.menuId}`);
    } else if (data.type === "Custom") {
      history.push(`/others/window/${data.menuId}`);
    } else {
      message.warning("Not Available");
    }
  };
  const onReports = (subMenuItem) => {
    setReportsVisible(false);
    history.push(`/reports/report/${subMenuItem.id}`);
  };

  const getLoggedInUserRolesData = async () => {
    const userRolesRespose = await getLoggedInUserRoles(usersData.user_id);
    setUserRoleResposeData(userRolesRespose);
  };

  const getLoggedInUserBusinessUnitData = async () => {
    const userBusinessUnitResponse = await getLoggedInBusinessUnits(usersData.user_id);
    setUserBusinessUnitData(userBusinessUnitResponse);
  };

  const onSelectRole = (e) => {
    setRoleId(e);
  };

  const onSelectBusinessUnit = (e) => {
    setBunitId(e);
  };

  const changeRoleAndBusinessUnit = async () => {
    const rolesAndBusinessResponse = await updateRoles(roleId, bunitId);
    if (rolesAndBusinessResponse.messageCode === "200") {
      processForUpdate();
    } else {
      message.error(rolesAndBusinessResponse.message);
    }
  };

  const processForUpdate = async () => {
    const userDataResponse = await getUser(globalStore.userData.username);
    userDataResponse.username = globalStore.userData.username;
    if (!userDataResponse) {
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
    setGlobalStore({ userData: userDataResponse, sideMenuData: menuDataResponse, userPreferences: userPreferencesResponse });
    history.push("/");
    window.localStorage.removeItem("windowDefinitions");
    window.location.reload();
  };

  const routeToProfile = () =>{
    history.push("/others/window/7465");
  }

  const content = (
    <Card style={Themes.navBar.logoutCardStyle}>
      <Row>
        <Col span={6}>
          <Image alt="profile" src={Profile} style={Themes.navBar.profileIcon} />
        </Col>
        <Col span={18} onClick = {routeToProfile} style={{ paddingLeft: "30px",cursor:'pointer' }}>
          <Row>
            <Col span={24} style={Themes.navBar.profileName}>
              {data.name}
            </Col>
            <Tooltip title={data.Email}>
              <Col
                span={24}
                style={{
                  width: "auto",
                  maxWidth: "100%",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  position: "relative",
                  fontSize: "10px",
                  fontWeight: "500",
                }}
              >
                {data.Email === "null" ? "" : data.Email}
              </Col>
            </Tooltip>
            <Col span={24} style={Themes.navBar.profileInfo}>
              {data.Phone === "null" ? "" : data.Phone}
            </Col>
          </Row>
        </Col>
        <Divider style={Themes.navBar.dividerOne} />
        <Col span={24}>
          <Form layout="vertical" name={form}>
            <Row style={{ margin: "-4px" }}>
              <Col span={24}>
                <Form.Item name="roleName" label="Roles" style={Themes.navBar.roles}>
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    className="certain-category-search"
                    dropdownClassName="certain-category-search-dropdown"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onFocus={getLoggedInUserRolesData}
                    onSelect={onSelectRole}
                    defaultValue={globalStore.userData.role_iden}
                  >
                    {/* <Option value="CW Solutions">CW Solutions</Option> */}
                    {userRoleResposeData.map((data, index) => (
                      <Option key={data.recordid} value={data.recordid}>
                        {data.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="bunitName" label="Business Unit" style={Themes.navBar.businessUnit}>
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    className="certain-category-search"
                    dropdownClassName="certain-category-search-dropdown"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onFocus={getLoggedInUserBusinessUnitData}
                    onSelect={onSelectBusinessUnit}
                    defaultValue={globalStore.userData.bunit_iden}
                  >
                    {userBusinessUnitData.map((data, index) => (
                      <Option key={data.recordid} value={data.recordid}>
                        {data.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24} style={{ textAlign: "right" }}>
                <Form.Item style={Themes.navBar.businessUnit}>
                  <Button style={Themes.navBar.cancelButton}>Cancel</Button>
                  <Button onClick={changeRoleAndBusinessUnit} type="primary" htmlType="submit" style={Themes.navBar.applyButton}>
                    Apply
                  </Button>
                </Form.Item>
              </Col>
              <Divider style={Themes.navBar.dividerTwo} />
              <Button type="link" onClick={logout} style={Themes.navBar.logoutButton}>
                <Row>
                  <img style={{ marginTop: "-10px" }} src={LogoutIcon} alt="Logo" />
                  &nbsp;&nbsp;
                  <p style={Themes.navBar.logoutButton.logoutText}>Logout</p>
                </Row>
              </Button>
            </Row>
          </Form>
        </Col>
      </Row>
    </Card>
  );

  const favMenuContent = (
    <div style={{ width: "18em" }}>
      <Select
        showSearch
        style={{ width: "100%", paddingRight: "8px" }}
        suffixIcon={<i className="fa fa-search" role="presentation" aria-hidden="true" style={Themes.sideMenu.sideMenuSearchIcon} />}
        onSelect={selectMenu}
        value={null}
        placeholder={
          <Row>
            <Col span={4}>
              <i className="fa fa-search" role="presentation" aria-hidden="true" style={Themes.sideMenu.sideMenuSearchIcon} />
            </Col>
            <Col span={20}>Search...</Col>
          </Row>
        }
        showArrow={false}
        className="search-arrow placeHolder"
      >
        {menuData.map((menu, index) => (
          <OptGroup key={`${menu.title}-${index}`} label={menu.title}>
            {menu.children
              ? menu.children.map((subMenuItem) => (
                  <Option key={subMenuItem.id} url={subMenuItem.url} value={`${subMenuItem.title}@${subMenuItem.type}`}>
                    {subMenuItem.title}
                  </Option>
                ))
              : null}
          </OptGroup>
        ))}
      </Select>
      <p />
      <ul style={{ listStyleType: "none", paddingLeft: "0px" }}>
        {favouriteMenuData !== null
          ? favouriteMenuData.map((data) => {
              return (
                <li key={data.menuId} style={{ paddingTop: "2px", paddingBottom: "2px", cursor: "pointer" }}>
                  <Row gutter={16}>
                    <Col span={20}>
                      <span
                        onClick={() => {
                          onFavourites(data);
                        }}
                      >
                        {data.menuName}
                      </span>
                    </Col>
                    <Col span={4}>
                      <img alt="pin" src={Yellowpin} onClick={() => deleteFavourites(data.id)} />
                    </Col>
                  </Row>
                </li>
              );
            })
          : ""}
      </ul>
    </div>
  );

  const selectReportMenuSearch = (value) => {
    history.push(`/reports/report/${value}`);
  };

  const NavigateToMenu = (menuType, menuId, menuTitle) => {
    let navigationUrl;
    switch (menuType) {
      case "Report":
        navigationUrl = `/reports/report/${menuId}`;
        break;
      case "Dashboard":
        navigationUrl = `/analytics/dashboard/${menuId}`;
        break;
      case "Generic":
        navigationUrl = `/window/list/${menuId}`;
        break;
      case "Custom":
        navigationUrl = `/others/window/${menuId}`;
        break;
      case "GenericNew":
        navigationUrl = `/window/${menuId}/NEW_RECORD`;
        break;
      default:
        message.warning("Not Available");
        break;
    }
    history.push(navigationUrl);
  };

  const selectMenuToNavigate = (value, data) => {
    const valueData = value.split("@");
    if (valueData.length > 0) {
      NavigateToMenu(valueData[1], data.key, data.children);
    }
  };

  const reportMenuContent = (
    <div style={{ width: "18em", height: "220px" }}>
      <div>
        <Select
          showSearch
          style={{ width: "100%", paddingRight: "8px" }}
          suffixIcon={<i className="fa fa-search" role="presentation" aria-hidden="true" style={Themes.sideMenu.sideMenuSearchIcon} />}
          onSelect={selectReportMenuSearch}
          value={null}
          filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          listHeight={180}
          allowClear={true}
          placeholder={
            <Row>
              <Col span={4}>
                <i className="fa fa-search" role="presentation" aria-hidden="true" style={Themes.sideMenu.sideMenuSearchIcon} />
              </Col>
            </Row>
          }
          showArrow={false}
          className="search-arrow placeHolder"
        >
          {getFilteredMenuData(menuData, "Report").map((menu, index) =>
            menu.children ? (
              getFilteredSubMenuData(menu.children, "Report").map((subMenuItem) => (
                <Option key={subMenuItem.id} value={subMenuItem.id}>
                  {subMenuItem.title}
                </Option>
              ))
            ) : (
              <Option key={menu.id} value={menu.id}>
                {menu.title}
              </Option>
            )
          )}
        </Select>
      </div>
      <Scrollbars
        style={{
          height: "190px",
        }}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        thumbSize={90}
        renderView={renderView}
        renderThumbHorizontal={renderThumb}
        renderThumbVertical={renderThumb}
      >
        <Menu theme="light" mode="inline">
          {getFilteredMenuData(menuData, "Report").map((menu) => (
            <SubMenu
              key={`${menu.key}`}
              icon={
                <span className={menu.icon} style={{ color: "#666666" }}>
                  &ensp;
                </span>
              }
              title={`${menu.title}`}
            >
              {menu.children
                ? getFilteredSubMenuData(menu.children, "Report")
                    .sort((a, b) => (a.title > b.title ? 1 : -1))
                    .map((subMenuItem, index) => (
                      <Menu.Item key={`${subMenuItem.key}-${index}`} onClick={() => onReports(subMenuItem)} title={subMenuItem.title}>
                        {subMenuItem.title}
                      </Menu.Item>
                    ))
                : null}
            </SubMenu>
          ))}
        </Menu>
      </Scrollbars>
    </div>
  );

  const dashboardMenuContent = (
    <div style={{ width: "18em", height: "250px", marginRight: "-10px" }}>
      <Input
        style={{ width: "100%", paddingRight: "8px" }}
        prefix={<i className="fa fa-search" role="presentation" aria-hidden="true" style={Themes.sideMenu.sideMenuSearchIcon} />}
        value={dashBoardSearchInput}
        onChange={(e) => setDashBoardSearchInput(e.target.value)}
        allowClear={true}
      />
      <Scrollbars
        style={{
          height: "220px",
        }}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        thumbSize={90}
        renderView={renderView}
        renderThumbHorizontal={renderThumb}
        renderThumbVertical={renderThumb}
      >
        {dashboardMenuData.map((menu) => {
          return (
            <div
              style={{
                height: "90px",
                width: "100px",
                border: "0px solid gray",
                backgroundColor: "#F5F5F5",
                display: "inline-block",
                borderRadius: "5px",
                paddingBottom: "20px",
                fontSize: "11px",
                paddingTop: "20px",
                margin: "10px",
                paddingLeft: "10px",
                paddingRight: "10px",
                textAlign: "center",
                verticalAlign: "middle",
                cursor: "pointer",
              }}
              id={menu.id}
              onClick={() => dashBoardNavigate(menu.id)}
            >
              {menu.title}
            </div>
          );
        })}
      </Scrollbars>
    </div>
  );

  const responsiveDesignNew = {
    xxl: 24,
    xl: 24,
    lg: 24,
    xs: 24,
    sm: 24,
    md: 24,
  };

  const responsiveDesignForColumn = {
    xxl: 8,
    xl: 8,
    lg: 8,
    xs: 4,
    sm: 12,
    md: 12,
  };

  const responsiveSearch = {
    xxl: 6,
    xl: 6,
    lg: 6,
    xs: 20,
    sm: 12,
    md: 8,
  };
  const globalSearch = {
    xxl: 8,
    xl: 8,
    lg: 8,
    xs: 0,
    sm: 0,
    md: 0,
  };

  const responsiveSearch1 = {
    xxl: 13,
    xl: 13,
    lg: 13,
    xs: 20,
    sm: 12,
    md: 8,
  };

  const responsiveLogo = {
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 24,
    sm: 14,
    md: 24,
  };

  // const responsiveLogo1 = {
  //   xxl: 6,
  //   xl: 6,
  //   lg: 6,
  //   xs: 24,
  //   sm: 14,
  //   md: 24,
  // };

  // const responsiveToggle1 = {
  //   xxl: 18,
  //   xl: 18,
  //   lg: 18,
  //   xs: 0,
  //   sm: 0,
  //   md: 0,
  // };

  const responsiveLogo1 = {
    xxl: 11,
    xl: 11,
    lg: 11,
    xs: 11,
    sm: 11,
    md: 11,
  };

  const forCollapse = {
    xxl: 2,
    xl: 2,
    lg: 2,
    xs: 2,
    sm: 2,
    md: 2,
  }

  const responsiveToggle1 = {
    xxl: 11,
    xl: 11,
    lg: 11,
    xs: 11,
    sm: 11,
    md: 11,
  };

  const responsiveToggle = {
    xxl: 6,
    xl: 6,
    lg: 6,
    xs: 0,
    sm: 0,
    md: 0,
  };

  const responsiveIcons = {
    xxl: 3,
    xl: 3,
    lg: 3,
    xs: 0,
    sm: 0,
    md: 0,
  };

  const responsiveUserText = {
    xxl: 10,
    xl: 10,
    lg: 10,
    xs: 0,
    sm: 0,
    md: 0,
  };

  const responsiveUserIcon = {
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 4,
    sm: 4,
    md: 6,
  };

  const responsiveUserIconDown = {
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 16,
    sm: 16,
    md: 12,
  };

  const responsiveSpace = {
    xxl: 2,
    xl: 2,
    lg: 2,
    xs: 14,
    sm: 14,
    md: 14,
  };

  const moreMenu = (
    <Col {...responsiveDesignNew} style={{ height: "125px", width: "110px", paddingLeft: "15px" }}>
      <Row>
        <Popover
          title={<p style={{ paddingBottom: "0px", marginBottom: "0px", textAlign: "center" }}>Favourites</p>}
          placement="bottom"
          style={{ marginLeft: "120px" }}
          content={favMenuContent}
          trigger="hover"
          visible={favouritesVisible}
          onVisibleChange={handleFavouritesChange}
        >
          <p style={{ marginBottom: "5px" }}>Favourites</p>
        </Popover>
      </Row>
      <Row>
        <Popover
          title={<p style={{ paddingBottom: "0px", marginBottom: "0px", textAlign: "center" }}>Reports</p>}
          placement="bottom"
          style={{ marginLeft: "120px" }}
          content={reportMenuContent}
          trigger="hover"
          visible={reportsVisible}
          onVisibleChange={handleReportsChange}
        >
          <p style={{ marginBottom: "5px" }}>Reports</p>
        </Popover>
      </Row>
      <Row>
        <Popover
          title={<p style={{ paddingBottom: "0px", marginBottom: "0px", textAlign: "center" }}>Dashboards</p>}
          placement="bottom"
          style={{ marginLeft: "120px" }}
          content={dashboardMenuContent}
          trigger="hover"
          visible={visible}
          onVisibleChange={handleVisibleChange}
        >
          <p style={{ marginBottom: "5px" }}>Dashboards</p>
        </Popover>
      </Row>
      <Row onClick={getAdminMenus}>
        <Tooltip title="Settings">
          <p style={{ marginBottom: "5px" }}>Settings</p>
        </Tooltip>
      </Row>
    </Col>
  );

  const fullToggle = () =>{
    setFullMenuToggle((t) => !t)
    setMenuToggle((t) => !t)
    setShowToggler(false)
  }

  const VisileToggler = () =>{
    setShowToggler((t) => !t)
  }

  const VisileToggler1 =() =>{
    setShowToggler((t) => !t)
    setDrawerFlag((t) => !t)
  }

  return (
    <div>
      <Row justify="space-between">
        <Col {...responsiveDesignForColumn}>
          <Row>
            <Col {...responsiveSearch1} style={{ cursor: "pointer", marginTop: "-13.5px", marginLeft: "-8px" }}>
              {!drawerFlag ? (
                <Row>
                  {fullMenuToggle ? (
                    showToggler ? (
                      <Col {...forCollapse}>
                      {/* <span>
                        <img style={{marginLeft:'-6px'}} onMouseLeave = {VisileToggler} onClick ={fullToggle} alt="hideMenuIconArray" src={CollapseToggleIcon} />
                      </span> */}
                      </Col>
                    ):
                    <Col {...forCollapse}>
                    <span>
                    <img style={{marginLeft:'-6px'}} /* onMouseEnter={VisileToggler1} */ onClick ={fullToggle} alt="menuToggler" src={MenuToggler} />
                    &nbsp;
                    </span>
                    </Col>
                  ):null}
                  <Col {...responsiveLogo1}>
                    <img
                      onClick={goToHome}
                      style={{ cursor: "pointer"}}
                      src={cwLogo !== null ? `data:image/jpeg;base64,${cwLogo}` : Logo}
                      // style={{width:"100%",height:"auto",maxWidth:'100px'}}
                      id="logo-img1"
                      alt="Logo"
                    />
                  </Col>
                  <Col {...responsiveToggle1}>
                  {clientLogo !== null ? (
                    <img
                        src={`data:image/jpeg;png;svg;base64,${clientLogo}`}
                        // style={{width:"100%",height:"auto",maxWidth:'100px'}}
                        alt="clientLogo"
                        id="logo-img1"
                      />
                  ) : (
                    null
                  )}
                  </Col>
                  {fullMenuToggle ? (
                   null
                    ) : (
                      <Col {...forCollapse} style={{marginLeft:'-12px' }}>
                      <span>
                        <img onClick ={fullToggle} alt="hideMenuIconArray" src={HideMenuIconArrow} />
                      </span>
                      </Col>
                    )}
                </Row>
              ) : (
                <Col {...responsiveToggle} style={{ marginLeft: "16px" }}>
                  {/* <Image src={Toggle} onClick={() => setMenuToggle((toggle) => !toggle)} preview={false} style={{ paddingTop: "20px" }} /> */}
                </Col>
              )}
            </Col>

            <Col {...responsiveLogo}>
              {!drawerFlag || menuToggle ? (
                <Image style={{ cursor: "pointer" }} className="toggleOnMobile" src={Toggle} onClick={() => setDrawerFlag((toggle) => !toggle)} preview={false} />
              ) : null}
            </Col>
            <Col {...responsiveDesignForColumn} />
          </Row>
        </Col>
        <Col {...globalSearch} style={{ marginTop: "-12px" }}>
          {fullMenuToggle ? (
            <Select
              showSearch
              style={{ width: "85%", paddingRight: "8px" }}
              suffixIcon={<i className="fa fa-search" role="presentation" aria-hidden="true" style={Themes.sideMenu.sideMenuSearchIcon} />}
              // onSelect={selectMenu}
              value={null}
              onSelect={selectMenuToNavigate}
              placeholder={
                <Row>
                  <Col>
                    <i className="fa fa-search" role="presentation" aria-hidden="true" style={Themes.sideMenu.sideMenuSearchIcon} />
                  </Col>
                  &emsp;
                  <Col>Search...</Col>
                </Row>
              }
              showArrow={false}
              className="search-arrow placeHolder"
            >
              {menuData.map((menu) =>
                  menu.children ? (
                    <OptGroup label={<span style={{ fontSize: '13px', color: 'black' }}><strong>{menu.title}</strong></span>}>
                     {  menu.children.map((subMenuItem) =>
                      subMenuItem.children ? (
                        subMenuItem.children.map((lowerSubMenuItem) => (
                          <Option style={{fontSize:'12px',fontFamily:'Open Sans' }} key={lowerSubMenuItem.id} value={`${lowerSubMenuItem.title}@${lowerSubMenuItem.type}`}>
                            {lowerSubMenuItem.title}
                          </Option>
                        ))
                      ) : (
                        <Option style={{fontSize:'12px',fontFamily:'Open Sans'}} key={subMenuItem.id} value={`${subMenuItem.title}@${subMenuItem.type}`}>
                          {subMenuItem.title}
                        </Option>
                      )
                    )
                  }
                    </OptGroup>
                  ):(
                    <Option style={{fontSize:'12px',fontFamily:'Open Sans' }} key={menu.id} value={`${menu.title}@${menu.type}`}>
                      {menu.title}
                    </Option>
                  )
                )}
            </Select>
          ) : null}
        </Col>
        <Col {...responsiveSearch}>
          <Row>
            <Col {...responsiveSpace} />

            <Col {...responsiveIcons} style={{ textAlign: "center" }}>
              <Popover
                title={<p style={{ paddingBottom: "0px", marginBottom: "0px", textAlign: "center" }}>Favourites</p>}
                placement="bottom"
                style={{ marginLeft: "120px" }}
                content={favMenuContent}
                trigger="hover"
                visible={favouritesVisible}
                onVisibleChange={handleFavouritesChange}
              >
                <Tooltip placement="left">
                  <Image src={Heart} preview={false} style={Themes.navBar.navbarIcons} />{" "}
                </Tooltip>
              </Popover>
            </Col>
            <Col {...responsiveIcons} style={{ textAlign: "center" }}>
              <Popover
                title={<p style={{ paddingBottom: "0px", marginBottom: "0px", textAlign: "center" }}>Reports</p>}
                placement="bottom"
                style={{ marginLeft: "120px" }}
                content={reportMenuContent}
                trigger="hover"
                visible={reportsVisible}
                onVisibleChange={handleReportsChange}
              >
                <Tooltip>
                  <Image src={Report} preview={false} style={Themes.navBar.navbarIcons} />{" "}
                </Tooltip>
              </Popover>
            </Col>
            <Col {...responsiveIcons} style={{ textAlign: "center" }}>
              <Popover
                title={<p style={{ paddingBottom: "0px", marginBottom: "0px", textAlign: "center" }}>Dashboards</p>}
                placement="bottom"
                style={{ marginLeft: "120px" }}
                content={dashboardMenuContent}
                trigger="hover"
                visible={visible}
                onVisibleChange={handleVisibleChange}
              >
                <Tooltip>
                  <Image src={Dashboards} preview={false} style={Themes.navBar.navbarDashboardIcon} />{" "}
                </Tooltip>
              </Popover>
            </Col>
            <Col {...responsiveIcons} style={{ textAlign: "center", cursor: "pointer" }}>
              <Tooltip title="Settings">
                <Image style={{ cursor: "pointer" }} src={Settings} onClick={getAdminMenus} preview={false} style={Themes.navBar.navbarSettingIcon} />{" "}
              </Tooltip>
            </Col>
            <Col {...responsiveUserText} style={{ textAlign: "center", marginTop: "-4%" }}>
              <Popover content={content} placement="topRight">
                <span style={{ fontWeight: "bold", marginTop: "2px", color: "white", whiteSpace: "nowrap", fontSize: "12px", cursor: "pointer" }}>
                  {" "}
                  {data.name} &nbsp;
                  <img src={DownArrow} width="11px" preview={false} />
                </span>
              </Popover>
            </Col>
            <Col {...responsiveUserIconDown} />
            <Col {...responsiveUserIcon} style={{ textAlign: "right", marginTop: "-14px" }}>
              <Dropdown trigger={["click"]} overlay={moreMenu}>
                <img style={{ cursor: "pointer" }} src={MoreNavs} preview={false} />
              </Dropdown>
            </Col>
            <Col {...responsiveUserIcon} style={{ textAlign: "right", marginTop: "-14px" }}>
              <Popover content={content} trigger="click" placement="topRight">
                <img style={{ cursor: "pointer" }} src={UserIcon} preview={false} />{" "}
              </Popover>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default NavBar;
