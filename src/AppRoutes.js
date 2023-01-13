import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import TasksPage from "./pages/Tasks";
import WithNavBar from "./components/WithNavBar";
import WithoutNavBar from "./components/WithoutNavBar";

function PlannerTasksApp() {
  return (
    <Routes>
      <Route element={<WithNavBar />}>
        <Route path="/" element={<HomePage />} />
      </Route>
      <Route element={<WithoutNavBar />}>
        <Route path="/tasks" element={<TasksPage />} />
      </Route>
    </Routes>
  );
}

export default PlannerTasksApp;
