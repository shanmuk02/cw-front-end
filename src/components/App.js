import React, { useReducer } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { GlobalContext, storeReducer } from "../lib/storage";
import PrivateRoute from "../lib/authentication/privateRoute";
import PopupLayout from "./popupLayout";
import AdminLayout from "./adminLayout";
import Login from "./login";
import HomePage from "./home";
import GenericWindow from "./window";
import Dashboard from "./analytics";
import Report from "./report";
import ImportRecord from "./import";
import PurchaseOrder from "./customWindow/PurchaseOrder";
import StockAllocation from "./customWindow/StockAllocation";
import ProfitLossStatement from "./customWindow/ProfitLossStatement";
import BalanceSheet from "./customWindow/BalanceSheet";
import PivotSample from "./customWindow/PivotSample";
import Users from "./customWindow/Users";
import UserDetails from "./customWindow/Users/UserDetails";
import CreateRole from "./customWindow/Role/createNewRole";
import RoleDetails from "./customWindow/Role/RoleDetails";
import RoleListWindow from "./customWindow/Role/index";
import SqlQuery from "./customWindow/Sql_Query";
import AdvSqlQuery from "./customWindow/Sql_Advance_Query";
import SalesGPReport from "./customWindow/Sales_GP_Report";
import SalesGpReport from "./customWindow/SalesGPReport";
import StockCount from "./customWindow/stockCount";
import WastageEntry from "./customWindow/wastageEntry";
import StIssue from "./customWindow/stIssue";
import newStReceipt from "./customWindow/stReceipt"
import PurchaseReturns from "./customWindow/purchaseReturn";
import PurchaseOrderApparel from "./customWindow/PurchaseOrderApparel";
import GSTR3BSummaryReport from "./customWindow/GSTR3BSummaryReport";
import ApplicationSetup from "./customWindow/applicationsetup";
import ManageRequisition from "./customWindow/ManageRequisition";
import ManageSalesOrder from "./customWindow/ManageSalesOrder";
import GRN from "./customWindow/grn";
import POSConfiguration from "./customWindow/posconfiguration";
import NewSalesOrder from "./customWindow/newSalesOrder";
import ProductPriceUpdate from "./customWindow/ProductPriceUpdate";
import NewProductDesign from "./customWindow/NewProductDesign";
import PJCustom from "./customWindow/PJCustom";
import PJcustomDetails from "./customWindow/PJCustom/PJCustomerDetails"
import ErrorPage from "./errorBoundary/ErrorPage";
import PageNotFound from "./errorBoundary/PageNotFound";
import ReportDeveloper from "./customWindow/Report Developer";
import NewReport from "./customWindow/Report Developer/NewReport";
import ProfitLossSchedule3 from "./customWindow/Finance/Profit&Loss(schedule3)";
import AlertsandMessages from "./customWindow/alertsandmessages";
import ManageWorkOrder from "./customWindow/NewWorkOrer"
import ManageWorkRequest from "./customWindow/ManageWorkRequest"
import Profile from "./customWindow/profile"
import PendingQualityTask from "./customWindow/pendingQualityTask"
import PendingdetailsView from "./customWindow/pendingQualityTask/detailsView"
import QualityReview from  "./customWindow/qualityReview"
import TrialBalance from "./customWindow/TrialBalance";
import DataLoadNewConfig from "./customWindow/initialDataLoadConfigNew"
import InitialDataLoadNew from "./customWindow/initialDataLoadNew"
import RetailSetup from "./customWindow/RetailSetup";
import QcDetailsView from "./customWindow/qualityReview/detailsView"
import DagTask from "./customWindow/DagTask";
import NewTask from "./customWindow/DagTask/NewTask";
import CwAnalytics from "./customWindow/CwAnalytics";
import CwConnections from "./customWindow/CwConnections";

import "../styles/app.css";
import "../styles/antd.css";

const authTokens = JSON.parse(localStorage.getItem("authTokens"));
const userData = JSON.parse(localStorage.getItem("userData"));
const sideMenuData = JSON.parse(localStorage.getItem("sideMenuData"));
const userPreferences = JSON.parse(localStorage.getItem("userPreferences"));
const windowTabs = JSON.parse(localStorage.getItem("windowTabs"));

const App = () => {
  const [globalStore, setGlobalStore] = useReducer(storeReducer, {
    authTokens: authTokens,
    userData: userData,
    sideMenuData: sideMenuData,
    userPreferences: userPreferences,
    windowTabs: windowTabs ? windowTabs : [],
  });

  return (
    <GlobalContext.Provider value={{ globalStore, setGlobalStore }}>
      <Router>
        <Switch>
          <PrivateRoute exact path="/" layout={AdminLayout} component={HomePage} />
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/window/list/:windowId" layout={AdminLayout} component={GenericWindow} />
          <PrivateRoute exact path="/window/:windowId/:recordId" layout={AdminLayout} component={GenericWindow} />
          <PrivateRoute exact path="/popupWindow/:windowId/:recordId" layout={PopupLayout} component={GenericWindow} />
          <PrivateRoute exact path="/analytics/dashboard/:dashboardId" layout={AdminLayout} component={Dashboard} />
          <PrivateRoute exact path="/reports/report/:reportId" layout={AdminLayout} component={Report} />
          <PrivateRoute exact path="/others/window/7137" layout={AdminLayout} component={PurchaseOrder} />
          <PrivateRoute exact path="/others/window/7371" layout={AdminLayout} component={StockAllocation} />
          <PrivateRoute exact path="/others/window/7396" layout={AdminLayout} component={ProfitLossStatement} />
          <PrivateRoute exact path="/others/window/7404" layout={AdminLayout} component={BalanceSheet} />
          <PrivateRoute exact path="/others/window/7406" layout={AdminLayout} component={PivotSample} />
          <PrivateRoute exact path="/others/window/7198" layout={AdminLayout} component={Users} />
          <PrivateRoute exact path="/others/window/userDetails" layout={AdminLayout} component={UserDetails} />
          <PrivateRoute exact path="/others/window/7199" layout={AdminLayout} component={RoleListWindow} />
          <PrivateRoute exact path="/others/window/CreateRole" layout={AdminLayout} component={CreateRole} />
          <PrivateRoute exact path="/others/window/RoleDetails" layout={AdminLayout} component={RoleDetails} />
          <PrivateRoute exact path="/others/window/7359" layout={AdminLayout} component={StockCount} />
          <PrivateRoute exact path="/others/window/7360" layout={AdminLayout} component={WastageEntry} />
          <PrivateRoute exact path="/others/window/7295" layout={AdminLayout} component={StIssue} />
          <PrivateRoute exact path="/others/window/7296" layout={AdminLayout} component={newStReceipt} />
          <PrivateRoute exact path="/others/window/7407" layout={AdminLayout} component={PurchaseOrderApparel} />
          <PrivateRoute exact path="/others/window/7363" layout={AdminLayout} component={GRN} />
          <PrivateRoute exact path="/others/window/7424" layout={AdminLayout} component={PurchaseReturns} />
          <PrivateRoute exact path="/others/window/7257" layout={AdminLayout} component={SqlQuery} />
          <PrivateRoute exact path="/others/window/7293" layout={AdminLayout} component={AdvSqlQuery} />
          <PrivateRoute exact path="/others/window/7208" layout={AdminLayout} component={ImportRecord} />
          <PrivateRoute exact path="/others/window/7301" layout={AdminLayout} component={SalesGPReport} />
          <PrivateRoute exact path="/others/window/7412" layout={AdminLayout} component={SalesGpReport} />
          <PrivateRoute exact path="/others/window/7417" layout={AdminLayout} component={GSTR3BSummaryReport} />
          <PrivateRoute exact path="/others/window/7430" layout={AdminLayout} component={ApplicationSetup} />
          <PrivateRoute exact path="/others/window/7426" layout={AdminLayout} component={ManageRequisition} />
          <PrivateRoute exact path="/others/window/7425" layout={AdminLayout} component={ManageSalesOrder} />
          <PrivateRoute exact path="/others/window/7435" layout={AdminLayout} component={POSConfiguration} />
          <PrivateRoute exact path="/others/window/7439" layout={AdminLayout} component={NewSalesOrder} />
          <PrivateRoute exact path="/others/window/7439/:recordId" layout={AdminLayout} component={NewSalesOrder} />
          <PrivateRoute exact path="/others/window/7444" layout={AdminLayout} component={ProductPriceUpdate} />
          <PrivateRoute exact path="/others/window/7447" layout={AdminLayout} component={NewProductDesign} />
          <PrivateRoute exact path="/others/window/7447/:recordId" layout={AdminLayout} component={NewProductDesign} />
          <PrivateRoute exact path="/others/window/7452" layout={AdminLayout} component={PJCustom}/> 
          <PrivateRoute exact path="/others/window/PJCustomerDetails" layout={AdminLayout} component={PJcustomDetails}/>
          <PrivateRoute exact path="/others/window/7459" layout={AdminLayout} component={InitialDataLoadNew} />
          <PrivateRoute exact path="/others/window/7460" layout={AdminLayout} component={DataLoadNewConfig} />
          <PrivateRoute exact path="/others/window/7473" layout={AdminLayout} component={ManageWorkOrder}/>
          <PrivateRoute exact path="/others/window/7473/:recordId" layout={AdminLayout} component={ManageWorkOrder}/>
          <PrivateRoute exact path="/others/window/7472" layout={AdminLayout} component={ManageWorkRequest} />
          <PrivateRoute exact path="/others/window/7464" layout={AdminLayout} component={ReportDeveloper} />
          <PrivateRoute exact path="/others/window/7464/:reportId" layout={AdminLayout} component={NewReport} />
          <PrivateRoute exact path="/others/window/7467" layout={AdminLayout} component={ProfitLossSchedule3} />
          <Route exact path="/alerts" component={AlertsandMessages} />
          <PrivateRoute exact path="/others/window/7465" layout={AdminLayout} component={Profile} />
          <PrivateRoute exact path="/others/window/7475" layout={AdminLayout} component={PendingQualityTask} />
          <PrivateRoute exact path="/others/window/7475/:recordId" layout={AdminLayout} component={PendingdetailsView} />
          <PrivateRoute exact path="/others/window/7478" layout={AdminLayout} component={QualityReview} />
          <PrivateRoute exact path="/others/window/7478/:recordId" layout={AdminLayout} component={QcDetailsView} />
          <PrivateRoute exact path="/others/window/7474" layout={AdminLayout} component={TrialBalance} />
          <PrivateRoute exact path="/others/window/7477" layout={AdminLayout} component={RetailSetup} />
          <PrivateRoute exact path="/others/window/7484" layout={AdminLayout} component={DagTask} />
          <PrivateRoute exact path="/others/window/7484/:taskId" layout={AdminLayout} component={NewTask} />
          <PrivateRoute exact path="/others/window/7485" layout={AdminLayout} component={CwAnalytics} />
          <PrivateRoute exact path="/others/window/7486" layout={AdminLayout} component={CwConnections} />
          <PrivateRoute exact path="/error" layout={AdminLayout} component={ErrorPage} />
          <PrivateRoute path="*" layout={AdminLayout} component={PageNotFound} />
        </Switch>
      </Router>
    </GlobalContext.Provider>
  );
};

export default App;