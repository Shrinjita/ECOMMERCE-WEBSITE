import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App"; // Ensure App is imported

// Rendering the App with React 18's `createRoot`
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
