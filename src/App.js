function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-5">
      <h1 className="text-3xl font-bold mb-5">JSON Tree Visualizer</h1>
      <div className="flex w-full max-w-6xl gap-5">
        <textarea
          id="jsonInput"
          placeholder="Paste your JSON here..."
          className="w-1/2 h-[500px] p-3 border border-gray-400 rounded"
        ></textarea>
        <div
          id="treeOutput"
          className="w-1/2 h-[500px] overflow-auto border border-gray-400 rounded p-3 bg-white"
        ></div>
      </div>
    </div>
  );
}
export default App;
