import React, { useState, useEffect, Fragment } from "react";
import { Card, Row, Col, Button, Collapse, Form, Typography, Spin, message, notification, Dropdown, Tooltip } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import { getTabData, upsertTabData, getWindowInitializationData } from "../../services/generic";
import { FieldReference } from "../../lib/fieldReference";
import RecordForm from "../window/RecordForm";
import StatusBar from "./StatusBar";
import AuditTrail from "../../assets/images/auditTrail.svg";
import Arrow from "../../assets/images/arrow.svg";
import Repeat from "../../assets/images/repeat.svg";
import ListMore from "../../assets/images/listMoreIcon.svg";

import Print from "./Print";
import EmailTemplate from "./EmailTemplate";
import FileAttachment from "./FileAttachment";
import dayjs from "dayjs";
import { useGlobalContext, useWindowContext } from "../../lib/storage";
import { formatDisplayField } from "../window/windowUtilities";
import "antd/dist/antd.css";

const { Panel } = Collapse;
const { Text } = Typography;

const headerOptionIcons = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#536C78",
  paddingBottom: "7px",
  paddingLeft: "0px",
  cursor: "pointer",
};

const labelValueDiv = {
  border: "0.5px solid transparent",
  borderRadius: "3px",
  width: "100%",
  // height: "32px",
  padding: "3px 11px 0px",
  marginTop: "3px",
};

const customParseFormat = require("dayjs/plugin/customParseFormat");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

const RecordHeader = (props) => {
  const { globalStore } = useGlobalContext();
  const Themes = globalStore.userData.CW360_V2_UI;
  const { lastRefreshed, setLastRefreshed, setHeaderRecordData, setIsHeaderActive, setLoadingRecordWindow } = props;
  const { recordId } = useParams();
  const [headerTab, setHeaderTab] = useState({ fields: [] });
  const [headerTabId, setHeaderTabId] = useState("");
  const [headerRecord, setHeaderRecord] = useState({});
  const [headerFieldGroups, setHeaderFieldGroups] = useState({});
  const [headerReferenceList, setHeaderReferenceList] = useState([]);
  const [recordTitles, setRecordTitles] = useState([]);
  const [statusBar, setStatusBar] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayAuditInfo, setDisplayAuditInfo] = useState(false);
  const [auditData, setAuditData] = useState({});

  const history = useHistory();

  const { windowStore, setWindowStore } = useWindowContext();
  const windowDefinition = { ...windowStore.windowDefinition };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (isMounted) {
        setLoading(true);
        try {
          if (windowDefinition.tabs) {
            const headerTabData = windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === "0")];
            const headerTabId = headerTabData.ad_tab_id;
            headerTabData.fields.sort((a, b) => {
              const x = a.seqno !== null ? parseInt(a.seqno) : a.seqno;
              const y = b.seqno !== null ? parseInt(b.seqno) : b.seqno;
              return (x != null ? x : Infinity) - (y != null ? y : Infinity);
            });
            setHeaderTab(headerTabData);
            setHeaderTabId(headerTabId);

            let headerRecordData;
            if (recordId !== "NEW_RECORD") {
              const getTabDataResponse = await getTabData({ ad_tab_id: headerTabData.ad_tab_id, recordId: recordId, startRow: "0", endRow: "1" });
              headerRecordData = getTabDataResponse[0];
            } else {
              setIsEditMode(true);
              headerRecordData = await getWindowInitializationData(headerTabData.ad_tab_id);
            }
            setHeaderRecord(headerRecordData);
            setHeaderRecordData({ ...headerRecordData });
            setWindowStore({ windowHeaderTabRecords: headerRecordData });

            const recordTitle = headerTabData.record_identifier.split(",");
            const recordTitlesData = [];
            recordTitle.forEach((element) => {
              const headerFieldIndex = headerTabData.fields.findIndex((field) => field.ad_field_id === element);
              const recordIdentifierField = headerTabData.fields[headerFieldIndex];
              let titleNameValue = headerRecordData[element.concat("_iden")];
              if (titleNameValue === null || titleNameValue === undefined) {
                titleNameValue = headerRecordData[element];
              }
              titleNameValue = formatDisplayField(titleNameValue, recordIdentifierField);
              recordTitlesData.push({
                titleName: titleNameValue,
                titleTip: titleNameValue,
              });
            });
            setRecordTitles([...recordTitlesData]);

            const statusBarValues = [];
            const referenceList = [];
            const fieldGroupsList = {};
            const auditDataValues = {};
            headerTabData.fields.forEach((element) => {
              if (element["nt_base_reference_id"] === FieldReference.List) {
                const list = element.Values;
                if (list !== undefined || list !== null) {
                  Object.keys(list).forEach((key) => {
                    referenceList.push(list[key]);
                  });
                }
              }

              if (element.isshowninstatusbar === "Y" && element.isdisplayed === "Y" && element.isactive === "Y") {
                let titleDataValue = headerRecordData[element.ad_field_id.concat("_iden")];
                if (titleDataValue === null || titleDataValue === undefined) {
                  titleDataValue = headerRecordData[element.ad_field_id];
                  const refIndex = referenceList.findIndex((list) => list.key === titleDataValue);
                  if (refIndex >= 0) {
                    titleDataValue = referenceList[refIndex].value;
                  }
                }
                if (titleDataValue === "Y") {
                  titleDataValue = "Yes";
                }
                if (titleDataValue === "N") {
                  titleDataValue = "No";
                }
                statusBarValues.push({
                  titleName: element.name,
                  titleValue: titleDataValue,
                });
              }

              if (element.fieldgroup_name !== undefined && element.nt_base_reference_id !== "28") {
                fieldGroupsList[element.fieldgroup_name] = fieldGroupsList[element.fieldgroup_name] || [];
                fieldGroupsList[element.fieldgroup_name].push(element);
              }

              if (element.column_name?.toLowerCase() === "updatedby") {
                auditDataValues.updatedby = headerRecordData[element.ad_field_id.concat("_iden")];
              }
              if (element.column_name?.toLowerCase() === "createdby") {
                auditDataValues.createdby = headerRecordData[element.ad_field_id.concat("_iden")];
              }
              if (element.column_name?.toLowerCase() === "created") {
                auditDataValues.created = dayjs(headerRecordData[element.ad_field_id], "YYYY-MM-DD HH:mm:ss").fromNow();
              }
              if (element.column_name?.toLowerCase() === "updated") {
                auditDataValues.updated = dayjs(headerRecordData[element.ad_field_id], "YYYY-MM-DD HH:mm:ss").fromNow();
              }
            });
            setStatusBar([...statusBarValues]);
            setHeaderFieldGroups(fieldGroupsList);
            setHeaderReferenceList([...referenceList]);
            setAuditData({ ...auditDataValues });
          }
        } catch (error) {
          console.error("Error", error);
        } finally {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [recordId, lastRefreshed]);

  const updateLastRefresh = () => {
    setLastRefreshed(new Date());
  };

  const getRecordValue = (field) => {
    let recordValueField = headerRecord[field.ad_field_id.concat("_iden")] ? headerRecord[field.ad_field_id.concat("_iden")] : headerRecord[field.ad_field_id];
    const refIndex = headerReferenceList.findIndex((list) => list.key === recordValueField);
    if (refIndex >= 0) {
      recordValueField = headerReferenceList[refIndex].value;
    }
    // if (typeof recordValueField === "string") {
    //   if (recordValueField.trim() === "Y") {
    //     recordValueField = "Yes";
    //   }
    //   if (recordValueField.trim() === "N") {
    //     recordValueField = "No";
    //   }
    // }
    return formatDisplayField(recordValueField, field, "header");
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    if (isEditMode && recordId !== "NEW_RECORD") {
      setIsEditMode(false);
    } else {
      window.self.close();
      history.push(`/window/list/${windowDefinition.ad_window_id}`);
    }
  };

  const onFinish = (values) => {
    setLoading(true);
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

    if (recordId === "NEW_RECORD") {
      Object.entries(values).map(([ValuesKey, valuesValue]) => {
        Object.entries(headerRecord).map(([headerKey, headerValue]) => {
          if (values[headerKey] === undefined) {
            if (headerKey.search("_iden") === -1) {
              values[headerKey] = headerValue;
            }
          }
          return null;
        });
        return null;
      });
    }

    const stringifiedFields = JSON.stringify(values);
    const updatedStrings = stringifiedFields.replace(/\\"/g, '\\"');
    const stringRequest = JSON.stringify(updatedStrings);

    upsertTabData(headerTab.ad_tab_id, recordId, stringRequest)
      .then((upsertResponse) => {
        if (upsertResponse.data.data.upsertTab.status === "200") {
          message.success(`${upsertResponse.data.data.upsertTab.message}`);
          setIsEditMode(false);
          if (recordId === "NEW_RECORD") {
            const currentRecord = upsertResponse.data.data.upsertTab.recordId;
            const currentLocation = history.location.pathname;
            const windowType = currentLocation.search("popupWindow") >= 0 ? "popupWindow" : "window";
            history.push(`/${windowType}/${windowDefinition.ad_window_id}/${currentRecord}`);
          } else {
            setLastRefreshed(new Date());
          }
        } else {
          console.error(JSON.stringify(upsertResponse, null, 2));
          // message.error("An Error Occured !");
          // form.setFieldsValue(originalFormValues);
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
        // message.error("An Error Occured !");
        // form.setFieldsValue(originalFormValues);
        /* notification.error({
          message: upsertResponse.data.data.upsertTab.messageCode,
          description: upsertResponse.data.data.upsertTab.message,
        }); */
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setIsHeaderActive(isEditMode);
  }, [isEditMode]);

  const showPopupWindow = (field) => {
    window.open(`/popupWindow/${field.new_record_window}/${headerRecord[field.ad_field_id]}`, "Record Window", "width=1200,height=600,left=210,top=120");
  };

  const navigateToListWindow = () => {
    window.self.close();
    history.push(`/window/list/${windowDefinition.ad_window_id}`);
  };

  const [collapseAllGroups, setCollapseAllGroups] = useState(false);

  const [form] = Form.useForm();

  const responsiveDesignForAuditTrial = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 12,
    sm: 16,
    md: 12,
  };

  const responsiveDesignRecordTitle = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 12,
    sm: 8,
    md: 12,
  };

  const responsiveDesignForColumn = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 0,
    sm: 0,
    md: 0,
  };

  const responsiveDesignTitle = {
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 12,
    sm: 12,
    md: 12,
  };

  const responsiveTrial = {
    xxl: 14,
    xl: 14,
    lg: 14,
    xs: 8,
    sm: 8,
    md: 10,
  };

  const responsiveButtonIn = {
    xxl: 24,
    xl: 24,
    lg: 24,
    xs: 12,
    sm: 16,
    md: 18,
  };

  const responsiveButtonFor = {
    xxl: 24,
    xl: 24,
    lg: 24,
    xs: 0,
    sm: 0,
    md: 24,
  };

  const responsiveButtonHeader = {
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 24,
    sm: 24,
    md: 0,
  };

  const innerWidth = window.innerWidth;

  const moreHeaderActions = (
    <Col {...responsiveButtonFor}>
      <div className="flex-spread">
        {windowDefinition.enableprint === "Y" ? <Print setLoadingRecordWindow={"setLoadingForPrint"} {...props} headerTabId={headerTabId} /> : null}
        {windowDefinition.enableprint === "Y" ? <EmailTemplate headerTabId={headerTabId} /> : null}
        <Tooltip placement="bottom" title="Repeat">
          <Button style={Themes.contentWindow.ListWindowHeader.headerActionButtons} onClick={updateLastRefresh}>
            <img style={{ paddingBottom: "3px", paddingRight: "2px", width: "18px" }} src={Repeat} alt="invoice" />
          </Button>
        </Tooltip>

        {windowDefinition.enableattachment === "Y" || headerTab.tabenabledforimport === "Y" ? <FileAttachment style={{ marginRight: "0px" }} headerTabId={headerTabId} /> : ""}
      </div>
    </Col>
  );

  return (
    <Fragment>
      <Row>
        <Col {...responsiveDesignForColumn} style={{ marginTop: "-4px" }}>
          <Button type="link" onClick={navigateToListWindow} style={Themes.contentWindow.recordWindow.RecordHeader.breadCrumb}>
            {windowDefinition.name}
          </Button>
        </Col>
        <Col {...responsiveDesignTitle} style={{ marginTop: "-18px" }}>
          <Button type="link" onClick={navigateToListWindow} style={Themes.contentWindow.recordWindow.RecordHeader.breadCrumb}>
            {windowDefinition.name}
          </Button>
        </Col>
      </Row>
      <Row style={{ width: "100%" }}>
        <Col
          {...responsiveDesignForAuditTrial}
          style={{ marginLeft: `${innerWidth > 1200 ? "-14px" : "-9px"}`, marginTop: `${recordTitles.length > 0 && recordTitles[0].titleName ? "-18px" : "-10px"}` }}
        >
          <span style={{ display: "inline-block" }} className="formRecordTitle">
            <span className="auditTrialText">
              {recordTitles.map((record, index) => (
                <span>&ensp;{record.titleName}</span>
              ))}
            </span>
          </span>
          <span
            style={{
              display: "inline-block",
              position: "absolute",
              top: `${innerWidth < 375 ? "4px" : "10px"}`,
            }}
          >
            {windowDefinition.enableauditlog === "Y" ? <img onClick={() => setDisplayAuditInfo((a) => !a)} style={headerOptionIcons} src={AuditTrail} alt="AuditTrail" /> : null}
          </span>
        </Col>
        <Col
          {...responsiveDesignRecordTitle}
          style={{
            float: "right",
            marginTop: "10px",
            marginLeft: `${innerWidth > 1200 ? "14px" : "9px"}`,
          }}
        >
          <Row>
            <Col {...responsiveButtonFor}>
              <div className="flex-spread">
                {windowDefinition.enableedit === "Y" && !isEditMode ? (
                  <span>
                    <Button style={Themes.contentWindow.recordWindow.RecordHeader.aboveHeaderEditButtons} onClick={handleEdit}>
                      Edit
                    </Button>
                    <Button style={Themes.contentWindow.recordWindow.RecordHeader.aboveHeaderEditButtons} onClick={handleCancel}>
                      Close
                    </Button>
                  </span>
                ) : (
                  ""
                )}
                {isEditMode ? (
                  <span>
                    <Button
                      onClick={() => {
                        form
                          .validateFields()
                          .then(() => {
                            form.submit();
                          })
                          .catch((error) => {
                            setCollapseAllGroups(true);
                            console.error(JSON.stringify(error, null, 2));
                          });
                      }}
                      style={Themes.contentWindow.recordWindow.RecordHeader.aboveHeaderEditButtons}
                    >
                      Save
                    </Button>
                    <Button style={Themes.contentWindow.recordWindow.RecordHeader.aboveHeaderEditButtons} onClick={handleCancel}>
                      Cancel
                    </Button>
                  </span>
                ) : (
                  ""
                )}
                {windowDefinition.enableprint === "Y" ? <Print setLoadingRecordWindow={setLoadingRecordWindow} headerTabId={headerTabId} {...props} /> : null}
                {windowDefinition.enableprint === "Y" ? <EmailTemplate headerTabId={headerTabId} /> : null}
                <Tooltip placement="bottom" title="Repeat">
                  <Button style={Themes.contentWindow.ListWindowHeader.headerActionButtons} onClick={updateLastRefresh}>
                    <img style={{ paddingBottom: "3px", paddingRight: "2px", width: "18px" }} src={Repeat} alt="invoice" />
                  </Button>
                </Tooltip>

                {windowDefinition.enableattachment === "Y" || headerTab.tabenabledforimport === "Y" ? (
                  <FileAttachment style={{ marginRight: "0px" }} headerTabId={headerTabId} />
                ) : (
                  ""
                )}
              </div>
            </Col>
            <Col {...responsiveButtonHeader} style={{ textAlign: "right" }}>
              {windowDefinition.enableedit === "Y" && !isEditMode ? (
                <span>
                  <Button style={Themes.contentWindow.recordWindow.RecordHeader.aboveHeaderEditButtons} onClick={handleEdit}>
                    Edit
                  </Button>
                  <Button style={Themes.contentWindow.recordWindow.RecordHeader.aboveHeaderEditButtons} onClick={handleCancel}>
                    Close
                  </Button>
                </span>
              ) : (
                ""
              )}
              {isEditMode ? (
                <span>
                  <Button
                    onClick={() => {
                      form
                        .validateFields()
                        .then(() => {
                          form.submit();
                        })
                        .catch((error) => {
                          setCollapseAllGroups(true);
                          console.error(JSON.stringify(error, null, 2));
                        });
                    }}
                    style={Themes.contentWindow.recordWindow.RecordHeader.aboveHeaderEditButtons}
                  >
                    Save
                  </Button>
                  <Button style={Themes.contentWindow.recordWindow.RecordHeader.aboveHeaderEditButtons} onClick={handleCancel}>
                    Cancel
                  </Button>
                </span>
              ) : (
                ""
              )}{" "}
              <Dropdown
                trigger={["click"]}
                overlay={
                  <Col {...responsiveButtonFor}>
                    <div className="flex-spread">
                      {windowDefinition.enableprint === "Y" ? <Print setLoadingRecordWindow={setLoadingRecordWindow} {...props} headerTabId={headerTabId} /> : null}
                      {windowDefinition.enableprint === "Y" ? <EmailTemplate headerTabId={headerTabId} /> : null}
                      <Tooltip placement="bottom" title="Repeat">
                        <Button style={Themes.contentWindow.ListWindowHeader.headerActionButtons} onClick={updateLastRefresh}>
                          <img style={{ paddingBottom: "3px", paddingRight: "2px", width: "18px" }} src={Repeat} alt="invoice" />
                        </Button>
                      </Tooltip>

                      {windowDefinition.enableattachment === "Y" || headerTab.tabenabledforimport === "Y" ? (
                        <FileAttachment style={{ marginRight: "0px" }} headerTabId={headerTabId} />
                      ) : (
                        ""
                      )}
                    </div>
                  </Col>
                }
              >
                <Button
                  color="primary"
                  style={{
                    height: "31px",
                    width: "33px",
                    background: "#fff",
                    border: "0.5px solid #dddbda",
                    borderRadius: "5px",
                    cursor: "pointer",
                    paddingLeft: "5px",
                    paddingRight: "5px ",
                    marginRight: "0px ",
                  }}
                >
                  <img style={{ paddingBottom: "4px", width: "19px" }} src={ListMore} alt="invoice" />
                </Button>
              </Dropdown>
            </Col>
          </Row>
        </Col>
        {displayAuditInfo ? (
          <Col {...responsiveButtonIn}>
            <div style={{ marginTop: "-20px" }}>
              <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}>
                Created By : <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}> {auditData?.createdby}</span> &emsp;
              </span>
              <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}>
                Created On : <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}> {auditData?.created}</span> &emsp;
              </span>
              <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}>
                Updated By : <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}> {auditData?.updatedby}</span> &emsp;
              </span>
              <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}>
                Updated On : <span style={{ color: "#5D5454", fontSize: "10px", opacity: "77%", marginBottom: "0px" }}> {auditData?.updated}</span> &emsp;
              </span>
            </div>
          </Col>
        ) : null}
      </Row>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
        <Card style={Themes.contentWindow.recordWindow.RecordHeader.headerCard} bodyStyle={{ padding: "0px" }}>
          {(() => {
            if (statusBar.length > 0) {
              return <StatusBar statusBar={statusBar} />;
            }
          })()}
          {isEditMode ? (
            <Fragment>
              <RecordForm
                form={form}
                idName="headerTab"
                onFinish={onFinish}
                headerTab={headerTab}
                headerRecord={headerRecord}
                headerFieldGroups={headerFieldGroups}
                recordId={recordId}
                isHeader={true}
                collapseAllGroups={collapseAllGroups}
              />
            </Fragment>
          ) : (
            <Fragment>
              <Row>
                <Col span={24} style={Themes.contentWindow.recordWindow.RecordHeader.readOnlyViewColumn}>
                  <Row gutter={[16, 16]}>
                    {headerTab.fields.map((field, index) =>
                      field.isdisplayed === "Y" &&
                      field.fieldgroup_name === undefined &&
                      field.isshowninstatusbar !== "Y" &&
                      field.nt_base_reference_id !== "28" &&
                      field.column_type !== "Button" ? (
                        <Col
                          key={`${index}-${headerRecord[field.ad_field_id]}`}
                          span={field.nt_base_reference_id === FieldReference.WYSIWYGEditor || innerWidth < 600 ? 24 : innerWidth > 600 && innerWidth < 800 ? 12 : 8}
                          style={{ paddingLeft: 12, paddingRight: 12 }}
                        >
                          <Text type="secondary">
                            <span style={{ visibility: "hidden" }}>*</span> <span style={{ verticalAlign: "text-bottom", paddingLeft: 1 }}>{field.name}</span>
                          </Text>{" "}
                          <br />
                          <div style={labelValueDiv}>
                            <Text>
                              {field.new_record_window ? (
                                <span style={{ color: "#1648AA" }}>
                                  {getRecordValue(field) ? (
                                    <span style={{ cursor: "pointer" }} onClick={() => showPopupWindow(field)}>
                                      {getRecordValue(field)}&nbsp; <img src={Arrow} style={{ paddingBottom: "5px" }} alt="Arrow" />
                                    </span>
                                  ) : null}
                                </span>
                              ) : (
                                getRecordValue(field)
                              )}
                            </Text>
                          </div>
                        </Col>
                      ) : (
                        ""
                      )
                    )}
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Collapse style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.collapsePanel}>
                    {Object.entries(headerFieldGroups).map(([key, value], i) => (
                      <Panel header={key} key={key}>
                        <Row>
                          <Col span={24} style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                            <Row gutter={[24, 24]}>
                              {value.map((field, index) =>
                                field.isdisplayed === "Y" && field.isshowninstatusbar !== "Y" && field.nt_base_reference_id !== "28" && field.column_type !== "Button" ? (
                                  <Col
                                    key={`${index}-${headerRecord[field.ad_field_id]}`}
                                    span={field.nt_base_reference_id === FieldReference.WYSIWYGEditor || innerWidth < 600 ? 24 : innerWidth > 600 && innerWidth < 800 ? 12 : 8}
                                  >
                                    <Text type="secondary">{field.name}</Text> <br />
                                    <Text>
                                      {field.new_record_window ? (
                                        <span style={{ color: "#1648AA" }}>
                                          {getRecordValue(field) ? (
                                            <span style={{ cursor: "pointer" }} onClick={() => showPopupWindow(field)}>
                                              {getRecordValue(field)}&nbsp; <img src={Arrow} style={{ paddingBottom: "5px" }} alt="Arrow" />
                                            </span>
                                          ) : null}
                                        </span>
                                      ) : (
                                        getRecordValue(field)
                                      )}
                                    </Text>
                                  </Col>
                                ) : (
                                  ""
                                )
                              )}
                            </Row>
                          </Col>
                        </Row>
                      </Panel>
                    ))}
                  </Collapse>
                </Col>
              </Row>
            </Fragment>
          )}
        </Card>
      </Spin>
    </Fragment>
  );
};

export default RecordHeader;
