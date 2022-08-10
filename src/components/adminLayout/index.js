import React, { useEffect, useState, useRef } from "react";
import { Layout, Spin, Card, Tabs } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useHistory } from "react-router";
import { useGlobalContext } from "../../lib/storage";
import NavBar from "../navBar";
import SideMenu from "../sideMenu";
import ErrorBoundary from "../errorBoundary";
import "antd/dist/antd.css";

const { Header, Content } = Layout;
const { TabPane } = Tabs;

const AdminLayout = (props) => {
  const { globalStore, setGlobalStore } = useGlobalContext();
  const { userPreferences, windowTabs, userData } = globalStore;
  const Themes = userData.CW360_V2_UI;
  const [loading, setLoading] = useState(true);
  const [menuToggle, setMenuToggle] = useState(false);
  const [fullMenuToggle, setFullMenuToggle] = useState(false);
  const [showToggler,setShowToggler] = useState(false)
  const [drawerFlag, setDrawerFlag] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => setLoading(false), 200);
  }, []);

  const [activeKey, setActiveKey] = useState(0);
  const onChangeKey = (key) => {
    history.push(windowTabs[key].url);
    setActiveKey(key);
  };

  const initialExc = useRef(false);
  useEffect(() => {
    if (initialExc.current) {
      if (userPreferences.enableMultiTab === "Y" && windowTabs.length > 0) {
        if (windowTabs[parseInt(activeKey)].content === null) {
          const localwindowTabs = [...windowTabs];
          localwindowTabs[parseInt(activeKey)].content = props.children;
          setGlobalStore({ windowTabs: [...localwindowTabs] });
        }
      }
    }
  }, [activeKey]);

  const editTab = (tabKey, action) => {
    if (action === "remove") {
      removeTab(tabKey);
    }
  };

  const removeTab = (key) => {
    const localwindowTabs = [...windowTabs];
    const tabKey = parseInt(key);
    localwindowTabs.splice(tabKey, 1);
    setGlobalStore({ windowTabs: [...localwindowTabs] });
    let newKey = 0;
    if (tabKey >= 1) {
      newKey = tabKey - 1;
    }
    setActiveKey(`${newKey}`);
    history.push(windowTabs[newKey].url);
  };

  useEffect(() => {
    if (userPreferences.enableMultiTab === "Y") {
      if (windowTabs.length > 0) {
        const localwindowTabs = [...windowTabs];
        const tabIdx = localwindowTabs.findIndex((tab) => tab.url === history.location.pathname && tab.content === null);
        if (tabIdx >= 0) {
          localwindowTabs[tabIdx].content = props.children;
          setGlobalStore({ windowTabs: [...localwindowTabs] });
          setActiveKey(`${tabIdx}`);
          const localStorageTabs = [];
          localwindowTabs.map((tab) => {
            const newTabData = { ...tab, content: null };
            return localStorageTabs.push(newTabData);
          });
          localStorage.setItem("windowTabs", JSON.stringify(localStorageTabs));
        }
      } else {
        const newWindowTab = [];
        newWindowTab.push({
          url: history.location.pathname,
          title: "Window",
          content: props.children,
        });
        setGlobalStore({ windowTabs: [...newWindowTab] });
        setActiveKey(`0`);
        newWindowTab[0].content = null;
        localStorage.setItem("windowTabs", JSON.stringify(newWindowTab));
      }
      initialExc.current = true;
    }
  }, [windowTabs]);

  const onClose = () => {
    setDrawerFlag(false);
  };

  return (
    <Spin indicator={<LoadingOutlined className="spinLoader" style={Themes} spin />} spinning={loading}>
      <Layout style={{ display: loading ? "none" : "block", fontFamily: "'Open Sans', sans-serif" }}>
        <Header style={Themes.header}>
          <NavBar showToggler={showToggler} setShowToggler ={setShowToggler} fullMenuToggle={fullMenuToggle} setFullMenuToggle={setFullMenuToggle} setMenuToggle={setMenuToggle} menuToggle={menuToggle} setDrawerFlag={setDrawerFlag} drawerFlag={drawerFlag} />
        </Header>
        <Layout>
          <SideMenu showToggler={showToggler} setShowToggler ={setShowToggler} fullMenuToggle={fullMenuToggle} setFullMenuToggle={setFullMenuToggle} setMenuToggle={setMenuToggle} menuToggle={menuToggle} drawerFlag={drawerFlag} onClose={onClose} />
          <Content style={Themes.content}>
            <div style={Themes.contentWindow}>
              <Card style={Themes.contentWindow.contentCard}>
                {userPreferences.enableMultiTab === "Y" ? (
                  <Tabs hideAdd onChange={onChangeKey} activeKey={activeKey} type="editable-card" onEdit={editTab}>
                    {windowTabs.map((tab, index) => (
                      <TabPane forceRender={false} tab={tab.title} key={index} closable={windowTabs.length > 1 ? true : false}>
                        <ErrorBoundary>{tab.content}</ErrorBoundary>
                      </TabPane>
                    ))}
                  </Tabs>
                ) : (
                  <ErrorBoundary>{props.children}</ErrorBoundary>
                )}
              </Card>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Spin>
  );
};

export default AdminLayout;
