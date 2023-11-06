import React, { useEffect, useRef, useState } from "react";

export const defaultSearch = ({ data, key }) => {
  key = key.toLowerCase(); // Convert search term to lowercase for case-insensitive search

  // Use Array.filter to filter the objects that match the search term
  let results = data.filter((item) => {
    return Object.values(item).some((value) => {
      if (typeof value === "string") {
        return (
          value.toLocaleLowerCase().startsWith(key) ||
          value.toLocaleLowerCase().endsWith(key)
        );
      }
      return false; // Ignore non-string values
    });
  });
  //add includes if no results found
  if (!results.length) {
    results = data.filter((item) => {
      return Object.values(item).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(key);
        }
        return false; // Ignore non-string values
      });
    });
  }
  return results;
};

export const defaultSort = ({ data, key, direction }) => {
  // Use the sort method to sort the JSON data based on the specified key
  data.sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    if (direction == "asc") {
      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    } else {
      return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
    }
  });

  return data;
};

export const Datatable = ({
  checkbox,
  columns,
  data,
  elements,
  search,
  sort,
  headers = true,
  getSelectedData,
  loading,
  loader,
  getApiParams,
  pagination,
  noData,
  perpage = 10,
}) => {
  const [sortDetails, setSortDetails] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [apiParams, setApiParams] = useState({
    key: "",
    page: 1,
    perpage: perpage,
  });
  const inputValueRef = useRef(null);
  let timeoutId;
  const toggleRowSelection = (row) => {
    const selectedRowsData = new Set(selectedRows);
    if (selectedRowsData.has(row)) {
      selectedRowsData.delete(row);
    } else {
      selectedRowsData.add(row);
    }
    getSelectedData(Array.from(selectedRowsData));
    setSelectedRows(Array.from(selectedRowsData));
  };

  const selectAllRows = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      getSelectedData(Array.from(data));
      setSelectedRows(data);
    }
  };

  const handleSort = (column) => {
    const currentSortDirection = sortDetails.sortDirection || "asc";
    const newSortDirection = currentSortDirection === "asc" ? "desc" : "asc";
    // Update sortDetails with the new sort direction
    const updatedSortDetails = {
      sortBy: column.key,
      sortDirection: newSortDirection,
    };
    // Update apiParams for sorting
    const updatedApiParams = {
      ...apiParams,
      ...updatedSortDetails,
    };
    // Call the sort function with the new sort details

    setSortDetails(updatedSortDetails);
    if (sort) {
      sort(column.key, newSortDirection, updatedSortDetails);
    } else {
      setApiParams(updatedApiParams);
    }
  };
  useEffect(() => {
    inputValueRef.current.value = apiParams.key;

    if (getApiParams) {
      // Set a new timeout to update the state after a delay
      getApiParams(apiParams);
    }
  }, [apiParams]);
  return (
    <section className="datatable">
      {headers && (
        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            padding: "10px 0px",
          }}
        >
          {elements && elements}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: "5px",
              placeItems: "center",
            }}
          >
            {loading ? loader : ""}
            <input
              type="search"
              placeholder="Search"
              className="search_input"
              ref={inputValueRef}
              onChange={(e) => {
                const newKey = e.target.value;
                inputValueRef.current.value = newKey;
                const updatedApiParams = { ...apiParams, key: newKey };

                // If you also want to use this key for searching, call the search function here
                if (search) {
                  search(newKey, data);
                } else {
                  // Clear the previous timeout, if any
                  if (timeoutId) {
                    clearTimeout(timeoutId);
                  }

                  // Set a new timeout to update the state after a delay
                  timeoutId = setTimeout(() => {
                    setApiParams(updatedApiParams);
                  }, 300);
                }
              }}
            />
          </div>
        </header>
      )}

      <article style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              {checkbox && (
                <th key="checkbox__">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length}
                    onChange={selectAllRows}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th key={column.key}>
                  <div
                    style={{
                      display: "flex",
                      placeItems: "center",
                      gap: "10px",
                    }}
                  >
                    {column.label ? column.label : column.key}
                    {column.sortable && (
                      <button
                        onClick={() => handleSort(column)}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        {/* sortDetails[column.key] == "asc" */}

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          style={{
                            height: "10px",
                            width: "10px",
                            opacity:
                              sortDetails.sortBy == [column.key]
                                ? sortDetails.sortDirection == "asc"
                                  ? 10
                                  : 0.5
                                : 1,
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 15.75l7.5-7.5 7.5 7.5"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          style={{
                            height: "10px",
                            width: "10px",
                            opacity:
                              sortDetails.sortBy == [column.key]
                                ? sortDetails.sortDirection == "desc"
                                  ? 10
                                  : 0.5
                                : 1,
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {checkbox && (
                    <td key={"checkbox__" + rowIndex}>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row)}
                        onChange={() => toggleRowSelection(row)}
                      />
                    </td>
                  )}
                  {columns.map((column, columnIndex) => (
                    <td key={columnIndex}>
                      {column.value ? column.value(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (checkbox ? 1 : 0)}>
                  {noData
                    ? noData
                    : loading
                    ? "Loading..."
                    : " No data available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </article>
      {pagination && (
        <section className="pagination">
          <button
            onClick={() => {
              if (apiParams.page && apiParams.page > 1) {
                const updatedApiParams = {
                  ...apiParams,
                  page: apiParams.page - 1,
                };

                setApiParams(updatedApiParams);
              }
            }}
            disabled={apiParams.page && apiParams.page < 2 ? true : false}
          >
            Previous
          </button>
          <select
            onChange={(e) => {
              const updatedApiParams = {
                ...apiParams,
                perpage: e.target.value,
              };
              setApiParams(updatedApiParams);
            }}
          >
            {[perpage, 50, 100, 999999999999].map((a, i) => (
              <option value={a} key={i}>
                {a == 999999999999 ? "All" : a}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (apiParams.page) {
                const updatedApiParams = {
                  ...apiParams,
                  page: apiParams.page + 1,
                };

                setApiParams(updatedApiParams);
              }
            }}
            disabled={data.length ? false : true}
          >
            Next
          </button>
        </section>
      )}
    </section>
  );
};
