import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Button, AutoComplete, Input, Dropdown, Menu, Checkbox, message, Alert, Modal, Form, notification, Collapse, Spin, Tooltip } from "antd";
import { useWindowContext, useGlobalContext } from "../../lib/storage";
import Settings from "../../assets/images/settingIcon.svg";
import MoreActions from "../../assets/images/moreActions.svg";
import TreeView from "../../assets/images/tree_View.svg";
import Export from "../../assets/images/export.svg";
import Import from "../../assets/images/importGeneric.svg";
import QuickAdd from "../../assets/images/Quickadd.svg";
import DownArrow from "../../assets/images/arrow-drop-down.svg";
import Reset from "../../assets/images/reset.svg";
import Summary from "../../assets/images/summary.svg";
import Selection from "../../assets/images/selection.svg";
import ShowList from "../../assets/images/listView.svg";
import ShowAndHide from "../../assets/images/showandHide.svg";
import Repeat from "../../assets/images/repeat.svg";
import ListMore from "../../assets/images/listMoreIcon.svg";
import Print from "../../assets/images/print.svg";
import Filter from "../../assets/images/filter.svg";
import Edit from "../../assets/images/edit.svg";
import Trash from "../../assets/images/trash.svg";
import CollapseAll from "../../assets/images/collapse_all.png";
import ExpandAll from "../../assets/images/expand_all.png";
import RecordForm from "../window/RecordForm";
import dayjs from "dayjs";
import { Scrollbars } from "react-custom-scrollbars";
import { LoadingOutlined } from "@ant-design/icons";
import { FieldReference } from "../../lib/fieldReference";
import { deleteTabRecord, getWindowInitializationData, upsertTabData, getViews, upsertViews, getTabData, importDefinitionService } from "../../services/generic";
import { getTabColumns } from "../window/windowUtilities";
import { ExportToCsv } from "export-to-csv";
import ImportComponent from "../import";
import "antd/dist/antd.css";

const { Panel } = Collapse;

const ListWindowHeader = (props) => {
  const {
    setSearchKey,
    setLastRefreshed,
    treeView,
    treeViewFlag,
    columns,
    resetFilters,
    takeSummary,
    takeHideAndshowData,
    hideAndShowTitles,
    kanbanCards,
    /* ShowListView, */
    selectedRowKeys,
    setSelectedRowKeys,
    setWindowLoading,
    kanbanCardFlag,
    filters,
    takeViewFilters,
    expandTreeView,
    collapseTreeView,
    treeSearchInput,
    setTreeSearchInput
  } = props;
  const history = useHistory();
  const { globalStore } = useGlobalContext();
  const Themes = globalStore.userData.CW360_V2_UI;
  const { windowStore, setWindowStore } = useWindowContext();
  const { windowDefinition } = windowStore;
  const [searchInput, setSearchInput] = useState("");
  const [headerTabData, setHeaderTabData] = useState({});
  const [hideAndShowData, setHideAndShowData] = useState([]);
  const [headerFieldGroups, setHeaderFieldGroups] = useState({});
  const [visible, setVisible] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [checkBox, setCheckBox] = useState(false);
  const [summaryMenuItems, setSummaryMenuItems] = useState([]);

  const [viewsVisible, setViewsVisible] = useState(false);
  const [viewModalFlag, setViewModalFlag] = useState("");
  const [visibleViewModal, setVisibleViewModal] = useState(false);
  const [viewName, setViewName] = useState("");

  const [recentVisible, setRecentVisible] = useState(false);
  const [viewsData, setViewsData] = useState([]);
  const [recentName, setRecentName] = useState("");
  const [saveFlag, setSaveFlag] = useState(false);
  const [importPopupVisible, setImportPopupVisible] = useState(false);

  useEffect(async () => {
    let isMounted = true;
    const response = await getViews(windowDefinition.ad_window_id);
    if (response) {
      if (isMounted) {
        const data = response;
        setViewsData(data);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [saveFlag]);

  const handleRecentDropDown = (flag) => {
    setRecentVisible(flag);
  };

  const handleRecentMenu = (e) => {
    const data = viewsData.filter((item) => item.id === e.key);
    setRecentName(data[0].name);
    takeViewFilters(data[0].filters);
    setRecentVisible(false);
  };

  const recentMenu = () => {
    return (
      <Menu
        key="1"
        style={{
          overflowY: "scroll",
          maxHeight: "15rem",
        }}
        onClick={handleRecentMenu}
      >
        {viewsData.map((item) => {
          return <Menu.Item key={item.id}>{item.name}</Menu.Item>;
        })}
      </Menu>
    );
  };

  const getSearchData = (e) => {
    const searchValue = e.target.value;
    setSearchInput(searchValue);
    setSearchKey(searchValue);
  };

  const getSearchTreeData = (e) => {
    const searchValue = e.target.value;
    setTreeSearchInput(searchValue);
  }; 

  const refreshData = () => {
    setLastRefreshed(new Date());
  };

  useEffect(() => {
    if (windowDefinition.tabs) {
      const headerTab = windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === "0")];
      headerTab.fields.sort((a, b) => {
        const x = a.grid_seqno !== null ? parseInt(a.grid_seqno) : a.grid_seqno;
        const y = b.grid_seqno !== null ? parseInt(b.grid_seqno) : b.grid_seqno;
        return (x != null ? x : Infinity) - (y != null ? y : Infinity);
      });
      setHeaderTabData(headerTab);
      let hideAndShowTitles = [];
      for (let index1 = 0; index1 < headerTab.fields.length; index1++) {
        if (headerTab.fields[index1].nt_base_reference_id !== FieldReference.Button && headerTab.fields[index1].isdisplayed === "Y" && headerTab.fields[index1].isactive === "Y") {
          hideAndShowTitles.push({
            title: headerTab.fields[index1].name,
            checked: headerTab.fields[index1].showinrelation === "Y" ? true : false,
          });
        }
      }

      const fieldGroupsList = {};
      headerTab.fields.forEach((element) => {
        if (element.fieldgroup_name !== undefined && element.nt_base_reference_id !== "28") {
          fieldGroupsList[element.fieldgroup_name] = fieldGroupsList[element.fieldgroup_name] || [];
          fieldGroupsList[element.fieldgroup_name].push(element);
        }
      });
      setHeaderFieldGroups(fieldGroupsList);

      takeHideAndshowData(hideAndShowTitles);
      setHideAndShowData(hideAndShowTitles);
    }
  }, [checkBox, hideAndShowTitles]);

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  const onChange = (e, i) => {
    const windowDef = { ...windowDefinition };
    if (windowDef.tabs) {
      const headerTab = windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === "0")];
      headerTab.fields.sort((a, b) => {
        const x = a.grid_seqno !== null ? parseInt(a.grid_seqno) : a.grid_seqno;
        const y = b.grid_seqno !== null ? parseInt(b.grid_seqno) : b.grid_seqno;
        return (x != null ? x : Infinity) - (y != null ? y : Infinity);
      });
      for (let index1 = 0; index1 < headerTab.fields.length; index1++) {
        if (headerTab.fields[index1].name === e.target.id) {
          if (e.target.checked) {
            headerTab.fields[index1].showinrelation = "Y";
          } else {
            headerTab.fields[index1].showinrelation = "N";
          }
        }
      }
    }
    setWindowStore({ windowDefinition: windowDef });
    setCheckBox(!checkBox);
  };

  const menu = () => {
    return (
      <Menu
        key="1"
        style={{
          overflowY: "scroll",
          maxHeight: "15rem",
        }}
      >
        {hideAndShowData.map((item, index) => {
          return (
            <Menu.Item key={index}>
              <Checkbox key={index} id={item.title} onChange={(e) => onChange(e, index)} checked={item.checked}>
                {item.title}
              </Checkbox>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  const handleSummaryVisibleChange = (flag) => {
    setSummaryVisible(flag);
  };

  const handleSummary = (e) => {
    const windowDef = { ...windowDefinition };
    if (windowDef) {
      if (e.target.id === "SUM") {
        if (e.target.checked) {
          windowDef.sum = true;
        } else {
          windowDef.sum = false;
        }
      }
      if (e.target.id === "COUNT") {
        if (e.target.checked) {
          windowDef.count = true;
        } else {
          windowDef.count = false;
        }
      }
      if (e.target.id === "MIN") {
        if (e.target.checked) {
          windowDef.min = true;
        } else {
          windowDef.min = false;
        }
      }
      if (e.target.id === "MAX") {
        if (e.target.checked) {
          windowDef.max = true;
        } else {
          windowDef.max = false;
        }
      }
      if (e.target.id === "AVG") {
        if (e.target.checked) {
          windowDef.avg = true;
        } else {
          windowDef.avg = false;
        }
      }
    }
    setWindowStore({ windowDefinition: windowDef });
    let fieldIds = [];
    for (let i = 0; i < columns.length; i++) {
      if (e.target.id === "COUNT") {
        if (columns[i].baseReferenceId === "22" || columns[i].baseReferenceId === "10") {
          fieldIds.push(columns[i].dataIndex.replace("_iden", ""));
        }
      } else {
        if (columns[i].baseReferenceId === "22") {
          fieldIds.push(columns[i].dataIndex.replace("_iden", ""));
        }
      }
    }
    if (fieldIds.length > 0) {
      let summary = windowDef.summary === undefined || windowDef.summary === {} ? {} : windowDef.summary;
      if (e.target.checked) {
        summary[e.target.id] = fieldIds;
      } else {
        delete summary[e.target.id];
      }
      takeSummary(summary);
    }
  };

  useEffect(() => {
    const summaryMenu = [
      {
        title: "TOTAL",
        id: "SUM",
        checked: windowDefinition.sum === undefined || windowDefinition.sum === false ? false : true,
      },
      {
        title: "COUNT",
        id: "COUNT",
        checked: windowDefinition.count === undefined || windowDefinition.count === false ? false : true,
      },
      {
        title: "MIN",
        id: "MIN",
        checked: windowDefinition.min === undefined || windowDefinition.min === false ? false : true,
      },
      {
        title: "MAX",
        id: "MAX",
        checked: windowDefinition.max === undefined || windowDefinition.max === false ? false : true,
      },
      {
        title: "AVG",
        id: "AVG",
        checked: windowDefinition.avg === undefined || windowDefinition.avg === false ? false : true,
      },
    ];
    setSummaryMenuItems(summaryMenu);
  }, [windowDefinition]);

  const summaryMenu = () => {
    return (
      <Menu key="1">
        {summaryMenuItems.map((item, index) => {
          return (
            <Menu.Item key={index}>
              <Checkbox key={index} id={item.id} onChange={handleSummary} checked={item.checked}>
                {item.title}
              </Checkbox>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  const [isAlertActive, setIsAlertActive] = useState(false);
  const [errorMessageDetails, setErrorMessageDetails] = useState();
  const deleteRecords = async () => {
    setWindowLoading(true);
    const recordArray = [];
    selectedRowKeys.map((recordKey) => {
      return recordArray.push(recordKey.recordId);
    });
    const deleteResponse = await deleteTabRecord(headerTabData.ad_tab_id, recordArray);
    if (deleteResponse.messageCode === "200") {
      setWindowLoading(false);
      setSelectedRowKeys([]);
      message.success(deleteResponse.message);
      refreshData();
    } else {
      setWindowLoading(false);
      setErrorMessageDetails(deleteResponse);
      setIsAlertActive(true);
    }
  };

  const editRecord = () => {
    history.push(`/window/${windowDefinition.ad_window_id}/${selectedRowKeys[0].recordId}`);
  };

  const displayErrorDetails = () => {
    if (errorMessageDetails) {
      Modal.error({
        title: errorMessageDetails.title,
        content: errorMessageDetails.message,
      });
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

  const [headerRecordData, setHeaderRecordData] = useState({});
  const [visibleQuickAddModal, setVisibleQuickAddModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form] = Form.useForm();
  const showQuickAdd = async () => {
    const headerRecordData = await getWindowInitializationData(headerTabData.ad_tab_id);
    setHeaderRecordData(headerRecordData);
    setVisibleQuickAddModal(true);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then(() => {
        form.submit();
      })
      .catch((error) => {
        console.error(JSON.stringify(error, null, 2));
      });
  };

  const onFinish = (values) => {
    setFormLoading(true);
    Object.entries(values).map(([key, value]) => {
      if (value === true) {
        values[key] = "Y";
      }
      if (value === false) {
        values[key] = "N";
      }
      if (typeof value === "string") {
        values[key] = value;
      }
      if (typeof value === "number") {
        values[key] = `${value}`;
      }
      if (dayjs.isDayjs(value)) {
        values[key] = `${value.format("YYYY-MM-DD HH:mm:ss")}`;
      }
      if (value === "") {
        values[key] = null;
      }
      if (value === undefined) {
        values[key] = null;
      }
      return null;
    });

    Object.entries(values).map(() => {
      Object.entries(headerRecordData).map(([headerKey, headerValue]) => {
        if (values[headerKey] === undefined) {
          if (headerKey.search("_iden") === -1) {
            values[headerKey] = headerValue;
          }
        }
        return null;
      });
      return null;
    });

    const stringifiedFields = JSON.stringify(values);
    const updatedStrings = stringifiedFields.replace(/\\"/g, '\\"');
    const stringRequest = JSON.stringify(updatedStrings);

    upsertTabData(headerTabData.ad_tab_id, "NEW_RECORD", stringRequest)
      .then((upsertResponse) => {
        if (upsertResponse.data.data.upsertTab.status === "200") {
          message.success(`${upsertResponse.data.data.upsertTab.message}`);
          setVisibleQuickAddModal(false);
          setLastRefreshed(new Date());
        } else {
          console.error(JSON.stringify(upsertResponse, null, 2));
          notification.error({
            message: "Error Processing Operation",
            description: (
              <Collapse ghost>
                <Panel header="Details" key="1">
                  {upsertResponse.data.data.upsertTab.message}
                </Panel>
              </Collapse>
            ),
          });
        }
      })
      .catch((e) => {
        console.error(JSON.stringify(e, null, 2));
      })
      .finally(() => {
        setFormLoading(false);
      });
  };

  const rowsInLine = headerTabData.noofcolumnsinrow;
  let colSpanValue = 8;
  let modalWidth = "280px";
  if (rowsInLine) {
    colSpanValue = 24 / parseInt(rowsInLine);
    if (colSpanValue === 12) {
      modalWidth = "520px";
    } else if (colSpanValue === 24) {
      modalWidth = "280px";
    } else if (colSpanValue === 8) {
      modalWidth = "800px";
    } else {
      modalWidth = "auto";
    }
  }

  const handleViewsDropdown = (flag) => {
    setViewsVisible(flag);
  };

  const handleViewsChange = (e) => {
    setViewModalFlag(e.key);
    setVisibleViewModal(true);
  };

  const viewsMenu = () => {
    return (
      <Menu key={"1"} onClick={handleViewsChange}>
        <Menu.Item key={"New"}>New</Menu.Item>
      </Menu>
    );
  };

  const saveViewName = async () => {
    try {
      setViewModalFlag(false);
      const userData = { ...globalStore.userData };
      let finalFilters = [...new Set(filters)];
      const response = await upsertViews(userData.user_id, userData.cs_client_id, windowDefinition.ad_window_id, viewName, finalFilters);
      if (response) {
        if (response.title === "Success") {
          message.success(response.message);
          // window.location.reload();
          setSaveFlag(!saveFlag);
        }
      }
    } catch (error) {
      message.error("View is not saved properly");
    }
  };

  const handleViewName = (e) => {
    setViewName(e.target.value);
  };

  const exportData = async () => {
    const windowName = windowDefinition.name;
    const today = new Date();
    const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    setWindowLoading(true);
    let finalFilters = [...new Set(filters)];
    const getTabDataResponse = await getTabData({
      ad_tab_id: headerTabData.ad_tab_id,
      startRow: "0",
      endRow: "1000000",
      isDownload: "Y",
      filterData: finalFilters.length > 0 ? finalFilters : null,
    });
    const gridColumns = getTabColumns(headerTabData);
    let finalOutputArray = [];

    for (let recordIndex = 0; recordIndex < getTabDataResponse.length; recordIndex++) {
      const jsonRecord = getTabDataResponse[recordIndex];
      let jsonObject = {};
      for (let headerIndex = 0; headerIndex < gridColumns.length; headerIndex++) {
        const fieldValue = gridColumns[headerIndex].dataIndexWithoutIdn.concat("_iden");
        const fieldValueWithoutConcat = gridColumns[headerIndex].dataIndexWithoutIdn;
        if (!(jsonRecord[fieldValue] === undefined)) {
          jsonObject[gridColumns[headerIndex].title] = jsonRecord[fieldValue];
        } else if (!(jsonRecord[fieldValueWithoutConcat] === undefined)) {
          jsonObject[gridColumns[headerIndex].title] = jsonRecord[fieldValueWithoutConcat];
        }
      }
      finalOutputArray.push(jsonObject);
    }
    // console.log("===finalArray===",finalOutputArray)
    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: false,
      filename: `${windowName}_${date}_${time}`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };

    const csvExporter = new ExportToCsv(options);

    csvExporter.generateCsv(finalOutputArray);
    setWindowLoading(false);
  };

  const importData = async () => {
    console.log("----importCompo====", ImportComponent);
    const importTypeId = headerTabData.ad_tab_id;

    /* const getImportDataOnSelect = await importDefinitionService(importTypeId);
    console.log("==>getImportDataOnSelect<==", getImportDataOnSelect);
    // const headerData = Object.keys(getImportDataOnSelect[0]); */
    setImportPopupVisible(true);
  };

  const responsiveDesignForColumn = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 12,
    sm: 12,
    md: 12,
  };

  const responsiveDesignNew = {
    xxl: 24,
    xl: 24,
    lg: 24,
    xs: 24,
    sm: 24,
    md: 24,
  };

  const responsiveSearch = {
    xxl: 6,
    xl: 6,
    lg: 6,
    xs: 24,
    sm: 24,
    md: 6,
  };

  const responsiveButtonIn = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 0,
    sm: 0,
    md: 12,
  };

  const responsiveRecentlyViewed = {
    xxl: 6,
    xl: 6,
    lg: 6,
    xs: 0,
    sm: 0,
    md: 6,
  };

  const responsiveButton = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 24,
    sm: 16,
    md: 12,
  };

  const responsiveButtonMore = {
    xxl: 24,
    xl: 24,
    lg: 24,
    xs: 0,
    sm: 0,
    md: 24,
  };

  const responsiveButtonMoreIn = {
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 24,
    sm: 24,
    md: 0,
  };

  const moreMenu = (
    <Col {...responsiveDesignNew} style={{ height: "auto" }}>
      <Row>
        {windowDefinition.enablenew === "Y" ? (
          <Button className="addNewInList" onClick={() => history.push(`/window/${windowDefinition.ad_window_id}/NEW_RECORD`)}>
            New
          </Button>
        ) : null}
      </Row>
      <Row>
        {windowDefinition.enablequickadd === "Y" ? (
          <Button onClick={showQuickAdd} className="addNewInList">
            Quick Add
          </Button>
        ) : null}
      </Row>
    </Col>
  );

  const moreHeaderActions = (
    <Col {...responsiveButton} style={{ textAlign: "right", paddingTop: "8px" }}>
      <div className="flex-spread">
        <div style={{ display: treeViewFlag === true ? "block" : "none" }}>
          <Tooltip title="Expand All" placement="bottom">
            <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={expandTreeView}>
              <img style={{ paddingBottom: "5px", paddingLeft: "1px", width: "20px" }} src={ExpandAll} alt="invoice" />
            </Button>
          </Tooltip>
          <Tooltip title="Collapse All" placement="bottom">
            <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={collapseTreeView}>
              <img style={{ paddingBottom: "5px", paddingLeft: "1px", width: "20px" }} src={CollapseAll} alt="invoice" />
            </Button>
          </Tooltip>
        </div>
        <Dropdown trigger={["click"]} overlay={summaryMenu} onVisibleChange={handleSummaryVisibleChange} visible={summaryVisible}>
          <Tooltip tipContentClassName="arrow-content-tooltipList" direction="down" distance={12} content="Summary">
            <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
              <img style={{ paddingBottom: "6px", paddingRight: "1px", width: "11px" }} src={Summary} alt="invoice" />
            </Button>
          </Tooltip>
        </Dropdown>
        <Fragment>
          {!kanbanCardFlag ? (
            <div style={{ display: treeViewFlag === true ? "none" : "block" }}>
              <Tooltip title="Kanban View" placement="bottom">
                <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={kanbanCards}>
                  <img style={{ paddingBottom: "6px", width: "16px" }} src={Selection} alt="invoice" />
                </Button>
              </Tooltip>
            </div>
          ) : (
            <Tooltip title="List View" placement="bottom">
              <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={kanbanCards}>
                <img style={{ paddingBottom: "6px", width: "19px" }} src={ShowList} alt="invoice" />
              </Button>
            </Tooltip>
          )}
        </Fragment>
        <div style={{ display: treeViewFlag === true ? "none" : "block" }}>
          <Tooltip title="Clear Filters" placement="bottom">
            <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={resetFilters}>
              <img style={{ paddingBottom: "5px", paddingLeft: "1px", width: "20px" }} src={Reset} alt="invoice" />
            </Button>
          </Tooltip>
        </div>
        <Dropdown trigger={["click"]} overlay={menu} onVisibleChange={handleVisibleChange} visible={visible}>
          <Tooltip title="Show/Hide Columns" placement="bottom">
            <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
              <img style={{ paddingBottom: "5px", paddingLeft: "1px", width: "16px" }} src={ShowAndHide} alt="invoice" />
            </Button>
          </Tooltip>
        </Dropdown>
        <Tooltip title="Reload" placement="bottom">
          <Button onClick={refreshData} color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
            <img style={{ paddingBottom: "7px", paddingRight: "2px", width: "18px" }} src={Repeat} alt="invoice" />
          </Button>
        </Tooltip>

        {windowDefinition.enableprint === "Y" && treeViewFlag === false ? (
          <Tooltip title="Print" placement="bottom">
            <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
              <img style={{ paddingBottom: "5px", paddingRight: "2px", width: "22px" }} src={Print} alt="invoice" />
            </Button>
          </Tooltip>
        ) : null}
        {windowDefinition.enablefilter === "Y" && treeViewFlag === false ? (
          <Tooltip title="Filter" placement="bottom">
            <Button style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
              <img style={{ paddingBottom: "5px", paddingRight: "2px", width: "16px" }} src={Filter} alt="invoice" />
            </Button>
          </Tooltip>
        ) : null}
        <Tooltip title="Export" placement="bottom">
          <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={exportData}>
            <img style={{ paddingBottom: "5px", paddingLeft: "1px", width: "16px" }} src={Export} alt="invoice" />
          </Button>
        </Tooltip>
        {headerTabData.enabletreeview === "Y" ? (
          <Tooltip title="Edit" placement="bottom">
            <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={treeView}>
              <img style={{ paddingBottom: "6px", paddingRight: "1px" }} src={TreeView} alt="invoice" />
            </Button>
          </Tooltip>
        ) : (
          ""
        )}
        {windowDefinition.enableedit === "Y" && selectedRowKeys.length === 1 ? (
          <Tooltip title="Edit" placement="bottom">
            <Button onClick={editRecord} color="primary" style={Themes.contentWindow.ListWindowHeader.listActionEditButtons}>
              <img style={{ paddingBottom: "6px", paddingRight: "1px", width: "15px" }} src={Edit} alt="invoice" />
            </Button>
          </Tooltip>
        ) : null}
        {windowDefinition.enabledelete === "Y" && selectedRowKeys.length >= 1 ? (
          <Tooltip title="Trash" placement="bottom">
            <Button onClick={deleteRecords} style={Themes.contentWindow.ListWindowHeader.listActionEditButtons}>
              <img style={{ paddingBottom: "6px", width: "12px" }} src={Trash} alt="invoice" />
            </Button>
          </Tooltip>
        ) : null}
      </div>
    </Col>
  );

  return (
    <div>
      <Row>
        <Col {...responsiveDesignForColumn}>
          <p style={Themes.contentWindow.ListWindowHeader.listWindowTitle}>{windowDefinition.name} </p>
        </Col>
        <Col {...responsiveDesignForColumn}>
          <Col {...responsiveButtonMore}>
            {windowDefinition.enablenew === "Y" ? (
              <Button onClick={() => history.push(`/window/${windowDefinition.ad_window_id}/NEW_RECORD`)} style={Themes.contentWindow.ListWindowHeader.newButtonForlist}>
                New
              </Button>
            ) : null}
            {windowDefinition.enablequickadd === "Y" ? (
              <Button onClick={showQuickAdd} style={{ float: "right", marginRight: `${windowDefinition.enablequickadd === "Y" ? "8px" : "0px"}` }} className="quickAddButtons">
                <img style={Themes.contentWindow.ListWindowHeader.quickAddButtonImage} src={QuickAdd} alt="quickAdd" />
              </Button>
            ) : null}
          </Col>
          <Col {...responsiveButtonMoreIn} style={{ float: "right", marginRight: "-4px" }}>
            <Dropdown trigger={["click"]} overlay={moreMenu}>
              <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} /* onClick={showMoreOptions} */>
                <img style={{ paddingBottom: "6px", width: "19px" }} src={ListMore} alt="invoice" />
              </Button>
            </Dropdown>
            <Dropdown trigger={["click"]} overlay={moreHeaderActions}>
              <Button style={{ backgroundColor: "rgb(245, 245, 245)", border: "0px solid gray", width: "32px", boxShadow: "0 0px 0 rgb(0 0 0 / 2%)" }}>
                <img style={{ paddingBottom: "6px", width: "30px", marginLeft: "-15px" }} src={MoreActions} alt="invoice" />
              </Button>
            </Dropdown>
          </Col>
        </Col>
      </Row>
      <Row>
        {treeViewFlag === true ? 
          <Col {...responsiveSearch} style={{ paddingTop: "8px" }}>
            <AutoComplete style={{ width: "100%" }}>
              <Input
                placeholder="Search"
                value={treeSearchInput}
                onChange={getSearchTreeData}
                style={{ border: "0.25px solid #D7DADE" }}
                suffix={<i role="presentation" aria-hidden="true" style={Themes.contentWindow.ListWindowHeader.listSearchIcon} />}
              />
            </AutoComplete>
          </Col> : 
          <Col {...responsiveSearch} style={{ paddingTop: "8px" }}>
            <AutoComplete style={{ width: "100%" }}>
              <Input
                  placeholder="Search"
                  value={searchInput}
                  onChange={getSearchData}
                  style={{ border: "0.25px solid #D7DADE" }}
                  suffix={<i className="fa fa-search" role="presentation" aria-hidden="true" style={Themes.contentWindow.ListWindowHeader.listSearchIcon} />}
              />
            </AutoComplete>
          </Col>
        }
        <Col {...responsiveRecentlyViewed} style={{ paddingTop: "12px", paddingLeft: "15px" }}>
          {/* <Dropdown disabled={true}> */}
          <Dropdown trigger={["click"]} overlay={recentMenu} onVisibleChange={handleRecentDropDown} visible={recentVisible}>
            <span className="ant-dropdown-link" role="presentation" style={Themes.contentWindow.ListWindowHeader.viewTypeDropdown}>
              {recentName !== "" ? recentName : "Recently viewed"}
              <span>
                <img src={DownArrow} alt="img" />
              </span>
            </span>
          </Dropdown>
          {/* </Dropdown> */}
        </Col>
        <Col {...responsiveButtonIn} style={{ textAlign: "right", paddingTop: "8px" }}>
          <div className="flex-spread">
            <div style={{ display: treeViewFlag === true ? "block" : "none" }}>
              <Tooltip title="Expand All" placement="bottom">
                <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={expandTreeView}>
                  <img style={{ paddingBottom: "5px", paddingLeft: "1px", width: "20px" }} src={ExpandAll} alt="invoice" />
                </Button>
              </Tooltip>
              <Tooltip title="Collapse All" placement="bottom">
                <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={collapseTreeView}>
                  <img style={{ paddingBottom: "5px", paddingLeft: "1px", width: "20px" }} src={CollapseAll} alt="invoice" />
                </Button>
              </Tooltip>
            </div>
            <Dropdown trigger={["click"]} overlay={viewsMenu} onVisibleChange={handleViewsDropdown} visible={viewsVisible}>
              <Tooltip title="Settings" placement="bottom">
                <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
                  <img style={{ paddingBottom: "6px", width: "20px" }} src={Settings} alt="invoice" />
                </Button>
              </Tooltip>
            </Dropdown>
            <Dropdown trigger={["click"]} overlay={summaryMenu} onVisibleChange={handleSummaryVisibleChange} visible={summaryVisible}>
              <Tooltip title="Summary" placement="bottom">
                <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
                  <img style={{ paddingBottom: "6px", paddingRight: "1px", width: "11px" }} src={Summary} alt="invoice" />
                </Button>
              </Tooltip>
            </Dropdown>
            <Fragment>
              {!kanbanCardFlag ? (
                <div style={{ display: treeViewFlag === true ? "none" : "block" }}>
                  <Tooltip title="Kanban View" placement="bottom">
                    <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={kanbanCards}>
                      <img style={{ paddingBottom: "6px", width: "16px" }} src={Selection} alt="invoice" />
                    </Button>
                  </Tooltip>
                </div>
              ) : (
                <Tooltip title="List View" placement="bottom">
                  <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={kanbanCards}>
                    <img style={{ paddingBottom: "6px", width: "19px" }} src={ShowList} alt="invoice" />
                  </Button>
                </Tooltip>
              )}
            </Fragment>
            <div style={{ display: treeViewFlag === true ? "none" : "block" }}>
              <Tooltip title="Clear Filters" placement="bottom">
                <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={resetFilters}>
                  <img style={{ paddingBottom: "5px", paddingLeft: "1px", width: "20px" }} src={Reset} alt="invoice" />
                </Button>
              </Tooltip>
            </div>
            {/*
          &nbsp;
          <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
            <img style={{ paddingBottom: "6px", paddingLeft: "1px", width: "19px" }} src={Setting} alt="invoice" />
          </Button>
          &nbsp; */}
            <Dropdown trigger={["click"]} overlay={menu} onVisibleChange={handleVisibleChange} visible={visible}>
              <Tooltip title="Show/Hide Columns" placement="bottom">
                <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
                  <img style={{ paddingBottom: "5px", paddingLeft: "1px", width: "16px" }} src={ShowAndHide} alt="invoice" />
                </Button>
              </Tooltip>
            </Dropdown>
            <Tooltip title="Reload" placement="bottom">
              <Button onClick={refreshData} color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
                <img style={{ paddingBottom: "7px", paddingRight: "2px", width: "18px" }} src={Repeat} alt="invoice" />
              </Button>
            </Tooltip>
            {/*  
          &nbsp;
         {windowDefinition.enableattachment === "Y" ? (
            <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
              <img style={{ paddingBottom: "5px", paddingRight: "2px", width: "18px" }} src={Import} alt="invoice" />
            </Button>
          ) : null}
          &nbsp; */}
            {windowDefinition.enableprint === "Y" && treeViewFlag === false ? (
              <Tooltip title="Print" placement="bottom">
                <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
                  <img style={{ paddingBottom: "5px", paddingRight: "2px", width: "22px" }} src={Print} alt="invoice" />
                </Button>
              </Tooltip>
            ) : null}
            {windowDefinition.enablefilter === "Y" && treeViewFlag === false ? (
              <Tooltip title="Filter" placement="bottom">
                <Button style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
                  <img style={{ paddingBottom: "5px", paddingRight: "2px", width: "16px" }} src={Filter} alt="invoice" />
                </Button>
              </Tooltip>
            ) : null}
            <Tooltip title="Export" placement="bottom">
              <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={exportData}>
                <img style={{ paddingBottom: "5px", paddingLeft: "1px", width: "16px" }} src={Export} alt="invoice" />
              </Button>
            </Tooltip>

            {headerTabData.tabenabledforimport === "Y" ? (
              <Tooltip title="Import" placement="bottom">
                <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={importData}>
                  <img style={{ paddingBottom: "5px", paddingLeft: "1px", width: "16px" }} src={Import} alt="invoice" />
                </Button>
              </Tooltip>
            ) : (
              ""
            )}

            {headerTabData.enabletreeview === "Y" ? (
              <Tooltip title="TreeView" placement="bottom">
                <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons} onClick={treeView}>
                  <img style={{ paddingBottom: "6px", paddingRight: "1px" }} src={TreeView} alt="invoice" />
                </Button>
              </Tooltip>
            ) : (
              ""
            )}
            {windowDefinition.enableedit === "Y" && selectedRowKeys.length === 1 ? (
              <Tooltip title="Edit" placement="bottom">
                <Button onClick={editRecord} color="primary" style={Themes.contentWindow.ListWindowHeader.listActionEditButtons}>
                  <img style={{ paddingBottom: "6px", paddingRight: "1px", width: "15px" }} src={Edit} alt="invoice" />
                </Button>
              </Tooltip>
            ) : null}
            {windowDefinition.enabledelete === "Y" && selectedRowKeys.length >= 1 ? (
              <Tooltip title="Trash" placement="bottom">
                <Button onClick={deleteRecords} style={Themes.contentWindow.ListWindowHeader.listActionEditButtons}>
                  <img style={{ paddingBottom: "6px", width: "12px" }} src={Trash} alt="invoice" />
                </Button>
              </Tooltip>
            ) : null}
            {/*   <Button color="primary" style={Themes.contentWindow.ListWindowHeader.listActionButtons}>
            <img style={{ paddingBottom: "6px", fontWeight: "600", width: "20px", paddingRight: "2px" }} src={Options} alt="invoice" />
          </Button> */}
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ marginTop: "0px" }}>
          {isAlertActive ? (
            <Alert
              style={{
                width: "400px",
                position: "absolute",
                zIndex: 111,
                right: 0,
                top: "8px",
                borderLeft: "5px solid #c13832",
                borderRight: "0.5px solid #c13832",
                borderBottom: "0.5px solid #c13832",
                borderTop: "0.5px solid #c13832",
                backgroundColor: "white",
              }}
              message="Error"
              description="There is an error processing your request !"
              type="error"
              closable
              onClose={() => setIsAlertActive(false)}
              action={
                <Button onClick={displayErrorDetails} size="small" style={{ border: "0px solid #c13832", color: "#c13832", fontSize: "13px", marginTop: "6px" }} danger>
                  Detail
                </Button>
              }
            />
          ) : null}
        </Col>
      </Row>
      <Modal
        visible={visibleQuickAddModal}
        onCancel={() => setVisibleQuickAddModal(false)}
        getContainer={false}
        width={modalWidth}
        maskClosable={false}
        footer={[
          <Button key="save" style={{ border: "0px solid #000000" }} disabled={formLoading} onClick={() => setVisibleQuickAddModal(false)}>
            Cancel
          </Button>,
          <Button
            key="save-next"
            type="primary"
            disabled={formLoading}
            style={Themes.contentWindow.recordWindow.linesTab.popUpNewButton}
            loading={formLoading}
            onClick={handleSave}
          >
            Save
          </Button>,
        ]}
        title={"Quick Add"}
      >
        <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={formLoading}>
          <Scrollbars
            style={{
              height: "60vh",
            }}
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            thumbSize={90}
            renderView={renderView}
            renderThumbHorizontal={renderThumb}
            renderThumbVertical={renderThumb}
          >
            <RecordForm
              form={form}
              idName="quickAdd"
              onFinish={onFinish}
              headerTab={headerTabData}
              headerRecord={headerRecordData}
              headerFieldGroups={headerFieldGroups}
              recordId={"NEW_RECORD"}
            />
          </Scrollbars>
        </Spin>
      </Modal>
      {viewModalFlag === "New" ? (
        <Modal
          visible={visibleViewModal}
          title={"Create New Grid View"}
          onCancel={() => {
            setVisibleViewModal(false);
            setViewName("");
          }}
          getContainer={false}
          footer={[
            <Button
              onClick={() => {
                setVisibleViewModal(false);
                setViewName("");
              }}
            >
              Cancel
            </Button>,
            <Button style={{ backgroundColor: "rgb(8 158 164)", color: "white", width: "93px", height: "33px" }} onClick={saveViewName}>
              Save
            </Button>,
          ]}
        >
          <Input placeholder="Enter View Name" allowClear onChange={handleViewName} />
        </Modal>
      ) : (
        ""
      )}

      <Modal
        width={"1000px"}
        visible={importPopupVisible}
        onCancel={() => {
          setImportPopupVisible(false);
        }}
        footer={null}
      >
        <ImportComponent importData={{ importId: headerTabData.ad_tab_id, importFlag: true, windowName: windowDefinition.name }} />
      </Modal>
    </div>
  );
};

export default ListWindowHeader;
