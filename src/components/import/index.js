import React, { useState,useEffect } from "react";
import { Card, Col, Row, Spin, Select, Form, message,Button,Dropdown,Menu } from "antd";
import { ExportToCsv } from 'export-to-csv'
import { getComboFillForImport, importDefinitionService, downloadImportDataService,verifyAndImportService } from "../../services/generic";
import { LoadingOutlined } from "@ant-design/icons";
import verifyError from '../../assets/images/verifyerror.svg'
import TableForImport from "./TableForImport";


const { Option } = Select;

const Import = (props) => {
  
  const propsData = props
  let importTypeFlag = false
  // const [propsData,setPropsData] = useState(props)
  const [selectedId, setSelectedId] = useState([]);
  const [importTypeDropdownDetails, setImporTypeDropdownDetails] = useState([]);
  const [sortedTableHeader, setSortedTableHeader] = useState([]);
  const [tableHeader, setTableHeader] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [templateColumns, setTemplateColumns] = useState([]);
  const [selectedImportName, setSelectedImportName] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadTemplateFlag, setDownloadTemplateFlag] = useState(false);
  const [showDownloadTemplateOption, setShowDownloadTemplateOption] = useState(false); 
  const [verifyAndImportFlag, setVerifyAndImportFlag] = useState(false);
  const [form] = Form.useForm();

    useEffect(() => {
      if (propsData.importData !== undefined) {
        const { importData } = propsData;
        const { importFlag, importId, windowName } = importData;
        onSelectImportData(importId, { children: windowName });
      }
    }, [propsData]);
  
  if(propsData.importData !== undefined){
    const { importData } = propsData;
    const { importFlag } = importData;
    importTypeFlag = importFlag
  }

  const getImportDropdownData = async () => {
    const getImportData = await getComboFillForImport();
    setImporTypeDropdownDetails([...getImportData]);
  };

  const onSelectImportData = async (value, event) => {
    setLoading(true)
    const importTypeId = value;
    const importName = event.children;
    const headerArray = [];
    const getImportDataOnSelect = await importDefinitionService(importTypeId);
    const headerData = Object.keys(getImportDataOnSelect[0]);
    for (let index = 0; index < headerData.length; index++) {
      const element = headerData[index];
      headerArray.push({
        // headerName: filtersData[index].displayName,
        title: element,
        dataIndex: element,
        key: index,
        width: 180,
        ellipsis: true,
        /* render: (text) => (finalArrayToPush[index].drillDown === "Y" ? <a>{text}</a> : text),
        onCell: (record) => ({
          onClick: () => {
            drillDown(jsonToSend, finalArrayToPush[index].fieldName, record[finalArrayToPush[index].fieldName], finalArrayToPush[index].detailReportId);
          },
        }), */
      });
    }
    setTableHeader(headerArray);
    setTableData(getImportDataOnSelect);
    setSelectedId(importTypeId);
    setSelectedImportName(importName)
    setLoading(false)

    const headersData = await downloadImportDataService(importTypeId);
    const arrayOfColumns = [];
    const nullArray = [];
    const withoutNullArray = [];
    const sortedFieldArray = [];
    const parsedResponse = headersData;
    const sortedResponse = parsedResponse.sort(function (a, b) {
      return a.sequenceNo - b.sequenceNo;
    });

    for (let index1 = 0; index1 < sortedResponse.length; index1++) {
      if (sortedResponse[index1].sequenceNo === null) {
        nullArray.push(sortedResponse[index1]);
      } else {
        withoutNullArray.push(sortedResponse[index1]);
      }
    }

    const finalArray = withoutNullArray.concat(nullArray);

    for (let index = 0; index < finalArray.length; index += 1) {
      const element = finalArray[index].fieldName;
      sortedFieldArray.push(finalArray[index].fieldName);
      arrayOfColumns.push({ title: element, dataIndex: element, width: 180, ellipsis: true });
    }

    setTemplateColumns(arrayOfColumns)
  };

  const readFileData = async (evt) => {
    /* const {form}=this.props;
    form.validateFieldsAndScroll(['importDropdownName'],(err, values) => {
      if (!err) { */
    setTableHeader([]);
    setTableData([]);
    setLoading(true)
    const headersData = await downloadImportDataService(selectedId);
    const arrayOfColumns = [];
    const nullArray = [];
    const withoutNullArray = [];
    const sortedFieldArray = [];
    const parsedResponse = headersData;
    const sortedResponse = parsedResponse.sort(function (a, b) {
      return a.sequenceNo - b.sequenceNo;
    });

    for (let index1 = 0; index1 < sortedResponse.length; index1++) {
      if (sortedResponse[index1].sequenceNo === null) {
        nullArray.push(sortedResponse[index1]);
      } else {
        withoutNullArray.push(sortedResponse[index1]);
      }
    }

    const finalArray = withoutNullArray.concat(nullArray);

    for (let index = 0; index < finalArray.length; index += 1) {
      const element = finalArray[index].fieldName;
      sortedFieldArray.push(finalArray[index].fieldName);
      arrayOfColumns.push({ title: element, dataIndex: element, width: 180, ellipsis: true });
    }

    setTableHeader(arrayOfColumns);
    setSortedTableHeader(sortedFieldArray)
    setTemplateColumns(arrayOfColumns)
    // const {columns}=this.state;
    const { files } = evt.target;
    // console.log("===file===",files)
    if(files[0] === undefined){
      setLoading(false)
      document.getElementById("choosefile").value = null;
    }else{

    const filename = files[0].name;
    // console.log("===filename===",filename)
    const fileExt = filename.substr(filename.lastIndexOf("."), filename.length);

    if (fileExt !== ".csv") {
      message.error("Please select csv file");
    } else {
      const file = files[0];
      const reader = new FileReader();
      let fileTextData;
      reader.onload = (e) => {
        fileTextData = e.target.result;
        const rows = fileTextData.split(/\r?\n/);
        const newData = [];
        rows.forEach((element) => {
          if (element.trim() !== "") {
            newData.push(element);
          }
        });

        const dataArr = [];
        let importCount = 1;
        for (let i = 1; i < newData.length; i += 1) {
          const cells = newData[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          if (cells.length === arrayOfColumns.length) {
            const jsonObject = {};
            importCount += 1;
            for (let index = 0; index < arrayOfColumns.length; index += 1) {
              const element = arrayOfColumns[index];
              jsonObject[element.dataIndex] = cells[index].replace(/"/g, "");
            }
            dataArr.push(jsonObject);
          }
        }

        if (dataArr.length > 0) {
          if (newData.length === importCount) {
            // that.setState({detailsToBeAddedArrayForGrid:dataArr,hideVerifyButton:false,isDownloadDisabled:false})
            setTableData(dataArr);
            setLoading(false)
            message.success("Data imported successfully");
            setShowDownloadTemplateOption(true)
            setDownloadTemplateFlag(true)
            setVerifyAndImportFlag(true)
          } else {
            setTableData([]);
            setLoading(false)

          }
        } else {
          message.error("Error in importing file");
          document.getElementById("choosefile").value = null;
          setLoading(false)
        }
      };
      reader.readAsText(file);
    }

    }
    
    /* }else{
        document.getElementById("choosefile").value = null;  
      }
    }) */
  };

  const clearData=()=>{
    form.resetFields()
    setTableData([]);
    setTableHeader([]);
    setShowDownloadTemplateOption(false)
    setDownloadTemplateFlag(false)
    setVerifyAndImportFlag(false)
    /* this.setState({
      columns: [],
      detailsToBeAddedArrayForGrid: [],
      hideVerifyButton: true,
      hideImportButton: true,
      isDownloadDisabled: true,
      showVerifyInAction: false,
    }) */
    document.getElementById("choosefile").value = null;
  }

  const verifyAndImport=()=>{
    form.submit();
  }

  const onFinish= async (values)=>{
    console.log("===propsData===",propsData)
    if (propsData.importData !== undefined) {
    const { importData } = propsData;
    const { headerId } = importData
    setLoading(true)
    const tableHeaderAfterVerifyAndImport = []
    const stringifiedJSON = JSON.stringify(tableData)
    const jsonToSend = stringifiedJSON.replace(/"/g, '\\"')
    const verifyAndImportResponse = await verifyAndImportService(headerId,selectedId,jsonToSend);
    const {afterInsert} = verifyAndImportResponse
    const afterVerifyArray = Object.keys(afterInsert[0])
    const messageCodeAndMessageArray = ["ErrorMessageCode","ErrorMessage"]
    const verifyAndImportTableHeader = messageCodeAndMessageArray.concat(sortedTableHeader)
    for (let index = 0; index < verifyAndImportTableHeader.length; index++) {
      const element = verifyAndImportTableHeader[index];
      tableHeaderAfterVerifyAndImport.push({
        title: element,
        render: (text) => (text === 'Verify Error'?<span>{text}&emsp;<img alt="" src={verifyError} /></span> :text),
        dataIndex: element,
        width: 180,
        ellipsis: true,
      });
    }
    setTableHeader(tableHeaderAfterVerifyAndImport)
    setTableData(afterInsert)
    setLoading(false)
    setVerifyAndImportFlag(false)
    }else{
      setLoading(true)
      const headerId = null
      const tableHeaderAfterVerifyAndImport = []
      const stringifiedJSON = JSON.stringify(tableData)
      const jsonToSend = stringifiedJSON.replace(/"/g, '\\"')
      const verifyAndImportResponse = await verifyAndImportService(headerId,selectedId,jsonToSend);
      const {afterInsert} = verifyAndImportResponse
      const afterVerifyArray = Object.keys(afterInsert[0])
      const messageCodeAndMessageArray = ["ErrorMessageCode","ErrorMessage"]
      const verifyAndImportTableHeader = messageCodeAndMessageArray.concat(sortedTableHeader)
      for (let index = 0; index < verifyAndImportTableHeader.length; index++) {
        const element = verifyAndImportTableHeader[index];
        tableHeaderAfterVerifyAndImport.push({
          title: element,
          render: (text) => (text === 'Verify Error'?<span>{text}&emsp;<img alt="" src={verifyError} /></span> :text),
          dataIndex: element,
          width: 180,
          ellipsis: true,
        });
      }
      setTableHeader(tableHeaderAfterVerifyAndImport)
      setTableData(afterInsert)
      setLoading(false)
      setVerifyAndImportFlag(false)
    }
    
  }

  const onFinishFailed=(errorInfo)=>{
    console.log("Failed:", errorInfo);
  }

  const downloadTemplate=()=>{
    // console.log("=======>selectedImportName<======",selectedImportName)
    if(templateColumns===undefined || templateColumns===null || templateColumns.length===0 ){
      message.error("No Headers present")
    }else{
      const templateArray = []
      const headerArray=[]
      for (let index = 0; index < templateColumns.length; index+=1) {
        const element = templateColumns[index];
        const fieldName = element.dataIndex
        templateArray.push({})
        headerArray.push(fieldName)
      }
      // console.log("========>Template Array<======",templateArray)
      // console.log("========>headerArray<======",headerArray)
      
  
      const options = {
        fieldSeparator: ',',
        filename: selectedImportName,
        // quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        showTitle: false,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: false,
        headers:headerArray
        // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
      }
      const csvExporter = new ExportToCsv(options)
      csvExporter.generateCsv(templateArray)
    }
  }

  const downloadData = () => {  
    if(tableData.length===0 || tableHeader.length===0){
      message.error("No Headers present")
    }else{
      console.log("====table Header====",tableHeader)
      console.log("====table data====",tableData)
      for (let index = 0; index < tableData.length; index+=1) {
        const element = tableData[index];
        Object.keys(element).forEach(function (key) {
             let Keys = key
             if(Keys.substring(0,2)==='__'){
              delete element[Keys]
             }
             /* delete element["ErrorMessageCode"]
             delete element["ErrorMessage"] */
          })
      }
      
  
      const options = {
        fieldSeparator: ',',
        filename: 'ImportData',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        showTitle: false,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
        headers:tableHeader
        // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
      }
      const csvExporter = new ExportToCsv(options)
      csvExporter.generateCsv(tableData)
      // this.setState({ loading: false })
    }
    
  }

  const actionsContent = (
    <Menu>
      {showDownloadTemplateOption === true ? (
        <Menu.Item key="1" style={{ color: "#314659" }} onClick={downloadTemplate}>
          Download Template
        </Menu.Item>
      ) : (
        ""
      )}

      {/* <Menu.Item
        key="2"
        style={{ color: '#314659' }}
        // disabled={isDownloadDisabled}
      >
        Download Data
      </Menu.Item>

      <Menu.Item key="3" style={{ color: '#314659' }}>
        Download Error Records
      </Menu.Item> */}

      {/* {showVerifyInAction === true ? (
        <Menu.Item key="4" style={{ color: '#314659' }} onClick={this.verifyDatainAction}>
          Verify
        </Menu.Item>
      ) : (
        ''
      )}
 */}
      <Menu.Item key="4" style={{ color: "#314659" }} onClick={clearData}>
        Clear
      </Menu.Item>
    </Menu>
  );

  /* const responsiveDesignForColumn = {
    xxl: 24,
    xl: 24,
    lg: 24,
    xs: 12,
    sm: 12,
    md: 12,
  }; */
  return (
    <div>
      <Spin indicator={<LoadingOutlined style={{ fontSize: "52px" }} spin />} spinning={loading}>
        <Row>
          <Col span={12}>
            <h2>
              <b>Import</b>
            </h2>
          </Col>
          <Col span={12}>
            <Button disabled={verifyAndImportFlag===false?true:false} style={{ float: "right", backgroundColor: "#089EA4", color: "#FFFFFF", fontWeight: "bold" }} onClick={verifyAndImport}>
              Verify and Import
            </Button>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={24} style={{ marginBottom: "8px" }}>
            <Card>
              <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                <Row gutter={8}>
                  {importTypeFlag === false ? (
                    <Col span={8}>
                      <Form.Item label="Import" name="import" rules={[{ required: true, message: "Please select supplier" }]}>
                        <Select
                          style={{ width: "100%" }}
                          size="medium"
                          // mode="multiple"
                          maxTagCount={1}
                          showSearch
                          allowClear
                          dropdownMatchSelectWidth={false}
                          filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          onFocus={getImportDropdownData}
                          onSelect={onSelectImportData}
                        >
                          {importTypeDropdownDetails === null || importTypeDropdownDetails === undefined
                            ? null
                            : importTypeDropdownDetails.map((data) => {
                                // console.log("===>data<====", data);
                                return (
                                  <Option key={data.id} value={data.id}>
                                    {data.name}
                                  </Option>
                                );
                              })}
                        </Select>
                      </Form.Item>
                    </Col>
                  ) : null}
                  <Col span={8}>
                    <Form.Item label="Import Option" name="importOption" rules={[{ required: false, message: "Please select import option" }]}>
                      <Select
                        style={{ width: "100%" }}
                        size="medium"
                        // mode="multiple"
                        maxTagCount={1}
                        showSearch
                        allowClear
                        dropdownMatchSelectWidth={false}
                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        // onFocus={getImportDropdownData}
                        // onSelect={onSelectImportData}
                      >
                        <Option key="1" value="Create New">
                          Create New
                        </Option>
                        <Option key="2" value="Update Existing">
                          Update Existing
                        </Option>
                        <Option key="3" value="Create New & Update Existing">
                          Create New & Update Existing
                        </Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <input id="choosefile" type="file" accept=".csv" onChange={readFileData} style={{ marginTop: "15%" }} />
                  </Col>
                  <Col span={4}>
                    {/* <Button style={{ marginTop: "13%", float:"right",backgroundColor:"#089EA4",color:"#FFFFFF",fontWeight:"bold" }} onClick={clearData}>Clear</Button> */}
                    <Dropdown placement="bottomRight" overlay={actionsContent} trigger={["hover"]}>
                      <Button style={{ marginTop: "13%", float: "right", backgroundColor: "#089EA4", color: "#FFFFFF", fontWeight: "bold" }}>Actions</Button>
                    </Dropdown>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginBottom: "8px" }}>
            <Card>
              {downloadTemplateFlag === false ? (
                <span style={{ cursor: "pointer", color: "#0000EE" }} onClick={downloadTemplate}>
                  Download Template
                </span>
              ) : (
                <span style={{ cursor: "pointer", color: "#0000EE" }} onClick={downloadData}>
                  Download CSV Format
                </span>
              )}
              <br />
              <TableForImport columnsData={tableHeader} gridData={tableData} />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default Import;
