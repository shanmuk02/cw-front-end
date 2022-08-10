import React, { useState, Fragment, useEffect, useRef, useMemo } from "react";
import { Form, Input, Select, Checkbox, Upload, Button, Row } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { getsearchFieldData, getAutoCompleteData, getProcessParamComboFill } from "../../services/generic";
import { DatePicker, TimePicker } from "../../lib/date";
import { FieldReference } from "../../lib/fieldReference";
import { useGlobalContext } from "../../lib/storage";
import useDebounce from "../../lib/hooks/useDebounce";
import dayjs from "dayjs";
import ReactQuill, { Quill } from "react-quill";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import "antd/dist/antd.css";
import "../../styles/antd.css";

const Block = Quill.import('blots/block');
Block.tagName = 'div';
Quill.register(Block);

const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const { Option } = Select;
const { TextArea, Password } = Input;

const FormField = (props) => {
  const { globalStore } = useGlobalContext();
  const Themes = globalStore.userData.CW360_V2_UI;
  const userPreferences = globalStore.userPreferences;
  const { field, fieldData, form, headerTabId, dataOptions, setDataOptions, jsonParam, parentId, headerTab, setLoading, formFieldIndexKey } = props;
  
  const getFieldValue = () => {
    const fieldValueIden = fieldData[field.ad_field_id.concat("_iden")];
    if (fieldValueIden) {
      return fieldValueIden;
    } else {
      return fieldData[field.ad_field_id];
    }
  };

  let initialOptionsValue = [];
  if (getFieldValue()) {
    initialOptionsValue = [{ RecordID: fieldData[field.ad_field_id], Name: getFieldValue() }];
  }

  let initialOptionsValueForSelector = [];
  if (getFieldValue()) {
    initialOptionsValueForSelector = [{ recordid: fieldData[field.ad_field_id], name: getFieldValue() }];
  }

  const [options, setOptions] = useState(initialOptionsValue);
  const [optionsForSelector, setOptionsForSelector] = useState(initialOptionsValueForSelector);

  useEffect(() => {
    setOptions([...initialOptionsValue]);
    setOptionsForSelector([...initialOptionsValueForSelector]);
  }, [fieldData]);

  const [searchKey, setSearchkey] = useState();
  const debouncedSearchKey = useDebounce(searchKey, 350);

  useEffect(() => {
    if (debouncedSearchKey) {
      if (parseInt(debouncedSearchKey.toString().length) > parseFloat(field.ajax_search)) {
        const dependent = field.dependent ? form.getFieldValue(field.dependent) : null;
        getsearchFieldData(field.ad_field_id, debouncedSearchKey, dependent, jsonParam).then((serchDataResponse) => {
          const searchData = JSON.parse(serchDataResponse.data.data.searchField).searchData;
          setOptions(searchData);
        });
      }
    }
  }, [debouncedSearchKey]);

  const onSearch = (searchText) => {
    setSearchkey(searchText);
  };

  const onSearchForSelector = (searchText) => {
    const searchTextValue = searchText.target.value;
    if (searchTextValue) {
      getProcessParamComboFill(field.parameter_id).then((serchDataResponse) => {
        const searchData = JSON.parse(serchDataResponse.data.data.processParamComboFill);
        setOptionsForSelector(searchData);
      });
    }
  };

  const focusSearchForSelector = (searchText) => {
    if (searchText.target.value === "") {
      getProcessParamComboFill(field.parameter_id).then((serchDataResponse) => {
        const searchData = JSON.parse(serchDataResponse.data.data.processParamComboFill);
        setOptionsForSelector(searchData);
      });
    }
  };

  const focusSearch = (searchText) => {
    if (searchText.target.value === "") {
      const dependent = field.dependent ? form.getFieldValue(field.dependent) : null;
      getsearchFieldData(field.ad_field_id, searchText.target.value, dependent, jsonParam).then((searchDataResponse) => {
        const searchResponseData = JSON.parse(searchDataResponse.data.data.searchField);
        if (searchResponseData) {
          const searchData = searchResponseData.searchData;
          setOptions(searchData);
        }
      });
    }
  };

  const checkAutoComplete = (value) => {
    if (field.enableautocomplete === "Y") {
      setLoading(true);
      const fieldsForAutoCompleteData = form.getFieldsValue(true);
      const fieldsForAutoComplete = { ...fieldsForAutoCompleteData };
      Object.entries(fieldsForAutoComplete).map(([key, val]) => {
        headerTab.fields.map((dat) => {
          if (dat.ad_field_id === key) {
            let keyValueField = val;

            if (keyValueField === true) {
              keyValueField = "Y";
            }
            if (keyValueField === false) {
              keyValueField = "N";
            }
            if (typeof keyValueField === "number") {
              keyValueField = `${value}`;
            }
            if (dayjs.isDayjs(keyValueField)) {
              keyValueField = `${keyValueField.format("YYYY-MM-DD HH:mm:ss")}`;
            }
            if (keyValueField === "") {
              keyValueField = null;
            }
            if (keyValueField === undefined) {
              keyValueField = null;
            }
            fieldsForAutoComplete[dat.column_name] = keyValueField;
            delete fieldsForAutoComplete[key];
          }
          return null;
        });
        return null;
      });

      const stringifiedFields = JSON.stringify(fieldsForAutoComplete);
      const updatedStrings = stringifiedFields.replace(/\\"/g, '\\"');
      const allFieldsData = JSON.stringify(updatedStrings);

      getAutoCompleteData(field.ad_field_id, value, headerTabId, parentId, allFieldsData).then((autoCompleteData) => {
        if (autoCompleteData !== null) {
          setDataOptions(autoCompleteData);
        }
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    if (dataOptions !== undefined) {
      Object.entries(dataOptions).map(([dataKey, dataValue]) => {
        if (dataKey === field.ad_field_id) {
          const dataValueData = dataValue.value;
          const fieldsToUpdate = {};
          if (dataValueData) {
            setOptions(dataValueData);
            fieldsToUpdate[field.ad_field_id] = dataValueData[0].RecordID ? dataValueData[0].RecordID : dataValueData;
          } else {
            setOptions([]);
            fieldsToUpdate[field.ad_field_id] = null;
          }
          form.setFieldsValue(fieldsToUpdate);
        }
        return null;
      });
    }
  }, [dataOptions]);

  const formatJson = (e) => {
    let prettyJson = e.target.value;
    try {
      prettyJson = JSON.stringify(JSON.parse(e.target.value), null, 4);
    } catch (err) {
      prettyJson = e.target.value;
    }
    const fieldsToUpdate = {};
    fieldsToUpdate[field.ad_field_id] = prettyJson;
    form.setFieldsValue(fieldsToUpdate);
  };

  const [fieldInput, setFieldInput] = useState();
  const fieldInputKey = useDebounce(fieldInput, 350);

  useEffect(() => {
    if (fieldInputKey) {
      checkAutoComplete(fieldInputKey);
    }
  }, [fieldInputKey]);

  const checkAutoFillData = (e) => {
    if (field.enableautocomplete === "Y") {
      setFieldInput(e.target.value);
    }
  };

  const getTimePeriod = () => {
    const dateValue = getFieldValue();
    const valueDate = dateValue ? dayjs(dateValue) : null;
    return valueDate;
  };

  const openAddNewRecordPopup = () => {
    window.open(`/popupWindow/${field.new_record_window}/NEW_RECORD`, "New Record Window", "width=1200,height=600,left=210,top=120");
  };

  const quillRef = useRef(null);
  const imageHandler = () => {
    const range = quillRef.current.getEditorSelection();
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      setLoading(true);
      const file = input.files[0];
      const formData = new FormData();
      formData.set("image", file, file.filename);
      try {
        const response = await axios({
          method: "POST",
          url: "https://sapp.mycw.in/image-manager/uploadImage",
          data: formData,
          headers: {
            Accept: "*/*",
            "Content-Type": "multipart/form-data",
            APIKey: "AUa4koVlpsgR7PZwPVhRdTfUvYsWcjkg",
          },
        });
        if (!response) {
          return null;
        } else {
          quillRef.current.getEditor().insertEmbed(range.index, "image", response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  };

  const imageUploadStatusChange = (uploadStatus) => {
    if(uploadStatus.file.percent === 100 || uploadStatus.file.status){
      const fieldsToUpdate = {};
      fieldsToUpdate[field.ad_field_id] = uploadStatus.file.response;
      form.setFieldsValue(fieldsToUpdate);
    }
  };

  const reactQuillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ font: [false, "serif", "monospace"] }, { header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["code", "background"],
        ["code-block", "direction"],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      }
    }
  }),[]);
  
  const fousElementRef = useRef();
  useEffect(() => {
    setTimeout(() => {
      if (fousElementRef.current) {
        fousElementRef.current.focus();
      }
    }, 100);
  }, [fieldData]);

  return (
    <Fragment>
      {(() => {
        switch (field.nt_base_reference_id) {
          case FieldReference.String:
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={getFieldValue()}
                rules={[
                  {
                    required: field.ismandatory === "Y" ? true : false,
                    message: `Please input ${field.name}`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <Input onChange={checkAutoFillData} ref={formFieldIndexKey === 1 ? fousElementRef : null} disabled={field.isreadonly === "Y" ? true : false} />
              </Form.Item>
            );
          case FieldReference.TableDir:
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={fieldData[field.ad_field_id]}
                rules={[
                  {
                    required: field.ismandatory === "Y" ? true : false,
                    message: `Please input ${field.name}`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  onSearch={onSearch}
                  onFocus={focusSearch}
                  onChange={checkAutoComplete}
                  onClear={checkAutoComplete}
                  optionFilterProp="children"
                  allowClear={true}
                  filterOption={false}
                  disabled={field.isreadonly === "Y" ? true : false}
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      {field.create_new_record === "Y" && field.new_record_window ? (
                        <div onClick={openAddNewRecordPopup} style={{ padding: "4px", borderTop: "1px solid #e6e6e6", textAlign: "center", cursor: "pointer" }}>
                          <PlusOutlined /> Add New {field.name}
                        </div>
                      ) : null}
                    </div>
                  )}
                  ref={formFieldIndexKey === 1 ? fousElementRef : null}
                >
                  {options.map((option, index) => (
                    <Option key={`${index}-${option.Name}`} value={option.RecordID}>
                      {option.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            );
          case "Selector":
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={fieldData[field.ad_field_id]}
                rules={[
                  {
                    required: field.ismandatory === "Y" ? true : false,
                    message: `Please input ${field.name}`,
                  },
                ]}
              >
                <Select
                  showSearch
                  style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.SelectTag}
                  onInputKeyDown={onSearchForSelector}
                  onFocus={focusSearchForSelector}
                  onChange={checkAutoComplete}
                  optionFilterProp="children"
                  allowClear={true}
                  disabled={field.isreadonly === "Y" ? true : false}
                  ref={formFieldIndexKey === 1 ? fousElementRef : null}
                >
                  {optionsForSelector.map((option, index) => (
                    <Option key={`${index}-${option.name}`} value={option.recordid}>
                      {option.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            );
          case FieldReference.List:
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={getFieldValue()}
                rules={[
                  {
                    required: field.ismandatory === "Y" ? true : false,
                    message: `Please input ${field.name}`,
                  },
                ]}
              >
                <Select
                  disabled={field.isreadonly === "Y" ? true : false}
                  showSearch
                  style={{ width: "100%", marginBottom: "0px" }}
                  placeholder={`Select ${field.name}`}
                  optionFilterProp="children"
                  ref={formFieldIndexKey === 1 ? fousElementRef : null}
                >
                  {field.Values.map((option, index) => (
                    <Option key={`${index}-${option.value}`} value={option.key}>
                      {option.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            );
          case FieldReference.YesNo:
            return (
              <Fragment>
                {getFieldValue() ? (
                  <Form.Item
                    style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
                    label={field.name}
                    name={field.ad_field_id}
                    initialValue={getFieldValue().trim() === "Y" ? true : false}
                    valuePropName="checked"
                  >
                    <Checkbox ref={formFieldIndexKey === 1 ? fousElementRef : null} disabled={field.isreadonly === "Y" ? true : false} />
                  </Form.Item>
                ) : null}
              </Fragment>
            );
          case FieldReference.Integer:
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={getFieldValue() ? parseFloat(getFieldValue()) : null}
                rules={[
                  {
                    required: field.ismandatory === "Y" ? true : false,
                    validator: async (_, value) => {
                      try {
                        if (value) {
                          const intValue = value.toString();
                          if (!(intValue.indexOf(".") === -1 && intValue.length <= parseInt(field.displaylength))) {
                            throw new Error("Invalid Format");
                          }
                          if (isNaN(value)) {
                            throw new Error("Not a Number");
                          }
                        }
                      } catch (error) {
                        return Promise.reject(new Error("Invalid Integer"));
                      }
                    },
                    message: `Please input proper ${field.name} value`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <Input onChange={checkAutoFillData} ref={formFieldIndexKey === 1 ? fousElementRef : null} disabled={field.isreadonly === "Y" ? true : false} />
              </Form.Item>
            );
          case FieldReference.Number:
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={getFieldValue() ? parseFloat(getFieldValue()) : null}
                rules={[
                  {
                    required: field.ismandatory === "Y" ? true : false,
                    validator: async (_, value) => {
                      if (value) {
                        try {
                          const intValue = value.toString();
                          if (!(intValue.length <= parseInt(field.displaylength))) {
                            throw new Error("Invalid Format");
                          }
                          if (isNaN(value)) {
                            throw new Error("Not a Number");
                          }
                          if (intValue.length < 1) {
                            throw new Error("Input Value");
                          }
                        } catch (error) {
                          return Promise.reject(new Error("Invalid Integer"));
                        }
                      }
                    },
                    message: `Please input ${field.name} with proper value`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <Input onChange={checkAutoFillData} ref={formFieldIndexKey === 1 ? fousElementRef : null} disabled={field.isreadonly === "Y" ? true : false} />
              </Form.Item>
            );
          case FieldReference.ID:
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={getFieldValue() ? getFieldValue() : null}
                rules={[
                  {
                    required: field.ismandatory === "Y" ? true : false,
                    message: `Please input ${field.name}`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <Input disabled={field.isreadonly === "Y" ? true : false} ref={formFieldIndexKey === 1 ? fousElementRef : null} />
              </Form.Item>
            );
          case FieldReference.DateTime:
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={getTimePeriod()}
                rules={[
                  {
                    required: field.ismandatory === "Y" ? true : false,
                    message: `Please input ${field.name} with proper value`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <DatePicker ref={formFieldIndexKey === 1 ? fousElementRef : null} style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.SelectTag} showTime={true} format={userPreferences.dateTimeFormat} />
              </Form.Item>
            );
          case FieldReference.Date:
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={getTimePeriod()}
                rules={[
                  {
                    required: field.ismandatory === "Y" ? true : false,
                    message: `Please input ${field.name} with proper value`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <DatePicker
                  ref={formFieldIndexKey === 1 ? fousElementRef : null}
                  disabled={field.isreadonly === "Y" ? true : false}
                  style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.SelectTag}
                  format={userPreferences.dateFormat}
                />
              </Form.Item>
            );
          case FieldReference.Time:
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={getTimePeriod()}
                rules={[
                  {
                    required: field.ismandatory === "Y" ? true : false,
                    message: `Please input ${field.name} with proper value`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <TimePicker ref={formFieldIndexKey === 1 ? fousElementRef : null} disabled={field.isreadonly === "Y" ? true : false} use12Hours={true} style={{ width: "100%" }} format={userPreferences.timeFormat} />
              </Form.Item>
            );
          case FieldReference.Text:
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={getFieldValue() ? getFieldValue() : null}
                rules={[
                  {
                    required: field.ismandatory === "Y" ? true : false,
                    message: `Please input ${field.name} with proper value`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <TextArea ref={formFieldIndexKey === 1 ? fousElementRef : null} disabled={field.isreadonly === "Y" ? true : false} autoSize={{ minRows: 1, maxRows: 6 }} />
              </Form.Item>
            );
          case FieldReference.Password:
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={getFieldValue() ? getFieldValue() : null}
                rules={[
                  {
                    required: field.ismandatory === "Y" ? true : false,
                    message: `Please input ${field.name} with proper value`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <Password ref={formFieldIndexKey === 1 ? fousElementRef : null} disabled={field.isreadonly === "Y" ? true : false} />
              </Form.Item>
            );
          case FieldReference.JSON:
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={getFieldValue() ? getFieldValue() : null}
                rules={[
                  {
                    required: field.ismandatory === "Y" ? true : false,
                    validator: async (_, value) => {
                      if (value) {
                        try {
                          JSON.stringify(value);
                        } catch (error) {
                          return Promise.reject(new Error("Invalid JSON"));
                        }
                      }
                    },
                    message: `Invalid ${field.name} Value`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <TextArea ref={formFieldIndexKey === 1 ? fousElementRef : null} disabled={field.isreadonly === "Y" ? true : false} autoSize={{ minRows: 1, maxRows: 6 }} onChange={formatJson} />
              </Form.Item>
            );
          case FieldReference.WYSIWYGEditor:
            return (
              <Form.Item
                label={field.name}
                name={field.ad_field_id}
                initialValue={getFieldValue() ? getFieldValue() : null}
                rules={[
                  {
                    required: field.ismandatory === "Y" ? true : false,
                    message: `Please input ${field.name} with proper value`,
                  },
                ]}
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
              >
                <ReactQuill
                  ref={(el) => { quillRef.current = el }}
                  theme="snow"
                  modules={reactQuillModules}
                  disabled={field.isreadonly === "Y" ? true : false}
                />
              </Form.Item>
            );

          case FieldReference.Image:
            return (
              <>
                <Row>
                  <Form.Item label={field.name} name={field.ad_field_id} initialValue={getFieldValue()}>
                    <Input type="hidden" />
                  </Form.Item>
                </Row>
                <Row style={{ marginTop: "-21px" }}>
                  <Upload
                    action="https://sapp.mycw.in/image-manager/uploadImage"
                    listType="picture"
                    headers={{ APIKey: "AUa4koVlpsgR7PZwPVhRdTfUvYsWcjkg" }}
                    name="image"
                    onChange={imageUploadStatusChange}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </Row>
              </>
            );

          default:
            return (
              <Form.Item
                style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
                label={field.name}
                name={field.ad_field_id}
                initialValue={getFieldValue()}
              >
                <Input ref={formFieldIndexKey === 1 ? fousElementRef : null} readOnly={true} />
              </Form.Item>
            );
        }
      })()}
    </Fragment>
  );
};

export default FormField;
