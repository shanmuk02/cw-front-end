import React, { useEffect, useState, Fragment } from "react";
import { message, Table, Modal, Select, Form, Button, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useHistory } from "react-router";
import { useWindowContext, useGlobalContext } from "../../lib/storage";
import { getTabColumns, getTabRecords, getFilterData, getTreeData } from "../window/windowUtilities";
import useDebounce from "../../lib/hooks/useDebounce";
import StoryBook from "../storyBook";
import "antd/dist/antd.css";
import "../../styles/app.css";
import { Resizable } from "react-resizable";
import ReactDragListView from "react-drag-listview";
import { getTabSummary } from "../../services/generic";
import { FieldReference } from "../../lib/fieldReference";
const { Option } = Select;

const ResizableCell = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

const ListWindowLines = (props) => {
  const { globalStore } = useGlobalContext();
  const Themes = globalStore.userData.CW360_V2_UI;
  const {
    searchKey,
    lastRefreshed,
    treeViewFlag,
    takeColumns,
    filterFlag,
    setFilterFlag,
    summaryData,
    hideAndShowData,
    takeHideAndShowTitles,
    kanbanCardFlag,
    setSelectedRowKeys,
    setKanBanCardFlag,
    takeFilters,
    viewFilters,
    expandTreeViewFlag,
    collapseTreeViewFlag,
    treeSearchInput
  } = props;
  const [loading, setLoading] = useState(false);
  const [groupNameDropdDownData, setGroupNameDropdDownData] = useState([]);
  const [displayKanban, setDisplayKanban] = useState(false);
  const [getGroupNameModal, setGetGroupNameModal] = useState(false);
  const [cardsIdentifiers, setCardsIdentifiers] = useState([]);
  const [statusIdForCard, setStatusIdForCard] = useState("");
  const [laneArray, setLaneArray] = useState([]);
  const [sendDataToCard, setSendDataToCard] = useState([]);
  const [baseRefId, setBaseRefId] = useState("");

  const [tabData, setTabData] = useState({});
  const [dataSourceRecords, setDataSourceRecords] = useState([]);
  const [columnsData, setColumnsData] = useState([]);
  const [form] = Form.useForm();

  const [filterArray, setFilterArray] = useState({});
  const [sorterArray, setSorterArray] = useState({});
  const [finalFilterArray, setFinalFilterArray] = useState([]);
  const [finalSorterArray, setFinalSorterArray] = useState([]);
  const [summaryResponse, setSummaryResponse] = useState({});
  const [reOrderIndexes, setReOrderIndexes] = useState([]);
  const [isLoading, setIsLoading] = useState({});
  const { windowStore, setWindowStore } = useWindowContext();
  const windowDefinition = { ...windowStore.windowDefinition };
  const [keys, setKeys] = useState(() => {
    if (windowDefinition.keys === undefined) {
      return [];
    } else {
      return windowDefinition.keys;
    }
  });
  const [expandTreeViewData, setExpandTreeViewData] = useState([]);
  const [nestedKeys, setNestedKeys] = useState([]);
  const [nestedData, setNestedData] = useState({});
  const history = useHistory();
  const { Text } = Typography;

  useEffect(() => {
    let isMounted = true;
    if (windowDefinition.tabs) {
      setLoading(true);
      const headerTab = windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === "0")];
      headerTab.fields.sort((a, b) => {
        const x = a.grid_seqno !== null ? parseInt(a.grid_seqno) : a.grid_seqno;
        const y = b.grid_seqno !== null ? parseInt(b.grid_seqno) : b.grid_seqno;
        return (x != null ? x : Infinity) - (y != null ? y : Infinity);
      });
      setTabData(headerTab);
      const tabColumnsData = getTabColumns(headerTab);
      let finalFilterArray = [];
      let finalSorterArray = [];
      if (sorterArray.order !== undefined && sorterArray.field !== undefined) {
        finalSorterArray.push(`{'${`sortBy`}':'${sorterArray.field.replace("_iden", "")}','${`sortDirection`}':'${sorterArray.order === "ascend" ? "ASC" : "DESC"}'}`);
      }
      getTabRecords({ ad_tab_id: headerTab.ad_tab_id, startRow: "0", endRow: `${headerTab.pagelimit}`, sortInfo: finalSorterArray.length !== 0 ? finalSorterArray : null }).then(
        (getTabRecordsResponse) => {
          if (isMounted) {
            let filteredData = getFilterData(tabColumnsData, getTabRecordsResponse, headerTab);
            for (let index = 0; index < filteredData.length; index++) {
              if (filteredData[index].filteredValue !== null && filteredData[index].filteredValue !== undefined) {
                if (
                  filteredData[index].baseReferenceId === "17" ||
                  filteredData[index].baseReferenceId === "19" ||
                  filteredData[index].baseReferenceId === "15" ||
                  filteredData[index].baseReferenceId === "16"
                ) {
                  finalFilterArray.push(`{'${`filterBy`}':'${filteredData[index].dataIndex.replace("_iden", "")}','${`filterTerm`}':'[${filteredData[index].filteredValue}]'}`);
                } else {
                  finalFilterArray.push(`{'${`filterBy`}':'${filteredData[index].dataIndex.replace("_iden", "")}','${`filterTerm`}':'${filteredData[index].filteredValue}'}`);
                }
              }
            }
            takeFilters(finalFilterArray);
            setFinalFilterArray(finalFilterArray);
            if (finalFilterArray.length > 0) {
              getTabRecords({
                ad_tab_id: headerTab.ad_tab_id,
                startRow: "0",
                endRow: `${headerTab.pagelimit}`,
                filterData: finalFilterArray,
                sortInfo: finalSorterArray.length !== 0 ? finalSorterArray : null,
              }).then((getTabRecordsResponse) => {
                let newFilteredData = getFilterData(tabColumnsData, getTabRecordsResponse, headerTab);
                for (let index = 0; index < newFilteredData.length; index++) {
                  if (newFilteredData[index].filteredValue !== null && newFilteredData[index].filteredValue !== undefined) {
                    if (
                      newFilteredData[index].baseReferenceId === "17" ||
                      newFilteredData[index].baseReferenceId === "19" ||
                      filteredData[index].baseReferenceId === "15" ||
                      filteredData[index].baseReferenceId === "16"
                    ) {
                      finalFilterArray.push(
                        `{'${`filterBy`}':'${newFilteredData[index].dataIndex.replace("_iden", "")}','${`filterTerm`}':'[${newFilteredData[index].filteredValue}]'}`
                      );
                    } else {
                      finalFilterArray.push(
                        `{'${`filterBy`}':'${newFilteredData[index].dataIndex.replace("_iden", "")}','${`filterTerm`}':'${newFilteredData[index].filteredValue}'}`
                      );
                    }
                  }
                }
                for (let index = 0; index < newFilteredData.length; index++) {
                  let title = newFilteredData[index].title;
                  newFilteredData[index].title = <span className="dragHandler">{title}</span>;
                }
                setFinalFilterArray(finalFilterArray);
                takeColumns([...newFilteredData]);
                setColumnsData([...newFilteredData]);
                setDataSourceRecords([...getTabRecordsResponse]);
                setFilterFlag(false);
                setLoading(false);
              });
            } else {
              if (treeViewFlag === false) {
                for (let index = 0; index < filteredData.length; index++) {
                  let title = filteredData[index].title;
                  filteredData[index].title = <span className="dragHandler">{title}</span>;
                }
                takeColumns([...filteredData]);
                setColumnsData([...filteredData]);
                setDataSourceRecords([...getTabRecordsResponse]);
                setLoading(false);
              } else {
                // getTabRecords({ ad_tab_id: headerTab.ad_tab_id, startRow: "0", endRow: "500", sortInfo : finalSorterArray.length !== 0 ? finalSorterArray : null }).then((getTabRecordsResponse) => {
                for (let index = 0; index < filteredData.length; index++) {
                  let title = filteredData[index].title;
                  filteredData[index].title = <span className="dragHandler">{title}</span>;
                }
                takeColumns([...filteredData]);
                setColumnsData([...filteredData]);
                setExpandTreeViewData([...getTabRecordsResponse]);
                const treeRowData = getTreeData(getTabRecordsResponse, windowDefinition.tabs);
                setDataSourceRecords([...treeRowData]);
                setLoading(false);
                // });
              }
            }
          }
        }
      );
    }
    return () => {
      isMounted = false;
    };
  }, [treeViewFlag, filterArray]);

  const debouncedTreeSearchKey = useDebounce(treeSearchInput, 350);

  useEffect(() => {
    if (debouncedTreeSearchKey !== "") {
      getTreesearchData(debouncedTreeSearchKey);
    } else {
      setKeys([]);
    };
  }, [debouncedTreeSearchKey]);

  const getTreesearchData = (input) => {
    setLoading(true);
    if (treeViewFlag === true) {
      let arr = [];
      let mainData = [...expandTreeViewData];
      mainData.forEach(record => {
        let flag = "N";
        Object.values(record).forEach(value => {
          if (value !== null && typeof(value) !== "number" && typeof(value) !== "object") {
            if (value.toLowerCase().indexOf(input.toLowerCase()) >= 0) {
              flag = "Y"
            };
          };
        });
        if (flag === "Y") {
          arr.push(record);
        };
      });

      let arr1 = [], arr2 = [], arr3 = [], arr4 = [], arr5 = [], arr6 = [], arr7 = [], arr8 = [], arr9 = [], arr10 = [];
      arr.forEach(item => {
        if (item.tree_field_id !== null) {
          mainData.forEach(row => {
            if (row.recordId === item.tree_field_id) {
              arr1.push(row);
            }
          })
        }
      });
      arr1.forEach(item => {
        if (item.tree_field_id !== null) {
          mainData.forEach(row => {
            if (row.recordId === item.tree_field_id) {
              arr2.push(row);
            }
          })
        }
      });
      arr2.forEach(item => {
        if (item.tree_field_id !== null) {
          mainData.forEach(row => {
            if (row.recordId === item.tree_field_id) {
              arr3.push(row);
            }
          })
        }
      });
      arr3.forEach(item => {
        if (item.tree_field_id !== null) {
          mainData.forEach(row => {
            if (row.recordId === item.tree_field_id) {
              arr4.push(row);
            }
          })
        }
      });
      arr4.forEach(item => {
        if (item.tree_field_id !== null) {
          mainData.forEach(row => {
            if (row.recordId === item.tree_field_id) {
              arr5.push(row);
            }
          })
        }
      });
      arr5.forEach(item => {
        if (item.tree_field_id !== null) {
          mainData.forEach(row => {
            if (row.recordId === item.tree_field_id) {
              arr6.push(row);
            }
          })
        }
      });
      arr6.forEach(item => {
        if (item.tree_field_id !== null) {
          mainData.forEach(row => {
            if (row.recordId === item.tree_field_id) {
              arr7.push(row);
            }
          })
        }
      });
      arr7.forEach(item => {
        if (item.tree_field_id !== null) {
          mainData.forEach(row => {
            if (row.recordId === item.tree_field_id) {
              arr8.push(row);
            }
          })
        }
      });
      arr8.forEach(item => {
        if (item.tree_field_id !== null) {
          mainData.forEach(row => {
            if (row.recordId === item.tree_field_id) {
              arr9.push(row);
            }
          })
        }
      });
      arr9.forEach(item => {
        if (item.tree_field_id !== null) {
          mainData.forEach(row => {
            if (row.recordId === item.tree_field_id) {
              arr10.push(row);
            }
          })
        }
      });
      let finalArr = [...arr, ...arr1, ...arr2, ...arr3, ...arr4, ...arr5, ...arr6, ...arr7, ...arr8, ...arr9, ...arr10];
      let key = [];
      finalArr.forEach(item => {
        if (key.includes(item.key)) {

        } else {
          key.push(item.key);
        };
      });
      setKeys(key);
      const getTreeMainData = (data) => {
        const toTree = (arr) => {
          const arrMap = new Map(arr.map(item => [item.recordId, item]));
          const tree = [];
          for (let index = 0; index < arr.length; index++) {
            const item = arr[index];
            if (item.tree_field_id) {
              const parentItem = arrMap.get(item.tree_field_id);
              if (parentItem) {
                const { children } = parentItem;
                if (children) {
                  parentItem.children.push(item);
                } else {
                  parentItem.children = [item];
                }
              }
            } else {
              tree.push(item);
            }
          }
          return tree;
        }
        const treeRowData = toTree(data);
        return treeRowData;
      };
      mainData.map(item => {
        delete item['children'];
      });
      let treeRowData = getTreeMainData(mainData, windowDefinition.tabs);
      setDataSourceRecords([...treeRowData]);
      setLoading(false);
    };
  };

  useEffect(() => {
    if (viewFilters !== "") {
      const data = JSON.parse(viewFilters.replace(/'/g, '"'));
      const windowDef = { ...windowDefinition };
      if (windowDef.tabs) {
        const headerTab = windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === "0")];
        headerTab.fields.sort((a, b) => {
          const x = a.grid_seqno !== null ? parseInt(a.grid_seqno) : a.grid_seqno;
          const y = b.grid_seqno !== null ? parseInt(b.grid_seqno) : b.grid_seqno;
          return (x != null ? x : Infinity) - (y != null ? y : Infinity);
        });
        for (let index1 = 0; index1 < headerTab.fields.length; index1++) {
          headerTab.fields[index1].filters = null;
        }
        for (let index1 = 0; index1 < headerTab.fields.length; index1++) {
          if (
            headerTab.fields[index1].nt_base_reference_id !== FieldReference.Button &&
            headerTab.fields[index1].isdisplayed === "Y" &&
            headerTab.fields[index1].isactive === "Y" &&
            headerTab.fields[index1].showinrelation === "Y"
          ) {
            for (let index2 = 0; index2 < data.length; index2++) {
              if (data[index2].filterBy.replace(/[^a-zA-Z0-9-, ]/g, "") === headerTab.fields[index1].ad_field_id) {
                headerTab.fields[index1].filters = [data[index2].filterTerm.replace(/[^a-zA-Z0-9-, ]/g, "")];
              }
            }
          } else {
            headerTab.fields[index1].filters = null;
          }
        }
      }
      setWindowStore({ windowDefinition: windowDef });
      setFilterArray(viewFilters);
    }
  }, [viewFilters]);

  useEffect(() => {
    if (windowDefinition.tabs) {
      const headerTab = windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === "0")];
      headerTab.fields.sort((a, b) => {
        const x = a.grid_seqno !== null ? parseInt(a.grid_seqno) : a.grid_seqno;
        const y = b.grid_seqno !== null ? parseInt(b.grid_seqno) : b.grid_seqno;
        return (x != null ? x : Infinity) - (y != null ? y : Infinity);
      });
      setTabData(headerTab);
      const tabColumnsData = getTabColumns(headerTab);
      for (let index = 0; index < tabColumnsData.length; index++) {
        let title = tabColumnsData[index].title;
        tabColumnsData[index].title = <span className="dragHandler">{title}</span>;
      }
      if (dataSourceRecords.length > 0) {
        let filteredData = getFilterData(tabColumnsData, dataSourceRecords, headerTab);
        takeColumns([...filteredData]);
        setColumnsData([...filteredData]);
      }
    }
  }, [hideAndShowData, reOrderIndexes]);

  useEffect(() => {
    if (kanbanCardFlag !== null) {
      let groupDropdownData = [];
      for (var key in columnsData) {
        if (columnsData[key]["baseReferenceId"] === "17" || columnsData[key]["baseReferenceId"] === "19") {
          groupDropdownData.push({ Name: columnsData[key]["title"], RecordID: columnsData[key]["dataIndexWithoutIdn"], baseReferenceId: columnsData[key]["baseReferenceId"] });
        }
      }

      setGroupNameDropdDownData(groupDropdownData);

      if (displayKanban === "true") {
        setGetGroupNameModal(false);
        setDisplayKanban(false);
      } else {
        setGetGroupNameModal(kanbanCardFlag);
        setDisplayKanban(false);
      }
    }
  }, [kanbanCardFlag]);

  const [rowSelectionKeys, setRowSelectionKeys] = useState([]);
  const onSelectChange = (keys, selectedRows) => {
    setRowSelectionKeys([...keys]);
    setSelectedRowKeys([...selectedRows]);
  };

  const onCancel = () => {
    setGetGroupNameModal(false);
    setKanBanCardFlag(false);
  };

  const onCreate = (values) => {
    setDisplayKanban(true);
    setGetGroupNameModal(false);
  };

  const getBaseRefId = (key, value) => {
    let statusId = value["value"];
    let baseRefId = value["baseRefId"];
    let laneArray = [];
    let tableIdentifires = [];
    if (baseRefId === "19") {
      dataSourceRecords.filter((data) => {
        for (var key in data) {
          if (key === statusId) {
            let makeJsonForCard = { key: data[key], value: data[key] !== null ? data[key.concat("_iden")] : null /* data[key]!==null ? data[key].concat('_iden') : null */ };
            tableIdentifires.push(makeJsonForCard);
            laneArray.push(data[key]);
          }
        }

        return 0;
      });

      setCardsIdentifiers(tableIdentifires);
    } else {
      let cardsIdentifiers = columnsData[0]["listKeyAndValueArray"];
      cardsIdentifiers.filter((data) => {
        laneArray.push(data.key);
        return 0;
      });

      setCardsIdentifiers(columnsData[0]["listKeyAndValueArray"]);
    }

    setBaseRefId(baseRefId);

    let laneArrayData = [...new Set(laneArray)];

    let OnlyArray = [];
    let OnlyArrayRemove = [];
    for (let l = 0; l < laneArrayData.length; l += 1) {
      let temmArray = [];
      let temmArray1Remove = {};
      let newArrtoAdd = [];
      for (let k = 0; k < dataSourceRecords.length; k += 1) {
        if (laneArrayData[l] === "undefined") {
        } else {
          const recordTitle = tabData.title_field_id.split(",");
          const recordRow1 = tabData.row1_field_id.split(",");
          const recordRow2 = tabData.row2_field_id.split(",");
          const recordRow3 = tabData.row3_field_id.split(",");
          if (laneArrayData[l] === dataSourceRecords[k][statusId]) {
            let recordTitlesData = [];
            let recordRow1Data = [];
            let recordRow2Data = [];
            let recordRow3Data = [];
            for (const [key, value] of Object.entries(dataSourceRecords[k])) {
              for (let index = 0; index < recordTitle.length; index++) {
                const element = recordTitle[index];
                if (element === key) {
                  const newData = dataSourceRecords[k][key.concat("_iden")];
                  const newData1 = newData ? newData : dataSourceRecords[k][key];
                  recordTitlesData.push({
                    titleName: newData1,
                  });
                }
              }
              for (let index1 = 0; index1 < recordRow1.length; index1++) {
                const element = recordRow1[index1];
                if (element === key) {
                  const newData = dataSourceRecords[k][key.concat("_iden")];
                  const newData1 = newData ? newData : dataSourceRecords[k][key];
                  recordRow1Data.push({
                    recordRow1Name: newData1,
                  });
                }
              }
              for (let index2 = 0; index2 < recordRow2.length; index2++) {
                const element = recordRow2[index2];
                if (element === key) {
                  const newData = dataSourceRecords[k][key.concat("_iden")];
                  const newData1 = newData ? newData : dataSourceRecords[k][key];
                  recordRow2Data.push({
                    recordRow2Name: newData1,
                  });
                }
              }
              for (let index2 = 0; index2 < recordRow3.length; index2++) {
                const element = recordRow3[index2];
                if (element === key) {
                  const newData = dataSourceRecords[k][key.concat("_iden")];
                  const newData1 = newData ? newData : dataSourceRecords[k][key];
                  recordRow3Data.push({
                    recordRow3Name: newData1,
                  });
                }
              }
            }
            dataSourceRecords[k].recordTitlesData = recordTitlesData.reverse();
            dataSourceRecords[k].title_field_color = tabData.title_field_color;
            dataSourceRecords[k].recordRow1Data = recordRow1Data.reverse();
            dataSourceRecords[k].row1_field_color = tabData.row1_field_color;
            dataSourceRecords[k].recordRow2Data = recordRow2Data.reverse();
            dataSourceRecords[k].row2_field_color = tabData.row2_field_color;
            dataSourceRecords[k].recordRow3Data = recordRow3Data.reverse();
            dataSourceRecords[k].row3_field_color = tabData.row3_field_color;
            temmArray.push(dataSourceRecords[k]);
          }
        }
      }
      temmArray1Remove[laneArrayData[l]] = temmArray;
      OnlyArrayRemove.push(temmArray1Remove);
      OnlyArray.push(temmArray);
    }

    setStatusIdForCard(statusId);
    setLaneArray(laneArrayData);
    setSendDataToCard(OnlyArrayRemove);
  };

  useEffect(() => {
    const windowDef = { ...windowDefinition };
    if (windowDef.tabs) {
      const headerTab = windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === "0")];
      headerTab.fields.sort((a, b) => {
        const x = a.grid_seqno !== null ? parseInt(a.grid_seqno) : a.grid_seqno;
        const y = b.grid_seqno !== null ? parseInt(b.grid_seqno) : b.grid_seqno;
        return (x != null ? x : Infinity) - (y != null ? y : Infinity);
      });
      for (let index1 = 0; index1 < headerTab.fields.length; index1++) {
        if (
          headerTab.fields[index1].nt_base_reference_id !== FieldReference.Button &&
          headerTab.fields[index1].isdisplayed === "Y" &&
          headerTab.fields[index1].isactive === "Y" &&
          headerTab.fields[index1].showinrelation === "Y"
        ) {
          for (let index2 = 0; index2 < columnsData.length; index2++) {
            if (columnsData[index2].dataIndex.replace("_iden", "") === headerTab.fields[index1].ad_field_id) {
              headerTab.fields[index1].gridlength = columnsData[index2].width;
            }
          }
        }
      }
    }
    setWindowStore({ windowDefinition: windowDef });
  }, [columnsData]);

  const rowSelection = {
    selectedRowKeys: rowSelectionKeys,
    onChange: onSelectChange,
    hideSelectAll: false,
    fixed: true,
  };

  const debouncedSearchKey = useDebounce(searchKey, 350);
  useEffect(() => {
    if (searchKey !== null) {
      if (debouncedSearchKey || debouncedSearchKey === "") {
        getLineSearchDataValue(debouncedSearchKey.trim());
      }
    }
  }, [debouncedSearchKey]);

  const getLineSearchDataValue = async (SearchValue) => {
    setLoading(true);
    const getTabRecordsResponse = await getTabRecords({ ad_tab_id: tabData.ad_tab_id, search: SearchValue, startRow: "0", endRow: `${tabData.pagelimit}` });
    setDataSourceRecords([...getTabRecordsResponse]);
    setLoading(false);
  };

  let scrollLeft;
  const fetchMoreData = (event) => {
    const maxScroll = event.target.scrollHeight - event.target.clientHeight;
    const currentScroll = event.target.scrollTop;

    if (scrollLeft !== event.target.scrollLeft) {
      scrollLeft = event.target.scrollLeft;
      return null;
    }

    if (Math.round(currentScroll) === Math.round(maxScroll)) {
      setLoading(true);
      const tabColumnsData = getTabColumns(tabData);
      const recordOffset = dataSourceRecords.length;
      if (finalFilterArray.length > 0) {
        getTabRecords({
          ad_tab_id: tabData.ad_tab_id,
          startRow: `${recordOffset}`,
          endRow: `${tabData.pagelimit}`,
          filterData: finalFilterArray,
          sortInfo: finalSorterArray.length !== 0 ? finalSorterArray : null,
        })
          .then((getTabRecordsResponse) => {
            if (getTabRecordsResponse.length > 0) {
              const newSourceRecords = dataSourceRecords.concat(getTabRecordsResponse);
              let newFilteredData = getFilterData(tabColumnsData, newSourceRecords, tabData);
              setDataSourceRecords([...newSourceRecords]);
              takeColumns([...newFilteredData]);
              setColumnsData([...newFilteredData]);
            } else {
              message.info("No More Records !");
            }
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        getTabRecords({
          ad_tab_id: tabData.ad_tab_id,
          startRow: `${recordOffset}`,
          endRow: `${tabData.pagelimit}`,
          sortInfo: finalSorterArray.length !== 0 ? finalSorterArray : null,
        })
          .then((getTabRecordsResponse) => {
            if (getTabRecordsResponse.length > 0) {
              const newSourceRecords = dataSourceRecords.concat(getTabRecordsResponse);
              let newFilteredData = getFilterData(tabColumnsData, newSourceRecords, tabData);
              setDataSourceRecords([...newSourceRecords]);
              takeColumns([...newFilteredData]);
              setColumnsData([...newFilteredData]);
            } else {
              message.info("No More Records !");
            }
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      }
    }
  };

  useEffect(() => {
    const antTableBody = document.querySelector(".ant-table-body");
    if (treeViewFlag === false) {
      antTableBody.addEventListener("scroll", fetchMoreData);
    }
    return () => antTableBody.removeEventListener("scroll", fetchMoreData);
  }, [tabData, dataSourceRecords]);

  useEffect(() => {
    if (lastRefreshed) {
      getLineSearchDataValue("");
    }
  }, [lastRefreshed]);

  const handleOnExpand = (expanded, record) => {
    if (expanded === true) {
      setKeys([...keys, record.key]);
    } else {
      let arrKeys = [];
      for (let index = 0; index < keys.length; index++) {
        if (record.key !== keys[index]) {
          arrKeys.push(keys[index]);
        }
      }
      setKeys(arrKeys);
    }
  };

  const expandedRowRender = (record) => {
    if (windowDefinition.tabs) {
      const firstLevelTabs = windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === "1")];
      firstLevelTabs.fields.sort((p, c) => parseInt(p.grid_seqno) - parseInt(c.grid_seqno));
      const tabColumnsData = getTabColumns(firstLevelTabs);
      const data = nestedData[record.recordId];

      return (
        <Table
          style={{ fontSize: "12px" }}
          size="small"
          sticky={true}
          scroll={{ y: "60vh" }}
          columns={tabColumnsData}
          dataSource={nestedData[record.recordId]}
          loading={isLoading[record.recordId] && !data}
          pagination={false}
        />
      );
    }
  };

  const handleExpand = (expanded, record) => {
    setIsLoading({
      [record.recordId]: true,
    });
    if (expanded === true) {
      getTabRecords({ ad_tab_id: tabData.child_tab_id, parentTabId: tabData.ad_tab_id, parentRecordID: record.recordId, startRow: "0", endRow: `${tabData.pagelimit}` }).then(
        (getTabRecordsResponse) => {
          setNestedData((state) => ({
            ...state,
            [record.recordId]: getTabRecordsResponse,
          }));
        }
      );
      setNestedKeys([...nestedKeys, record.key]);
    } else {
      let arrKeys = [];
      for (let index = 0; index < nestedKeys.length; index++) {
        if (record.key !== nestedKeys[index]) {
          arrKeys.push(nestedKeys[index]);
        }
      }
      setNestedKeys(arrKeys);
    }
  };

  useEffect(() => {
    const windowDef = { ...windowDefinition };
    if (windowDef) {
      windowDef.keys = keys;
    }
    setWindowStore({ windowDefinition: windowDef });
  }, [keys]);

  const handleTableChange = (pagination, filters, sorter) => {
    const windowDef = { ...windowDefinition };
    if (windowDef.tabs) {
      const headerTab = windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === "0")];
      headerTab.fields.sort((a, b) => {
        const x = a.grid_seqno !== null ? parseInt(a.grid_seqno) : a.grid_seqno;
        const y = b.grid_seqno !== null ? parseInt(b.grid_seqno) : b.grid_seqno;
        return (x != null ? x : Infinity) - (y != null ? y : Infinity);
      });
      for (let index1 = 0; index1 < headerTab.fields.length; index1++) {
        if (
          headerTab.fields[index1].nt_base_reference_id !== FieldReference.Button &&
          headerTab.fields[index1].isdisplayed === "Y" &&
          headerTab.fields[index1].isactive === "Y" &&
          headerTab.fields[index1].showinrelation === "Y"
        ) {
          for (let index2 = 0; index2 < Object.keys(filters).length; index2++) {
            if (Object.keys(filters)[index2].replace("_iden", "") === headerTab.fields[index1].ad_field_id) {
              if (Object.values(filters)[index2] !== undefined) {
                headerTab.fields[index1].filters = Object.values(filters)[index2];
              } else {
                headerTab.fields[index1].filters = null;
              }
            }
          }
        } else {
          headerTab.fields[index1].filters = null;
        }
      }
    }
    setWindowStore({ windowDefinition: windowDef });
    setSorterArray(sorter);
    setFilterArray(filters);
  };

  useEffect(() => {
    if (filterFlag) {
      const windowDef = { ...windowDefinition };
      if (windowDef.tabs) {
        const headerTab = windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === "0")];
        headerTab.fields.sort((a, b) => {
          const x = a.grid_seqno !== null ? parseInt(a.grid_seqno) : a.grid_seqno;
          const y = b.grid_seqno !== null ? parseInt(b.grid_seqno) : b.grid_seqno;
          return (x != null ? x : Infinity) - (y != null ? y : Infinity);
        });
        for (let index1 = 0; index1 < headerTab.fields.length; index1++) {
          if (
            headerTab.fields[index1].nt_base_reference_id !== FieldReference.Button &&
            headerTab.fields[index1].isdisplayed === "Y" &&
            headerTab.fields[index1].isactive === "Y" &&
            headerTab.fields[index1].showinrelation === "Y"
          ) {
            headerTab.fields[index1].filters = null;
          }
        }
      }
      setWindowStore({ windowDefinition: windowDef });
      setFilterArray({});
    }
  }, [filterFlag]);

  const components = {
    header: {
      cell: ResizableCell,
    },
  };

  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      let startIndex, endIndex;
      if (tabData.enablenestedtab === "Y") {
        startIndex = fromIndex - 2;
        endIndex = toIndex - 2;
      } else {
        startIndex = fromIndex - 1;
        endIndex = toIndex - 1;
      }
      let tempDataindexes = [];
      for (let index = 0; index < columnsData.length; index++) {
        if (index === startIndex) {
          tempDataindexes.push(columnsData[index].dataIndex.replace("_iden", ""));
        }
      }
      for (let index = 0; index < columnsData.length; index++) {
        if (index === endIndex) {
          tempDataindexes.push(columnsData[index].dataIndex.replace("_iden", ""));
        }
      }
      let index1, index2;
      const windowDef = { ...windowDefinition };
      if (windowDef.tabs) {
        const headerTab = windowDef.tabs[windowDef.tabs.findIndex((tab) => tab.tablevel === "0")];
        headerTab.fields.sort((a, b) => {
          const x = a.grid_seqno !== null ? parseInt(a.grid_seqno) : a.grid_seqno;
          const y = b.grid_seqno !== null ? parseInt(b.grid_seqno) : b.grid_seqno;
          return (x != null ? x : Infinity) - (y != null ? y : Infinity);
        });
        for (let index = 0; index < headerTab.fields.length; index++) {
          if (headerTab.fields[index].nt_base_reference_id !== FieldReference.Button && headerTab.fields[index].isdisplayed === "Y" && headerTab.fields[index].isactive === "Y") {
            if (tempDataindexes[0] === headerTab.fields[index].ad_field_id) {
              index1 = index;
            }
          }
        }
        for (let index = 0; index < headerTab.fields.length; index++) {
          if (headerTab.fields[index].nt_base_reference_id !== FieldReference.Button && headerTab.fields[index].isdisplayed === "Y" && headerTab.fields[index].isactive === "Y") {
            if (tempDataindexes[1] === headerTab.fields[index].ad_field_id) {
              index2 = index;
            }
          }
        }
        const item = headerTab.fields.splice(index1, 1)[0];
        headerTab.fields.splice(index2, 0, item);
        for (let index = 0; index < headerTab.fields.length; index++) {
          if (headerTab.fields[index].nt_base_reference_id !== FieldReference.Button && headerTab.fields[index].isdisplayed === "Y" && headerTab.fields[index].isactive === "Y") {
            headerTab.fields[index].grid_seqno = index;
          }
        }
      }
      setWindowStore({ windowDefinition: windowDef });
      takeHideAndShowTitles([index1, index2]);
      setReOrderIndexes([index1, index2]);
    },
    nodeSelector: "th",
    handleSelector: ".dragHandler",
    ignoreSelector: "react-resizable-handle",
  };

  useEffect(() => {
    if (windowDefinition.tabs) {
      const headerTab = windowDefinition.tabs[windowDefinition.tabs.findIndex((tab) => tab.tablevel === "0")];
      if (Object.values(summaryData).length > 0) {
        let finalSummaryData = JSON.stringify(summaryData).replace(/"/g, '\\"');
        getTabSummary({ tabId: headerTab.ad_tab_id, filterData: finalFilterArray, summaryData: finalSummaryData }).then((getTabSummaryResponse) => {
          setSummaryResponse(JSON.parse(getTabSummaryResponse));
        });
      } else {
        setSummaryResponse({});
      }
    }
  }, [summaryData, finalFilterArray]);

  const summary = () => {
    let arr = [];
    const userPreferences = JSON.parse(localStorage.getItem("userPreferences"));
    for (let index1 = 0; index1 < Object.values(summaryResponse).length; index1++) {
      for (let index2 = 0; index2 < Object.values(summaryResponse)[index1].length; index2++) {
        for (let index3 = 0; index3 < Object.values(Object.values(summaryResponse)[index1][index2]).length; index3++) {
          const fixedValue = parseInt(userPreferences.decimalPlaces);
          const numberValue = parseFloat(Object.values(Object.values(summaryResponse)[index1][index2])[index3]).toFixed(fixedValue);
          if (!isNaN(numberValue)) {
            Object.values(summaryResponse)[index1][index2][Object.keys(Object.values(summaryResponse)[index1][index2])[index3]] = numberValue;
          }
        }
      }
    }
    if (Object.keys(summaryResponse).length > 0) {
      for (let index1 = 0; index1 < Object.values(summaryResponse).length; index1++) {
        for (let index2 = 0; index2 < Object.values(summaryResponse)[index1].length; index2++) {
          Object.assign(Object.values(summaryResponse)[index1][index2], { key: Object.keys(summaryResponse)[index1] });
          arr.push(Object.values(summaryResponse)[index1][index2]);
        }
      }
    }
    let totalArr = [];
    if (tabData.enablenestedtab === "Y") {
      for (let index = 0; index < columnsData.length + 2; index++) {
        totalArr[index] = 0;
      }
    } else {
      for (let index = 0; index < columnsData.length + 1; index++) {
        totalArr[index] = 0;
      }
    }
    for (let index = 0; index < columnsData.length; index++) {
      if (columnsData[index].baseReferenceId === "22" || columnsData[index].baseReferenceId === "10") {
        if (tabData.enablenestedtab === "Y") {
          totalArr[index + 2] = columnsData[index].dataIndex.replace("_iden", "");
        } else {
          totalArr[index + 1] = columnsData[index].dataIndex.replace("_iden", "");
        }
      }
    }
    if (tabData.enablenestedtab === "Y") {
      totalArr.splice(2, 1, "key");
    } else {
      totalArr.splice(1, 1, "key");
    }
    let finalArr = [];
    for (let index1 = 0; index1 < arr.length; index1++) {
      let tempArr = [];
      for (let index2 = 0; index2 < Object.keys(arr[index1]).length; index2++) {
        for (let index3 = 0; index3 < totalArr.length; index3++) {
          if (totalArr[index3] === Object.keys(arr[index1])[index2]) {
            tempArr[index3] = Object.values(arr[index1])[index2];
          }
        }
      }
      finalArr[index1] = tempArr;
    }
    for (let index1 = 0; index1 < finalArr.length; index1++) {
      for (let index2 = 0; index2 < finalArr[index1].length; index2++) {
        if (finalArr[index1][index2] === undefined) {
          finalArr[index1][index2] = "";
        }
      }
    }
    return (
      <Table.Summary fixed>
        {finalArr.map((data, index) => {
          return (
            <Table.Summary.Row key={index}>
              {data.map((summaryItem, index) => {
                return (
                  <Table.Summary.Cell key={index}>
                    <Text>{summaryItem}</Text>
                  </Table.Summary.Cell>
                );
              })}
            </Table.Summary.Row>
          );
        })}
      </Table.Summary>
    );
  };

  const columns = columnsData.map((col, index) => ({
    ...col,
    onHeaderCell: (columns) => ({
      width: columns.width,
      onResize: handleResize(index),
    }),
  }));
  const handleResize =
    (index) =>
    (e, { size }) => {
      setColumnsData((columns) => {
        const nextColumns = [...columns];
        nextColumns[index] = {
          ...nextColumns[index],
          width: size.width,
        };
        return nextColumns;
      });
    };

  useEffect(() => {
    let arr = [];
    expandTreeViewData.forEach((data, index) => {
      arr.push(data.key);
    });
    setKeys(arr);
  }, [expandTreeViewFlag]);

  useEffect(() => {
    setKeys([]);
  }, [collapseTreeViewFlag]);

  return (
    <Fragment>
      {displayKanban === true ? (
        <StoryBook baseRefId={baseRefId} identiFiers={cardsIdentifiers} statusID={statusIdForCard} laneData={laneArray} cardData={sendDataToCard} hederTabData={tabData} />
      ) : tabData.enablenestedtab === "Y" ? (
        <ReactDragListView.DragColumn {...dragProps}>
          <Table
            style={Themes.contentWindow.listWindowTable}
            size="small"
            scroll={{ y: "72vh", x: "100%" }}
            sticky={true}
            pagination={false}
            loading={{
              spinning: loading,
              indicator: <LoadingOutlined className="spinLoader" style={{ fontSize: "52px" }} spin />,
            }}
            dataSource={dataSourceRecords}
            columns={columns}
            components={components}
            rowSelection={rowSelection}
            onRow={(record) => ({
              onClick: () => {
                history.push(`/window/${windowDefinition.ad_window_id}/${record.recordId}`);
              },
            })}
            expandedRowRender={expandedRowRender}
            onExpand={handleExpand}
            onChange={handleTableChange}
            expandedRowKeys={nestedKeys}
            summary={summary}
          />
        </ReactDragListView.DragColumn>
      ) : (
        <ReactDragListView.DragColumn {...dragProps}>
          <Table
            style={Themes.contentWindow.listWindowTable}
            size="small"
            scroll={{ y: "72vh", x: "100%" }}
            sticky={true}
            pagination={false}
            loading={{
              spinning: loading,
              indicator: <LoadingOutlined className="spinLoader" style={{ fontSize: "52px" }} spin />,
            }}
            dataSource={dataSourceRecords}
            columns={columns}
            components={components}
            rowSelection={rowSelection}
            onRow={(record) => ({
              onClick:
                treeViewFlag === false
                  ? () => {
                      history.push(`/window/${windowDefinition.ad_window_id}/${record.recordId}`);
                    }
                  : null,
            })}
            onChange={handleTableChange}
            onExpand={handleOnExpand}
            expandedRowKeys={keys}
            summary={summary}
          />
        </ReactDragListView.DragColumn>
      )}
      <div>
        <Modal
          visible={getGroupNameModal}
          onCancel={onCancel}
          width="350px"
          maskClosable={false}
          footer={[
            <Button style={{ background: "white", color: "gray", fontSize: "14px" }} onClick={onCancel}>
              Cancel
            </Button>,
            <Button
              style={{ background: "#3E7A86", color: "#ffffff", fontSize: "14px" }}
              key="submit"
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => {
                    form.resetFields();
                    onCreate(values);
                  })
                  .catch((info) => {
                    console.warn("Validate Failed:", info);
                  });
              }}
            >
              NEXT
            </Button>,
          ]}
        >
          <Form form={form} layout="vertical" name="form_in_modal" initialValues={{ modifier: "public" }}>
            <Form.Item
              label="Select Group Name"
              name="groupname"
              rules={[
                {
                  required: true,
                  message: `Please Select Group Name`,
                },
              ]}
              style={Themes.contentWindow.recordWindow.RecordHeader.RecordForm.FormField.FormItem}
            >
              <Select onSelect={getBaseRefId} showSearch style={{ width: "100%" }} optionFilterProp="children" allowClear={true}>
                {groupNameDropdDownData.map((option, index) => (
                  <Option key={`${option.RecordID}`} value={option.RecordID} baseRefId={option.baseReferenceId}>
                    {option.Name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Fragment>
  );
};

export default ListWindowLines;
