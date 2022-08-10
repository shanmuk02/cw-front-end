import React, { useState } from "react";
import { useParams } from "react-router";
import { Button, Modal, Card, Col, Form, Input, Divider, Row, Result, Tooltip } from "antd";
import { fileDownloadUrl } from "../../constants//serverConfig";
import { getEmailData, getPrintTemplate, sendEmailFun } from "../../services/generic";
import { Document, Page, pdfjs } from "react-pdf";
import { useGlobalContext } from "../../lib/storage";
import Envelop from "../../assets/images/envelop.svg";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

const EmailTemplate = (props) => {
  const { globalStore } = useGlobalContext();
  const Themes = globalStore.userData.CW360_V2_UI;
  const { headerTabId } = props;
  const { recordId } = useParams();
  const { windowId } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMailSuccessModal, setIsMailSuccessModal] = useState(false);
  const [emailBody, setEmailBody] = useState("");
  const [emailCc, setEmailCc] = useState("");
  const [emailFrom, setEmailFrom] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [emailReplyTo, setEmailReplyTo] = useState("");
  const [emailAttachment, setEmailAttachment] = useState("");
  //const [emailSuccessFailedTitle, setEmailSuccessFailedTitle] = useState('');
  const [emailSuccessFailedMessage, setEmailSuccessFailedMessage] = useState("");
  const [emailSuccessFailedStatus, setEmailSuccessFailedStatus] = useState("");

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const [form] = Form.useForm();

  let urlForEmailPdf = `${fileDownloadUrl}`.concat(`${emailAttachment}`);

  const printTemplate = async () => {
    form.resetFields();

    try {
      const emailData = await getEmailData(windowId, recordId);

      const getEmailTemplateValues = JSON.parse(emailData.data.data.getEmailData);
      const getPdfName = await getPrintTemplate(headerTabId, recordId);
      let pdfName = getPdfName.data.data.reportTemplate;

      setEmailBody(getEmailTemplateValues["body"]);
      setEmailCc(getEmailTemplateValues["cc"]);
      setEmailFrom(getEmailTemplateValues["fromEmail"]);
      setEmailSubject(getEmailTemplateValues["subject"]);
      setEmailTo(getEmailTemplateValues["toEmail"]);
      setEmailReplyTo(getEmailTemplateValues["replyTo"]);
      setEmailAttachment(pdfName);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const successNotification = (title, message) => {
    //setEmailSuccessFailedTitle(title)
    setEmailSuccessFailedMessage(message);
    setIsMailSuccessModal(true);
  };

  const handleOk = () => {
    form.submit();
    // setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCancelForEmail = () => {
    setIsMailSuccessModal(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      const sendEmail = await sendEmailFun(values);

      const messageCode = sendEmail.data.data.sendEmail.messageCode;
      const Title = sendEmail.data.data.sendEmail.title;
      const Message = sendEmail.data.data.sendEmail.message;

      if (messageCode === 200) {
        setEmailSuccessFailedStatus("success");
        successNotification(Title, Message);
        setIsModalVisible(false);
      } else {
        setEmailSuccessFailedStatus("error");
        successNotification(Title, Message);
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <span>
      <Tooltip placement="bottom" title="Envelop">
        <Button style={Themes.contentWindow.ListWindowHeader.headerActionButtons} onClick={printTemplate}>
          <img style={{ paddingBottom: "3px", paddingRight: "2px", width: "20px" }} src={Envelop} alt="invoice" />{" "}
        </Button>
      </Tooltip>
      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width="87%"
        height="94%"
        centered
        title="Notify by Email"
        bodyStyle={{ padding: "0px" }}
        footer={[
          <div>
            <Button
              key="back"
              onClick={handleCancel}
              style={{
                border: "none",
                boxShadow: "rgb(0 0 0 / 2%) 0px 0px 0px",
                fontWeight: "600",
                fontSize: "14px",
                color: "rgb(93, 84, 84)",
              }}
              // className={`${styles.buttonStylesforlistProductCancel}`}
            >
              Cancel
            </Button>
            <Button
              // className={`${styles.buttonStylesforlistProduct}`}
              onClick={handleOk}
              htmlType="submit"
              style={Themes.contentWindow.recordWindow.linesTab.popUpNewButton}
            >
              <span>Send</span>
            </Button>
          </div>,
        ]}
      >
        <Form layout="vertical" name="control-hooks" style={{ padding: "15px" }} form={form} onFinish={onFinish}>
          <Row>
            <Col style={{ padding: "10px" }} span={12}>
              <Row style={{ paddingBottom: "16px" }}>
                <Col style={{ paddingRight: "8px" }} span={12}>
                  <Form.Item label="From" name="from" initialValue={emailFrom}>
                    <Input style={{ fontWeight: 600 }} disabled />
                  </Form.Item>
                </Col>

                <Col style={{ paddingLeft: "8px" }} span={12}>
                  <Form.Item label="Reply To" name="replyTo" initialValue={emailReplyTo}>
                    <Input style={{ fontWeight: 600 }} disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ paddingBottom: "16px" }}>
                <Col style={{ paddingRight: "8px" }} span={12}>
                  <Form.Item
                    label="To"
                    name="to"
                    rules={[
                      {
                        type: "email",
                        message: "The input is not valid E-mail!",
                      },
                      {
                        required: true,
                        message: "Please input your E-mail!",
                      },
                    ]}
                    initialValue={emailTo}
                  >
                    <Input style={{ fontWeight: 600 }} />
                  </Form.Item>
                </Col>
                <Col style={{ paddingLeft: "8px" }} span={12}>
                  <Form.Item label="Cc" name="cc" initialValue={emailCc}>
                    <Input style={{ fontWeight: 600 }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ paddingBottom: "16px" }}>
                <Col span={24}>
                  <Form.Item label="Subject" name="subject" initialValue={emailSubject}>
                    <Input style={{ fontWeight: 600 }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row style={{ paddingBottom: "16px" }}>
                <Col span={24}>
                  <Form.Item name="body" label="Body" initialValue={emailBody}>
                    <ReactQuill
                      theme="snow"
                      modules={{
                        toolbar: [
                          [{ font: [false, "serif", "monospace"] }, { header: [1, 2, 3, 4, 5, 6, false] }],
                          ["bold", "italic", "underline", "strike", "blockquote"],
                          [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                          [{ align: [] }],
                          ["code", "background"],
                          ["code-block", "direction"],
                          ["link", "image", "video"],
                          ["clean"],
                        ],
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <Form.Item label="Attachment" name="attachment" initialValue={emailAttachment}>
                    <Input style={{ fontWeight: 600 }} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col style={{ padding: "10px" }} span={12}>
              <div style={{ position: "relative", top: "7px", maxHeight: "76vh", overflowY: "auto", overflowX: "hidden" }}>
                <strong>Preview</strong>
                <Card bodyStyle={{ padding: "5px" }} style={{ pointerEvents: "none" }} /* className={styles.emailPreviewPdfScrollBar} */>
                  <Form layout="inline" form={form} onFinish={onFinish}>
                    <span style={{ color: "slategray" }}>From:</span>
                    <Form.Item name="from">{<Input style={{ width: "23rem", border: "none", position: "relative", top: "-5px", fontWeight: 500, color: "black" }} />}</Form.Item>
                  </Form>
                  <Form layout="inline" form={form} onFinish={onFinish} style={{ top: "-10px", position: "relative" }}>
                    <span style={{ color: "slategray" }}>Reply To</span>
                    <Form.Item name="replyTo">{<Input style={{ width: "23rem", border: "none", position: "relative", top: "-5px", fontWeight: 500, color: "black" }} />}</Form.Item>
                  </Form>
                  <Form layout="inline" form={form} onFinish={onFinish} style={{ top: "-20px", position: "relative" }}>
                    <span style={{ color: "slategray" }}>To</span>
                    <Form.Item name="to">{<Input style={{ width: "23rem", border: "none", position: "relative", top: "-5px", fontWeight: 500, color: "black" }} />}</Form.Item>
                  </Form>
                  <Form layout="inline" form={form} onFinish={onFinish} style={{ top: "-30px", position: "relative" }}>
                    <span style={{ color: "slategray" }}>Cc</span>
                    <Form.Item name="cc">{<Input style={{ width: "23rem", border: "none", position: "relative", top: "-5px", fontWeight: 500, color: "black" }} />}</Form.Item>
                  </Form>

                  <div style={{ position: "relative", top: "-44px" }}>
                    <Divider />
                    <span>
                      <Form.Item name="subject" style={{ marginBottom: "0px" }}>
                        <Input style={{ width: "23rem", border: "none", position: "relative", top: "-5px", fontWeight: 500, color: "black" }} />
                      </Form.Item>
                    </span>

                    <Col span={24}>
                      <Form.Item name="body">
                        <ReactQuill theme="bubble" />
                      </Form.Item>
                    </Col>
                    <Card bodyStyle={{ padding: "0px", width: "100px" }}>
                      <div>
                        <Document file={urlForEmailPdf} width="100">
                          <Page pageNumber={1} />
                        </Document>
                        <p>
                          Page {1} of {2}
                        </p>
                      </div>
                    </Card>
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal width="36%" bodyStyle={{ height: "35%" }} style={{ top: "13rem" }} visible={isMailSuccessModal} footer={[]} /*  onOk={handleOk} */ onCancel={handleCancelForEmail}>
        <Result
          status={emailSuccessFailedStatus}
          title={emailSuccessFailedStatus === "success" ? emailSuccessFailedMessage : ""}
          subTitle={emailSuccessFailedStatus === "error" ? emailSuccessFailedMessage : ""}
        />
      </Modal>
    </span>
  );
};

export default EmailTemplate;
