import React, { useState, useEffect } from "react";
import { Card, Tabs, Row, Col, Form, Select, Checkbox, Button, message, Spin,Input,Space } from "antd";
import { LoadingOutlined ,MinusCircleOutlined, PlusOutlined,PlusCircleOutlined } from "@ant-design/icons";
import { useGlobalContext } from "../../../lib/storage";
import Axios from "axios";
import StockAdjustment from './stockadjustment'
import { serverUrl } from "../../../constants/serverConfig";
import "antd/dist/antd.css";
import "../../../styles/antd.css";
import { convertLegacyProps } from "antd/lib/button/button";

const { TabPane } = Tabs;
const { Option } = Select;

const ApplicationSetup = () => {
  const { globalStore } = useGlobalContext();
  const Themes = globalStore.userData.CW360_V2_UI;

  const [checkedValuePurchasePrintPdf, setCheckedValuePurchasePrintPdf] = useState(1);
  const [checkedValueCreateGRN, setCheckedValueCreateGRN] = useState(1);
  const [checkedValuePurchaseCreateInvoice, setCheckedValuePurchaseCreateInvoice] = useState(1);
  const [checkedValuePurchaseSendEmail, setCheckedValuePurchaseSendEmail] = useState(1);
  const [checkedValuePurchaseShowSummary, setCheckedValuePurchaseShowSummary] = useState(1);
  const [checkedValuePurchaseChangePrice, setCheckedValuePurchaseChangePrice] = useState(1);
  const [checkedValuePurchaseImport, setCheckedValuePurchaseImport] = useState(1);
  const [checkedValuePurchaseDownloadTemplate, setCheckedValuePurchaseDownloadTemplate] = useState(1);

  const [checkedValuePurchaseUPC, setCheckedValuePurchaseUPC] = useState(1); 
  const [checkedValuePurchaseSKU, setCheckedValuePurchaseSKU] = useState(1);
  const [checkedValuePurchaseDiscount,setCheckedValuePurchaseDiscount] = useState(1)
  const [checkedValuePurchaseDiscountType,setCheckedValuePurchaseDiscountType] = useState(1)

  const [checkedValueEnableWithoutPO, setCheckedValueEnableWithoutPO] = useState(1);
  const [checkedValueGRPrintPdf, setCheckedValueGRPrintPdf] = useState(1);
  const [checkedValueGRCreateInvoice, setCheckedValueGRCreateInvoice] = useState(1);
  const [checkedValueGRSendEmail, setCheckedValueGRSendEmail] = useState(1);
  const [checkedValueGRShowSummary, setCheckedValueGRShowSummary] = useState(1);

  const [checkedValueGRChangePrice, setCheckedValueGRChangePrice] = useState(1);
  const [checkedValueGRImport, setCheckedValueGRImport] = useState(1);
  const [checkedValueGRDownloadTemplate, setCheckedValueGRDownloadTemplate] = useState(1);

  const [checkedValueGRFreeQty, setCheckedValueGRFreeQty] = useState(1)
  const [checkedValueGRMRP, setCheckedValueGRMRP] = useState(1)
  const [checkedValueGRSalePrice, setCheckedValueGRSalePrice] = useState(1)
  
  const [checkedValueGRBasePrice, setCheckedValueGRBasePrice] = useState(1)
  const [checkedValueGRActualPriceMRP, setCheckedValueGRActualPriceMRP] = useState(1)
  const [checkedValueGRUnitPrice, setCheckedValueGRUnitPrice] = useState(1)
  
  const [checkedValueGRNetUnitPrice, setCheckedValueGRNetUnitPrice] = useState(1)
  const [checkedValueGRMargin, setCheckedValueGRMargin] = useState(1)
  const [checkedValueGROldMargin, setCheckedValueGROldMargin] = useState(1) 

  const [checkedValueGRNetAmount, setCheckedValueGRNetAmount] = useState(1)
  const [checkedValueGRGrossAmount, setCheckedValueGRGrossAmount] = useState(1)
  const [checkedValueGRTotalDiscount, setCheckedValueGRTotalDiscount] = useState(1)

  const [checkedValueGRDiscountValue, seCheckedValueGRDiscountValue] = useState(1);
  const [checkedValueGRDiscountType, setCheckedValueGRDiscountType] = useState(1);
  const [checkedValueGRDUPC, setCheckedValueGRDUPC] = useState(1);  

  const [checkedValueGRNSKU, setCheckedValueGRNSKU] = useState(1);
  const [checkedSplitBatch,setCheckedSplitBatch] = useState(1)

  const [checkedValueSACost, setCheckedValueSACost] = useState(1)
  const [checkedValueSAQtyOnHand, setCheckedValueSAQtyOnHand] = useState(1)
  const [checkedValueSADownloadTemplate, setCheckedValueSADownloadTemplate] = useState(1)

  const [checkedValueSAImport, setCheckedValueSAImport] = useState(1)
  const [checkedValueSABatchNo, setCheckedValueSABatchNo] = useState(1)
  const [checkedValueSAMfgDate, setCheckedValueSAMfgDate] = useState(1)

  const [checkedValueSAExpiryDate, setCheckedValueSAExpiryDate] = useState(1)
  const [checkedValueSABatch, setCheckedValueSABatch] = useState(1);
  const [checkedValueSAUPC, setCheckedValueSAUPC] = useState(1); 
  const [checkedValueSASKU, setCheckedValueSASKU] = useState(1);

  const [checkedValueSTIQtyOnHand, setCheckedValueSTIQtyOnHand] = useState(1)
  const [checkedValueSTIBatchNo, setCheckedValueSTIBatchNo] = useState(1)
  const [checkedValueSTIMfgDate, setCheckedValueSTIMfgDate] = useState(1)

  const [checkedValueSTIExpiryDate, setCheckedValueSTIExpiryDate] = useState(1)
  const [checkedValueSTIDownloadTemplate, setCheckedValueSTIDownloadTemplate] = useState(1)
  const [checkedValueSTIImport, setCheckedValueSTIImport] = useState(1) 

  const [checkedValueSTIBatch, setCheckedValueSTIBatch] = useState(1);
  const [checkedValueSTIUPC, setCheckedValueSTIUPC] = useState(1);
  const [checkedValueSTISKU, setCheckedValueSTISKU] = useState(1); 

  const [checkedValueSTRBatchNo, setCheckedValueSTRBatchNo] = useState(1);
  const [checkedValueSTRMfgDate, setCheckedValueSTRMfgDate] = useState(1);
  const [checkedValueSTRExpiryDate, setCheckedValueSTRExpiryDate] = useState(1); 

  const [checkedValueSTRUPC, setCheckedValueSTRUPC] = useState(1);
  const [checkedValueSTRSKU, setCheckedValueSTRSKU] = useState(1); 

 const  [checkedValuePRUPC, setCheckedValuePRUPC] = useState(1);
 const  [checkedValuePRSKU, setCheckedValuePRSKU] = useState(1);
 const  [checkedValuePRImport, setCheckedValuePRImport] = useState(1); 

 const  [checkedValuePRDownloadTemplate, setCheckedValuePRDownloadTemplate] = useState(1);
 const  [checkedValuePRCategory, setCheckedValuePRCategory] = useState(1);
 const  [checkedValuePRSummary, setCheckedValuePRSummary] = useState(1); 

 const  [checkedValuePRBatchNo, setCheckedValuePRBatchNo] = useState(1);
 const  [checkedValuePRMfgDate, setCheckedValuePRMfgDate] = useState(1); 
 const  [checkedValuePRExpiryDate, setCheckedValuePRExpiryDate] = useState(1);

  const [dynamicValues,setDynamicValues]=useState();

  const [stockAdjustmentValues,setStockAdjustmentValues]=useState({})

  const [loading, setLoading] = useState(false);

  const [mainForm] = Form.useForm();

  useEffect(() => {
      getAppSetupData();
  }, []);

  const getAppSetupData = async () => {
    try {
      setLoading(true);
      const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const getAppSetupMutation = {
        query: `query{
          getAppSetup(application:"PO")
          {
              appSetupId
              application
              configJson
          }
        }`,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken.access_token}`,
      };

      const serverResponse = await Axios.post(serverUrl, getAppSetupMutation, { headers: headers }, { async: true }, { crossDomain: true });
      const appSetupResponse = serverResponse.data.data.getAppSetup;     
      // const appSetupData = JSON.parse(appSetupResponse.data);
      if (appSetupResponse.length > 0) {
        const appSetupRecord = appSetupResponse[0];
        const { configJson } = appSetupRecord;
        const poParsedConfigJSON = JSON.parse(configJson);
        const { basePriceCalc, createGRN, createInvoice, printPDF, sendEmail, showSummary,changePrice,importPO,downloadTemplate,upc,sku,dyanamicFileds,discounttype,discountvalue} = poParsedConfigJSON;
       if(dyanamicFileds!==undefined){ 
        if(dyanamicFileds.length>0){
          let arraobjdynamic=[]
          for (let index = 0; index < dyanamicFileds.length; index++) {
            let obj={label:dyanamicFileds[index].label,type:dyanamicFileds[index].type,defaultValue:dyanamicFileds[index].defaultValue};  
            arraobjdynamic.push(obj)
          }
          mainForm.setFieldsValue({dyanamicFileds:arraobjdynamic})
        }
      }
     
        mainForm.setFieldsValue({ basePriceCalculation: basePriceCalc});
        if (createGRN === "Y") {
          setCheckedValueCreateGRN(1);
        } else {
          setCheckedValueCreateGRN(0);
        }
        if (createInvoice === "Y") {
          setCheckedValuePurchaseCreateInvoice(1);
        } else {
          setCheckedValuePurchaseCreateInvoice(0);
        }

        if (printPDF === "Y") {
          setCheckedValuePurchasePrintPdf(1);
        } else {
          setCheckedValuePurchasePrintPdf(0);
        }

        if (sendEmail === "Y") {
          setCheckedValuePurchaseSendEmail(1);
        } else {
          setCheckedValuePurchaseSendEmail(0);
        }

        if (showSummary === "Y") {
          setCheckedValuePurchaseShowSummary(1);
        } else {
          setCheckedValuePurchaseShowSummary(0);
        }

        if (changePrice === "Y") {
          setCheckedValuePurchaseChangePrice(1);
        } else {
          setCheckedValuePurchaseChangePrice(0);
        }

        if (importPO === "Y") {
          setCheckedValuePurchaseImport(1);
        } else {
          setCheckedValuePurchaseImport(0);
        }

        if (downloadTemplate === "Y") {
          setCheckedValuePurchaseDownloadTemplate(1);
        } else {
          setCheckedValuePurchaseDownloadTemplate(0);
        }
        
        if (upc === "Y") {
          setCheckedValuePurchaseUPC(1);
        } else {
          setCheckedValuePurchaseUPC(0);
        }
        if(discountvalue === "Y"){
          setCheckedValuePurchaseDiscount(1)
        }else{
          setCheckedValuePurchaseDiscount(0)
        }

        if(discounttype === "Y"){
          setCheckedValuePurchaseDiscountType(1)
        }else{
          setCheckedValuePurchaseDiscountType(0)
        }

        if (sku === "Y") {
          setCheckedValuePurchaseSKU(1);
        } else {
          setCheckedValuePurchaseSKU(0);
        }
        setLoading(false);
      } else {
        message.error("No Data Available");
        setLoading(false);
      }
    } catch (error) {
      const { message } = JSON.parse(JSON.stringify(error));
      if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
        localStorage.clear();
        window.location.replace("/login");
      } else {
        return Promise.reject(error);
      }
    }
  };

  const callBackTabs = async (value) => {
    try {
      setLoading(true);
      const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const getAppSetupMutation = {
        query: `query{
          getAppSetup(application:"${value}")
          {
              appSetupId
              application
              configJson
          }
        }`,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${newToken.access_token}`,
      };

      const serverResponse = await Axios.post(serverUrl, getAppSetupMutation, { headers: headers }, { async: true }, { crossDomain: true });
      console.log()
      const appSetupResponse = serverResponse.data.data.getAppSetup;
      
      if (appSetupResponse.length > 0) {
        // const appSetupData = JSON.parse(appSetupResponse.data);
        const appSetupRecord = appSetupResponse[0];
        const { application, configJson } = appSetupRecord;
      
        if (application === "PO") {
          const poParsedConfigJSON = JSON.parse(configJson);
          
          const { basePriceCalc, createGRN, createInvoice, printPDF, sendEmail, showSummary, changePrice , importPO , downloadTemplate,upc,sku,dyanamicFileds,discountvalue,discounttype} = poParsedConfigJSON;
        
          if(dyanamicFileds!==undefined){
          if(dyanamicFileds.length>0){
            let arraobjdynamic=[]
            for (let index = 0; index < dyanamicFileds.length; index++) {
                let obj={label:dyanamicFileds[index].label,type:dyanamicFileds[index].type,defaultValue:dyanamicFileds[index].defaultValue};  
              arraobjdynamic.push(obj)
            }
            mainForm.setFieldsValue({dyanamicFileds:arraobjdynamic})
          }
        }
        
         
          mainForm.setFieldsValue({ basePriceCalculation: basePriceCalc});
          if (createGRN === "Y") {
            setCheckedValueCreateGRN(1);
          } else {
            setCheckedValueCreateGRN(0);
          }

          if (createInvoice === "Y") {
            setCheckedValuePurchaseCreateInvoice(1);
          } else {
            setCheckedValuePurchaseCreateInvoice(0);
          }

          if (printPDF === "Y") {
            setCheckedValuePurchasePrintPdf(1);
          } else {
            setCheckedValuePurchasePrintPdf(0);
          }

          if (sendEmail === "Y") {
            setCheckedValuePurchaseSendEmail(1);
          } else {
            setCheckedValuePurchaseSendEmail(0);
          }

          if (showSummary === "Y") {
            setCheckedValuePurchaseShowSummary(1);
          } else {
            setCheckedValuePurchaseShowSummary(0);
          }

          if (changePrice === "Y") {
            setCheckedValuePurchaseChangePrice(1);
          } else {
            setCheckedValuePurchaseChangePrice(0);
          }

          if (importPO === "Y") {
            setCheckedValuePurchaseImport(1);
          } else {
            setCheckedValuePurchaseImport(0);
          }

          if (downloadTemplate === "Y") {
            setCheckedValuePurchaseDownloadTemplate(1);
          } else {
            setCheckedValuePurchaseDownloadTemplate(0);
          }
          
          if (upc === "Y") {
            setCheckedValuePurchaseUPC(1);
          } else {
            setCheckedValuePurchaseUPC(0);
          }

          if(discountvalue === "Y"){
            setCheckedValuePurchaseDiscount(1)
          }else{
            setCheckedValuePurchaseDiscount(0)
          }

          if(discounttype === "Y"){
            setCheckedValuePurchaseDiscountType(1)
          }else{
            setCheckedValuePurchaseDiscountType(0)
          }

          if (sku === "Y") {
            setCheckedValuePurchaseSKU(1);
          } else {
            setCheckedValuePurchaseSKU(0);
          }


        }
        if (application === "GRN") {
          const grnparsedConfigJSON = JSON.parse(configJson); 
        
          const { enableWithoutPO, createInvoice, printPDF, sendEmail, showSummary,basePriceCalc,changePrice,importGRN,downloadTemplate,freeQty,MRP,salePrice,basePrice,actualPriceGreaterMrp,unitPrice,netunitPrice,margin,oldmargin,netamount,grossamount,totaldiscount,discountvalue,discounttype,upc,sku,dynamicFiledsGRN,splitBatch} = grnparsedConfigJSON;
           
          if(dynamicFiledsGRN!==undefined){ 
          if(dynamicFiledsGRN.length>0){
            let arrDynamic=[]
               for (let index = 0; index < dynamicFiledsGRN.length; index++) {
                 let element = {label:dynamicFiledsGRN[index].label,type:dynamicFiledsGRN[index].type,defaultValue:dynamicFiledsGRN[index].defaultValue};
                arrDynamic.push(element) 
               }
               mainForm.setFieldsValue({dynamicFiledsGRN:arrDynamic})
          }
        }
      
          mainForm.setFieldsValue({ basePriceCalculationGRN: basePriceCalc });
          if (enableWithoutPO === "Y") {
            setCheckedValueEnableWithoutPO(1);
          } else {
            setCheckedValueEnableWithoutPO(0);
          }

          if (createInvoice === "Y") {
            setCheckedValueGRCreateInvoice(1);
          } else {
            setCheckedValueGRCreateInvoice(0);
          }

          if (printPDF === "Y") {
            setCheckedValueGRPrintPdf(1);
          } else {
            setCheckedValueGRPrintPdf(0);
          }

          if (sendEmail === "Y") {
            setCheckedValueGRSendEmail(1);
          } else {
            setCheckedValueGRSendEmail(0);
          }

          if (showSummary === "Y") {
            setCheckedValueGRShowSummary(1);
          } else {
            setCheckedValueGRShowSummary(0);
          }

          if (changePrice === "Y") {
            setCheckedValueGRChangePrice(1);
          } else {
            setCheckedValueGRChangePrice(0);
          }

          if (importGRN === "Y") {
            setCheckedValueGRImport(1);
          } else {
            setCheckedValueGRImport(0);
          }

          if (downloadTemplate === "Y") {
            setCheckedValueGRDownloadTemplate(1);
          } else {
            setCheckedValueGRDownloadTemplate(0);
          }

          if (freeQty === "Y") {
            setCheckedValueGRFreeQty(1);
          } else {
            setCheckedValueGRFreeQty(0);
          }

          if (MRP === "Y") {
            setCheckedValueGRMRP(1);
          } else {
            setCheckedValueGRMRP(0);
          }

          if (salePrice === "Y") {
            setCheckedValueGRSalePrice(1);
          } else {
            setCheckedValueGRSalePrice(0);
          }

          if (basePrice === "Y") {
            setCheckedValueGRBasePrice(1);
          } else {
            setCheckedValueGRBasePrice(0);
          }

          if (actualPriceGreaterMrp === "Y") {
            setCheckedValueGRActualPriceMRP(1);
          } else {
            setCheckedValueGRActualPriceMRP(0);
          }

          if (unitPrice === "Y") {
               setCheckedValueGRUnitPrice(1)
          } else {
              setCheckedValueGRUnitPrice(0);
           }
            
           if (netunitPrice === "Y") {
            setCheckedValueGRNetUnitPrice(1)
          } else {
            setCheckedValueGRNetUnitPrice(0);
          }

          if (margin === "Y") {
            setCheckedValueGRMargin(1)
          } else {
            setCheckedValueGRMargin(0);
          }

          if (oldmargin === "Y") {
            setCheckedValueGROldMargin(1)
          } else {
            setCheckedValueGROldMargin(0);
          }

          if (netamount === "Y") {
            setCheckedValueGRNetAmount(1)
          } else {
            setCheckedValueGRNetAmount(0);
          }

          if (grossamount === "Y") {
            setCheckedValueGRGrossAmount(1)
          } else {
            setCheckedValueGRGrossAmount(0);
          }

          if (totaldiscount === "Y") {
            setCheckedValueGRTotalDiscount(1)
          } else {
            setCheckedValueGRTotalDiscount(0);
          }

          if (discountvalue === "Y") {
            seCheckedValueGRDiscountValue(1)
          } else {
            seCheckedValueGRDiscountValue(0);
          }

          if (discounttype=== "Y") {
            setCheckedValueGRDiscountType(1)
          } else {
            setCheckedValueGRDiscountType(0);
          }

          if (upc=== "Y") {
            setCheckedValueGRDUPC(1)
          } else {
            setCheckedValueGRDUPC(0);
          }

          if (sku=== "Y") {
            setCheckedValueGRNSKU(1)
          } else {
            setCheckedValueGRNSKU(0);
          }
          if(splitBatch === "Y"){
            setCheckedSplitBatch(1)
          }else{
            setCheckedSplitBatch(0)
          }

        }
        if (application === "Stock Adjustment") {
          const stockAdjustmentParsedConfigJSON = JSON.parse(configJson); 
          
          setStockAdjustmentValues(stockAdjustmentParsedConfigJSON)
          // const { showSummary,importSA,downloadTemplate,upcSearch,skuSearch,fullCount,cyclicCount,openingBalance} = stockAdjustmentParsedConfigJSON;
          const {cost,qtyonhand,downloadtemplate,Import,batchno,mfgdate,expirydate,batch,upc,sku } = stockAdjustmentParsedConfigJSON; 

          if (cost === "Y") {
            setCheckedValueSACost(1);
          } else {
            setCheckedValueSACost(0);
          }

          if (qtyonhand === "Y") {
            setCheckedValueSAQtyOnHand(1);
          } else {
            setCheckedValueSAQtyOnHand(0);
          }

          if (downloadtemplate === "Y") {
            setCheckedValueSADownloadTemplate(1);
          } else {
            setCheckedValueSADownloadTemplate(0);
          }

          if (Import === "Y") {
            setCheckedValueSAImport(1);
          } else {
            setCheckedValueSAImport(0);
          }

          if (batchno === "Y") {
            setCheckedValueSABatchNo(1);
          } else {
            setCheckedValueSABatchNo(0);
          }
         
          if (mfgdate === "Y") {
            setCheckedValueSAMfgDate(1);
          } else {
            setCheckedValueSAMfgDate(0);
          }

          if (expirydate === "Y") {
            setCheckedValueSAExpiryDate(1);
          } else {
            setCheckedValueSAExpiryDate(0);
          }

          if (batch === "Y") {
            setCheckedValueSABatch(1);
          } else {
            setCheckedValueSABatch(0);
          }

          if (upc === "Y") {
            setCheckedValueSAUPC(1);
          } else {
            setCheckedValueSAUPC(0);
          }

          if (sku === "Y") {
            setCheckedValueSASKU(1);
          } else {
            setCheckedValueSASKU(0);
          }

        }
        if(application ==="Stock Transfer Issue"){
          const stockTransferParsedConfigJSON = JSON.parse(configJson); 
          
          setStockAdjustmentValues(stockTransferParsedConfigJSON)
                    // const { showSummary,importSA,downloadTemplate,upcSearch,skuSearch,fullCount,cyclicCount,openingBalance} = stockAdjustmentParsedConfigJSON;
          const {qtyonhand,batchno,mfgdate,expirydate,downloadtemplate,Import,batch,upc,sku} = stockTransferParsedConfigJSON; 

          if (qtyonhand === "Y") {
            setCheckedValueSTIQtyOnHand(1);
          } else {
            setCheckedValueSTIQtyOnHand(0);
          }

          if (batchno === "Y") {
            setCheckedValueSTIBatchNo(1);
          } else {
            setCheckedValueSTIBatchNo(0);
          }

          if (mfgdate === "Y") {
            setCheckedValueSTIMfgDate(1);
          } else {
            setCheckedValueSTIMfgDate(0);
          }

          if (expirydate === "Y") {
            setCheckedValueSTIExpiryDate(1);
          } else {
            setCheckedValueSTIExpiryDate(0);
          }

          if (downloadtemplate=== "Y") {
            setCheckedValueSTIDownloadTemplate(1);
          } else {
            setCheckedValueSTIDownloadTemplate(0);
          }

          if (Import === "Y") {
            setCheckedValueSTIImport(1);
          } else {
            setCheckedValueSTIImport(0);
          }

          if (batch === "Y") {
            setCheckedValueSTIBatch(1);
          } else {
            setCheckedValueSTIBatch(0);
          } 
            
          if (upc === "Y") {
            setCheckedValueSTIUPC(1);
          } else {
            setCheckedValueSTIUPC(0);
          } 

          if (sku === "Y") {
            setCheckedValueSTISKU(1);
          } else {
            setCheckedValueSTISKU(0);
          } 

        }

        if(application ==="Stock Transfer Receipt"){
          const stockTransferReciptParsedConfigJSON = JSON.parse(configJson); 
         
          setStockAdjustmentValues(stockTransferReciptParsedConfigJSON )
                    // const { showSummary,importSA,downloadTemplate,upcSearch,skuSearch,fullCount,cyclicCount,openingBalance} = stockAdjustmentParsedConfigJSON;
          const {batchno,mfgdate,expirydate,upc,sku} = stockTransferReciptParsedConfigJSON ; 
          if (batchno === "Y") {
            setCheckedValueSTRBatchNo(1);
          } else {
            setCheckedValueSTRBatchNo(0);
          } 

          if (mfgdate === "Y") {
            setCheckedValueSTRMfgDate(1);
          } else {
            setCheckedValueSTRMfgDate(0);
          }

          if (expirydate === "Y") {
            setCheckedValueSTRExpiryDate(1);
          } else {
            setCheckedValueSTRExpiryDate(0);
          }

          if ( upc === "Y") {
            setCheckedValueSTRUPC(1);
          } else {
            setCheckedValueSTRUPC(0);
          }


          if ( sku === "Y") {
            setCheckedValueSTRSKU(1);
          } else {
            setCheckedValueSTRSKU(0);
          }
        
        } 

        if(application ==="PR"){
          const purchaseReturnParsedConfigJSON = JSON.parse(configJson); 
        
           const {upc,sku,Import,downloadtemplate,category,summary,batchno,mfgdate,expirydate} = purchaseReturnParsedConfigJSON ; 
          if (upc === "Y") {
            setCheckedValuePRUPC(1);
          } else {
            setCheckedValuePRUPC(0);
          } 
          if (sku === "Y") {
            setCheckedValuePRSKU(1);
          } else {
            setCheckedValuePRSKU(0);
          } 
          if (Import === "Y") {
            setCheckedValuePRImport(1);
          } else {
            setCheckedValuePRImport(0);
          } 
          if (downloadtemplate === "Y") {
            setCheckedValuePRDownloadTemplate(1);
          } else {
            setCheckedValuePRDownloadTemplate(0);
          } 
          if (category === "Y") {
            setCheckedValuePRCategory(1);
          } else {
            setCheckedValuePRCategory(0);
          } 
          if (summary === "Y") {
            setCheckedValuePRSummary(1);
          } else {
            setCheckedValuePRSummary(0);
          } 
          if (batchno === "Y") {
            setCheckedValuePRBatchNo(1);
          } else {
            setCheckedValuePRBatchNo(0);
          } 
          if (mfgdate === "Y") {
            setCheckedValuePRMfgDate(1);
          } else {
            setCheckedValuePRMfgDate(0);
          } 
          if (expirydate === "Y") {
            setCheckedValuePRExpiryDate(1);
          } else {
            setCheckedValuePRExpiryDate(0);
          } 


        }

        setLoading(false);
      }else{
        message.error("No data available")
        setLoading(false);
      }
    } catch (error) {
      const { message } = JSON.parse(JSON.stringify(error));
      if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
        localStorage.clear();
        window.location.replace("/login");
      } else {
        return Promise.reject(error);
      }
    }
  };

  const saveData = () => {
    mainForm.submit(); 
    
  };

  const onFinish = async (values) => {

       const formattedArray=[] 
        const data = values.dyanamicFileds
        const formattedArrayGRN=[] 
        
          for (let i=0;i<values.dyanamicFileds?.length;i++){ 
            const stringifiedJSON = JSON.stringify(values.dyanamicFileds[i]);
            const jsonToSend = stringifiedJSON.replace(/"/g, '\\"');
            formattedArray.push(jsonToSend) 
            } 
          for (let index = 0; index < values.dynamicFiledsGRN?.length; index++) {
            const stringJSON =JSON.stringify (values.dynamicFiledsGRN[index]);
            const jsonTosendGRN=stringJSON.replace(/"/g,'\\"')
            formattedArrayGRN.push(jsonTosendGRN) 
          }  
        
        setDynamicValues(formattedArray)

    
    try {
      setLoading(true);
      const newToken = JSON.parse(localStorage.getItem("authTokens"));
      const appSetupArray = [];
      appSetupArray.push(
        `{
          application:"PO"
          configJson: "{\\"basePriceCalc\\":${
            values.basePriceCalculation === undefined || values.basePriceCalculation === null ? null : `\\"${values.basePriceCalculation}\\"`
          },\\"printPDF\\":${checkedValuePurchasePrintPdf === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"createGRN\\":${
          checkedValueCreateGRN === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`
        },\\"createInvoice\\":${checkedValuePurchaseCreateInvoice === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"sendEmail\\":${
          checkedValuePurchaseSendEmail === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`
        },\\"showSummary\\":${checkedValuePurchaseShowSummary === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"changePrice\\":${checkedValuePurchaseChangePrice === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"importPO\\":${checkedValuePurchaseImport === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"downloadTemplate\\":${checkedValuePurchaseDownloadTemplate === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"upc\\":${checkedValuePurchaseUPC === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"sku\\":${checkedValuePurchaseSKU === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"discountvalue\\":${checkedValuePurchaseDiscount === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"discounttype\\":${checkedValuePurchaseDiscountType === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"dyanamicFileds\\":[${formattedArray}]}" 
       },
        {
          application:"GRN"
          configJson: "{\\"basePriceCalc\\":${
            values.basePriceCalculationGRN === undefined || values.basePriceCalculationGRN === null ? null : `\\"${values.basePriceCalculationGRN}\\"`
          },\\"enableWithoutPO\\":${checkedValueEnableWithoutPO === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"printPDF\\":${
          checkedValueGRPrintPdf === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`
        },\\"createInvoice\\":${checkedValueGRCreateInvoice === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"sendEmail\\":${
          checkedValueGRSendEmail === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`
        },\\"showSummary\\":${checkedValueGRShowSummary === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"changePrice\\":${checkedValueGRChangePrice === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"importGRN\\":${checkedValueGRImport === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"downloadTemplate\\":${checkedValueGRDownloadTemplate === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"freeQty\\":${checkedValueGRFreeQty === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"MRP\\":${checkedValueGRMRP === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"salePrice\\":${checkedValueGRSalePrice === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"basePrice\\":${checkedValueGRBasePrice === 1?`\\"${"Y"}\\"`:`\\"${"N"}\\"`},\\"actualPriceGreaterMrp\\":${checkedValueGRActualPriceMRP === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"unitPrice\\":${checkedValueGRUnitPrice === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"netunitPrice\\":${checkedValueGRNetUnitPrice === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"margin\\":${checkedValueGRMargin === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"oldmargin\\":${checkedValueGROldMargin === 1 ? `\\"${"Y"}\\"`:`\\"${"N"}\\"`},\\"netamount\\":${checkedValueGRNetAmount === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"grossamount\\":${checkedValueGRGrossAmount === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"totaldiscount\\":${checkedValueGRTotalDiscount=== 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"discountvalue\\":${checkedValueGRDiscountValue=== 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"discounttype\\":${checkedValueGRDiscountType === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"upc\\":${checkedValueGRDUPC === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"sku\\":${checkedValueGRNSKU === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"splitBatch\\":${checkedSplitBatch === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"dynamicFiledsGRN\\":[${formattedArrayGRN}] }" 
        }
        {
          application:"Stock Adjustment"
          configJson: "{\\"showSummary\\":${values.sashowsummary === undefined || values.sashowsummary === null ? null : values.sashowsummary===true?`\\"${"Y"}\\"`:`\\"${"N"}\\"`},\\"importSA\\":${values.saimport === undefined || values.saimport === null ? null : values.saimport===true?`\\"${"OkaOkatY"}\\"`:`\\"${"N"}\\"`},\\"downloadTemplate\\":${values.sadownloadtemplate === undefined || values.sadownloadtemplate === null ? null : values.sadownloadtemplate===true?`\\"${"Y"}\\"`:`\\"${"N"}\\"`},\\"upcSearch\\":${values.saupcsearch === undefined || values.saupcsearch === null ? null : values.saupcsearch===true?`\\"${"Y"}\\"`:`\\"${"N"}\\"`},\\"skuSearch\\":${values.saskusearch === undefined || values.saskusearch === null ? null : values.saskusearch===true?`\\"${"Y"}\\"`:`\\"${"N"}\\"`},\\"fullCount\\":${values.safullcount === undefined || values.safullcount === null ? null : values.safullcount===true?`\\"${"Y"}\\"`:`\\"${"N"}\\"`},\\"cyclicCount\\":${values.sacycliccount === undefined || values.sacycliccount === null ? null : values.sacycliccount===true?`\\"${"Y"}\\"`:`\\"${"N"}\\"`},\\"openingBalance\\":${values.saopeningbalance === undefined || values.saopeningbalance === null ? null : values.saopeningbalance===true?`\\"${"Y"}\\"`:`\\"${"N"}\\"`},\\"cost\\":${checkedValueSACost === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"qtyonhand\\":${checkedValueSAQtyOnHand === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"downloadtemplate\\":${checkedValueSADownloadTemplate === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"Import\\":${checkedValueSAImport=== 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"batchno\\":${checkedValueSABatchNo=== 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"mfgdate\\":${checkedValueSAMfgDate=== 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"expirydate\\":${checkedValueSAExpiryDate === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"batch\\":${checkedValueSABatch === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"upc\\":${checkedValueSAUPC === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"sku\\":${checkedValueSASKU === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`}}"   
        }
        {
          application:"Stock Transfer Issue"
          configJson:"{\\"qtyonhand\\":${checkedValueSTIQtyOnHand === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"batchno\\":${checkedValueSTIBatchNo === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"mfgdate\\":${checkedValueSTIMfgDate=== 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"expirydate\\":${checkedValueSTIExpiryDate === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"downloadtemplate\\":${checkedValueSTIDownloadTemplate === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"Import\\":${checkedValueSTIImport === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"batch\\":${checkedValueSTIBatch === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"upc\\":${checkedValueSTIUPC === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"sku\\":${checkedValueSTISKU === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`}}"

        }
        {
          application:"Stock Transfer Receipt"
          configJson:"{\\"batchno\\":${checkedValueSTRBatchNo=== 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"mfgdate\\":${checkedValueSTRMfgDate === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"expirydate\\":${checkedValueSTRExpiryDate === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"upc\\":${checkedValueSTRUPC === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"sku\\":${checkedValueSTRSKU === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`}}"

        }
        {
          application:"PR"
          configJson:"{\\"upc\\":${checkedValuePRUPC === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"sku\\":${checkedValuePRSKU === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"Import\\":${checkedValuePRImport === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"downloadtemplate\\":${checkedValuePRDownloadTemplate === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"category\\":${checkedValuePRCategory  === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"summary\\":${checkedValuePRSummary  === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"batchno\\":${checkedValuePRBatchNo  === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"mfgdate\\":${checkedValuePRMfgDate  === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`},\\"expirydate\\":${checkedValuePRExpiryDate  === 1 ? `\\"${"Y"}\\"` : `\\"${"N"}\\"`}}"

        }`
        
      );
        
      const appSetupMutation = {
        query: `mutation {
          upsertAppSetup(appSetup: { 
            csAppSetup:[${appSetupArray}]
          }) {
            status
            message
        }
      }`,
      };

      Axios({
        url: serverUrl,
        method: "POST",
        data: appSetupMutation,
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${newToken.access_token}`,
        },
      }).then((response) => {
     
        const appSetupResponse = response.data.data.upsertAppSetup;
         
        if (appSetupResponse.status === "200") {          
          message.success(appSetupResponse.message);
          setLoading(false);
        } else {
          message.error(appSetupResponse.message);
          setLoading(false);
        }
      });
    } catch (error) {
      const { message } = JSON.parse(JSON.stringify(error));
      if (message === "Network error: Unexpected token < in JSON at position 0" || message === "Request failed with status code 401") {
        localStorage.clear();
        window.location.replace("/login");
      } else {
        return Promise.reject(error);
      }
    }
    
  };

  /* const clearData = () => {
    mainForm.resetFields();
  }; */

  const onChangeCheckbox = (e) => {
    const eventId = e.target.id;
    const checkedValue = e.target.checked;
    if (eventId === "control-hooks_purchaseOrderPrintPdf") {
      if (checkedValue === true) {
        setCheckedValuePurchasePrintPdf(1);
      } else {
        setCheckedValuePurchasePrintPdf(0);
      }
    }

    if (eventId === "control-hooks_createGRN") {
      if (checkedValue === true) {
        setCheckedValueCreateGRN(1);
      } else {
        setCheckedValueCreateGRN(0);
      }
    }

    if (eventId === "control-hooks_purchaseOrderCreateInvoice") {
      if (checkedValue === true) {
        setCheckedValuePurchaseCreateInvoice(1);
      } else {
        setCheckedValuePurchaseCreateInvoice(0);
      }
    }

    if (eventId === "control-hooks_purchaseOrderSendEmail") {
      if (checkedValue === true) {
        setCheckedValuePurchaseSendEmail(1);
      } else {
        setCheckedValuePurchaseSendEmail(0);
      }
    }

    if (eventId === "control-hooks_purchaseOrderShowSummary") {
      if (checkedValue === true) {
        setCheckedValuePurchaseShowSummary(1);
      } else {
        setCheckedValuePurchaseShowSummary(0);
      }
    }

    if (eventId === "control-hooks_purchaseOrderChangePrice") {
      if (checkedValue === true) {
        setCheckedValuePurchaseChangePrice(1);
      } else {
        setCheckedValuePurchaseChangePrice(0);
      }
    }

    if (eventId === "control-hooks_purchaseOrderImport") {
      if (checkedValue === true) {
        setCheckedValuePurchaseImport(1);
      } else {
        setCheckedValuePurchaseImport(0);
      }
    }

    if (eventId === "control-hooks_purchaseOrderDownloadTemplate") {
      if (checkedValue === true) {
        setCheckedValuePurchaseDownloadTemplate(1);
      } else {
        setCheckedValuePurchaseDownloadTemplate(0);
      }
    }

    if (eventId === "control-hooks_purchaseOrderUPC") {
      if (checkedValue === true) {
        setCheckedValuePurchaseUPC(1);
      } else {
        setCheckedValuePurchaseUPC(0);
      }
    }

    if (eventId === "control-hooks_purchaseOrderSKU") {
      if (checkedValue === true) {
        setCheckedValuePurchaseSKU(1);
      } else {
        setCheckedValuePurchaseSKU(0);
      }
    }

    if(eventId === "control-hooks_purchaseOrderDiscount"){
      if (checkedValue === true) {
        setCheckedValuePurchaseDiscount(1);
      } else {
        setCheckedValuePurchaseDiscount(0);
      }
    }

    if(eventId === "control-hooks_purchaseOrderDiscountType"){
      if(checkedValue === true){
        setCheckedValuePurchaseDiscountType(1)
      }else{
        setCheckedValuePurchaseDiscountType(0)
      }
    }

    if (eventId === "control-hooks_enableWithoutPO") {
      if (checkedValue === true) {
        setCheckedValueEnableWithoutPO(1);
      } else {
        setCheckedValueEnableWithoutPO(0);
      }
    }

    if (eventId === "control-hooks_goodsReceiptCreateInvoice") {
      if (checkedValue === true) {
        setCheckedValueGRCreateInvoice(1);
      } else {
        setCheckedValueGRCreateInvoice(0);
      }
    }

    if (eventId === "control-hooks_goodsReceiptPrintPdf") {
      if (checkedValue === true) {
        setCheckedValueGRPrintPdf(1);
      } else {
        setCheckedValueGRPrintPdf(0);
      }
    }

    if (eventId === "control-hooks_goodsReceiptSendEmail") {
      if (checkedValue === true) {
        setCheckedValueGRSendEmail(1);
      } else {
        setCheckedValueGRSendEmail(0);
      }
    }

    if (eventId === "control-hooks_goodsReceiptShowSummary") {
      if (checkedValue === true) {
        setCheckedValueGRShowSummary(1);
      } else {
        setCheckedValueGRShowSummary(0);
      }
    }

    if (eventId === "control-hooks_GRNChangePrice") {
      if (checkedValue === true) {
        setCheckedValueGRChangePrice(1);
      } else {
        setCheckedValueGRChangePrice(0);
      }
    }

    if (eventId === "control-hooks_GRNImport") {
      if (checkedValue === true) {
        setCheckedValueGRImport(1);
      } else {
        setCheckedValueGRImport(0);
      }
    }

    if (eventId === "control-hooks_GRNDownloadTemplate") {
      if (checkedValue === true) {
        setCheckedValueGRDownloadTemplate(1);
      } else {
        setCheckedValueGRDownloadTemplate(0);
      }
    }

    if (eventId === "control-hooks_GRNFreeQty") {
      if (checkedValue === true) {
        setCheckedValueGRFreeQty(1);
      } else {
        setCheckedValueGRFreeQty(0);
      }
    }

    if (eventId === "control-hooks_GRNMRP") {
      if (checkedValue === true) {
        setCheckedValueGRMRP(1);
      } else {
        setCheckedValueGRMRP(0);
      }
    }

    if (eventId === "control-hooks_GRNSalePrice") {
      if (checkedValue === true) {
        setCheckedValueGRSalePrice(1);
      } else {
        setCheckedValueGRSalePrice(0);
      }
    }

    if (eventId === "control-hooks_GRNBasePrice") {
      if (checkedValue === true) {
        setCheckedValueGRBasePrice(1);
      } else {
        setCheckedValueGRBasePrice(0);
      }
    }

    if (eventId === "control-hooks_GRNActualPriceMrp") {
      if (checkedValue === true) {
        setCheckedValueGRActualPriceMRP(1);
      } else {
        setCheckedValueGRActualPriceMRP(0);
      }
    } 

    if (eventId === "control-hooks_GRNUnitPrice") {
      if (checkedValue === true) {
        setCheckedValueGRUnitPrice(1);
      } else {
        setCheckedValueGRUnitPrice(0);
      }
    }

    if (eventId === "control-hooks_GRNetUnitPrice") {
      if (checkedValue === true) {
        setCheckedValueGRNetUnitPrice(1);
      } else {
        setCheckedValueGRNetUnitPrice(0);
      }
    } 

    if (eventId === "control-hooks_GRNMargin") {
      if (checkedValue === true) {
        setCheckedValueGRMargin(1);
      } else {
        setCheckedValueGRMargin(0);
      }
    }

    if (eventId === "control-hooks_GRNOldMargin") {
      if (checkedValue === true) {
        setCheckedValueGROldMargin(1);
      } else {
        setCheckedValueGROldMargin(0);
      }
    }

    if (eventId === "control-hooks_GRNNetAmount") {
      if (checkedValue === true) {
        setCheckedValueGRNetAmount(1);
      } else {
        setCheckedValueGRNetAmount(0);
      }
    }
    
    if (eventId === "control-hooks_GRNGrossAmount") {
      if (checkedValue === true) {
        setCheckedValueGRGrossAmount(1);
      } else {
        setCheckedValueGRGrossAmount(0);
      }
    }

    if (eventId === "control-hooks_GRNTotalDiscount") {
      if (checkedValue === true) {
        setCheckedValueGRTotalDiscount(1);
      } else {
        setCheckedValueGRTotalDiscount(0);
      }
    }

    if (eventId === "control-hooks_GRNDiscountValue") {
      if (checkedValue === true) {
        seCheckedValueGRDiscountValue(1);
      } else {
        seCheckedValueGRDiscountValue(0);
      }
    }

    if (eventId === "control-hooks_GRNDiscountType") {
      if (checkedValue === true) {
        setCheckedValueGRDiscountType(1);
      } else {
        setCheckedValueGRDiscountType(0);
      }
    }

    if (eventId === "control-hooks_GRDUPC") {
      if (checkedValue === true) {
        setCheckedValueGRDUPC(1);
      } else {
        setCheckedValueGRDUPC(0);
      }
    }

    if (eventId === "control-hooks_GRNSKU") {
      if (checkedValue === true) {
        setCheckedValueGRNSKU(1);
      } else {
        setCheckedValueGRNSKU(0);
      }
    }
    if(eventId === "control-hooks_splitBatch"){
      if(checkedValue === true){
        setCheckedSplitBatch(1)
      }else{
        setCheckedSplitBatch(0)
      }
    }
    
    if (eventId === "control-hooks_SACost") {
      if (checkedValue === true) {
        setCheckedValueSACost(1);
      } else {
        setCheckedValueSACost(0);
      }
    }

    if (eventId === "control-hooks_SAQtyOnHand") {
      if (checkedValue === true) {
        setCheckedValueSAQtyOnHand(1);
      } else {
        setCheckedValueSAQtyOnHand(0);
      }
    }

    if (eventId === "control-hooks_SADownloadTemplate") {
      if (checkedValue === true) {
        setCheckedValueSADownloadTemplate(1);
      } else {
        setCheckedValueSADownloadTemplate(0);
      }
    }
     
    if (eventId === "control-hooks_SAImport") {
      if (checkedValue === true) {
        setCheckedValueSAImport(1);
      } else {
        setCheckedValueSAImport(0);
      }
    }

    if (eventId === "control-hooks_SABatchNo") {
      if (checkedValue === true) {
        setCheckedValueSABatchNo(1);
      } else {
        setCheckedValueSABatchNo(0);
      }
    }
    
    if (eventId === "control-hooks_SAMfgDate") {
      if (checkedValue === true) {
        setCheckedValueSAMfgDate(1);
      } else {
        setCheckedValueSAMfgDate(0);
      }
    }

    if (eventId === "control-hooks_SAExpiryDate") {
      if (checkedValue === true) {
        setCheckedValueSAExpiryDate(1);
      } else {
        setCheckedValueSAExpiryDate(0);
      }
    }

    if (eventId === "control-hooks_SABatch") {
      if (checkedValue === true) {
        setCheckedValueSABatch(1);
      } else {
        setCheckedValueSABatch(0);
      }
    } 

    if (eventId === "control-hooks_SAUPC") {
      if (checkedValue === true) {
        setCheckedValueSAUPC(1);
      } else {
        setCheckedValueSAUPC(0);
      }
    } 

    if (eventId === "control-hooks_SASKU") {
      if (checkedValue === true) {
        setCheckedValueSASKU(1);
      } else {
        setCheckedValueSASKU(0);
      }
    } 


    
    //this all ST Issues

    if (eventId === "control-hooks_STIQtyOnHand") {
      if (checkedValue === true) {
        setCheckedValueSTIQtyOnHand(1);
      } else {
        setCheckedValueSTIQtyOnHand(0);
      }
    }

    if (eventId === "control-hooks_STIQtyBatchNo") {
      if (checkedValue === true) {
        setCheckedValueSTIBatchNo(1);
      } else {
        setCheckedValueSTIBatchNo(0);
      }
    }

    if (eventId === "control-hooks_STIMfgDate") {
      if (checkedValue === true) {
        setCheckedValueSTIMfgDate(1);
      } else {
        setCheckedValueSTIMfgDate(0);
      }
    }
  
    if (eventId === "control-hooks_STIExpiryDate") {
      if (checkedValue === true) {
        setCheckedValueSTIExpiryDate(1);
      } else {
        setCheckedValueSTIExpiryDate(0);
      }
    }

    if (eventId === "control-hooks_STIDownloadTemplate") {
      if (checkedValue === true) {
        setCheckedValueSTIDownloadTemplate(1);
      } else {
        setCheckedValueSTIDownloadTemplate(0);
      }
    }

    if (eventId === "control-hooks_STIImport") {
      if (checkedValue === true) {
        setCheckedValueSTIImport(1);
      } else {
        setCheckedValueSTIImport(0);
      }
    }
    
    if (eventId === "control-hooks_STIBatch") {
      if (checkedValue === true) {
        setCheckedValueSTIBatch(1);
      } else {
        setCheckedValueSTIBatch(0);
      }
    }

    if (eventId === "control-hooks_STIUPC") {
      if (checkedValue === true) {
        setCheckedValueSTIUPC(1);
      } else {
        setCheckedValueSTIUPC(0);
      }
    }

    if (eventId === "control-hooks_STISKU") {
      if (checkedValue === true) {
        setCheckedValueSTISKU(1);
      } else {
        setCheckedValueSTISKU(0);
      }
    }
 //this all from STR
    if (eventId === "control-hooks_STRbatchno") {
      if (checkedValue === true) {
        setCheckedValueSTRBatchNo(1);
      } else {
        setCheckedValueSTRBatchNo(0);
      }
    }

    if (eventId === "control-hooks_STRMfgDate") {
      if (checkedValue === true) {
        setCheckedValueSTRMfgDate(1);
      } else {
        setCheckedValueSTRMfgDate(0);
      }
    }

    if (eventId === "control-hooks_STRExpiryDate") {
      if (checkedValue === true) {
        setCheckedValueSTRExpiryDate(1);
      } else {
        setCheckedValueSTRExpiryDate(0);
      }
    }

    if (eventId === "control-hooks_STRUPC") {
      if (checkedValue === true) {
        setCheckedValueSTRUPC(1);
      } else {
        setCheckedValueSTRUPC(0);
      }
    }

    if (eventId === "control-hooks_STRSKU") {
      if (checkedValue === true) {
        setCheckedValueSTRSKU(1);
      } else {
        setCheckedValueSTRSKU(0);
      }
    }

    if (eventId === "control-hooks_PRUPC") {
      if (checkedValue === true) {
       setCheckedValuePRUPC(1);
      } else {
        setCheckedValuePRUPC(0);
      }
    }
    if (eventId === "control-hooks_PRSKU") {
      if (checkedValue === true) {
       setCheckedValuePRSKU(1);
      } else {
        setCheckedValuePRSKU(0);
      }
    }
    if (eventId === "control-hooks_PRImport") {
      if (checkedValue === true) {
       setCheckedValuePRImport(1);
      } else {
        setCheckedValuePRImport(0);
      }
    }

    if (eventId === "control-hooks_PRDownloadTemplate") {
      if (checkedValue === true) {
       setCheckedValuePRDownloadTemplate(1);
      } else {
        setCheckedValuePRDownloadTemplate(0);
      }
    }
    if (eventId === "control-hooks_PRCategory") {
      if (checkedValue === true) {
       setCheckedValuePRCategory(1);
      } else {
        setCheckedValuePRCategory(0);
      }
    }
    if (eventId === "control-hooks_PRSummary") {
      if (checkedValue === true) {
       setCheckedValuePRSummary(1);
      } else {
        setCheckedValuePRSummary(0);
      }
    }
    if (eventId === "control-hooks_PRBatchNo") {
      if (checkedValue === true) {
       setCheckedValuePRBatchNo(1);
      } else {
        setCheckedValuePRBatchNo(0);
      }
    } 
    if (eventId === "control-hooks_PRMfgDate") {
      if (checkedValue === true) {
       setCheckedValuePRMfgDate(1);
      } else {
        setCheckedValuePRMfgDate(0);
      }
    }
    if (eventId === "control-hooks_PRExpiryDate") {
      if (checkedValue === true) {
       setCheckedValuePRExpiryDate(1);
      } else {
        setCheckedValuePRExpiryDate(0);
      }
    }


  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const getAllFormValues = (e,val) =>{
    console.log("e:", e);
    console.log("val:", val);
  }

  return (
    <Spin indicator={<LoadingOutlined style={{ fontSize: "52px" }} spin />} spinning={loading}>
      <div>
        <Row>
          <Col span={12}>
            <h2>Application Setup</h2>
          </Col>
          <Col span={10} />
          <Col span={2}>
            <Button style={Themes.contentWindow.ListWindowHeader.newButtonForlist} type="primary" onClick={saveData}>
              Save
            </Button>
            &nbsp;
          </Col>
         
        </Row>
        <Row>
          <Col span={24}>
            <Form layout="vertical" form={mainForm} name="control-hooks" onValuesChange={getAllFormValues} onFinish={onFinish} onFinishFailed={onFinishFailed}>
              <Card>
                <Tabs defaultActiveKey={"PO"} onChange={callBackTabs}>
                  <TabPane tab="Purchase" key="PO">
                    <div style={{ padding: "8px" }}>
                      <h3>Purchase Order</h3>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="basePriceCalculation" label="Base Price Calculation" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                             /* onFocus={getBusinessUnit}
                        onSelect={onSelectBusinessUnit} */
                            >
                              <Option key="2" value="Actual Cost Price" title="Actual Cost Price">
                                Actual Cost Price
                              </Option>

                              <Option key="1" value="Purchase Price" title="Purchase Price">
                                Purchase Price
                              </Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Print PDF" name="purchaseOrderPrintPdf">
                            <Checkbox
                              checked={checkedValuePurchasePrintPdf}
                              onChange={onChangeCheckbox}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Create GRN" name="createGRN">
                            <Checkbox checked={checkedValueCreateGRN} onChange={onChangeCheckbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item label="Create Invoice" name="purchaseOrderCreateInvoice">
                            <Checkbox
                              checked={checkedValuePurchaseCreateInvoice}
                              onChange={onChangeCheckbox}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Send Email" name="purchaseOrderSendEmail">
                            <Checkbox
                              checked={checkedValuePurchaseSendEmail}
                              onChange={onChangeCheckbox}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Show Summary" name="purchaseOrderShowSummary">
                            <Checkbox
                              checked={checkedValuePurchaseShowSummary}
                              onChange={onChangeCheckbox}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                      <br />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item label="Change Price" name="purchaseOrderChangePrice">
                            <Checkbox
                              checked={checkedValuePurchaseChangePrice}
                              onChange={onChangeCheckbox}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Import" name="purchaseOrderImport">
                            <Checkbox checked={checkedValuePurchaseImport} onChange={onChangeCheckbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Download Template" name="purchaseOrderDownloadTemplate">
                            <Checkbox
                              checked={checkedValuePurchaseDownloadTemplate}
                              onChange={onChangeCheckbox}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                      <br />
                      <Row  gutter={16}>
                          <Col className="gutter-row" span={2}/>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label ="UPC" name="purchaseOrderUPC">
                              <Checkbox
                                checked={checkedValuePurchaseUPC}
                                  onChange={onChangeCheckbox}
                                style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={4}/>
                          <Col className="gutter-row" span={4}>
                            <Form.Item label ="SKU" name="purchaseOrderSKU">
                              <Checkbox
                                 checked={checkedValuePurchaseSKU}
                                  onChange={onChangeCheckbox}
                                style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Discount Value" name="purchaseOrderDiscount">
                            <Checkbox
                              checked={checkedValuePurchaseDiscount}
                              onChange={onChangeCheckbox}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>
                      </Row> 
                      <br/>
                      <Row  gutter={16}>
                          <Col className="gutter-row" span={2}/>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label ="Discount Type" name="purchaseOrderDiscountType">
                              <Checkbox
                                checked={checkedValuePurchaseDiscountType}
                                  onChange={onChangeCheckbox}
                                style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>
                          
                      </Row> 
                      <br/>  
                      <Row gutter={16}> 
                      <Col className="gutter-row" span={2}/>
                      <Col className="gutter-row" span={24}>
                     
                          <Form.List form={mainForm}  name="dyanamicFileds"  autoComplete="off">
                              {(fields, { add, remove }) => (
                            <>  
                            <Col className="gutter-row" span={12} /> 
                              <Col className="gutter-row" span={22}>
                             <Form.Item>
                             <span style={{ float: "right" }}>
                                <PlusCircleOutlined  onClick={() => add()}/>
                               </span>
                             </Form.Item>
                            </Col>
                             <br/>
                                {fields.map(({ key, name, ...restField }) => (
                              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <Col className="gutter-row" span={2} />
                            <Col className="gutter-row" span={24}>
                            <Form.Item   name={[name, "label"]} label="Label"  {...restField} style={{ marginBottom: "8px" }}>
                            <Input  />
                            </Form.Item>
                            </Col>
                            
                            <Col className="gutter-row" span={2} />
                            <Col className="gutter-row" span={24}>
                            <Form.Item    name={[name, 'type']} label="Type"  {...restField} style={{ marginBottom: "8px" }}>
                         
                              <Select  style={{width:'200px'}}
                                  allowClear
                                      showSearch
                                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}           
                                         >
                                        <Option key="1" value="ST" title="String">
                                         String
                                        </Option>

                                        <Option key="2" value="NU" title="Numeric">
                                         Numeric
                                       </Option>

                                       <Option key="3" value="DA" title="Date">
                                        Date
                                       </Option>

                                      <Option key="4" value="DT" title="Date/Time ">
                                        Date/Time 
                                      </Option>
 
                                      <Option key="5" value="TI" title="Time">
                                      Time  
                                       </Option> 

                                       <Option key="6" value="LI" title="List">
                                        List
                                      </Option>
                                      <Option key="7" value="LM" title="List/Multi">
                                        List Multi Select
                                      </Option>
                                </Select>
                          </Form.Item>
                          </Col>
                                        
                          <Col className="gutter-row" span={2} />
                              <Col className="gutter-row" span={24}>
                                <Form.Item  name={[name,"defaultValue"]} label="DefaultValue"  {...restField} style={{ marginBottom: "8px" }}>
                                  <Input  />    
                               </Form.Item>
                          </Col>
                            <Col className="gutter-row" span={2} />
                              <Col className="gutter-row" span={2}>
                             <MinusCircleOutlined onClick={() => remove(name)} />
                          </Col>
                          </Space>
                              ))}
                           
                          </>
                          )}
                         
                          </Form.List>
                    
                          </Col>
                      </Row>   
                      <br/>
                      </div>
                  </TabPane>
                  <TabPane tab="Goods Receipt" key="GRN">
                    <div style={{ padding: "8px" }}>
                      <h3>Goods Receipt</h3>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item name="basePriceCalculationGRN" label="Base Price Calculation" style={{ marginBottom: "8px" }}>
                            <Select
                              allowClear
                              showSearch
                              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                           
                            >
                              <Option key="2" value="Actual Cost Price" title="Actual Cost Price">
                                Actual Cost Price
                              </Option>

                              <Option key="1" value="Purchase Price" title="Purchase Price">
                                Purchase Price
                              </Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Enable Without PO" name="enableWithoutPO">
                            <Checkbox
                              checked={checkedValueEnableWithoutPO}
                              onChange={onChangeCheckbox}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Print PDF" name="goodsReceiptPrintPdf">
                            <Checkbox checked={checkedValueGRPrintPdf} onChange={onChangeCheckbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>

                      <br />

                      <Row gutter={16}>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item label="Create Invoice" name="goodsReceiptCreateInvoice">
                            <Checkbox
                              checked={checkedValueGRCreateInvoice}
                              onChange={onChangeCheckbox}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Send Email" name="goodsReceiptSendEmail">
                            <Checkbox checked={checkedValueGRSendEmail} onChange={onChangeCheckbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Show Summary" name="goodsReceiptShowSummary">
                            <Checkbox checked={checkedValueGRShowSummary} onChange={onChangeCheckbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                      <br />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item label="Change Price" name="GRNChangePrice">
                            <Checkbox checked={checkedValueGRChangePrice} onChange={onChangeCheckbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Import" name="GRNImport">
                            <Checkbox checked={checkedValueGRImport} onChange={onChangeCheckbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Download Template" name="GRNDownloadTemplate">
                            <Checkbox
                              checked={checkedValueGRDownloadTemplate}
                              onChange={onChangeCheckbox}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                      <br />

                      <Row gutter={16}>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item label="Free Qty" name="GRNFreeQty">
                            <Checkbox checked={checkedValueGRFreeQty} onChange={onChangeCheckbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="MRP" name="GRNMRP">
                            <Checkbox checked={checkedValueGRMRP} onChange={onChangeCheckbox} style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Sale Price" name="GRNSalePrice">
                            <Checkbox
                              checked={checkedValueGRSalePrice}
                              onChange={onChangeCheckbox}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                      <br />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item label="Base Price" name="GRNBasePrice">
                            <Checkbox  
                            checked={checkedValueGRBasePrice}
                            onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Actual Price > Mrp" name="GRNActualPriceMrp">
                            <Checkbox  
                             checked={checkedValueGRActualPriceMRP}
                            onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Unit Price" name="GRNUnitPrice">
                            <Checkbox  
                             checked={checkedValueGRUnitPrice}
                             onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                        
                      </Row>
                      <br />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item label="Net Unit Price" name="GRNetUnitPrice">
                            <Checkbox  
                            checked={checkedValueGRNetUnitPrice}
                            onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Margin" name="GRNMargin">
                            <Checkbox  
                            checked={checkedValueGRMargin}
                            onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Old Margin" name="GRNOldMargin">
                            <Checkbox  
                            checked={checkedValueGROldMargin}
                            onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                      
                      </Row>
                      <br />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item label="Net Amount" name="GRNNetAmount">
                            <Checkbox  
                            checked={checkedValueGRNetAmount}
                            onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Gross Amount" name="GRNGrossAmount">
                            <Checkbox
                              checked={checkedValueGRGrossAmount}
                              onChange={onChangeCheckbox}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Total Discount" name="GRNTotalDiscount">
                            <Checkbox
                              checked={checkedValueGRTotalDiscount}
                              onChange={onChangeCheckbox}
                              style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}
                            ></Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                      <br />
                      
                      <Row gutter={16}>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item label="Discount Value" name="GRNDiscountValue">
                            <Checkbox  
                            checked={checkedValueGRDiscountValue}
                            onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Discount Type" name="GRNDiscountType">
                            <Checkbox  
                            checked={checkedValueGRDiscountType}
                            onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={4}/>
                          <Col className="gutter-row" span={4}>
                            <Form.Item label ="UPC" name="GRDUPC">
                              <Checkbox
                                checked={checkedValueGRDUPC}
                                  onChange={onChangeCheckbox}
                                style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>
                      </Row>
                      <br />
                      <Row gutter={16}>
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item label="SKU" name="GRNSKU">
                            <Checkbox  
                            checked={checkedValueGRNSKU}
                            onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col> 
                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Split Batch" name="splitBatch">
                            <Checkbox  
                            checked={checkedSplitBatch}
                            onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col>
                       </Row> 
  
                       <br/>  
                      <Row gutter={16}> 
                      <Col className="gutter-row" span={2}/>
                      <Col className="gutter-row" span={24}>
                     
                          <Form.List form={mainForm}  name="dynamicFiledsGRN"  autoComplete="off">
                              {(fields, { add, remove }) => (
                            <>  
                            <Col className="gutter-row" span={12} /> 
                              <Col className="gutter-row" span={22}>
                             <Form.Item>
                             <span style={{ float: "right" }}>
                                <PlusCircleOutlined  onClick={() => add()}/>
                               </span>
                             </Form.Item>
                            </Col>
                           
                             <br/>
                                {fields.map(({ key, name, ...restField }) => (
                              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        
                            <Col className="gutter-row" span={2} />
                            <Col className="gutter-row" span={24}>
                            <Form.Item   name={[name, "label"]} label="Label"  {...restField} style={{ marginBottom: "8px" }}>
                            <Input  />
                            </Form.Item>
                            </Col>
                            
                            <Col className="gutter-row" span={2} />
                            <Col className="gutter-row" span={24}>
                            <Form.Item    name={[name, 'type']} label="Type"  {...restField} style={{ marginBottom: "8px" }}>
                         
                              <Select  style={{width:'200px'}}
                                  allowClear
                                      showSearch
                                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}           
                                         >
                                        <Option key="1" value="ST" title="String">
                                         String
                                        </Option>

                                        <Option key="2" value="NU" title="Numeric">
                                         Numeric
                                       </Option>

                                       <Option key="3" value="DA" title="Date">
                                        Date
                                       </Option>

                                      <Option key="4" value="DT" title="Date/Time ">
                                        Date/Time 
                                      </Option>
 
                                      <Option key="5" value="TI" title="Time">
                                      Time  
                                       </Option> 

                                       <Option key="6" value="LI" title="List">
                                        List
                                      </Option>
                                </Select>
                          </Form.Item>
                          </Col>
                                        
                          <Col className="gutter-row" span={2} />
                              <Col className="gutter-row" span={24}>
                                <Form.Item  name={[name,"defaultValue"]} label="DefaultValue"  {...restField} style={{ marginBottom: "8px" }}>
                                  <Input  />    
                               </Form.Item>
                          </Col>
                            <Col className="gutter-row" span={2} />
                              <Col className="gutter-row" span={2}>
                             <MinusCircleOutlined onClick={() => remove(name)} />
                          </Col>
                          </Space>
                              ))}
                           
                          </>
                          )}
                         
                          </Form.List>
                    
                          </Col>
                      </Row>   
                      <br/>
                    </div>
                  </TabPane>
                  <TabPane tab="Stock Adjustment" key="Stock Adjustment">
                     {/* <StockAdjustment stockAdjustmentValues={stockAdjustmentValues} />  */}
                    <div style={{ padding: "8px" }}>
                      <h3>Stock Adjustment</h3>
                       <Row gutter={16}>   
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item label="Cost" name="SACost">
                            <Checkbox  
                             checked={checkedValueSACost}
                             onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col> 
                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Qty On Hand" name="SAQtyOnHand">
                            <Checkbox  
                             checked={checkedValueSAQtyOnHand}
                             onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col> 
                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Download Template" name="SADownloadTemplate">
                            <Checkbox  
                             checked={checkedValueSADownloadTemplate}
                             onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col> 
                      </Row>
                      <br />
                      <Row gutter={16}>   
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item label="Import" name="SAImport">
                            <Checkbox  
                             checked={checkedValueSAImport}
                             onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col> 
                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Batch No" name="SABatchNo">
                            <Checkbox  
                             checked={checkedValueSABatchNo}
                             onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col> 
                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Mfg Date" name="SAMfgDate">
                            <Checkbox  
                             checked={checkedValueSAMfgDate}
                             onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col> 
                      </Row>
                      <br />
                      <Row gutter={16}>   
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item label="Expiry Date" name="SAExpiryDate">
                            <Checkbox  
                             checked={checkedValueSAExpiryDate}
                             onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col> 
                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Batch" name="SABatch">
                            <Checkbox  
                             checked={checkedValueSABatch}
                             onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col> 
                         <Col className="gutter-row" span={4}/>
                         <Col className="gutter-row" span={4}>
                            <Form.Item label ="UPC" name="SAUPC">
                              <Checkbox
                                checked={checkedValueSAUPC}
                                  onChange={onChangeCheckbox}
                                style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>
                      </Row>
                      <br />
                      <Row gutter={16}>   
                      <Col className="gutter-row" span={2}/>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label ="SKU" name="SASKU">
                              <Checkbox
                                checked={checkedValueSASKU}
                                  onChange={onChangeCheckbox}
                                style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>  
                      </Row>
                      <br/>
                      </div>
                  </TabPane>
                  <TabPane tab="ST Issue" key="Stock Transfer Issue">
                  <div style={{ padding: "8px" }}>
                     <h3>Stock Transfer Issue</h3>
                    <Row gutter={16}>   
                        <Col className="gutter-row" span={2} />
                        <Col className="gutter-row" span={6}>
                          <Form.Item label="Qty On Hand" name="STIQtyOnHand">
                            <Checkbox  
                             checked={checkedValueSTIQtyOnHand}
                              onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col> 
                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Batch No" name="STIQtyBatchNo">
                            <Checkbox  
                              checked={checkedValueSTIBatchNo}
                              onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col> 
                        <Col className="gutter-row" span={4} />
                        <Col className="gutter-row" span={4}>
                          <Form.Item label="Mfg Date" name="STIMfgDate">
                            <Checkbox  
                              checked={checkedValueSTIMfgDate}
                              onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                          </Form.Item>
                        </Col> 
                      </Row>
                      <br />
                       <Row  gutter={16}>
                      <Col className="gutter-row" span={2}/>
                      <Col className="gutter-row" span={6}>
                        <Form.Item label ="Expiry Date" name="STIExpiryDate">
                          <Checkbox
                             checked={checkedValueSTIExpiryDate}
                              onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                        </Form.Item>
                      </Col>
                      <Col className="gutter-row" span={4}/>
                      <Col className="gutter-row" span={4}> 
                        <Form.Item label ="Download Template" name="STIDownloadTemplate">
                          <Checkbox
                             checked={checkedValueSTIDownloadTemplate}
                              onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                        </Form.Item>
                      </Col>
                      <Col className="gutter-row" span={4}/>
                      <Col className="gutter-row" span={4}>
                        <Form.Item label ="Import" name="STIImport">
                          <Checkbox
                            checked={checkedValueSTIImport}
                              onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                        </Form.Item>
                      </Col>
                    </Row>
                      <br/> 
                      <Row  gutter={16}>
                      <Col className="gutter-row" span={2}/>
                      <Col className="gutter-row" span={6}>
                        <Form.Item label ="Batch" name="STIBatch">
                          <Checkbox
                             checked={checkedValueSTIBatch}
                              onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                        </Form.Item>
                      </Col>
                      <Col className="gutter-row" span={4}/>
                      <Col className="gutter-row" span={4}>
                        <Form.Item label ="UPC" name="STIUPC">
                          <Checkbox
                             checked={checkedValueSTIUPC}
                              onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                        </Form.Item>
                      </Col>
                      <Col className="gutter-row" span={4}/>
                      <Col className="gutter-row" span={4}>
                        <Form.Item label ="SKU" name="STISKU">
                          <Checkbox
                             checked={checkedValueSTISKU}
                              onChange={onChangeCheckbox}
                            style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                        </Form.Item>
                      </Col>
                     </Row>
                    </div>   
                    <br/> 
                  </TabPane>
                  <TabPane tab="ST Receipt" key="Stock Transfer Receipt">
                  <div style={{ padding: "8px" }}>
                     <h3>Stock Transfer Receipt</h3>
                      <Row  gutter={16}>
                          <Col className="gutter-row" span={2}/>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label ="Batch No" name="STRbatchno">
                              <Checkbox
                                 checked={checkedValueSTRBatchNo}
                                   onChange={onChangeCheckbox}
                                style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={4}/>
                          <Col className="gutter-row" span={4}> 
                            <Form.Item label ="Mfg Date" name="STRMfgDate">
                              <Checkbox
                                checked={checkedValueSTRMfgDate}
                                  onChange={onChangeCheckbox}
                                style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={4}/>
                          <Col className="gutter-row" span={4}>
                            <Form.Item label ="Expiry Date" name="STRExpiryDate">
                              <Checkbox
                                checked={checkedValueSTRExpiryDate}
                                  onChange={onChangeCheckbox}
                                style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>
                    </Row>
                      <br/> 
                      <Row  gutter={16}>
                          <Col className="gutter-row" span={2}/>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label ="UPC" name="STRUPC">
                              <Checkbox
                                checked={checkedValueSTRUPC}
                                  onChange={onChangeCheckbox}
                                style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={4}/>
                          <Col className="gutter-row" span={4}>
                            <Form.Item label ="SKU" name="STRSKU">
                              <Checkbox
                                checked={checkedValueSTRSKU}
                                  onChange={onChangeCheckbox}
                                style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>
                      </Row>    
                      <br/>
                    
                  </div>
               </TabPane>
               <TabPane tab="Purchase Return" key="PR">
                  <div style={{ padding: "8px" }}>
                     <h3>Purchase Return</h3>
                      <Row  gutter={16}>
                        <Col className="gutter-row" span={2}/>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label ="UPC" name="PRUPC">
                              <Checkbox
                                 checked={checkedValuePRUPC}
                                   onChange={onChangeCheckbox}
                                style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={2}/>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label ="SKU" name="PRSKU">
                              <Checkbox
                                 checked={checkedValuePRSKU}
                                   onChange={onChangeCheckbox}
                                style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={2}/>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label ="Import" name="PRImport">
                              <Checkbox
                                 checked={checkedValuePRImport}
                                   onChange={onChangeCheckbox}
                                style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>
                           
                         
                    </Row>
                      <br/> 
                      <Row  gutter={16}>
                      <Col className="gutter-row" span={2}/>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label ="Download Template" name="PRDownloadTemplate">
                              <Checkbox
                                 checked={checkedValuePRDownloadTemplate}
                                   onChange={onChangeCheckbox}
                                style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={2}/>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label ="Category" name="PRCategory">
                              <Checkbox
                                 checked={checkedValuePRCategory}
                                   onChange={onChangeCheckbox}
                                style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={2}/>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label ="Summary" name="PRSummary">
                              <Checkbox
                                 checked={checkedValuePRSummary}
                                   onChange={onChangeCheckbox}
                                style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>
                          
                      </Row>    
                       <br/>
                       <Row  gutter={16}>
                            <Col className="gutter-row" span={2}/>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label ="Batch No" name="PRBatchNo">
                              <Checkbox
                                 checked={checkedValuePRBatchNo}
                                   onChange={onChangeCheckbox}
                                style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col> 
                           <Col className="gutter-row" span={2}/>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label ="Mfg Date" name="PRMfgDate">
                              <Checkbox
                                  checked={checkedValuePRMfgDate} 
                                   onChange={onChangeCheckbox}
                                style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>  
                           <Col className="gutter-row" span={2}/>
                          <Col className="gutter-row" span={6}>
                            <Form.Item label ="Expiry Date" name="PRExpiryDate">
                              <Checkbox
                                  checked={checkedValuePRExpiryDate} 
                                   onChange={onChangeCheckbox}
                                style={{ marginTop: "8px", color: "#5d5454", fontWeight: "300" }}></Checkbox>
                            </Form.Item>
                          </Col>  

                       </Row>
                      <br/>
                  </div>
               </TabPane>


                </Tabs>
              </Card>
            </Form>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default ApplicationSetup;
