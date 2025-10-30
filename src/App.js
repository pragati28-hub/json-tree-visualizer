import React, { useState } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

const nodeTypes = {};
const edgeTypes = {};

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Handle visualization
  function handleVisualize() {
    try {
      const data = JSON.parse(jsonInput);
      const newNodes = [];
      const newEdges = [];

      let y = 0;
      const rootId = "root";

      newNodes.push({
        id: rootId,
        data: { label: "Root" },
        position: { x: 250, y: y },
        style: {
          background: darkMode ? "#1e3a8a" : "#3b82f6",
          color: "white",
          padding: 8,
          borderRadius: 6,
        },
      });

      Object.entries(data).forEach(([key, value], i) => {
        const id = `node-${i}`;
        y += 100;
        newNodes.push({
          id,
          data: { label: `${key}: ${value}` },
          position: { x: 250, y: y },
          style: {
            background: darkMode ? "#2563eb" : "#93c5fd",
            color: darkMode ? "white" : "black",
            padding: 6,
            borderRadius: 6,
          },
        });
        newEdges.push({ id: `e-${rootId}-${id}`, source: rootId, target: id });
      });

      setNodes(newNodes);
      setEdges(newEdges);
      setError("");
    } catch (e) {
      setError("❌ Invalid JSON format!");
    }
  }

  // Handle clear/reset
  function handleClear() {
    setJsonInput("");
    setNodes([]);
    setEdges([]);
    setError("");
  }

  // Handle dark/light toggle
  function toggleMode() {
    setDarkMode(!darkMode);
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center p-6 transition-all ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h1 className="text-2xl font-bold mb-4">
        JSON Tree Visualizer ({darkMode ? "Dark" : "Light"} Mode)
      </h1>

      <div className="flex gap-3 mb-4">
        <button
          onClick={toggleMode}
          className={`px-4 py-2 rounded ${
            darkMode
              ? "bg-yellow-400 text-black hover:bg-yellow-300"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          Toggle {darkMode ? "Light" : "Dark"} Mode
        </button>

        <button
          onClick={handleClear}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear All
        </button>
      </div>

      <textarea
        className={`w-11/12 md:w-2/3 h-40 border rounded p-3 text-sm mb-3 ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border-gray-400"
        }`}
        placeholder='Enter JSON like {"name":"Pragati","city":"Pune"}'
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      ></textarea>

      <button
        onClick={handleVisualize}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        Visualize
      </button>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div
        className={`w-11/12 md:w-3/4 h-[500px] rounded-lg border ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
        }`}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;
