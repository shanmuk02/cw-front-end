/* eslint-disable */
import React, { useEffect, useState } from "react";
import HeaderComponent from "./HeaderComponent";
import { useParams } from "react-router-dom";
import { Card, Col, Row, Spin, message, Menu, Dropdown,Tooltip } from "antd";
import { LoadingOutlined, CloseOutlined,DownloadOutlined } from "@ant-design/icons";
import { genericUrl } from "../../constants/serverConfig";
import { ExportToCsv } from "export-to-csv";
import { useGlobalContext } from "../../lib/storage";
import BarChart from "./charts/BarChart";
import PieChart from "./charts/PieChart";
import LineChart from "./charts/LineChart";
import DonutChart from "./charts/DonutChart";
import GaugeChart from "./charts/GaugeChart";
import CombinationChartSingleYAxis from "./charts/CombinationChartSingleYAxis";
import CombinationChartDoubleYAxis from "./charts/CombinationChartDoubleYAxis";
import TableChart from "./charts/TableChart";
import WaterfallChart from "./charts/WaterfallChart";

import dashboardRefresh from '../../assets/images/refreshIcon.svg'
import FullScreen from "../../assets/images/fullscreen.svg";
import expandChartIcon from "../../assets/images/expandChart.svg";
 
import BarChartC3JS from "./c3charts/BarChart";
import PieChartC3JS from "./c3charts/PieChart";
import DonutChartC3JS from "./c3charts/DonutChart";
import GaugeChartC3JS from "./c3charts/GaugeChart";
import LineChartC3JS from "./c3charts/LineChart";
import AreaChartC3JS from "./c3charts/AreaChart";
import WaterfallChartC3JS from "./c3charts/WaterfallChart";

import Axios from "axios";
import { Scrollbars } from "react-custom-scrollbars";
import { useHistory } from "react-router";
// import FullScreen from "../../assets/images/fullscreen.svg";
import settingIcon from "../../assets/images/settingsIcon.svg";
import closeIcon from "../../assets/images/closeIcon.svg";
import redArrow from "../../assets/images/redArrow.svg";
import greenArrow from "../../assets/images/greenArrow.svg";
import CustomIcon from "../../assets/images/customicons";
import "./index.css";

// const myWorker = new Worker('webWorker.js');

const Dashboard = () => {
  const { dashboardId } = useParams();
  const { globalStore } = useGlobalContext();
  const { userPreferences } = globalStore;
  const userData = globalStore.userData
  const userCurrency = userData.currency
  const currencySymbol = userData.currency;

  const [dashboardName, setDashboardName] = useState("");
  const [dashboardFilters, setDashboardFilters] = useState([]);
  const [isComparableFlag, setIsComparableFlag] = useState("");
  const [kpiData, setKpiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [kpiLoading, setKpiLoading] = useState({});
  const [dashboardDataInState, setDashboardDataInState] = useState([]);
  const [dashboardParams, setDashboardParams] = useState("");
  const [fullScreenValue, setFullScreenValue] = useState(false);
  const [chartKpiId, setChartKpiId] = useState("");
  const [chartType, setChartType] = useState("");
  const [chartTitle, setChartTitle] = useState("");
  const [chartProperties, setChartProperties] = useState("");
  const [isDateChanged, setIsDateChanged] = useState(false);
  const [previousYearFlag, setPreviousYearFlag] = useState(false);
  const [currentYearFlag, setCurrentYearFlag] = useState(false);
  const [fromDateYear, setFromDateYear] = useState("");
  const [chartLibrary, setChartLibrary] = useState("");
  const [kpiIdInState, setKpiIdInState] = useState("")
  const history = useHistory();
  /* setIsDateChanged(values.isDateChanged)
    setPreviousYearFlag(values.previousYearFlag)
    setFromDateYear(values.fromDateYearInState) */

  const [refresh, setRefresh] = useState(new Date());

  useEffect(() => {
    // console.log("========>Inside Dashboard<=========")
    if (dashboardId) {
      getDashboardData();
    }
    return () => {
      setKpiData([]);
      setDashboardDataInState([]);
      setFullScreenValue(false);
    };
  }, [dashboardId]);

  useEffect(() => {
    if (userPreferences.enableMultiTab !== "Y") {
      setRefresh(new Date());
    }
  }, [dashboardId]);

  const getDashboardData = async () => {
    try {
      setLoading(true);
      const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const dashhboardQuery = {
        query: `query {
              getDashboardJson(dashboardId:"${dashboardId}"){data, messageCode, title, message}
          }`,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken.access_token}`,
      };

      const serverResponse = await Axios.post(genericUrl, dashhboardQuery, { headers: headers }, { async: true }, { crossDomain: true });

      const dashboardJsonResponse = serverResponse.data.data.getDashboardJson;
      if (dashboardJsonResponse.messageCode === "200") {
        const dashboardData = JSON.parse(dashboardJsonResponse.data);
        const dashboardName = dashboardData.name;
        const dashboardFilters = dashboardData.filters;
        const kpiData = dashboardData.KPI;
        const previousYearArray = [];
        const defaultValueJSON = {};
        let chartLibrary;
        if (dashboardData.Settings !== undefined) {
          const chartSettings = dashboardData.Settings[0];
          chartLibrary = chartSettings.chartlibrary;
        }

        let isComparableFlag = dashboardData.isComparable;
        let defaultDateValues = "";
        for (let index = 0; index < kpiData.length; index++) {
          kpiData[index]["hide"] = "N";
        }
        if (kpiData !== undefined) {
          kpiData.sort(function (a, b) {
            return a.position_column - b.position_column;
          });
        }
        // console.log("===kpiData===",kpiData)
        setLoading(false);
        setDashboardName(dashboardName);
        setDashboardFilters(dashboardFilters);
        setKpiData(kpiData);
        setIsComparableFlag(isComparableFlag);
        setChartLibrary(chartLibrary);

        for (let index = 0; index < dashboardFilters.length; index += 1) {
          const element = dashboardFilters[index];
          if (element.type === "DateRange") {
            const defaultValue = element.default_value_expression.split(";");
            defaultDateValues = defaultValue;
            /* this.setState({dateRange:defaultValue}) */
            defaultValueJSON[element.column_name] = defaultValue;

            if (isComparableFlag === "Y") {
              const fromDate = new Date(defaultDateValues[0]);
              const toDate = new Date(defaultDateValues[1]);
              const formattedFromDate = fromDate.getFullYear() - 1 + "-" + (fromDate.getMonth() + 1) + "-" + fromDate.getDate();
              const formattedToDate = toDate.getFullYear() - 1 + "-" + (toDate.getMonth() + 1) + "-" + toDate.getDate();
              previousYearArray.push(formattedFromDate, formattedToDate);
              defaultValueJSON[element.column_name.concat("_COMPARABLE_")] = previousYearArray;
            }
          }
        }

        const stringifiedJSON = JSON.stringify(defaultValueJSON);
        let jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
        setDashboardParams(defaultValueJSON);
        executeDashboard(kpiData, jsonToSend);
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const executeDashboard = (kpiData, dashboardParams) => {
    /* console.log("======kpiData======", kpiData);
    console.log("=======dashboardParams========", dashboardParams);
    console.log("=======dashboardFilters========", dashboardFilters);
    console.log("=======isComparableFlag========", isComparableFlag); */
    try {
      const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken.access_token}`,
      };
      let newData;
      for (let index = 0; index < kpiData.length; index++) {
        const element = kpiData[index];

        setKpiLoading((currentData) => ({ ...currentData, [element.kpi_id]: true }));
        const executeDashboardMutation = {
          query: `query {
          executeDashboard(dashboardId:"${dashboardId}",kpiId:"${element.kpi_id}",dashboardParam:"${dashboardParams}"){data, messageCode, title, message}
        }`,
        };
        Axios.post(genericUrl, executeDashboardMutation, { headers: headers }, { async: true }, { crossDomain: true }).then((execDashRes) => {
          const responseFromServer = execDashRes.data.data.executeDashboard;
          if (responseFromServer.title === "Success") {
            const dashboardData = JSON.parse(responseFromServer.data);
            // console.log("======dashboardData=====", dashboardData);
            newData = dashboardDataInState;
            for (const [key, value] of Object.entries(dashboardData)) {
              newData[key] = value;
            }
            setDashboardDataInState({ ...newData });
            setKpiLoading((currentData) => ({ ...currentData, [element.kpi_id]: false }));
            // dashBoardArr.push(dashboardData)
          } else {
            // message.error(`${element.title}-${responseFromServer.message}`)
            // console.log("======Error Data=====", responseFromServer.message);
            // message.error(`${element.title}-${responseFromServer.message}`);
            // history.push("/error");
            setKpiLoading((currentData) => ({ ...currentData, [element.kpi_id]: false }));
          }
        });
      }
    } catch (error) {
      console.log("=====Error in execute Dashboard=====", error);
    }
  };

  const isLoad = (isLoading, data) => {
    // console.log("====data")
    if (isLoading === "Y") {
      setKpiLoading((currentData) => ({ ...currentData, [data]: true }));
    } else {
      setKpiLoading((currentData) => ({ ...currentData, [data]: false }));
    }
  };

  const setParamsValueAfterFilter = (data) => {
    setDashboardParams(data);
  };

  const amountFormat = (badgeValue) => {
    let result;
    if (userCurrency === 'INR') {
      const absVal = Math.abs(badgeValue)
      if (badgeValue === undefined) {
        result = 0
      } else if (absVal >= 10000000) {
        result = `${(absVal / 10000000).toFixed(2)} Cr`
      } else if (absVal >= 100000) {
        result = `${(absVal / 100000).toFixed(2)} L`
      } /* else if (Math.abs(Number(badgeValue)) >= 1.0e3) {
        result = `${(Math.abs(Number(badgeValue)) / 1.0e3).toFixed(2)} K`
      } */ else {
        result = absVal
      }
    } else {
      if (badgeValue === undefined) {
        result = 0
      } else if (Math.abs(Number(badgeValue)) >= 1.0e9) {
        result = `${(Math.abs(Number(badgeValue)) / 1.0e9).toFixed(2)} B`
      } else if (Math.abs(Number(badgeValue)) >= 1.0e6) {
        result = `${(Math.abs(Number(badgeValue)) / 1.0e6).toFixed(2)} M`
      } else if (Math.abs(Number(badgeValue)) >= 1.0e3) {
        result = `${(Math.abs(Number(badgeValue)) / 1.0e3).toFixed(2)} K`
      } else {
        result = Math.abs(Number(badgeValue))
      }
    }
    return result;
  };

  const responsiveDesignForColumn = {
    xxl: 12,
    xl: 12,
    lg: 12,
    xs: 12,
    sm: 12,
    md: 12,
  };

  const maximizeChart = (id, type, title, properties) => {
    // console.log("===kpiId====",id)
    setChartKpiId(id);
    setChartType(type);
    setChartTitle(title);
    setChartProperties(properties);
    /* let data = [...kpiData];
    setFullScreenValue(true);
    for (let index1 = 0; index1 < data.length; index1++) {
      if (data[index1].kpi_id !== id) {
        data[index1].hide = "Y";
      }
    };
    setKpiData(data);
    if (fullScreenValue === true) {
      for (let index1 = 0; index1 < data.length; index1++) {
        data[index1].hide = "N";
      }
      setKpiData(data);
      setFullScreenValue(false);
    } */
  };

  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: "#c1c1c1",
      borderRadius: "5px",
      width: "8px",
    };
    setLoading(false);
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  const renderThumbHorizontalScroll = ({ style, ...props }) => {
    const thumbStyle = {
      // backgroundColor: "#c1c1c1",
      // borderRadius: "5px",
      width: "0px",
    };
    setLoading(false);
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  const renderView = ({ style, ...props }) => {
    const viewStyle = {
      color: "#00000",
    };
    return <div className="box" style={{ ...style, ...viewStyle }} {...props} />;
  };

  const toggleNoScroll = (off) => {
    //	test if already exist:
    var a = Array.prototype.indexOf.call(document.body.classList, "no-scroll") + 1;
    //	remove if does exist, so as not to double up
    document.body.className = document.body.className.replace(" no-scroll", "");
    //	add only if off IS False OR off is empty & it did not previously exist (thus "toggle")
    if (off === false || (off !== true && !a)) document.body.className += " no-scroll";
    return document.body.classList;
  };

  const fullScreenMode = (value) => {
    if (value) {
      if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
        toggleNoScroll(true);
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      } else {
        toggleNoScroll(false);
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    }
  };

  const dashboardParamsAndKpiData = {
    kpiData: kpiData,
    dashboardParams: dashboardParams,
  };

  

  const filteredData = (data) => {
    // console.log("===Data===>",data)
    let newData = dashboardDataInState;
    const parsedJSON = data;
    for (const [key, value] of Object.entries(parsedJSON)) {
      newData[key] = value;
    }
    setDashboardDataInState({ ...newData });
    /* if (data.title === 'Error') {
      // console.log(title)
      message.error(`${data.message}`)
    } else {
      // console.log('=====success data====', data)
      let newData = this.state.dashboardDataInState
      const parsedJSON = data
      for (const [key, value] of Object.entries(parsedJSON)) {
        newData[key] = value
      }
      this.setState({ dashboardDataInState: newData, hideChartData: flag })
    } */
  };

  /* const showKpiOptions=()=>{

  } */

  /* const expandChart = (id) => {
    let data = [...kpiData];
    setFullScreenValue(true);
    for (let index1 = 0; index1 < data.length; index1++) {
      if (data[index1].kpi_id !== id) {
        data[index1].hide = "Y";
      }
    }
    setKpiData(data);
    if (fullScreenValue === true) {
      for (let index1 = 0; index1 < data.length; index1++) {
        data[index1].hide = "N";
      }
      setKpiData(data);
      setFullScreenValue(false);
    }
  }; */

  const expandChart = kpiId => {
    // console.log("====>fullScreenValue<====",fullScreenValue)
    setFullScreenValue(true);
    setKpiIdInState(kpiId)
    // this.setState({ fullScreenValue: true, kpiIdInState: kpiId })
    if (fullScreenValue === true) {
      setFullScreenValue(false);
      setKpiIdInState('')
      // this.setState({ fullScreenValue: false, kpiIdInState: '' })
    }
  }

  const refreshChart = (kpiId) => {
    // console.log("===dashboardParams===",dashboardParams)
    try {
      const stringifiedJSON = JSON.stringify(dashboardParams);
      let jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
      const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken.access_token}`,
      };
      let newData;

      setKpiLoading((currentData) => ({ ...currentData, [kpiId]: true }));
      const executeDashboardMutation = {
        query: `query {
        executeDashboard(dashboardId:"${dashboardId}",kpiId:"${kpiId}",dashboardParam:"${jsonToSend}"){data, messageCode, title, message}
      }`,
      };
      Axios.post(genericUrl, executeDashboardMutation, { headers: headers }, { async: true }, { crossDomain: true }).then((execDashRes) => {
        const responseFromServer = execDashRes.data.data.executeDashboard;
        if (responseFromServer.title === "Success") {
          const dashboardData = JSON.parse(responseFromServer.data);
          // console.log("======dashboardData=====", dashboardData);
          newData = dashboardDataInState;
          for (const [key, value] of Object.entries(dashboardData)) {
            newData[key] = value;
          }
          setDashboardDataInState({ ...newData });
          setKpiLoading((currentData) => ({ ...currentData, [kpiId]: false }));
          // dashBoardArr.push(dashboardData)
        } else {
          // message.error(`${element.title}-${responseFromServer.message}`)
          // console.log("======Error Data=====", responseFromServer.message);
          // message.error(`${element.title}-${responseFromServer.message}`)
          setKpiLoading((currentData) => ({ ...currentData, [kpiId]: false }));
        }
      });
    } catch (error) {
      console.log("=====Error in execute Dashboard=====", error);
    }
  };

  const exportTableData = (chartKpiId, chartTitle, chartProperties) => {

    const tableData = dashboardDataInState[chartKpiId]
    const finalArr = []
    for (const [key, value] of Object.entries(tableData)) {
      // console.log("===>key<====",key,"=====>value<=====",value)
    // newData[key] = value    
      delete value["key"]
  }
 
    const tableProperties = JSON.parse(chartProperties)
    const columnsDataArr = tableProperties.columnsData
    const dataIndexArr = []
    for (let index = 0; index < columnsDataArr.length; index++) {
      dataIndexArr.push(columnsDataArr[index].dataIndex)
    }
    for (let index = 0; index < tableData.length; index++) {
      const jsonObj={}
      const element1 = tableData[index];
      for (let index2 = 0; index2 < dataIndexArr.length; index2++) {
        const element2 = dataIndexArr[index2];
        jsonObj[element2]=element1[element2]
      }
      finalArr.push(jsonObj)
    }


    const options = {
      fieldSeparator: ',',
      filename: chartTitle,
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: headersArr,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    }
    const csvExporter = new ExportToCsv(options)
    csvExporter.generateCsv(finalArr)
  };

  const kpiOptionsMenu = (
    <Menu>
      <Menu.Item key="1" onClick={() => expandChart(chartKpiId)}>
        Expand
      </Menu.Item>
      <Menu.Item key="2" onClick={() => refreshChart(chartKpiId)}>
        Refresh
      </Menu.Item>
      {chartType === "Table Chart" ? (
        <Menu.Item key="3" onClick={() => exportTableData(chartKpiId, chartTitle, chartProperties)}>
          Download
        </Menu.Item>
      ) : (
        ""
      )}
    </Menu>
  );

  const currentYearDateChange = (values) => {
    // console.log("===curr values===",values)
    setIsDateChanged(values.isDateChanged);
    setCurrentYearFlag(values.currentYearFlag);
    setFromDateYear(values.fromDateYearInState);
    /* this.setState({
      isDateChanged: values.isDateChanged,
      currentYearFlag: values.currentYearFlag,
      fromDateYearInState: values.fromDateYearInState,
    }) */
  };

  const previousYearDateChange = (values) => {
    // console.log("===prev values===",values)
    setIsDateChanged(values.isDateChanged);
    setPreviousYearFlag(values.previousYearFlag);
    setFromDateYear(values.fromDateYearInState);
    /* this.setState({
      isDateChanged: values.isDateChanged,
      previousYearFlag: values.previousYearFlag,
      fromDateYearInState: values.fromDateYearInState,
    }) */
  };

  const clearFilterValues = () => {
    setIsDateChanged(false);
    setPreviousYearFlag(false);
    setFromDateYear(false);
  };

  return (
    <Spin indicator={<LoadingOutlined spin />} spinning={loading}>
      <Scrollbars
        autoHide
        // Hide delay in ms
        autoHideTimeout={1000}
        // Duration for hide animation in ms.
        autoHideDuration={200}
        thumbSize={100}
        // renderView={renderView}
        renderThumbHorizontal={renderThumbHorizontalScroll}
        renderThumbVertical={renderThumb}
        style={{ height: "90vh" }}
      >
        <HeaderComponent
          dashboardId={dashboardId}
          isComparableFlag={isComparableFlag}
          dashboardFilters={dashboardFilters}
          dashboardTitle={dashboardName}
          fullScreen={fullScreenMode}
          refreshDashboard={getDashboardData}
          currentYearDateChange={currentYearDateChange}
          previousYearDateChange={previousYearDateChange}
          clearFilterValues={clearFilterValues}
          kpiData={kpiData}
          filteredData={filteredData}
          loadingAfterFiltersApplied={isLoad}
          paramsValue={setParamsValueAfterFilter}
        />

        <Row gutter={8} style={{paddingBottom:"10px"}}>
          {kpiData.map((kpiContent, index) => {
            const kpiUIProperties = JSON.parse(kpiContent.properties);

            let bgColor;
            let textColor;
            let titleTextColor;
            let badgeTitleColor;
            let displayChart = false;
            let previousYearDate;
            let backgroundImage;
            let opacityNumber;

            if (isDateChanged === true && previousYearFlag === true && currentYearFlag === true) {
              previousYearDate = fromDateYear;
            } else if (isDateChanged === true && currentYearFlag === true) {
              previousYearDate = fromDateYear - 1;
            } else if (isDateChanged === true && previousYearFlag === true) {
              previousYearDate = fromDateYear;
            } else {
              previousYearDate = new Date().getFullYear() - 1;
            }

            if ((kpiContent.kpi_id === kpiIdInState || kpiIdInState === '') && (kpiContent.isDrilldownedKpi === "N" || kpiContent.isDrilldownedKpi === undefined) && (kpiContent.isactive === "Y" || kpiContent.isactive === undefined)) {
              displayChart = true;
            }

            if (kpiUIProperties === null) {
              titleTextColor="black"
              bgColor = "white";
              textColor = "black";
              badgeTitleColor = "black";
              backgroundImage = 'none';
              opacityNumber = 1
            } else {
              if (kpiUIProperties["titleTextColor"] === undefined) {
                titleTextColor = "#19181A";
              } else {
                titleTextColor = kpiUIProperties["textColor"];
              }
              if(kpiUIProperties["opacityNumber"] === undefined){
                opacityNumber = 1
              }else{
                opacityNumber = kpiUIProperties["opacityNumber"]
              }
              if(kpiUIProperties["imageUrl"] === undefined){
                backgroundImage = 'none'
              }else{
                backgroundImage = kpiUIProperties["imageUrl"]
              }
              if (kpiUIProperties["bgcolor"] === undefined) {
                bgColor = "white";
              } else {
                bgColor = kpiUIProperties["bgcolor"];
              }

              if (kpiUIProperties["textColor"] === undefined) {
                textColor = "#19181A";
              } else {
                textColor = kpiUIProperties["textColor"];
              }
              if (kpiUIProperties["badgeTitleColor"] === undefined) {
                badgeTitleColor = "#19181A";
              } else {
                badgeTitleColor = kpiUIProperties["badgeTitleColor"];
              }
            }
            const netPercentage =
              ((dashboardDataInState[kpiContent.kpi_id] - dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")]) /
                dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")]) *
              100;
            if (kpiContent.hide === "N") {
              return (
                <Col
                  key={index}
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: fullScreenValue === true && kpiContent.type !== "Badge" ? 24 : kpiContent.column_space * 2 }}
                  lg={{ span: fullScreenValue === true && kpiContent.type !== "Badge" ? 24 : kpiContent.column_space * 2 }}
                  xl={{ span: fullScreenValue === true && kpiContent.type !== "Badge" ? 24 : kpiContent.column_space * 2 }}
                  xxl={{ span: fullScreenValue === true && kpiContent.type !== "Badge" ? 24 : kpiContent.column_space * 2 }}
                  style={{ marginBottom: "13px",paddingLeft:"8px",paddingRight:"8px"}}
                >
                  <Spin
                    indicator={
                      <div>
                        <CustomIcon name="logo" />
                      </div>
                    }
                    spinning={kpiLoading[kpiContent.kpi_id]}
                  >
                    <Card
                      style={{
                        padding:"3px",
                        borderRadius: "6px",
                        opacity : opacityNumber,
                        backgroundImage:`url(${backgroundImage})`,
                        backgroundRepeat:"no-repeat",
                        backgroundPosition:"right",
                        // backgroundImage:kpiUIProperties["imageUrl"]===undefined || kpiUIProperties["imageUrl"]===null ? 'none':`url(${kpiUIProperties["imageUrl"]})`,
                        backgroundColor: bgColor,
                        // backgroundImage: kpiContent.type === "Badge"?`linear-gradient(to right, ${gradientOne}, ${gradientTwo} , ${gradientThree})`:`linear-gradient(to right, #FFFFFF, #FFFFFF , #FFFFFF)`,
                        // display: kpiContent.isactive === "Y" || kpiContent.isactive === undefined ? "block" : "none",
                        display: displayChart === true ? "block" : "none",
                        height:
                          fullScreenValue === true && kpiContent.type !== "Badge"
                            ? "81.3vh"
                            : kpiContent.type === "Badge"
                            ? "15vh"
                            : kpiContent.widget_height === undefined || kpiContent.widget_height === null
                            ? "40vh"
                            : `${kpiContent.widget_height}vh`,
                      }}
                    >
                      <span className="chartTitle">
                        <span style={{color: titleTextColor}}>{kpiContent.title}</span>
                        <span className="maxIcon">
                          {kpiContent.type !== "Badge" ? (
                            <span>
                              <span>
                                <img src={dashboardRefresh} style={{ cursor: "pointer" }} height="11px" width="11px" onClick={() => refreshChart(kpiContent.kpi_id)} />
                              </span>
                              &emsp;
                              <span>
                                {fullScreenValue === false ? (
                                  <img alt="maximize" height="11px" width="11px" src={expandChartIcon} style={{ cursor: "pointer" }} onClick={() => expandChart(kpiContent.kpi_id)} />
                                ) : (
                                  <img alt="minimize" height="11px" width="11px" src={closeIcon} style={{ cursor: "pointer" }} onClick={() => expandChart(kpiContent.kpi_id)} />
                                )}
                              </span>
                              &emsp;
                              {kpiContent.type === 'Table Chart' ? (
                                  <Tooltip placement="top" title="Export">
                                    <DownloadOutlined
                                      // className="maxIcon"
                                      style={{
                                        // float: 'right',
                                        cursor: 'pointer',
                                        opacity: 1,
                                        paddingTop: '3px',
                                        paddingRight: '3px',
                                        color: '#43682B',
                                      }}
                                      onClick={() =>
                                        exportTableData(
                                          kpiContent.kpi_id,
                                          kpiContent.title,
                                          kpiContent.properties,
                                        )
                                      }
                                    />
                                  </Tooltip>
                                ) : (
                                  ''
                                )}
                            </span>
                          ) : (
                            /* fullScreenValue === false ? (
                              <img height="11px" width="11px" src={FullScreen} style={{ float: "right", cursor: "pointer" }} onClick={() => maximizeChart(kpiContent.kpi_id)} />
                            ) : (
                              <CloseOutlined onClick={() => maximizeChart(kpiContent.kpi_id)} style={{ float: "right" }} />
                            ) */
                            ""
                          )}
                        </span>
                      </span>
                      <br />
                      {(() => {
                        if (chartLibrary === "D3JS") {
                          switch (kpiContent.type) {
                            case "Badge":
                              return (
                                <>
                                  <span
                                    style={{
                                      fontSize: "20px",
                                      color: "#19181A",
                                      // letterSpacing: "0px",
                                      opacity: "0.8",
                                      fontWeight: "bold",
                                      color: textColor,
                                    }}
                                  >
                                    {amountFormat(dashboardDataInState[kpiContent.kpi_id])}
                                  </span>
                                  &nbsp;
                                  <span
                                    style={{
                                      // textAlign: "right",
                                      fontSize: "12px",
                                      color: netPercentage < 0 ? "#F9656F" : "#0DBC70",
                                      fontWeight: "bold",
                                      // color: textColor
                                    }}
                                  >
                                    {loading === false ? (
                                      kpiContent.is_comparable === "Y" &&
                                      (dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== null ||
                                        dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== undefined) ? (
                                        `${netPercentage === "NaN" ? 0 : ` ${netPercentage < 0 ? "" : "+"}${netPercentage.toFixed(2)}`}%`
                                      ) : (
                                        <br />
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </span>
                                  &emsp;
                                  <span>
                                    {loading === false ? (
                                      kpiContent.is_comparable === "Y" &&
                                      (dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== null ||
                                        dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== undefined) ? (
                                        netPercentage < 0 ? (
                                          <img alt="redArrow" height="13px" width="13px" src={redArrow} />
                                        ) : (
                                          <img alt="greenArrow" height="13px" width="13px" src={greenArrow} />
                                        )
                                      ) : (
                                        <br />
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </span>
                                  <br />
                                  {kpiContent.is_comparable === "Y" ? (
                                    <span style={{ fontSize: "12px", color: textColor }}>
                                      Compared to {kpiContent.currency_field !== undefined && kpiContent.currency_field !== null ? currencySymbol : ""}&nbsp;
                                      <span style={{ fontWeight: "bold", color: textColor }}>
                                        {dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== null ||
                                        dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== undefined
                                          ? amountFormat(dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")])
                                          : ""}
                                      </span>
                                      &nbsp;
                                      <span style={{ color: textColor }}>in {previousYearDate}</span>&nbsp;
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </>
                              );
                            case "Bar Chart":
                              return (
                                <BarChart
                                  barChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  barChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}

                                  fullScreenValue={fullScreenValue}
                                  chartLibrary={chartLibrary}
                                />
                              );

                            case "Pie Chart":
                              return (
                                <PieChart
                                  pieChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  pieChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Line Chart":
                              return (
                                <LineChart
                                  lineChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  lineChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Donut Chart":
                              return (
                                <DonutChart
                                  donutChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  donutChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Gauge Chart":
                              return (
                                <GaugeChart
                                  gaugeChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  gaugeChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Combination Chart With Single Y axis":
                              return (
                                <CombinationChartSingleYAxis
                                  combinationChartSingleYAxisdata={dashboardDataInState[kpiContent.kpi_id]}
                                  combinationChartSingleYAxisProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Combination Chart With Double Y axis":
                              return (
                                <CombinationChartDoubleYAxis
                                  combinationChartDoubleYAxisdata={dashboardDataInState[kpiContent.kpi_id]}
                                  combinationChartDoubleYAxisProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Table Chart":
                              return (
                                <TableChart
                                  tableChartData={dashboardDataInState[kpiContent.kpi_id]}
                                  tableKpi={kpiContent}
                                  dashboardParamsAndKpiData={dashboardParamsAndKpiData}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Waterfall Chart":
                              return <WaterfallChart waterFallChartdata={dashboardDataInState[kpiContent.kpi_id]} fullScreenValue={fullScreenValue} />;

                            default:
                              return <div>Chart</div>;
                          }
                        } else {
                          switch (kpiContent.type) {
                            case "Badge":
                              return (
                                <>
                                  <span
                                    style={{
                                      fontSize: "20px",
                                      color: "#19181A",
                                      // letterSpacing: "0px",
                                      opacity: "0.8",
                                      fontWeight: "bold",
                                      color: textColor,
                                    }}
                                  >
                                    {amountFormat(dashboardDataInState[kpiContent.kpi_id])}
                                  </span>
                                  &nbsp;
                                  <span
                                    style={{
                                      // textAlign: "right",
                                      fontSize: "12px",
                                      color: netPercentage < 0 ? "#F9656F" : "#0DBC70",
                                      fontWeight: "bold",
                                      // color: textColor
                                    }}
                                  >
                                    {loading === false ? (
                                      kpiContent.is_comparable === "Y" &&
                                      (dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== null ||
                                        dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== undefined) ? (
                                        `${netPercentage === "NaN" ? 0 : ` ${netPercentage < 0 ? "" : "+"}${netPercentage.toFixed(2)}`}%`
                                      ) : (
                                        <br />
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </span>
                                  &emsp;
                                  <span>
                                    {loading === false ? (
                                      kpiContent.is_comparable === "Y" &&
                                      (dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== null ||
                                        dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== undefined) ? (
                                        netPercentage < 0 ? (
                                          <img alt="redArrow" height="13px" width="13px" src={redArrow} />
                                        ) : (
                                          <img alt="greenArrow" height="13px" width="13px" src={greenArrow} />
                                        )
                                      ) : (
                                        <br />
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </span>
                                  <br />
                                  {kpiContent.is_comparable === "Y" ? (
                                    <span style={{ fontSize: "12px", color: textColor }}>
                                      Compared to {kpiContent.currency_field !== undefined && kpiContent.currency_field !== null ? currencySymbol : ""}&nbsp;
                                      <span style={{ fontWeight: "bold", color: textColor }}>
                                        {dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== null ||
                                        dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")] !== undefined
                                          ? amountFormat(dashboardDataInState[kpiContent.kpi_id.concat("_COMPARABLE_")])
                                          : ""}
                                      </span>
                                      &nbsp;
                                      <span style={{ color: textColor }}>in {previousYearDate}</span>&nbsp;
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </>
                              );

                            case "Bar Chart":
                              return (
                                <BarChartC3JS
                                  uniqueIndex={index}
                                  barChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  barChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  colSpace={kpiContent.column_space}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Pie Chart":
                              return (
                                <PieChartC3JS
                                  uniqueIndex={index}
                                  pieChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  pieChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  colSpace={kpiContent.column_space}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Line Chart":
                              return (
                                <LineChartC3JS
                                  uniqueIndex={index}
                                  lineChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  lineChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Donut Chart":
                              return (
                                <DonutChartC3JS
                                  uniqueIndex={index}
                                  donutChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  donutChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                  colSpace={kpiContent.column_space}
                                />
                              );

                            case "Table Chart":
                              return (
                                <TableChart
                                  tableChartData={dashboardDataInState[kpiContent.kpi_id]}
                                  tableKpi={kpiContent}
                                  dashboardParamsAndKpiData={dashboardParamsAndKpiData}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Gauge Chart":
                              return (
                                <GaugeChartC3JS
                                  uniqueIndex={index}
                                  gaugeChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                  gaugeChartProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );

                            case "Area Chart":
                            return (
                              <AreaChartC3JS
                                uniqueIndex={index}
                                areaChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                areaChartProperties={JSON.parse(kpiContent.properties)}
                                height={kpiContent.widget_height}
                                fullScreenValue={fullScreenValue}
                                colSpace={kpiContent.column_space}
                              />
                            );

                            case "Waterfall Chart":
                            return (
                              <WaterfallChartC3JS
                                uniqueIndex={index}
                                waterFallChartdata={dashboardDataInState[kpiContent.kpi_id]}
                                waterFallChartProperties={JSON.parse(kpiContent.properties)}
                                height={kpiContent.widget_height}
                                fullScreenValue={fullScreenValue}
                                colSpace={kpiContent.column_space}
                              />
                            );

                            /*  case "Combination Chart With Single Y axis":
                              return (
                                <CombinationChartSingleYAxis
                                  combinationChartSingleYAxisdata={dashboardDataInState[kpiContent.kpi_id]}
                                  combinationChartSingleYAxisProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );
                              
  
                            case "Combination Chart With Double Y axis":
                              return (
                                <CombinationChartDoubleYAxis
                                  combinationChartDoubleYAxisdata={dashboardDataInState[kpiContent.kpi_id]}
                                  combinationChartDoubleYAxisProperties={JSON.parse(kpiContent.properties)}
                                  height={kpiContent.widget_height}
                                  fullScreenValue={fullScreenValue}
                                />
                              );
                              
  
                            
                              
  
                            case "Waterfall Chart":
                              return <WaterfallChart waterFallChartdata={dashboardDataInState[kpiContent.kpi_id]} fullScreenValue={fullScreenValue} />; */

                            default:
                              return <div>Chart</div>;
                          }
                        }
                      })()}
                    </Card>
                  </Spin>
                </Col>
              );
            } else {
              return;
            }
          })}
        </Row>
      </Scrollbars>
    </Spin>
  );
};

export default Dashboard;
