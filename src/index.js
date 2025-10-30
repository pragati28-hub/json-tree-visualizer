
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import { ReactFlowProvider } from 'reactflow'; // Add this import
   import './index.css';
   import App from './App';

   const root = ReactDOM.createRoot(document.getElementById('root'));
   root.render(
     <React.StrictMode>
       <ReactFlowProvider>  {/* Wrap App here */}
         <App />
       </ReactFlowProvider>
     </React.StrictMode>
   );