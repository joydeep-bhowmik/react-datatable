

# Documentation

The Datatable component is a flexible and customizable table component for rendering and manipulating tabular data in React applications. It provides features like searching, sorting, and row selection, making it a versatile tool for displaying data.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Importing the Component](#importing-the-component)
  - [Defining Columns](#defining-columns)
  - [Handling Data](#handling-data)
- [API](#api)
  - [Props](#props)
  - [Utility Functions](#utility-functions)
- [Default Styles](#default-styles)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Installation

To use the Datatable component in your React application, you need to install it as a dependency.

```bash
npm install joydeep-react-datatable
```

## Usage

### Importing the Component

Import the Datatable component and the utility functions as follows:

```javascript
import { Datatable, defaultSearch, defaultSort } from "joydeep-react-datatable";
```

```js
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
```

### Defining Columns

Define an array of column configurations for the table using the `Columns` function. Each column should have a unique `key`, a `label` for the header, and can be marked as `sortable`. You can also provide a custom `value` function to render column data.

```javascript
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
      value: (row) => <a href={`/edit/${row.id}`}>edit</a>,
    },
  ];
}
```

### Handling Data

Manage your data and state using the React `useState` hook. You can use the `search` and `sort` functions to update the data state based on user interactions. Additionally, you can use the `getApiParams` function to capture and handle API-related parameters.

```javascript
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
```

## API

### Props

Here are the available props for the Datatable component:

- `columns` (Array): An array of column configurations.
- `data` (Array): The data to be displayed in the table.
- `checkbox` (Boolean): Enable row selection with checkboxes.
- `getSelectedData` (Function): Callback function to handle selected rows.
- `search` (Function): Function for handling search functionality.
- `loader` (React Element): Loading indicator displayed during data loading.
- `loading` (Boolean): Indicates whether data is currently loading.
- `sort` (Function): Function for handling sorting functionality.
- `getApiParams` (Function): Function to notify the parent component of API parameters.
- `pagination` (Boolean): Enable pagination for the table.
- `elements` (React Element): Additional elements to be displayed in the header.

### Utility Functions

The Datatable component includes two utility functions for searching and sorting data:

- `defaultSearch({ data, key })`: Perform a case-insensitive search on the data array based on the search key.
- `defaultSort({ data, key, direction })`: Sort the data array based on the specified key and direction.

## default Styles

```js
import "joydeep-react-datatable/src/datatable.css";
```

## Examples

You can find example usage of the Datatable component in this [demo](https://github.com/joydeep-bhowmik/react-datatable/blob/main/tests/Demotable.jsx). The example demonstrate how to integrate the component into your React application for displaying and manipulating data.

## Contributing

We welcome contributions to the Datatable component! If you have any ideas, bug reports, or improvements, please feel free to open an issue or create a pull request on our GitHub repository.

## License

This component is open-source and available under the [MIT License](LICENSE).
