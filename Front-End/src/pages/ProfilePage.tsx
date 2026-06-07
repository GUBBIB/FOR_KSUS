import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {
  getMyCommentsCount,
  getMyPostsCount,
  getMyProfile,
} from "../api/userApi";
import "./UserPage.css";

type UserProfile = {
  email: string;
  nickname: string;
  name: string;
};

function ProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [postCount, setPostCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMyPageInfo = async () => {
      try {
        setIsLoading(true);

        const [profileData, postsCountData, commentsCountData] =
          await Promise.all([
            getMyProfile(),
            getMyPostsCount(),
            getMyCommentsCount(),
          ]);

        setProfile(profileData);
        setPostCount(postsCountData);
        setCommentCount(commentsCountData);
      } catch (error) {
        console.error(error);
        alert("로그인 후 프로필을 확인할 수 있습니다.");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyPageInfo();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="user-page">
        <Header />

        <main className="user-container">
          <section className="user-hero-card">
            <h1>프로필</h1>
            <p>프로필 정보를 불러오는 중...</p>
          </section>
        </main>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="user-page">
      <Header />

      <main className="user-container">
        <section className="user-hero-card">
          <p className="user-badge">MY PROFILE</p>
          <h1>{profile.nickname}님</h1>
          <p>{profile.email}</p>
          <p>이름: {profile.name}</p>
        </section>

        <section className="user-grid">
          <article className="user-card">
            <h2>내 활동 요약</h2>

            <div className="stat-list two-columns">
              <div>
                <strong>{postCount}</strong>
                <span>작성한 글</span>
              </div>

              <div>
                <strong>{commentCount}</strong>
                <span>작성한 댓글</span>
              </div>
            </div>
          </article>

          <article className="user-card">
            <h2>바로가기</h2>

            <div className="quick-links">
              <Link to="/myposts">내 게시글 보기</Link>
              <Link to="/mycomments">내 댓글 보기</Link>
              <Link to="/community">커뮤니티로 이동</Link>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default ProfilePage;