const SimpleBarChart = ({ data }) => {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  if (!data.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
        No chart data available yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      {data.map((item) => {
        const widthPercent = Math.max(
          (item.value / maxValue) * 100,
          item.value > 0 ? 6 : 0,
        );

        return (
          <div
            key={item.label}
            className="grid grid-cols-[84px_1fr_44px] items-center gap-3"
          >
            <span className="text-xs font-medium text-gray-500">
              {item.label}
            </span>
            <div className="h-3 rounded-full bg-gray-100">
              <div
                className="h-3 rounded-full bg-linear-to-r from-indigo-500 to-blue-500"
                style={{ width: `${widthPercent}%` }}
              />
            </div>
            <span className="text-right text-xs font-semibold text-gray-700">
              {item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SimpleBarChart;
