import React, { useState } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

export default function App() {
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(
      {
        name: "Rosia",
        age: 22,
        skills: ["React", "Java", "Spring Boot"],
        education: {
          degree: "MCA",
          year: 2025,
        },
      },
      null,
      2
    )
  );

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMessage, setSearchMessage] = useState("");

  // Generate nodes & edges from JSON
  const generateTree = (data, parentId = null, path = "root", x = 0, y = 0) => {
    let nodeList = [];
    let edgeList = [];

    const createNode = (id, label, type, path, x, y) => ({
      id,
      data: { label },
      position: { x, y },
      type,
      path,
      style: {
        background:
          type === "object"
            ? "#60a5fa" // blue
            : type === "array"
            ? "#4ade80" // green
            : "#fbbf24", // yellow
        color: "#000",
        borderRadius: 8,
        padding: 10,
        border: "1px solid #000",
        fontSize: 12,
        textAlign: "center",
        minWidth: 120,
      },
    });

    const traverse = (value, id, parentId, path, x, y) => {
      let type = typeof value;
      let label = "";

      if (Array.isArray(value)) {
        label = "Array";
        nodeList.push(createNode(id, label, "array", path, x, y));
        if (parentId) edgeList.push({ id: `${parentId}-${id}`, source: parentId, target: id });
        value.forEach((v, i) => traverse(v, `${id}-${i}`, id, `${path}[${i}]`, x + 200, y + i * 100));
      } else if (type === "object" && value !== null) {
        label = "Object";
        nodeList.push(createNode(id, label, "object", path, x, y));
        if (parentId) edgeList.push({ id: `${parentId}-${id}`, source: parentId, target: id });
        Object.keys(value).forEach((k, i) =>
          traverse(value[k], `${id}-${k}`, id, `${path}.${k}`, x + 200, y + i * 100)
        );
      } else {
        label = `${value}`;
        nodeList.push(createNode(id, label, "primitive", path, x, y));
        if (parentId) edgeList.push({ id: `${parentId}-${id}`, source: parentId, target: id });
      }
    };

    traverse(data, "root", null, path, x, y);
    return { nodes: nodeList, edges: edgeList };
  };

  // Visualize JSON
  const handleVisualize = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const { nodes, edges } = generateTree(parsed);
      setNodes(nodes);
      setEdges(edges);
      setSearchMessage("");
    } catch {
      alert("Invalid JSON format!");
    }
  };

  // Clear Input and Visualization
  const handleClear = () => {
    setJsonInput("");
    setNodes([]);
    setEdges([]);
    setSearchQuery("");
    setSearchMessage("");
  };

  // Toggle Dark/Light Mode
  const toggleTheme = () => setDarkMode(!darkMode);

  // Search Feature
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchMessage("Enter a search path (e.g., education.degree or skills[0])");
      return;
    }

    let found = false;
    const updatedNodes = nodes.map((n) => {
      if (n.path === `root.${searchQuery}` || n.path === searchQuery) {
        found = true;
        return {
          ...n,
          style: { ...n.style, background: "#f87171", color: "white", border: "2px solid #dc2626" },
        };
      }
      return n;
    });

    if (found) {
      setSearchMessage("✅ Match found!");
      setNodes(updatedNodes);
    } else {
      setSearchMessage("❌ No match found!");
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      } p-4 transition-all`}
    >
      <h1 className="text-3xl font-bold text-center mb-4">🌳 JSON Tree Visualizer</h1>

      {/* Buttons */}
      <div className="flex justify-center gap-3 mb-4 flex-wrap">
        <button
          onClick={handleVisualize}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Visualize
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear
        </button>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search (e.g., education.degree or skills[0])"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`p-2 w-80 border rounded-md ${
            darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white"
          }`}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Search
        </button>
      </div>

      {/* Search Message */}
      {searchMessage && <p className="text-center mb-2">{searchMessage}</p>}

      {/* Layout */}
      <div className="flex flex-col md:flex-row gap-4">
        <textarea
          className={`w-full md:w-1/3 h-96 p-3 border rounded-md font-mono text-sm ${
            darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white"
          }`}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Enter or paste JSON here..."
        />

        <div
          className={`w-full md:w-2/3 h-96 border rounded-md ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
          }`}
        >
          {nodes.length > 0 ? (
            <ReactFlow nodes={nodes} edges={edges} fitView>
              <Background />
              <Controls />
            </ReactFlow>
          ) : (
            <p className="text-center mt-40 text-gray-500">
              👆 Enter JSON and click “Visualize” to see the tree
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
