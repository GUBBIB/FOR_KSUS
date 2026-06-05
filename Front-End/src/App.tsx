import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BoardPage from "./pages/BoardPage";
import PostDetailPage from "./pages/PostDetailPage";
import PostWritePage from "./pages/PostWritePage";
import MyPostsPage from "./pages/MyPostsPage";
import MyCommentsPage from "./pages/MyCommentsPage";
import ProfilePage from "./pages/ProfilePage";
import NoticePage from "./pages/NoticePage";
import NoticeDetailPage from "./pages/NoticeDetailPage";
import NoticeWritePage from "./pages/NoticeWritePage";
import ClassroomPage from "./pages/ClassroomPage";
import ClassroomDetailPage from "./pages/ClassroomDetailPage";
import BusPage from "./pages/BusPage";
import EngineeringMapPage from "./pages/EngineeringMapPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/notices" element={<NoticePage />} />
        <Route path="/notices/write" element={<NoticeWritePage />} />
        <Route path="/notices/:noticeId" element={<NoticeDetailPage />} />

        <Route path="/community" element={<BoardPage />} />
        <Route path="/community/write" element={<PostWritePage />} />
        <Route path="/community/posts/:postId" element={<PostDetailPage />} />

        <Route path="/classrooms" element={<ClassroomPage />} />
        <Route
          path="/classrooms/:buildingId/:classroomId"
          element={<ClassroomDetailPage />}
        />

        <Route path="/bus" element={<BusPage />} />
        <Route path="/engineering-map" element={<EngineeringMapPage />} />

        <Route path="/myposts" element={<MyPostsPage />} />
        <Route path="/mycomments" element={<MyCommentsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;