import { useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import HomePage from "./pages/HomePage";
import BusPage from "./pages/BusPage";
import ClassroomPage from "./pages/ClassroomPage";
import CampusMapPage from "./pages/CampusMapPage";
import CommunityPage from "./pages/CommunityPage";

function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "bus":
        return <BusPage />;
      case "classroom":
        return <ClassroomPage />;
      case "map":
        return <CampusMapPage />;
      case "community":
        return <CommunityPage />;
      default:
        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} />

      <main className="main">
        <Header page={page} setPage={setPage} />
        <div className="page">{renderPage()}</div>
      </main>
    </div>
  );
}

export default App;