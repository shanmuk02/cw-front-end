import React, { useState, useEffect, Fragment } from "react";
import ListWindowHeader from "./ListWindowHeader";
import ListWindowLines from "./ListWindowLines";
import { useWindowContext } from "../../lib/storage";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const ListWindow = () => {
  const { windowStore, setWindowStore } = useWindowContext();
  const windowDefinition = { ...windowStore.windowDefinition };
  const [searchKey, setSearchKey] = useState();
  const [lastRefreshed, setLastRefreshed] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [windowLoading, setWindowLoading] = useState(false);
  const [kanBanCardFlag, setKanBanCardFlag] = useState(false);
  const [treeViewFlag, setTreeViewFlag] = useState(() => {
    if (windowDefinition.treeView === undefined || windowDefinition.treeView === false) {
      return false;
    } else {
      return true;
    }
  });
  const [expandTreeViewFlag, setExpandTreeViewFlag] = useState(false);
  const [collapseTreeViewFlag, setCollapseTreeViewFlag] = useState(false);
  const [columns, setColumns] = useState([]);
  const [filterFlag, setFilterFlag] = useState(false);
  const [hideAndShowData, setHideAndShowData] = useState([]);
  const [hideAndShowTitles, setHideAndShowTitles] = useState([]);
  const [summaryData, setSummaryData] = useState(() => {
    if (windowDefinition.summary === undefined || windowDefinition.summary === {}) {
      return {};
    } else {
      return windowDefinition.summary;
    }
  });
  const [filters, setFilters] = useState([]);
  const [viewFilters, setViewFilters] = useState('');
  const [treeSearchInput, setTreeSearchInput] = useState('');

  const treeView = () => {
    setTreeViewFlag(!treeViewFlag);
  };

  useEffect(() => {
    const windowDef = { ...windowDefinition };
    if (windowDef) {
      windowDef.treeView = treeViewFlag;
      windowDef.summary = summaryData;
    }
    setWindowStore({ windowDefinition: windowDef });
  }, [treeViewFlag, summaryData]);

  const takeColumns = (column) => {
    setColumns(column);
  };

  const resetFilters = () => {
    setFilterFlag(true);
  };

  const takeSummary = (summary) => {
    setSummaryData({...summary});
  };

  const takeHideAndshowData = (data) => {
    setHideAndShowData(data);
  };

  const takeHideAndShowTitles = (data) => {
    setHideAndShowTitles(data);
  };

  const kanbanCards = () => {
    setKanBanCardFlag(!kanBanCardFlag);
  };

  const ShowListView = () => {
    setKanBanCardFlag(kanBanCardFlag);
  };

  const expandTreeView = () => {
    setExpandTreeViewFlag(!expandTreeViewFlag);
  };

  const collapseTreeView = () => {
    setCollapseTreeViewFlag(!collapseTreeViewFlag)
  }

  return (
    <Fragment>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} className="spinLoader" spin />} spinning={windowLoading}>
        <ListWindowHeader
          setSearchKey={setSearchKey}
          setLastRefreshed={setLastRefreshed}
          treeView={treeView}
          columns={columns}
          resetFilters={resetFilters}
          takeSummary={takeSummary}
          takeHideAndshowData={takeHideAndshowData}
          hideAndShowTitles={hideAndShowTitles}
          kanbanCards={kanbanCards}
          ShowListView={ShowListView}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          setWindowLoading={setWindowLoading}
          kanbanCardFlag={kanBanCardFlag}
          filters={filters}
          takeViewFilters={setViewFilters}
          treeViewFlag={treeViewFlag}
          expandTreeView={expandTreeView}
          collapseTreeView={collapseTreeView}
          treeSearchInput={treeSearchInput}
          setTreeSearchInput={setTreeSearchInput}
        />
        <ListWindowLines
          searchKey={searchKey}
          lastRefreshed={lastRefreshed}
          treeViewFlag={treeViewFlag}
          takeColumns={takeColumns}
          filterFlag={filterFlag}
          setFilterFlag={setFilterFlag}
          summaryData={summaryData}
          hideAndShowData={hideAndShowData}
          takeHideAndShowTitles={takeHideAndShowTitles}
          kanbanCardFlag={kanBanCardFlag}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          setKanBanCardFlag={setKanBanCardFlag}
          takeFilters={setFilters}
          viewFilters={viewFilters}
          expandTreeViewFlag={expandTreeViewFlag}
          collapseTreeViewFlag={collapseTreeViewFlag}
          treeSearchInput={treeSearchInput}
        />
      </Spin>
    </Fragment>
  );
};

export default ListWindow;
