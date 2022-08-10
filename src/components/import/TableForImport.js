import React from "react";
import { Table } from "antd";
// const { Text } = Typography;

const TableForImport = (props) => {
  const {columnsData,gridData}=props
  return (
    <div>
      <Table
        size="small"
        sticky={true}
        scroll={{ y: "58vh", x: "100%" }}
        columns={columnsData}
        dataSource={gridData}
        pagination={false}
      />
    </div>
  );
};

export default TableForImport;
