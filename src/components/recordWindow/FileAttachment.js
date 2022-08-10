import React, { useState } from "react";
import { useParams } from "react-router";
import { Button, Modal, Card, Form, notification, List, Tooltip } from "antd";
import { genericUrl } from "../../constants/serverConfig";
import { DownloadOutlined } from "@ant-design/icons";
import { useGlobalContext } from "../../lib/storage";
import { getFilesData, getPrintDownloadData } from "../../services/generic";
import Attachment from "../../assets/images/attachment.svg";
import http from "../recordWindow/http-common.js";

const FileAttachment = (props) => {
  const { globalStore } = useGlobalContext();
  const Themes = globalStore.userData.CW360_V2_UI;

  const { headerTabId } = props;
  const { recordId } = useParams();
  const { windowId } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [fileInfos, setFileInfos] = useState([]);

  const [form] = Form.useForm();

  const fileAttachment = async () => {
    const getFiles = await getFilesData(windowId, headerTabId, recordId);

    let fileData = JSON.parse(getFiles.data.data.getFileList);
    let fileDataArray = fileData.FileList;
    for (let i = 0; i < fileDataArray.length; i++) {
      fileDataArray[i]["AscOrder"] = i;
    }

    const sortFileDataArray = fileDataArray.sort(function (a, b) {
      return b.AscOrder - a.AscOrder;
    });

    setFileInfos(sortFileDataArray);

    setIsModalVisible(true);
  };

  const selectFile = async (event) => {
    let currentFile = event.target.files[0];
    const reduxToken = JSON.parse(localStorage.getItem("authTokens"));
    let formData = new FormData();
    formData.append("operations", '{"query": "mutation {upsertFile}","variables":{}}'); //append the values with key, value pair
    formData.append("file", currentFile);
    formData.append("data", '{"windowId":' + `"${windowId}"` + ',"tabId":' + `"${headerTabId}"` + ',"recordId":' + `"${recordId}"` + "}"); // eslint-disable-line
    return http
      .post(genericUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `bearer ${reduxToken.access_token}`,
        },
      })
      .then((response) => {
        if (response.status.toString() === "200") {
          fileAttachment();
          notification.success({
            message: "File Uploaded...!!",
          });
          document.getElementById("choosefile").value = "";
        } else {
          notification.info({
            message: "Please try again later..!!",
          });
        }
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const downloadFile = async (fileName, path) => {
    const downloadPrintData = await getPrintDownloadData(path + `${fileName}`);
    const fileURL = window.URL.createObjectURL(new Blob([downloadPrintData.data]));
    const link = document.createElement("a");
    link.setAttribute("id", "downloadlink");
    link.href = fileURL;
    link.setAttribute("download", `${path + `${fileName}`}`);
    link.click();
  };

  return (
    <span>
      <Tooltip placement="bottom" title="Attachment">
        <Button style={Themes.contentWindow.ListWindowHeader.headerActionButtons} onClick={fileAttachment}>
          <img style={{ paddingBottom: "3px", paddingRight: "1px", width: "20px" }} src={Attachment} alt="invoice" />{" "}
        </Button>
      </Tooltip>
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        // width="87%"
        // height="94%"
        centered
        title="Add Attachment"
        bodyStyle={{ padding: "0px" }}
        footer={[]}
      >
        <Card style={{ padding: "15px" }}>
          <div>
            <label>
              <input style={{ width: "74%" }} id="choosefile" type="file" onChange={selectFile} />
            </label>
          </div>
          <br />
          <div style={{ backgroundColor: "white", position: "relative", top: "7px", maxHeight: "55vh", overflowY: "auto", overflowX: "hidden" }}>
            <List
              size="small"
              header={
                <div>
                  <span style={{ fontWeight: 700, margin: "0px 0px 0px 50px" }}>List of Files</span>
                </div>
              }
              bordered
              dataSource={fileInfos}
              renderItem={(file) => (
                <List.Item>
                  {file.fileName}{" "}
                  <span style={{ float: "right" }}>
                    <DownloadOutlined onClick={() => downloadFile(file.fileName, file.path)} style={{ fontSize: "17px", cursor: "pointer", color: "rgb(22, 72, 170)" }} />
                  </span>
                </List.Item>
              )}
            />
          </div>
        </Card>
      </Modal>
    </span>
  );
};

export default FileAttachment;
