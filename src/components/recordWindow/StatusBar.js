import React,{useState} from "react";
import { Row, Col } from "antd";
import {DoubleRightOutlined,DoubleLeftOutlined} from '@ant-design/icons'
import { useGlobalContext } from "../../lib/storage";

const StatusBar = (props) => {
  const { globalStore } = useGlobalContext();
  const Themes = globalStore.userData.CW360_V2_UI;
  const [scrollLeft,setscrollLeft] = useState(true)

  const { statusBar } = props;
  const sty = {
    color: "#597380",
    description: "status bar keys styles in the status bar part",
    fontSize: "12px",
    fontWeight: "500",
    overflowX: "hidden",
    position: "relative",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }
  const  getScrollby = () =>{
    document.getElementById('yellow').scrollLeft += 600;
    setscrollLeft(false)
  }

  const getScrollbyRight = () =>{
    document.getElementById('yellow').scrollLeft -= 600;
    setscrollLeft(true)
  }
  return (
    <Row gutter={[0, 22]} style={{overflow:'hidden'}}  style={Themes.contentWindow.recordWindow.RecordHeader.StatusBar}>
      <Col span={23}  id ="yellow" style={{overflow:'hidden'}}>
        {statusBar.map((status, index) => (
          <span style={sty} key={`${index}`}>
            {status.titleName} : <span style={Themes.contentWindow.recordWindow.RecordHeader.statusBarValues}>{status.titleValue}</span> &#8739;&nbsp;
          </span>
        ))}
      </Col>
      {scrollLeft === true ?
      <Col style={{textAlign:'right'}} span={1}>
        <DoubleRightOutlined onClick={getScrollby} />
      </Col>
      :
      <Col style={{textAlign:'right'}} span={1}>
        <DoubleLeftOutlined onClick={getScrollbyRight} />
      </Col>
      }
    </Row>
  );
};

export default StatusBar;
