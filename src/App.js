import React, { useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import "./App.css";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const colors = {
    object: "#6C63FF",
    array: "#00B894",
    primitive: "#FFA500",
    highlight: "#FF4081",
  };

  // 🔹 Recursive function to build JSON tree
  const buildTree = (obj, parentId = "root", path = "$") => {
    const localNodes = [];
    const localEdges = [];

    if (typeof obj === "object" && obj !== null) {
      const entries = Array.isArray(obj) ? [...obj.entries()] : Object.entries(obj);

      for (let [key, value] of entries) {
        const nodeId = `${parentId}-${key}`;
        const nodePath = Array.isArray(obj)
          ? `${path}[${key}]`
          : `${path}.${key}`;

        const isObject = typeof value === "object" && value !== null;
        const type = Array.isArray(value)
          ? "array"
          : isObject
          ? "object"
          : "primitive";

        // Create node
        localNodes.push({
          id: nodeId,
          position: { x: Math.random() * 600, y: Math.random() * 600 },
          data: {
            label: `${key}: ${type === "primitive" ? JSON.stringify(value) : ""}`,
            path: nodePath,
          },
          style: {
            backgroundColor: colors[type],
            color: "white",
            padding: 10,
            borderRadius: 8,
            fontSize: 14,
            border: "2px solid white",
          },
        });

        // Create edge to parent
        localEdges.push({
          id: `${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
        });

        // Recurse if nested
        if (isObject) {
          const { nodes: childNodes, edges: childEdges } = buildTree(
            value,
            nodeId,
            nodePath
          );
          localNodes.push(...childNodes);
          localEdges.push(...childEdges);
        }
      }
    }

    return { nodes: localNodes, edges: localEdges };
  };

  // 🔹 Visualize button logic
  const visualizeJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setError("");
      setMessage("");

      // Create root first (important fix!)
      const rootNode = {
        id: "root",
        position: { x: 300, y: 50 },
        data: { label: "Root", path: "$" },
        style: {
          backgroundColor: "#3498db",
          color: "white",
          padding: 12,
          borderRadius: 8,
          border: "2px solid white",
        },
      };

      // Build remaining tree
      const { nodes: childNodes, edges: childEdges } = buildTree(parsed, "root", "$");

      setNodes([rootNode, ...childNodes]);
      setEdges(childEdges);
    } catch (err) {
      setError("❌ Invalid JSON format!");
    }
  };

  // 🔹 Search Function (path or label)
  const handleSearch = () => {
    if (!searchTerm.trim()) return setMessage("⚠️ Enter something to search.");

    let found = false;

    setNodes((nds) =>
      nds.map((node) => {
        const match =
          node.data.path.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
          node.data.label.toLowerCase().includes(searchTerm.trim().toLowerCase());

        if (match) {
          found = true;
          return {
            ...node,
            style: {
              ...node.style,
              backgroundColor: colors.highlight,
              border: "3px solid #fff",
            },
          };
        }

        return {
          ...node,
          style: { ...node.style, border: "2px solid white" },
        };
      })
    );

    setMessage(found ? "✅ Match found!" : "❌ No match found.");
  };

  // 🔹 Clear Button
  const clearAll = () => {
    setJsonInput("");
    setNodes([]);
    setEdges([]);
    setSearchTerm("");
    setMessage("");
    setError("");
  };

  return (
    <div className="app-container">
      <h1>🌳 JSON Tree Visualizer</h1>

      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Paste JSON here... e.g. {"user": {"name": "Rosia", "city": "Pune"}}'
      />

      <div className="button-group">
        <button onClick={visualizeJSON}>Visualize</button>
        <button onClick={clearAll}>Clear</button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by path or key/value e.g. $.user.city or Rosia"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;
