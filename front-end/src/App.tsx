import React from "react";
import PageLayout from "./_shared/components/PageLayout";
import { Routes, Route } from "react-router-dom";
import CompetitionPage from "./competition";

const App = () => {
  return (
    <PageLayout>
      <Routes>
        <Route path="/">
          <Route index element={<CompetitionPage />} />
        </Route>
        <Route path="/competition">
          <Route index element={<CompetitionPage />} />
        </Route>
      </Routes>
    </PageLayout>
  );
};

export default App;
