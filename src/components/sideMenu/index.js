import React, { useState, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { useHistory } from "react-router-dom";
import { Menu, Layout, Card, Select, message, Row, Col, Drawer, Button } from "antd";
import { useParams } from "react-router-dom";

import { useGlobalContext } from "../../lib/storage";
import Logo from "../../assets/images/cwsuiteWhite.svg";
import collapseMenuIcon from "../../assets/images/collapseMenuIcon.svg";
import expandMenuIcon from "../../assets/images/expandMenuIcon.svg";
import hideMenuIcon from "../../assets/images/hideMenuIcon.svg";
import showMenuIcon from "../../assets/images/showMenuIcon.svg";
import CloseIcon from "../../assets/images/closeButton.svg";
import Search from "../../assets/images/searchIcon.svg"
import {
  getAdminMenuListForDynamicLogos,
} from "../../services/generic";

// const { recordId } = useParams();

import "antd/dist/antd.css";
import "../../styles/app.css";
import "../../styles/antd.css";
import "./menu.css";

const { Sider } = Layout;
const { SubMenu } = Menu;
const { Option,OptGroup } = Select;

const toggleFullHideButtonInactive = {
  position: "absolute",
  bottom: "-4px",
  backgroundColor: "#FFFFFF",
  color: "white",
  height: "30px",
  width: "35px",
  borderRadius: "0px 50px 50px 0px",
  textAlign: "center",
  left: "59px",
  zIndex: "9",
  fontWeight: "bold",
  cursor: "pointer",
  padding: "5px",
};

const toggleFullHideButtonActive = {
  ...toggleFullHideButtonInactive,
  left: "0px",
};

const SideMenu = (props) => {
  // const textInput = React.useRef(null);

  const { globalStore, setGlobalStore } = useGlobalContext();
  const Themes = globalStore.userData.CW360_V2_UI;
  const { sideMenuData: menuList, windowTabs, userPreferences } = globalStore;
  const { menuToggle, setMenuToggle, fullMenuToggle,showToggler, setFullMenuToggle } = props;
  const [menuData, setMenuData] = useState([]);
  const history = useHistory();
  // const [menuToggle, setMenuToggle] = useState(false);
  // const [fullMenuToggle, setFullMenuToggle] = useState(false);
  // const [siderActiveStyles, setSiderActiveStyles] = useState({});
  const { drawerFlag, onClose } = props;
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState("left");
  const [autoFocusSearch,setautoFocusSearch] = useState(true)
  const [menuIdFromUrl,setMenuIdFromUrl] = useState(null)
  const [cwLogo, setCWLogo] = useState(null);
  const [clientLogo, setClientLogo] = useState(null);

  useEffect(() => {
    getCwLogos()
    const menuIdData = history.location.pathname.split('/')
    if(menuIdData.length > 0){
      setMenuIdFromUrl(menuIdData[3])
    }
    if (menuList) {
      try {
        menuList.sort((a, b) => (a.seqno != null ? parseInt(a.seqno) : Infinity) - (b.seqno != null ? parseInt(b.seqno) : Infinity));
        menuList.map((item, index) => {
          if (item.children && item.children.length > 0) {
            item.children.sort((a, b) => (a.seqno != null ? parseInt(a.seqno) : Infinity) - (b.seqno != null ? parseInt(b.seqno) : Infinity));
            item.children.map((subItem, subIndex) => {
              if (subItem.children && subItem.children.length > 0) {
                subItem.children.sort((a, b) => (a.seqno != null ? parseInt(a.seqno) : Infinity) - (b.seqno != null ? parseInt(b.seqno) : Infinity));
              }
              // item.children[subIndex] = subItem;
              return null;
            });
          }
          menuList[index] = item;
          return null;
        });
        setMenuData(menuList);
      } catch (error) {
        console.error("Failed to set menu data: ", JSON.stringify(error, null, 2));
      }
    }

  }, [menuList]);

  const getCwLogos = async () =>{
    const logosResponse = await getAdminMenuListForDynamicLogos(globalStore.userData.role_id);
    const cwLogo = logosResponse.cwLogo
    const clientLogo = logosResponse.clientLogo
    setCWLogo(cwLogo)
    setClientLogo(clientLogo)
  }
  
  /* const [openKeys, setOpenKeys] = useState([]);
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  }; */

  const showDrawer = () => {
    setVisible(true);
  };

  const NavigateToMenu = (menuType, menuId, menuTitle) => {
    setMenuIdFromUrl(menuId)
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
    if (navigationUrl) {
      if (userPreferences.enableMultiTab === "Y") {
        const prevWindowTabs = [...windowTabs];
        if (prevWindowTabs.findIndex((tab) => tab.url === navigationUrl) < 0) {
          const newWindowTab = {
            url: navigationUrl,
            title: menuTitle,
            content: null,
          };
          setGlobalStore({ windowTabs: [...prevWindowTabs, newWindowTab] });
          history.push(navigationUrl);
        } else {
          message.warning("Tab Already Active");
        }
      } else {
        history.push(navigationUrl);
      }
    }
    props.onClose();
  };

  const selectMenu = (value, data) => {
    const valueData = value.split("@");
    if (valueData.length > 0) {
      NavigateToMenu(valueData[1], data.key, data.children);
    }
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

  const menuToggleFromSerach = () =>{
    setMenuToggle((menuToggle) => !menuToggle)
    // setTimeout(() => {
    //   setautoFocusSearch(true)
    // }, 1000);
  }


  return (
    <div className="responsiveSideMenu">
      {drawerFlag && !menuToggle ? (
        <Drawer width={275} closable={false} placement={placement} onClose={onClose} visible={drawerFlag} key={placement}>
          <Row style={{ backgroundColor: "rgb(22, 72, 170)", height: "40px", margin: "-12px -3px 10px -10px", paddingLeft: "10px", paddingTop: "3px" }}>
            <img style={{ cursor: "pointer" }} src={Logo} alt="Logo" />
          </Row>
          <Select
            showSearch
            style={{ width: "100%", paddingRight: "8px" }}
            suffixIcon={<i className="fa fa-search" role="presentation" aria-hidden="true" style={Themes.sideMenu.sideMenuSearchIcon} />}
            onSelect={selectMenu}
            value={null}
            placeholder={
              <Row>
                <Col span={20}>Search...</Col>{" "}
                <Col style={{ textAlign: "right" }} span={4}>
                  <i className="fa fa-search" role="presentation" aria-hidden="true" style={Themes.sideMenu.sideMenuSearchIcon} />
                </Col>
              </Row>
            }
            showArrow={false}
            className="search-arrow placeHolder"
          >
            {menuData.map((menu) =>
              menu.children ? (
                menu.children.map((subMenuItem) =>
                  subMenuItem.children ? (
                    subMenuItem.children.map((lowerSubMenuItem) => (
                      <Option style={{fontSize:'12px',fontFamily:'Open Sans' }} key={lowerSubMenuItem.id} value={`${lowerSubMenuItem.title}@${lowerSubMenuItem.type}`}>
                        {lowerSubMenuItem.title}
                      </Option>
                    ))
                  ) : (
                    <Option style={{fontSize:'12px',fontFamily:'Open Sans' }} key={subMenuItem.id} value={`${subMenuItem.title}@${subMenuItem.type}`}>
                      {subMenuItem.title}
                    </Option>
                  )
                )
              ) : (
                <Option style={{fontSize:'12px',fontFamily:'Open Sans' }} key={menu.id} value={`${menu.title}@${menu.type}`}>
                  {menu.title}
                </Option>
              )
            )}
          </Select>
          <Button onClick={onClose} className="drawerClose">
            <img src={CloseIcon} style={{ width: "30px", marginLeft: "-10px", marginTop: "-2px" }} alt="CloseIcon" />
          </Button>
          <Scrollbars
            style={{
              height: "85vh",
            }}
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            thumbSize={90}
            renderView={renderView}
            renderThumbHorizontal={renderThumb}
            renderThumbVertical={renderThumb}
          >
            <Menu theme="light" mode="inline" /* openKeys={openKeys} onOpenChange={onOpenChange} */>
              {menuData.map((menu, menuIndex) =>
                menu.children && menu.children.length > 0 ? (
                  <SubMenu
                    key={`${menu.key}`}
                    icon={
                      <span className={menu.icon} style={{ color: "#666666", width: "23px" }}>
                        &ensp;
                      </span>
                    }
                    title={`${menu.title}`}
                  >
                    {menu.children.map((subMenuItem, index) =>
                      subMenuItem.children && subMenuItem.children.length > 0 ? (
                        <SubMenu
                          key={`${subMenuItem.key}`}
                          icon={
                            <span className={subMenuItem.icon} style={{ color: "#666666", width: "23px" }}>
                              &ensp;
                            </span>
                          }
                          title={`${subMenuItem.title}`}
                        >
                          {subMenuItem.children.map((lowerSubMenuItem, index) => (
                            <Menu.Item
                              key={`${lowerSubMenuItem.key}-${index}`}
                              icon={
                                <span className={lowerSubMenuItem.icon} style={{ color: "#666666", width: "23px" }}>
                                  &ensp;
                                </span>
                              }
                              style={{width:'auto',paddingRight:'10px'}}
                              // style={{width:'auto',overflow:'visible',textOverflow:'clip',whiteSpace:'normal',lineHeight:'15px'}}
                            >
                              <span title={lowerSubMenuItem.title} onClick={() => NavigateToMenu(lowerSubMenuItem.type, lowerSubMenuItem.id, lowerSubMenuItem.title)}>
                                {lowerSubMenuItem.title}
                              </span>
                              {/* &emsp;
                              <span
                                title={`Add New ${subMenuItem.title}`}
                                onClick={() => NavigateToMenu(`${lowerSubMenuItem.type}New`, lowerSubMenuItem.id, lowerSubMenuItem.title)}
                              >
                                +
                              </span> */}
                            </Menu.Item>
                          ))}
                        </SubMenu>
                      ) : (
                        <Menu.Item
                          key={`${subMenuItem.key}-${index}`}
                          icon={
                            <span className={subMenuItem.icon} style={{ color: "#666666", width: "23px" }}>
                              &ensp;
                            </span>
                          }
                          style={{width:'auto',paddingRight:'10px'}}
                          // style={{width:'auto',overflow:'visible',textOverflow:'clip',whiteSpace:'normal',lineHeight:'15px'}}
                        >
                          <span title={subMenuItem.title} onClick={() => NavigateToMenu(subMenuItem.type, subMenuItem.id, subMenuItem.title)}>
                            {subMenuItem.title}
                          </span>
                          {/* &emsp;
                          <span title={`Add New ${subMenuItem.title}`} onClick={() => NavigateToMenu(`${subMenuItem.type}New`, subMenuItem.id, subMenuItem.title)}>
                            +
                          </span> */}
                        </Menu.Item>
                      )
                    )}
                  </SubMenu>
                ) : (
                  <Menu.Item
                    key={`${menu.key}`}
                    icon={
                      <span className={menu.icon} style={{ color: "#666666", width: "23px" }}>
                        &ensp;
                      </span>
                    }
                    style={{width:'auto',paddingRight:'10px'}}
                    // style={{width:'auto',overflow:'visible',textOverflow:'clip',whiteSpace:'normal',lineHeight:'15px'}}
                  >
                    <span  title={menu.title} onClick={() => NavigateToMenu(menu.type, menu.id, menu.title)}>
                      {menu.title}
                    </span>
                    &emsp;
                    <span title={`Add New ${menu.title}`} onClick={() => NavigateToMenu(`${menu.type}New`, menu.id, menu.title)}>
                      +
                    </span>
                  </Menu.Item>
                )
              )}
            </Menu>
          </Scrollbars>
        </Drawer>
      ): (
        <Sider collapsed={menuToggle} onCollapse={null} style={{width:'500px'}} style={Themes.sideMenu} className={menuToggle ? (fullMenuToggle ? "fullmenu-active" : "fullmenu-inactive") : null}>
          <Card bodyStyle={menuToggle === true ? {paddingLeft:'0px'}: {paddingLeft:'8px'}} style={Themes.sideMenu.sideMenuCard}>
            {menuToggle ? (
              <div style={{ height: "30px" }}><img onClick={() => menuToggleFromSerach()} src={Search} style={{ marginLeft: "17px",cursor:'pointer'}} alt="Search" /></div> 
            ) : (
              <Select
                showSearch
                autoFocus={autoFocusSearch}
                style={{ width: "100%", paddingRight: "8px"}}
                suffixIcon={<i className="fa fa-search" role="presentation" aria-hidden="true" style={Themes.sideMenu.sideMenuSearchIcon} />}
                onSelect={selectMenu}
                value={null}
                placeholder={
                  <Row>
                    <Col span={20}>Search...</Col>
                    <Col style={{ textAlign: "right" }} span={4}>
                      <i className="fa fa-search" role="presentation" aria-hidden="true" style={Themes.sideMenu.sideMenuSearchIcon} />
                    </Col>
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
            )}
            <Scrollbars
              style={{
                height: "80vh",
              }}
              autoHide
              autoHideTimeout={1000}
              autoHideDuration={200}
              thumbSize={90}
              renderView={renderView}
              renderThumbHorizontal={renderThumb}
              renderThumbVertical={renderThumb}
            >
              <Menu theme="light" mode="inline" /* openKeys={openKeys} onOpenChange={onOpenChange} */>
                {menuData.map((menu, menuIndex) =>
                  menu.children && menu.children.length > 0 ? (
                    <SubMenu
                      key={`${menu.key}`}
                      icon={
                        <span className={menu.icon} style={{ color: "#666666", width: "23px" }}>
                          &ensp;
                        </span>
                      }
                      title={`${menu.title}`}
                    >
                      {menu.children.map((subMenuItem, index) =>
                        subMenuItem.children && subMenuItem.children.length > 0 ? (
                          <SubMenu
                            key={`${subMenuItem.key}`}
                            icon={
                              <span className={subMenuItem.icon} style={{ color: "#666666", width: "23px" }}>
                                &ensp;
                              </span>
                            }
                            title={`${subMenuItem.title}`}
                            style={{ marginLeft: "62px" }}
                          >
                            {subMenuItem.children.map((lowerSubMenuItem, index) => (
                              <Menu.Item
                                key={`${lowerSubMenuItem.key}-${index}`}
                                icon={
                                  <span className={lowerSubMenuItem.icon} style={{ color: "#666666", width: "23px" }}>
                                    &ensp;
                                  </span>
                                }
                                style={{width:'auto',paddingRight:'10px'}}
                                // style={{ paddingLeft: "26px",width:'auto',overflow:'visible',textOverflow:'clip',whiteSpace:'normal',lineHeight:'15px' }}
                              >
                                <span  title={lowerSubMenuItem.title} onClick={() => NavigateToMenu(lowerSubMenuItem.type, lowerSubMenuItem.id, lowerSubMenuItem.title)}>
                                  {lowerSubMenuItem.title}
                                </span>
                                {/* &emsp;
                                <span
                                  title={`Add New ${subMenuItem.title}`}
                                  onClick={() => NavigateToMenu(`${lowerSubMenuItem.type}New`, lowerSubMenuItem.id, lowerSubMenuItem.title)}
                                >
                                  +
                                </span> */}
                              </Menu.Item>
                            ))}
                          </SubMenu>
                        ) : (
                          <Menu.Item
                            key={`${subMenuItem.key}-${index}`}
                            icon={
                              <span className={subMenuItem.icon} style={{ color: "#666666", width: "23px" }}>
                                &ensp;
                              </span>
                            }
                            style={{width:'auto',paddingRight:'10px',backgroundColor:`${subMenuItem.id === menuIdFromUrl? "#fbfbfb":"#FFFF"}`}}
                            // style={{width:'auto',overflow:'visible',textOverflow:'clip',whiteSpace:'normal',lineHeight:'15px'}}
                          >
                            <span style={{fontWeight:`${subMenuItem.id === menuIdFromUrl? "550":"500"}`}} title={subMenuItem.title} onClick={() => NavigateToMenu(subMenuItem.type, subMenuItem.id, subMenuItem.title)}>
                              {subMenuItem.title}
                            </span>
                            {/* &emsp;
                            <span title={`Add New ${subMenuItem.title}`} onClick={() => NavigateToMenu(`${subMenuItem.type}New`, subMenuItem.id, subMenuItem.title)}>
                              +
                            </span> */}
                          </Menu.Item>
                        )
                      )}
                    </SubMenu>
                  ) : (
                    <Menu.Item
                      key={`${menu.key}`}
                      icon={
                        <span className={menu.icon} style={{ color: "#666666", width: "23px" }}>
                          &ensp;
                        </span>
                      }
                      style={{width:'auto',paddingRight:'10px'}}
                      // style={{width:'auto',overflow:'visible',textOverflow:'clip',whiteSpace:'normal',lineHeight:'15px'}}
                    >
                      <span  title={menu.title} onClick={() => NavigateToMenu(menu.type, menu.id, menu.title)}>
                        {menu.title}
                      </span>
                      {/* &emsp;
                      <span title={`Add New ${menu.title}`} onClick={() => NavigateToMenu(`${menu.type}New`, menu.id, menu.title)}>
                        +
                      </span> */}
                    </Menu.Item>
                  )
                )}
              </Menu>
            </Scrollbars>
            {/* <div onClick={() => setMenuToggle((t) => !t)} style={ menuToggle === true ? {  textAlign: "center", fontWeight: "bold", cursor: "pointer", backgroundColor: "#FFFFFF", padding: "5px" }:{textAlign: "right", fontWeight: "bold", cursor: "pointer", backgroundColor: "#FFFFFF", padding: "5px"}}>
              {menuToggle ? (
                <span>
                  <img alt="expandMenu" src={expandMenuIcon} />
                </span>
              ) : (
                <span>
                  <img alt="collapseMenu" src={collapseMenuIcon} />
                </span>
              )}
            </div> */}
            {/* {menuToggle ? (
              <div onClick={() => setFullMenuToggle((t) => !t)} style={fullMenuToggle ? toggleFullHideButtonActive : toggleFullHideButtonInactive}>
                {fullMenuToggle ? (
                  <span>
                    <img alt="showMenu" src={showMenuIcon} />
                  </span>
                ) : (
                  <span>
                    <img alt="hideMenu" src={hideMenuIcon} />
                  </span>
                )}
              </div>
            ) : null} */}
          </Card>
        </Sider>
      )}
    </div>
  );
};

export default SideMenu;
