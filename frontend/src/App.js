import React from "react";
import Upload from "./pages/Upload";
import Results from "./pages/Results";

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    setData(null);
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      {!data
        ? <Upload setData={setData} setLoading={setLoading} loading={loading} />
        : <Results data={data} onReset={handleReset} />
      }
    </div>
  );
}