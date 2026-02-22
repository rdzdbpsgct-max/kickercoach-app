import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LearnMode from "./features/learn/LearnMode";
import TrainMode from "./features/train/TrainMode";
import PlanMode from "./features/plan/PlanMode";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/learn" element={<LearnMode />} />
        <Route path="/train" element={<TrainMode />} />
        <Route path="/plan" element={<PlanMode />} />
        <Route path="*" element={<Navigate to="/learn" replace />} />
      </Routes>
    </Layout>
  );
}
