import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const App = () => {
  const [data, setData] = useState({});
  const [search, setSearch] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.getFullYear(); // Only return the year
  };
  
  useEffect(() => {
    fetch("/ecfr-app/data.json")
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData))
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  const getYAxisRange = (wordCounts) => {
    // Extract all count values from the wordCounts object
    const counts = Object.values(wordCounts);
    const min = Math.min(...counts);
    const max = Math.max(...counts);

    // Adjust range to ensure the axis covers a bit beyond the min and max
    const padding = (max - min) * 0.1;
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  };

  const formatYAxisTick = (tick) => {
    // Format the tick values to be rounded to the nearest 10
    console.log('start')
    var exp = Math.floor(Math.log10(tick))-2
    const increment = Math.max(10**exp, 1)
    tick = Math.round(Math.round(tick / increment) * increment);
    if (tick >= 1000000) {
      return (tick / 1000000).toFixed(2) + "M"; // Format millions
    } else if (tick >= 1000) {
      return (tick / 1000).toFixed(2) + "K"; // Format thousands
    } else {
      return 0
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search titles..."
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.values(data)
          .filter(({ title_name }) => title_name.toLowerCase().includes(search))
          .map(({ title_name, word_counts }, index) => {
            const yAxisRange = getYAxisRange(word_counts);
            return (
              <div key={index} className="border p-4 rounded shadow">
                <h2 className="text-lg font-bold mb-2">{title_name}</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={Object.entries(word_counts).map(([date, count]) => ({ date: formatDate(date), count }))}
                    margin={{ top: 20, right: 30, left: 30, bottom: 50 }}
                  >
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      dx={-10}
                    />
                    <YAxis
                      domain={yAxisRange} // Set the y-axis range dynamically
                      tickFormatter={formatYAxisTick} // Format the ticks to round numbers
                    />
                    <Tooltip />
                    <Line
                      type="monotone" // "monotone" gives smooth lines
                      dataKey="count"
                      stroke="#4A90E2" // Line color
                      strokeWidth={2} // Thickness of the line
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default App;
