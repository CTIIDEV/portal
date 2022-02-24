import { Table } from "antd";

import "./chartsLineBD.css";

export const ChartsLineBD = ({ data }) => {
  const { Column } = Table;

  return (
    <div className="chartsLineBD">
      <div className="componentContainer">
        <span className="componentTitle">Reveue Growth Breakdown</span>
      </div>
      <Table
        dataSource={data}
        pagination={{
          pageSize: 5,
          simple: true,
        }}
      >
        <Column title="Name" dataIndex="name" />
        <Column
          title="Year"
          dataIndex="year"
          defaultSortOrder="ascend"
          sorter={(a, b) => a.year - b.year}
        />
        <Column title="Value" dataIndex="value" />
      </Table>
    </div>
  );
};
