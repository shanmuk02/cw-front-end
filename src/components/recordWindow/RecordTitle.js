import React, { useState, useEffect, Fragment } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { Dropdown, Menu, Modal, notification, Button, Form, Row, Col, Collapse, message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { getProcessParamData, getRunProcess, getRunProcessWithoutParameters, getProcessParamJson } from "../../services/generic";
import { useGlobalContext, useWindowContext } from "../../lib/storage";
import ProcessField from "./ProcessField";
import "antd/dist/antd.css";
import { useParams } from "react-router";
import dayjs from "dayjs";
import RecordTable from "./RecordTable";
import DownArrow from "../../assets/images/downArrow.svg";

const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const { Panel } = Collapse;

const RecordTitle = (props) => {
  const { globalStore } = useGlobalContext();
  const Themes = globalStore.userData.CW360_V2_UI;
  const { setLastRefreshed, headerRecordData, isHeaderActive } = props;
  const { recordId } = useParams();
  const { windowStore } = useWindowContext();
  const windowDefinition = { ...windowStore.windowDefinition };
  const [buttonFieldsGroup, setButtonFieldsGroup] = useState([]);
  const [soloButtons, setSoloButtons] = useState([]);
  const [soloWithPartnerButtons, setSoloWithPartnerButtons] = useState([]);
  const [headerTabId, setHeaderTabId] = useState("");
  const [visible, setVisible] = React.useState(false);
  const [formFields, setFormFields] = useState([]);
  const [formLineFields, setFormLineFields] = useState([]);
  const [processParamsData, setProcessParamsData] = useState({});
  const [idForRunProces, setIdForRunProces] = useState([]);
  const [titleButtonProcess, setTitleButtonProcess] = useState("");
  const [loadingModal, setLoadingModal] = useState(false);

  const [selectedRecordsData, setSelectedRecordsData] = useState({});

  const [propsConfirmModalVisible, setPropsConfirmModalVisible] = useState(false)
  const [propsConfirmModalContent, setPropsConfirmModalContent] = useState(null)
  const [propsConfirmOkParams,setPropsConfirmOkParams] = useState({processData:null,key:null,withoutPara:null,id:null})

  useEffect(() => {
    headerDataFetch();
  }, [headerRecordData]);

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

  const headerDataFetch = async () => {
    try {
      if (windowDefinition.tabs) {
        const headerTabData = windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === "0")];

        const headerTabId = headerTabData.ad_tab_id;
        headerTabData.fields.sort((a, b) => {
          const x = a.seqno !== null ? parseInt(a.seqno) : a.seqno;
          const y = b.seqno !== null ? parseInt(b.seqno) : b.seqno;
          return (x != null ? x : Infinity) - (y != null ? y : Infinity);
        });

        const fieldGroupsList = [];
        headerTabData.fields.forEach((element) => {
          headerTabData.fields.sort((a, b) => {
            const x = a.seqno !== null ? parseInt(a.seqno) : a.seqno;
            const y = b.seqno !== null ? parseInt(b.seqno) : b.seqno;
            return (x != null ? x : Infinity) - (y != null ? y : Infinity);
          });
          if (element["nt_base_reference_id"] === "28") {
            fieldGroupsList.push(element);
          }
        });
        setSoloButtons(fieldGroupsList[0]);
        setSoloWithPartnerButtons(fieldGroupsList[1]);

        delete fieldGroupsList["0"];

        setButtonFieldsGroup(fieldGroupsList);
        setHeaderTabId(headerTabId);
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleMenuClickForSingle = async (data) => {
    if (!isHeaderActive) {
      let adFieldId = data.ad_field_id;
      let processtype = data.processtype;
      let ntProcessId = data.nt_process_id;
      let isReqConfirm = data.isrequiredconfirmationforprocess;

      setIdForRunProces(adFieldId);
      try {
        if (isReqConfirm === "Y") {
          const btnProcessData = await getProcessParamJson(adFieldId, processtype, ntProcessId, isReqConfirm);
          if (btnProcessData["parameters"] === undefined) {
            let withoutPara = true;
            showPropsConfirm(btnProcessData, adFieldId, withoutPara, ntProcessId);
          } else {
            let withoutPara = false;

            showPropsConfirm(btnProcessData, adFieldId, withoutPara, ntProcessId);
          }
        } else {
          callFinalProcess(adFieldId);
        }
      } catch (error) {
        console.error("Error", error);
      }
    } else {
      message.warn("Save Record !");
    }
  };

  const handleMenuClick = async (e) => {
    if (!isHeaderActive) {
      let data = e["item"]["props"];

      let adFieldId = e.key;
      let processtype = data.processtype;
      let ntProcessId = data.processid;
      let isReqConfirm = data.isreqconfirm;

      setIdForRunProces(adFieldId);
      try {
        if (isReqConfirm === "Y") {
          const btnProcessData = await getProcessParamJson(adFieldId, processtype, ntProcessId, isReqConfirm);
          // setButtonProcessData(btnProcessData)
          if (btnProcessData["parameters"] === undefined) {
            let withoutPara = true;
            showPropsConfirm(btnProcessData, adFieldId, withoutPara, ntProcessId);
          } else {
            let withoutPara = false;

            showPropsConfirm(btnProcessData, adFieldId, withoutPara, ntProcessId);
          }
        } else {
          callFinalProcess(adFieldId);
        }
      } catch (error) {
        console.error("Error", error);
      }
    } else {
      message.warn("Save Record !");
    }
  };

  const showPropsConfirm = async (processData, key, withoutPara, id) => {
    // console.log("===rpocess data===",processData)
    let processDataName = processData.name;
    processDataName = processDataName.split("-").pop();
    getParamsData(id);
    setPropsConfirmModalVisible(true);
    setPropsConfirmModalContent(processDataName);
    setPropsConfirmOkParams({ processData: processData, key: key, withoutPara: withoutPara, id: id });
    /* Modal.confirm({
      title: "Add New",
      content: `Do you want to ${processDataName}?`,
      okText: "Confirm",
      cancelText: "Cancel",
      icon:null,
      onOk() {
        if (withoutPara === true) {
          callFinalProcess(key);
        } else {
          let parameterArrayForGrid = [];
          let parameterArray = [];
          let btnProcessData = processData.parameters;
          for (let i = 0; i < btnProcessData.length; i += 1) {
            if (btnProcessData[i].type === "Form") {
              parameterArrayForGrid.push(btnProcessData[i]);
            } else {
              parameterArray.push(btnProcessData[i]);
            }
          }
          setTitleButtonProcess(processData.name);
          for (let index = 0; index < parameterArray.length; index++) {
            parameterArray[index]["ad_field_id"] = parameterArray[index].column_name;
            parameterArray[index]["isreadonly"] = parameterArray[index].readonly;
            parameterArray[index]["column_type"] = parameterArray[index].type;
            parameterArray[index]["name"] = parameterArray[index].display_name;
          }

          setFormFields(parameterArray);

          setFormLineFields(parameterArrayForGrid);

          setVisible(true);
        }
      },
      onCancel() {},
    }); */
  };

  const propsConfirmOk = () => {
    const propsOkData = { ...propsConfirmOkParams };
    // console.log("===processData====",propsOkData)
    const { processData, withoutPara, key, id } = propsOkData;
    if (withoutPara === true) {
      callFinalProcess(key);
      setPropsConfirmModalVisible(false);
    } else {
      let parameterArrayForGrid = [];
      let parameterArray = [];
      let btnProcessData = processData.parameters;
      for (let i = 0; i < btnProcessData.length; i += 1) {
        if (btnProcessData[i].type === "Form") {
          parameterArrayForGrid.push(btnProcessData[i]);
        } else {
          parameterArray.push(btnProcessData[i]);
        }
      }
      setTitleButtonProcess(processData.name);
      for (let index = 0; index < parameterArray.length; index++) {
        parameterArray[index]["ad_field_id"] = parameterArray[index].column_name;
        parameterArray[index]["isreadonly"] = parameterArray[index].readonly;
        parameterArray[index]["column_type"] = parameterArray[index].type;
        parameterArray[index]["name"] = parameterArray[index].display_name;
      }

      setFormFields(parameterArray);

      setFormLineFields(parameterArrayForGrid);

      setVisible(true);
      setPropsConfirmModalVisible(false);
    }
  };

  const propsConfirmCancel = ()=>{
    setPropsConfirmModalVisible(false)
  }

  const updateLastRefresh = () => {
    setLastRefreshed(new Date());
  };

  const getParamsData = async (key) => {
    try {
      const processBtnFormData = await getProcessParamData(headerTabId, recordId, key);

      setProcessParamsData(processBtnFormData);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const callFinalProcess = async (adFieldIdForRunProces) => {
    try {
      const callRunProcessWithoutParaData = await getRunProcessWithoutParameters(adFieldIdForRunProces, headerTabId, recordId);

      const messageCode = callRunProcessWithoutParaData.messageCode;
      const Title = callRunProcessWithoutParaData.title;
      const Message = callRunProcessWithoutParaData.message;
      if (messageCode === "200") {
        notification.success({
          message: Title,
          description: Message,
        });
        updateLastRefresh();
      } else if (messageCode === "201") {
        notification.info({
          message: Title === undefined || Title === "undefined" ? "Please check Once" : Title,
          description: Message === undefined || Message === "undefined" ? "Please check Once" : Message,
        });
      } else {
        notification.error({
          message: Title === undefined || Title === "undefined" ? "Please check Once" : Title,
          description: Message === undefined || Message === "undefined" ? "Please check Once" : Message,
        });
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleOk = async () => {
    try {
      await form.validateFields();
    form.submit();
    } catch (error) {
      console.log("error",error);

    }
    
  };

  //const datRows = useRef([]);

  const handleCancel = () => {
    //datRows.current = selectedRowKeys;
    setVisible(false);
    setSelectedRecordsData({});
  };

  useEffect(() => {
    if (!visible) {
      setSelectedRecordsData({});
    }
  }, [visible]);

  const onFinish = async (values) => {
    setLoadingModal(true);
    Object.entries(values).map(([key, value]) => {
      if (value === true) {
        values[key] = "Y";
      }
      if (value === false) {
        values[key] = "N";
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

    let getAllTablesValues = {};
    Object.keys(processParamsData).forEach(function (key) {
      let valObj = processParamsData[key];
      if (typeof valObj === "object" && valObj !== null) {
        getAllTablesValues[key] = valObj;
      }
    });

    let mandatoryViolated = false;
    Object.entries(getAllTablesValues).forEach(([aKey, aValue]) => {
      const fieldParamJson = formLineFields[formLineFields.findIndex((ffl) => ffl.column_name === aKey)];
      aValue.forEach((bObj, bIndex) => {
        Object.entries(bObj).forEach(([cKey, cValue]) => {

          if (cValue === true) {
            getAllTablesValues[aKey][bIndex][cKey] = "Y";
          }
          if (cValue === false) {
            getAllTablesValues[aKey][bIndex][cKey] = "N";
          }
          if (typeof cValue === "number") {
            getAllTablesValues[aKey][bIndex][cKey] = `${cValue}`;
          }
          if (dayjs.isDayjs(cValue)) {
            getAllTablesValues[aKey][bIndex][cKey] = `${cValue.format("YYYY-MM-DD HH:mm:ss")}`;
          }
          if (cValue === "") {
            getAllTablesValues[aKey][bIndex][cKey] = null;
          }
          if (cValue === undefined) {
            getAllTablesValues[aKey][bIndex][cKey] = null;
          }

          if (!cValue) {
            const fieldParamJsonIndex = fieldParamJson.fields.findIndex((ffl) => ffl.field_name === cKey);
            if (fieldParamJsonIndex >= 0 && fieldParamJson.fields[fieldParamJsonIndex].mandatory === "Y") {
              mandatoryViolated = true;
            }
          }
        });
      });
    });

    if (!mandatoryViolated) {
      let completeData = Object.assign({}, values, getAllTablesValues);
      Object.entries(selectedRecordsData).map(([paramkey, paramrows]) => {
        let newParamData = [];
        paramrows.map((key) => {
          return newParamData.push(completeData[paramkey][parseInt(key)]);
        });
        return (completeData[paramkey] = newParamData);
      });

      let NewCompleteData = JSON.stringify(completeData).replace(/"/g, '\\"');

      try {
        const runProcess = await getRunProcess(idForRunProces, headerTabId, recordId, NewCompleteData);

        const messageCode = runProcess.messageCode;
        const Title = runProcess.title;
        const Message = runProcess.message;
        if (messageCode === "200") {
          setTimeout(() => {
            setVisible(false);
            setLoadingModal(false);
            notification.success({
              message: Title,
              description: Message,
            });
          }, 2000);
        } else if (messageCode === "201") {
          notification.info({
            message: Title === undefined || Title === "undefined" ? "Please check Once" : Title,
            description: Message === undefined || Message === "undefined" ? "Please check Once" : Message,
          });
          setLoadingModal(false);
        } else {
          notification.error({
            message: Title === undefined || Title === "undefined" ? "Please check Once" : Title,
            description: Message === undefined || Message === "undefined" ? "Please check Once" : Message,
          });
          setLoadingModal(false);
        }
      } catch (error) {
        console.error("Error", error);
        setLoadingModal(false);
      }
    } else {
      message.warning("Please input proper values !");
    }
  };

  const [form] = Form.useForm();

  const handleSave = (row) => {
    let processLocalData = processParamsData;

    const newData = processLocalData[row["tableName"]];

    const index = newData.findIndex((item) => row.key === item.key);

    const item = newData[index];

    newData.splice(index, 1, { ...item, ...row });

    let tempTableData = processLocalData[row["tableName"]];
    let tempTableName = row["tableName"];

    setProcessParamsData({
      ...processParamsData,
      [tempTableName]: [...tempTableData],
    });
  };

  const checkDisplayLogic = (field) => {
    if (field.displaylogic) {
      let string = field.displaylogic;
      const keys = string.split("@");
      const actualKeys = keys.filter((s) => s.length === 32);
      actualKeys.map((k) => {
        let actualDataValue = headerRecordData[k];
        if (typeof actualDataValue === "string" && isNaN(actualDataValue)) {
          actualDataValue = `'${actualDataValue}'`;
        }
        if (typeof actualDataValue === "boolean") {
          if (actualDataValue) {
            actualDataValue = `'Y'`;
          } else {
            actualDataValue = `'N'`;
          }
        }
        const actualData = actualDataValue;
        const stringToUpdate = "@" + k + "@";
        return (string = string.replaceAll(stringToUpdate, actualData));
      });

      string = string.replaceAll("=", "==");
      string = string.replaceAll("<==", "<=");
      string = string.replaceAll(">==", ">=");
      string = string.replaceAll("&", "&&");
      string = string.replaceAll("|", "||");
      string = string.replaceAll("====", "===");
      string = string.replaceAll("&&&&", "&&");
      string = string.replaceAll("||||", "||");

      let logicState;
      try {
        // eslint-disable-next-line
        logicState = eval(string);
      } catch (error) {
        console.error("Invalid Display Logic Condition: ", string);
        logicState = false;
      }

      return logicState;
    } else {
      return true;
    }
  };

  const responsiveDesignNew = {
    xxl: 24,
    xl: 24,
    lg: 24,
    xs: 24,
    sm: 24,
    md: 24,
  };

  const responsiveDesignTitle = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 20,
    sm: 12,
    md: 12,
  };

  const responsiveDesignSpace = {
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 4,
    sm: 12,
    md: 12,
  };

  const menu = (
    <Col {...responsiveDesignNew} style={{ height: "auto" }}>
      <Row>
        <Menu onClick={handleMenuClick}>
          {buttonFieldsGroup.map((field) => {
            return checkDisplayLogic(field) ? (
              <Menu.Item key={field.ad_field_id} isreqconfirm={field.isrequiredconfirmationforprocess} processid={field.nt_process_id} processtype={field.processtype}>
                {field.name}
              </Menu.Item>
            ) : null;
          })}
        </Menu>
      </Row>
    </Col>
  );

  return (
    <Fragment>
      {recordId !== "NEW_RECORD" ? (
        <div>
          <Col {...responsiveDesignSpace} />
          <Col {...responsiveDesignTitle} style={{ float: "right", textAlign: "right" }}>
            {buttonFieldsGroup === undefined || buttonFieldsGroup.length === 0 ? null : buttonFieldsGroup.length === 1 ? (
              checkDisplayLogic(soloButtons) ? (
                <Button style={Themes.contentWindow.recordWindow.RecordHeader.formViewButton.formTopButtons} onClick={() => handleMenuClickForSingle(soloButtons)}>
                  {soloButtons.name}
                </Button>
              ) : null
            ) : buttonFieldsGroup.length === 2 ? (
              <span>
                {checkDisplayLogic(soloButtons) ? (
                  <Button style={Themes.contentWindow.recordWindow.RecordHeader.formViewButton.formTopButtons} onClick={() => handleMenuClickForSingle(soloButtons)}>
                    {soloButtons.name}
                  </Button>
                ) : null}
                &nbsp;
                {checkDisplayLogic(soloWithPartnerButtons) ? (
                  <Button style={Themes.contentWindow.recordWindow.RecordHeader.formViewButton.formTopButtons} onClick={() => handleMenuClickForSingle(soloWithPartnerButtons)}>
                    {soloWithPartnerButtons.name}
                  </Button>
                ) : null}
              </span>
            ) : (
              <span>
                {checkDisplayLogic(soloButtons) ? (
                  <Button style={Themes.contentWindow.recordWindow.RecordHeader.formViewButton.formTopButtons} onClick={() => handleMenuClickForSingle(soloButtons)}>
                    {soloButtons.name}
                  </Button>
                ) : null}
                &nbsp;
                <Dropdown trigger={["click"]} overlay={menu}>
                  <Button style={Themes.contentWindow.recordWindow.RecordHeader.formViewButton.formTopButtons}>
                    Actions&nbsp;&nbsp;
                    <img style={{ width: "12px" }} src={DownArrow} /* onClick={getAdminMenus} */ preview={false} />
                  </Button>
                </Dropdown>
              </span>
            )}
          </Col>
        </div>
      ) : null}
      <div>
        <Modal
          title={titleButtonProcess}
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          width="1200px"
          maskClosable={false}
          destroyOnClose={true}
          footer={[
            <Button disabled={loadingModal} key="save" style={{ border: "0px solid #000000" }} onClick={handleCancel}>
              Cancel
            </Button>,
            <Button disabled={loadingModal} key="save-next" type="primary" style={Themes.contentWindow.recordWindow.linesTab.popUpNewButton} loading={false} onClick={handleOk}>
              Confirm
            </Button>,
          ]}
        >
          <Spin indicator={<LoadingOutlined className="spinLoader" style={{ marginLeft: "auto", fontSize: "52px" }} spin />} spinning={loadingModal}>
            <Scrollbars
              style={{
                height: "60vh",
              }}
              autoHide
              // Hide delay in ms
              autoHideTimeout={1000}
              // Duration for hide animation in ms.
              autoHideDuration={200}
              thumbSize={90}
              renderView={renderView}
              renderThumbHorizontal={renderThumb}
              renderThumbVertical={renderThumb}
            >
              <Form
                style={{ paddingBottom: "10px", paddingLeft: "20px", paddingRight: "20px" }}
                form={form}
                preserve={false}
                name="processBtnForm"
                layout="vertical"
                onFinish={onFinish}
              >
                <Row gutter={[24, 24]}>
                  {formFields.map((field, index) => {
                    return field.displayed === "Y" ? (
                      <Col key={`${index}-${formFields["parameter_id"]}`} span={8}>
                        <ProcessField field={field} form={form} fieldData={processParamsData} setProcessParamsData={setProcessParamsData} recordId={recordId} />
                      </Col>
                    ) : null;
                  })}
                </Row>
                <div style={{ paddingTop: "24px" }} />
                <div style={Themes.contentWindow.recordWindow.RecordHeader.formViewButton.actionButtonMenu}>
                  {formLineFields.map((collaps) => {
                    let processParams = processParamsData[collaps.column_name];

                    if (processParams) {
                      for (let index = 0; index < processParams.length; index++) {
                        processParams[index]["tableName"] = collaps.column_name;
                        processParams[index]["key"] = index.toString();
                      }
                    }

                    let colFields = collaps.fields;
                    const tableColumns = [];

                    const sortCollapsFields = colFields.sort(function (a, b) {
                      return a.sequenceno - b.sequenceno;
                    });

                    for (let index = 0; index < sortCollapsFields.length; index++) {
                      sortCollapsFields[index]["mainKey"] = index;
                      if (sortCollapsFields[index]["displayed"] === "Y") {
                        if (sortCollapsFields[index]["type"] === "Selector") {
                          tableColumns.push({
                            title: sortCollapsFields[index]["name"],
                            dataIndex: sortCollapsFields[index]["field_name"],
                            editable: sortCollapsFields[index]["readonly"] === "Y" ? false : true,
                            typeCol: true,
                            mainKey: index
                          });
                        } else {
                          tableColumns.push({
                            title: sortCollapsFields[index]["name"],
                            dataIndex: sortCollapsFields[index]["field_name"],
                            editable: sortCollapsFields[index]["readonly"] === "Y" ? false : true,
                            typeCol: false,
                            mainKey: index
                          });
                        }
                      }
                    }

                    const columns = tableColumns.map((col) => {
                      if (!col.editable) {
                        if(col.typeCol){
                          col.dataIndex = col.dataIndex.concat("_iden");
                        }
                        return col;
                      }

                      const colDataValues = sortCollapsFields[sortCollapsFields.findIndex((a) => a.mainKey === col.mainKey)];
                      if (colDataValues.readonly === "Y") {
                        if(col.typeCol){
                          col.dataIndex = col.dataIndex.concat("_iden");
                        }
                        return col;
                      }

                      return {
                        ...col,
                        onCell: (record, rowIndex) => ({
                          record,
                          rowIndex: rowIndex,
                          editable: col.editable,
                          dataIndex: col.dataIndex,
                          title: col.title,
                          colData: colDataValues,
                          handleSave: handleSave,
                          //setSelectedRowKeys: setSelectedRowKeys,
                          //selectedRowKeys: selectedRowKeys
                        }),
                      };
                    });

                    return (
                      <div style={{ paddingTop: "12px" }}>
                        <Collapse>
                          <Panel header={collaps.display_name}>
                            <RecordTable
                              dataSource={processParamsData[collaps.column_name]}
                              columns={columns}
                              selectedRecordsData={selectedRecordsData}
                              setSelectedRecordsData={setSelectedRecordsData}
                            />
                          </Panel>
                        </Collapse>
                      </div>
                    );
                  })}
                </div>
                <div style={{ paddingTop: "0px" }} />
              </Form>
            </Scrollbars>
          </Spin>
        </Modal>

        <Modal
          title="Add New"
          maskClosable={false}
          destroyOnClose={true}
          visible={propsConfirmModalVisible}
          footer={null}
          // centered
          style={{marginTop:"3%"}}
          width="350px"
          // onOk={propsConfirmOk}
          onCancel={propsConfirmCancel}
        >
          <center>Do you want to {propsConfirmModalContent}?</center>
            <br />
            <center>
              <Button style={{ border: "1px solid #07888D" }} onClick={propsConfirmCancel}>
                Cancel
              </Button>
              ,
              <Button type="primary" style={Themes.contentWindow.recordWindow.linesTab.popUpNewButton} onClick={propsConfirmOk}>
                Confirm
              </Button>
            </center>,
          
        </Modal>

      </div>
    </Fragment>
  );
};

export default RecordTitle;
