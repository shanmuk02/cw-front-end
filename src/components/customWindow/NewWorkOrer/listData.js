import React,{useState,useEffect} from "react";
import { Input, Col, Row, Button, Dropdown, Tooltip, Table, Image } from "antd";
import "antd/dist/antd.css";
import { useHistory } from "react-router";
import {getWorkOrdersData } from "../../../services/generic";
import "../../../styles/antd.css";
import Settings from "../../../assets/images/settingIcon.svg";
import DownArrow from "../../../assets/images/arrow-drop-down.svg";
import Reset from "../../../assets/images/reset.svg";
import Summary from "../../../assets/images/summary.svg";
import Selection from "../../../assets/images/selection.svg";
import ShowList from "../../../assets/images/listView.svg";
import ShowAndHide from "../../../assets/images/showandHide.svg";
import Repeat from "../../../assets/images/repeat.svg";



const ListData = ({ designDetail, passData,onChangeData,onClickNew }) => {
const [dataSource,setDataSource] = useState([])
const [keyValue,setKeyValue] = useState('')

useEffect(()=>{
    CustomSalesOrder(keyValue)
  },[keyValue])

  const CustomSalesOrder = async(keyValue)=>{
    const valuesObj ={prodname:`${keyValue}`,limit:"100",offset:"1"}
    const stringifiedJSON = JSON.stringify(valuesObj);
    const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
    const CustomSalesOrderData = await getWorkOrdersData(jsonToSend)
    setDataSource(CustomSalesOrderData)
  }
  const history = useHistory();
  const onClick = () => {
    history.push(`/others/window/7473/New_Record`);
  };

  const selectRow = (record) => {
    return {
      onClick: (event) => {
        history.push(`/others/window/7473/${record.p_workorder_id}`);
      },
    };
  };

  const getKeyValue =(e)=>{
    setKeyValue(e.target.value)
  }

  const onSelectProductData = (e, data) => {
    // console.log(e, data);
  };

  const rowSelection = {
    onChange: onSelectProductData,
  };

  const getData = async (recordId,skip,limit) => {
    const valuesObj ={prodname:"",limit:`${limit}` ,offset:`${skip}`}
    const stringifiedJSON = JSON.stringify(valuesObj);
    const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
    const data = await getWorkOrdersData(jsonToSend);
    let finalArry = [...dataSource]
    data.filter((item,index)=>{
      if (index>dataSource.length){
        finalArry.push(item)
      }
    });
    setDataSource(finalArry)
  };

  const getTabData = (currentPage, page) => {
    let skip = currentPage ;
    let page1 = currentPage*10
    // console.log(page1,skip)
    if(currentPage>9){
      let limit = 20 + page1
      getData('',skip,limit)
    }
  };

  const columns = [
    {
      title: "bunitname",
      dataIndex: "bunitname",
      key: "bunitname",
      ellipsis: true,
    },
    {
      title: "Document No",
      dataIndex: "documentno",
      key: "documentno",
      ellipsis: true,
    },
    {
      title: "SoOrder Name",
      dataIndex: "sordername",
      key: "sordername",
      ellipsis: true,
    },
    {
      title: "Supplier Name",
      dataIndex: "suppliername",
      key: "suppliername",
      ellipsis: true,
    },

  ];

  const responsiveButton = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 24,
    sm: 16,
    md: 12,
  };
  const style1 = {
    fontWeight: "550",
    cursor: "pointer",
    fontSize: "14px",
    color: "rgb(62, 62, 60)",
    fontFamily: "Open Sans",
    textAline: "center",
    paddingLeft: "15px",
  };
  const styleData = {
    background: "#fff",
    border: "0.5px solid #dddbda",
    borderRadius: "5px",
    cursor: "pointer",
    description: "list icon buttons on the right hand side",
    height: "32px",
    marginRight: "4px ",
    paddingLeft: "5px",
    paddingRight: "5px ",
    paddingTop: "6px ",
    width: "33px",
  };
  const dropDownStyle = {
    height: "32px",
    width: "24px",
  };

  const styleForButton = {
    fontSize: "14px",
    borderRadius: "2px",
    fontWeight: "500",
    color: "rgb(255, 255, 255)",
    border: "0.25px solid rgb(7, 136, 141)",
    marginBottom: "8px",
    backgroundColor: "rgb(8 158 164)",
    color: "white",
    width: "93px",
    height: "33px",
  };
  return (
    <>
      <Row>
        <Col span={12} style={{ height: "auto" }}>
          <span
            style={{
              fontSize: "23px",
              color: "rgb(62, 62, 60)",
              fontWeight: "600",
              marginTop: "-5px",
              marginBottom: "0rem",
              width: "auto",
              maxWidth: "200px",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              position: "relative",
              cursor:"pointer"
            }}
          >
            {" "}
            New Work Order
          </span>
        </Col>
        <Col span={12} style={{ height: "auto" }}>
          {/* <span style={{ float: "right" }}>
            <Button onClick={onClick} style={styleForButton}>
              New
            </Button>
          </span> */}
        </Col>
      </Row>
      <Row>
        <Col span={6} style={{ height: "auto" }}>
          <Input
            onChange={getKeyValue}
            placeholder="Search"
            style={{ cursor: "pointer", color: "lightgray" }}
            suffix={<i className="fa fa-search" role="presentation" aria-hidden="true" />}
          />
        </Col>
        <Col span={6} style={{ height: "auto", display: "flex", alignItems: "center" }}>
          <span style={style1}>Recently Viewed</span>
          <span>
            <img src={DownArrow} alt="img" />
          </span>
        </Col>
        <Col span={12} {...responsiveButton}>
          <div style={{ display: "flex", float: "right" }}>
            <Dropdown trigger={["click"]} style={{ dropDownStyle }}>
              <Tooltip title="Settings" placement="bottom">
                <Button color="primary" style={styleData}>
                  <img style={{ paddingBottom: "6px", width: "20px" }} src={Settings} alt="invoice" />
                </Button>
              </Tooltip>
            </Dropdown>
            <Dropdown trigger={["click"]}>
              <Tooltip title="Summary" placement="bottom">
                <Button color="primary" style={styleData}>
                  <img style={{ paddingBottom: "6px", paddingRight: "1px", width: "11px" }} src={Summary} alt="invoice" />
                </Button>
              </Tooltip>
            </Dropdown>

            <Tooltip title="Kanban View" placement="bottom">
              <Button color="primary" style={styleData}>
                <img style={{ paddingBottom: "6px", width: "16px" }} src={Selection} alt="invoice" />
              </Button>
            </Tooltip>
            <Tooltip title="List View" placement="bottom">
              <Button color="primary" style={styleData}>
                <img style={{ paddingBottom: "6px", width: "19px" }} src={ShowList} alt="invoice" />
              </Button>
            </Tooltip>
            <Tooltip title="Clear Filters" placement="bottom">
              <Button color="primary" style={styleData}>
                <img style={{ paddingBottom: "5px", paddingLeft: "1px", width: "20px" }} src={Reset} alt="invoice" />
              </Button>
            </Tooltip>
            <Dropdown trigger={["click"]}>
              <Tooltip title="Show/Hide Columns" placement="bottom">
                <Button color="primary" style={styleData}>
                  <img style={{ paddingBottom: "5px", paddingLeft: "1px", width: "16px" }} src={ShowAndHide} alt="invoice" />
                </Button>
              </Tooltip>
            </Dropdown>
            <Tooltip title="Reload" placement="bottom">
              <Button color="primary" style={styleData}>
                <img style={{ paddingBottom: "7px", paddingRight: "2px", width: "18px" }} src={Repeat} alt="invoice" />
              </Button>
            </Tooltip>
          </div>
        </Col>
      </Row>
      <Row>
        <Table
          size="small"
          style={{ marginTop: "8px" }}
          columns={columns}
          dataSource={dataSource}
          sticky={true}
          pagination={{ onChange: getTabData }}
          rowSelection={{ ...rowSelection }}
          onRow={selectRow}
        />
      </Row>
    </>
  );
};
export default ListData;
