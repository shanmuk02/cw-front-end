import React, { useState } from "react";
import { Card, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useGlobalContext } from "../../lib/storage";
import RecordHeader from "./RecordHeader";
import RecordLines from "./RecordLines";
import RecordTitle from "./RecordTitle";

const RecordWindow = (props) => {
  const { globalStore } = useGlobalContext();
  const Themes = globalStore.userData.CW360_V2_UI;
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [isHeaderActive, setIsHeaderActive] = useState(false);
  const [headerRecordData, setHeaderRecordData] = useState({});
  const [loadingRecordWindow, setLoadingRecordWindow] = useState(false);

  return (
    <Card style={Themes.contentWindow.recordWindow.mainCard}>
      <Spin indicator={<LoadingOutlined className="spinLoader" style={Themes.contentWindow.mainCard} spin />} spinning={loadingRecordWindow}>
        <RecordTitle lastRefreshed={lastRefreshed} setLastRefreshed={setLastRefreshed} headerRecordData={headerRecordData} isHeaderActive={isHeaderActive} {...props} />
        <RecordHeader
          setIsHeaderActive={setIsHeaderActive}
          lastRefreshed={lastRefreshed}
          setLastRefreshed={setLastRefreshed}
          setHeaderRecordData={setHeaderRecordData}
          loadingRecordWindow={loadingRecordWindow}
          setLoadingRecordWindow={setLoadingRecordWindow}
          {...props}
        />
        <RecordLines
          isHeaderActive={isHeaderActive}
          lastRefreshed={lastRefreshed}
          setLastRefreshed={setLastRefreshed}
          headerRecordData={headerRecordData}
          loadingRecordWindow={loadingRecordWindow}
          setLoadingRecordWindow={setLoadingRecordWindow}
          {...props}
        />
      </Spin>
    </Card>
  );
};

export default RecordWindow;
