import { useState } from "react";
import { Datatable, defaultSearch, defaultSort } from "../src/Datatable";
import json from "./data";
function getSelectRow(data) {
  console.log(data);
}

function Columns() {
  return [
    {
      key: "id",
      label: "Id",
      sortable: true,
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "edit",
      label: "Edit",

      value: (row) => <a href={"/edit/" + row.id}>edit</a>,
    },
  ];
}
export default function Demo() {
  const [data, setData] = useState(json);
  const [loading, setLoading] = useState(false);
  function search(key) {
    const searchData = defaultSearch({ data: json, key: key });

    setData(key.length ? searchData : json);
  }
  function sort(key, direction) {
    setData(defaultSort({ data, key: key, direction: direction }));
  }

  function getApiParams(data) {
    console.log(data);
  }
  return (
    <Datatable
      columns={Columns()}
      data={data}
      checkbox={true}
      getSelectedData={getSelectRow}
      search={search}
      loader={<span>Loading...</span>}
      loading={loading}
      sort={sort}
      getApiParams={getApiParams}
    />
  );
}
