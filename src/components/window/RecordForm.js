import React, { useEffect, useState } from "react";
import { Row, Col, Collapse, Form, Spin } from "antd";
import { useGlobalContext } from "../../lib/storage";
import { FieldReference } from "../../lib/fieldReference";
import { LoadingOutlined } from "@ant-design/icons";
import FormField from "./FormField";
import "antd/dist/antd.css";
import "../../styles/antd.css";

const { Panel } = Collapse;

const RecordForm = (props) => {
  const { globalStore } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const Themes = globalStore.userData.CW360_V2_UI;
  const { form, onFinish, headerTab, headerRecord, headerFieldGroups, recordId, jsonParam, parentId, isHeader, idName, clearFields } = props;

  const headerTabForm = Object.assign({}, headerTab);
  const [dataOptions, setDataOptions] = useState({});
  const rowsInLine = headerTabForm.noofcolumnsinrow;
  let colSpanValue = 8;
  if (rowsInLine && !isHeader) {
    colSpanValue = 24 / parseInt(rowsInLine);
  }

  useEffect(() => {
    if (clearFields) {
      form.resetFields();
    }
  }, [clearFields]);

  useEffect(() => {
    if (Object.entries(headerRecord).length === 0 && headerRecord.constructor === Object) {
      const formFieldsData = form.getFieldsValue(true);
      const fieldsData = { ...formFieldsData };
      updateFields(null, fieldsData);
    } else {
      updateFields(null, headerRecord);
    }
  }, []);

  const [newHeaders, setNewHeaders] = useState(headerTabForm);
  const updateFields = (_, allValues) => {
    headerTabForm.fields.map((field, i) => {
      if (field.readonlylogic) {
        let string = field.readonlylogic;
        const keys = string.split("@");
        const actualKeys = keys.filter((s) => s.length === 32);
        actualKeys.map((k) => {
          let actualDataValue = allValues[k];
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

          const numberIndex = headerTabForm.fields.findIndex((f) => f.ad_field_id === k);
          if (numberIndex >= 0) {
            const compareField = headerTabForm.fields[numberIndex];
            if (compareField.nt_base_reference_id === FieldReference.Integer || compareField.nt_base_reference_id === FieldReference.Number) {
              if (actualDataValue === "" || actualDataValue === null || actualDataValue === undefined) {
                actualDataValue = 0;
              }
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
          logicState = eval(string); // eslint-disable-line
        } catch (error) {
          console.error("Invalid Read Only Logic Condition: ", string);
          logicState = false;
        }

        let temp = true;

        if (headerTab.fields[i].isreadonly === "Y" && !headerTabForm.fields[i].isreadonlyFromLogic) {
          logicState = true;
          temp = false;
          headerTabForm.fields[i].isreadonlyFromLogic = false;
        }

        if (typeof logicState === "boolean") {
          if (logicState) {
            headerTabForm.fields[i].isreadonly = "Y";
            if (temp) {
              headerTabForm.fields[i].isreadonlyFromLogic = true;
            }
          } else {
            headerTabForm.fields[i].isreadonly = "N";
          }

          if (headerTab.fields[i].isreadonly === "Y") {
            headerTabForm.fields[i].isreadonly = "Y";
          }

          setNewHeaders({ ...headerTabForm });
        }
      }

      if (field.displaylogic) {
        let string = field.displaylogic;
        const keys = string.split("@");
        const actualKeys = keys.filter((s) => s.length === 32);
        actualKeys.map((k) => {
          let actualDataValue = allValues[k];
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

          const numberIndex = headerTabForm.fields.findIndex((f) => f.ad_field_id === k);
          if (numberIndex >= 0) {
            const compareField = headerTabForm.fields[numberIndex];
            if (compareField.nt_base_reference_id === FieldReference.Integer || compareField.nt_base_reference_id === FieldReference.Number) {
              if (actualDataValue === "" || actualDataValue === null || actualDataValue === undefined) {
                actualDataValue = 0;
              }
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
          logicState = eval(string); // eslint-disable-line
        } catch (error) {
          console.error("Invalid Display Logic Condition: ", string);
          logicState = false;
        }

        if (typeof logicState === "boolean") {
          if (logicState) {
            headerTabForm.fields[i].isdisplayed = "Y";
          } else {
            headerTabForm.fields[i].isdisplayed = "N";
          }
          setNewHeaders({ ...headerTabForm });
        }
      }
      return null;
    });
  };

  const [panelExpandedKeys, setPanelExpandedKeys] = useState([]);

  useEffect(() => {
    if (props.collapseAllGroups) {
      const allPanelKeys = Object.keys(headerFieldGroups).map((item, i) => i);
      setPanelExpandedKeys([...allPanelKeys]);
    }
  }, [props.collapseAllGroups]);
  const innerWidth = window.innerWidth;

  return (
    <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={loading}>
      <Form form={form} name={idName} preserve={false} layout="vertical" onFinish={onFinish} onValuesChange={updateFields}>
        <Row>
          <Col span={24} style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm}>
            <Row gutter={[24, 24]}>
              {newHeaders.fields.map((field, index) => {
                const stats = recordId === "NEW_RECORD" && !isHeader ? (field.showinaddline === "N" ? false : true) : true;
                return field.isdisplayed === "Y" &&
                  field.fieldgroup_name === undefined &&
                  field.isshowninstatusbar !== "Y" &&
                  field.nt_base_reference_id !== "28" &&
                  field.column_type !== "Button" &&
                  stats ? (
                  <Col
                    key={`${index}-${headerRecord[field.ad_field_id]}`}
                    span={field.nt_base_reference_id === FieldReference.WYSIWYGEditor || innerWidth < 600 ? 24 : innerWidth > 600 && innerWidth < 800 ? 12 : colSpanValue}
                  >
                    <FormField
                      formFieldIndexKey={index}
                      field={field}
                      fieldData={headerRecord}
                      recordId={recordId}
                      form={form}
                      headerTabId={headerTabForm.ad_tab_id}
                      dataOptions={dataOptions}
                      jsonParam={jsonParam}
                      parentId={parentId}
                      headerTab={newHeaders}
                      setDataOptions={setDataOptions}
                      setLoading={setLoading}
                    />
                  </Col>
                ) : (
                  ""
                );
              })}
            </Row>
          </Col>
          <Col span={24}>
            <Collapse
              activeKey={panelExpandedKeys}
              onChange={(panelKey) => setPanelExpandedKeys([...panelKey])}
              style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.collapsePanel}
            >
              {Object.entries(headerFieldGroups).map(([key, value], index) => (
                <Panel forceRender={true} header={key} key={index}>
                  <Row>
                    <Col span={24} style={{ padding: "20px" }}>
                      <Row gutter={[24, 24]}>
                        {value.map((field, index) => {
                          const stats = recordId === "NEW_RECORD" && !isHeader ? (field.showinaddline === "N" ? false : true) : true;
                          return field.isdisplayed === "Y" && field.isshowninstatusbar !== "Y" && field.nt_base_reference_id !== "28" && field.column_type !== "Button" && stats ? (
                            <Col
                              key={`${index}-${headerRecord[field.ad_field_id]}`}
                              span={field.nt_base_reference_id === FieldReference.WYSIWYGEditor || innerWidth < 600 ? 24 : innerWidth > 600 && innerWidth < 800 ? 12 : colSpanValue}
                            >
                              <FormField
                                field={field}
                                fieldData={headerRecord}
                                recordId={recordId}
                                form={form}
                                headerTabId={headerTabForm.ad_tab_id}
                                dataOptions={dataOptions}
                                jsonParam={jsonParam}
                                parentId={parentId}
                                headerTab={headerTabForm}
                                setDataOptions={setDataOptions}
                                setLoading={setLoading}
                              />
                            </Col>
                          ) : (
                            ""
                          );
                        })}
                      </Row>
                    </Col>
                  </Row>
                </Panel>
              ))}
            </Collapse>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default RecordForm;
