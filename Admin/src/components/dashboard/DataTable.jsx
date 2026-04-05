const DataTable = ({ columns, rows, emptyText = "No data available." }) => {
  if (!rows.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center text-sm text-gray-500">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wider text-gray-500">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-3 py-3 font-semibold ${column.align === "right" ? "text-right" : ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={row.id || row._id || rowIndex}
              className="border-b border-gray-100"
            >
              {columns.map((column) => (
                <td
                  key={`${column.key}-${row.id || row._id || rowIndex}`}
                  className={`px-3 py-3 text-gray-700 ${column.align === "right" ? "text-right" : ""}`}
                >
                  {typeof column.render === "function"
                    ? column.render(row, rowIndex)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
