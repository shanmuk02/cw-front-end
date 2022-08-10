import React from "react";
import { useParams } from "react-router";
import { Button, notification, Tooltip } from "antd";
import { getPrintTemplate, getPrintDownloadData } from "../../services/generic";
import { useGlobalContext } from "../../lib/storage";
import PrintIcon from "../../assets/images/print.svg";

const Print = (props) => {
  const { globalStore } = useGlobalContext();
  const Themes = globalStore.userData.CW360_V2_UI;
  const { headerTabId, setLoadingRecordWindow } = props;
  const { recordId } = useParams();

  const printTemplate = async () => {
    try {
      setLoadingRecordWindow(true);
      const printTemplateData = await getPrintTemplate(headerTabId, recordId);
      if (printTemplateData.data.data.reportTemplate === null || printTemplateData.data.data.reportTemplate === "null" || printTemplateData.data.data.reportTemplate === "") {
        notification.info({
          message: "File Not Found..!!!!",
        });
        setLoadingRecordWindow(false);
      } else {
        getPrintCommand(printTemplateData.data.data.reportTemplate);
      }
    } catch (error) {
      console.error("Error", error);
      setLoadingRecordWindow(false);
    }
  };

  const getPrintCommand = async (fileName) => {
    const downloadPrintData = await getPrintDownloadData(fileName);
    const fileURL = window.URL.createObjectURL(new Blob([downloadPrintData.data]));
    const link = document.createElement("a");
    link.setAttribute("id", "downloadlink");
    link.href = fileURL;
    link.setAttribute("download", `${fileName}`);
    link.click();
    setLoadingRecordWindow(false);
  };

  return (
    <Tooltip placement="bottom" title="Print">
      <Button style={Themes.contentWindow.ListWindowHeader.printActionButtons} onClick={printTemplate}>
        <img style={{ paddingBottom: "3px", width: "20px" }} src={PrintIcon} alt="invoice" /> &nbsp;
      </Button>
    </Tooltip>
  );
};

export default Print;
