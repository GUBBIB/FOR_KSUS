import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { deletePost, getPostDetail } from "../api/boardApi";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../api/commentApi";
import "./PostDetailPage.css";

type User = {
  email: string;
  nickname: string;
};

type Post = {
  id: number;
  title: string;
  content: string;
  writer: string;
  viewCount: number;
  createdAt: string;
};

type Comment = {
  id: number;
  content: string;
  writer: string;
  createdAt: string;
};

type Reply = {
  id: number;
  postId: number;
  commentId: number;
  content: string;
  writer: string;
  writerEmail: string;
  createdAt: string;
};

const BOARD_ID = 1;

function PostDetailPage() {
  const navigate = useNavigate();
  const { postId } = useParams();

  const currentUser: User | null = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [replies, setReplies] = useState<Reply[]>(
    JSON.parse(localStorage.getItem("replies") || "[]")
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [commentContent, setCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const [replyTargetCommentId, setReplyTargetCommentId] = useState<number | null>(
    null
  );
  const [replyContent, setReplyContent] = useState("");

  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editingReplyContent, setEditingReplyContent] = useState("");

  const fetchPostAndComments = async () => {
    if (!postId) return;

    try {
      setIsLoading(true);
      setErrorMessage("");

      const [postData, commentData] = await Promise.all([
        getPostDetail(BOARD_ID, Number(postId)),
        getComments(BOARD_ID, Number(postId)),
      ]);

      setPost(postData);
      setComments(Array.isArray(commentData) ? commentData : [commentData]);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error ? error.message : "게시글 정보를 불러오지 못했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostAndComments();
  }, [postId]);

  const postComments = useMemo(() => {
    return [...comments].sort((a, b) => b.id - a.id);
  }, [comments]);

  const saveReplies = (nextReplies: Reply[]) => {
    setReplies(nextReplies);
    localStorage.setItem("replies", JSON.stringify(nextReplies));
  };

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert("로그인 후 댓글을 작성할 수 있습니다.");
      navigate("/login");
      return;
    }

    if (!commentContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      await createComment(BOARD_ID, Number(postId), {
        content: commentContent,
      });

      setCommentContent("");
      await fetchPostAndComments();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "댓글 작성 실패");
    }
  };

  const handleStartEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!editingContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      await updateComment(BOARD_ID, Number(postId), commentId, {
        content: editingContent,
      });

      setEditingCommentId(null);
      setEditingContent("");
      await fetchPostAndComments();
      alert("댓글 수정 완료");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "댓글 수정 실패");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      await deleteComment(BOARD_ID, Number(postId), commentId);

      const updatedReplies = replies.filter(
        (reply) => reply.commentId !== commentId
      );

      saveReplies(updatedReplies);
      await fetchPostAndComments();
      alert("댓글 삭제 완료");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "댓글 삭제 실패");
    }
  };

  const handleCreateReply = (commentId: number) => {
    if (!currentUser) {
      alert("로그인 후 대댓글을 작성할 수 있습니다.");
      navigate("/login");
      return;
    }

    if (!replyContent.trim()) {
      alert("대댓글 내용을 입력해주세요.");
      return;
    }

    const newReply: Reply = {
      id: Date.now(),
      postId: Number(postId),
      commentId,
      content: replyContent,
      writer: currentUser.nickname,
      writerEmail: currentUser.email,
      createdAt: "방금 전",
    };

    saveReplies([...replies, newReply]);
    setReplyContent("");
    setReplyTargetCommentId(null);
  };

  const handleStartEditReply = (reply: Reply) => {
    if (!currentUser || currentUser.email !== reply.writerEmail) {
      alert("본인이 작성한 대댓글만 수정할 수 있습니다.");
      return;
    }

    setEditingReplyId(reply.id);
    setEditingReplyContent(reply.content);
  };

  const handleUpdateReply = (replyId: number) => {
    if (!editingReplyContent.trim()) {
      alert("대댓글 내용을 입력해주세요.");
      return;
    }

    const updatedReplies = replies.map((reply) =>
      reply.id === replyId
        ? {
            ...reply,
            content: editingReplyContent,
          }
        : reply
    );

    saveReplies(updatedReplies);
    setEditingReplyId(null);
    setEditingReplyContent("");
    alert("대댓글 수정 완료");
  };

  const handleDeleteReply = (reply: Reply) => {
    if (!currentUser || currentUser.email !== reply.writerEmail) {
      alert("본인이 작성한 대댓글만 삭제할 수 있습니다.");
      return;
    }

    if (!window.confirm("대댓글을 삭제하시겠습니까?")) return;

    const updatedReplies = replies.filter((item) => item.id !== reply.id);
    saveReplies(updatedReplies);
  };

  const handleDeletePost = async () => {
    if (!postId) return;

    if (!currentUser) {
      alert("로그인 후 이용해주세요.");
      navigate("/login");
      return;
    }

    if (!window.confirm("게시글을 삭제하시겠습니까?")) return;

    try {
      await deletePost(BOARD_ID, Number(postId));
      alert("게시글 삭제 완료");
      navigate("/community");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "게시글 삭제 실패");
    }
  };

  if (isLoading) {
    return (
      <div className="post-detail-page">
        <Header />
        <main className="post-detail-container">
          <section className="post-card">
            <p className="empty-text">불러오는 중...</p>
          </section>
        </main>
      </div>
    );
  }

  if (errorMessage || !post) {
    return (
      <div className="post-detail-page">
        <Header />
        <main className="post-detail-container">
          <section className="post-card">
            <p className="empty-text">
              {errorMessage || "게시글을 찾을 수 없습니다."}
            </p>
            <button className="basic-button" onClick={() => navigate("/community")}>
              목록으로
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="post-detail-page">
      <Header />

      <main className="post-detail-container">
        <section className="post-card">
          <div className="post-title-row">
            <h1>{post.title}</h1>
            <span>{post.writer}</span>
          </div>

          <div className="post-meta-row">
            <span>조회수 {post.viewCount}</span>
            <span>{post.createdAt}</span>
          </div>

          <div className="post-content-box">{post.content}</div>

          <div className="post-actions">
            <button className="basic-button" onClick={() => navigate("/community")}>
              목록
            </button>

            {currentUser && (
              <>
                <button
                  className="basic-button"
                  onClick={() => navigate(`/community/write?postId=${post.id}`)}
                >
                  수정
                </button>

                <button className="danger-button" onClick={handleDeletePost}>
                  삭제
                </button>
              </>
            )}
          </div>
        </section>

        <section className="comment-card">
          <div className="comment-header">
            <h2>댓글</h2>
            <span>{postComments.length}개</span>
          </div>

          <form className="comment-form" onSubmit={handleCreateComment}>
            <input
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="댓글을 입력하세요."
            />

            <button type="submit">등록</button>
          </form>

          {postComments.length === 0 ? (
            <p className="empty-text">아직 댓글이 없습니다.</p>
          ) : (
            <ul className="comment-list">
              {postComments.map((comment) => {
                const commentReplies = replies
                  .filter((reply) => reply.commentId === comment.id)
                  .sort((a, b) => a.id - b.id);

                return (
                  <li key={comment.id} className="comment-item">
                    {editingCommentId === comment.id ? (
                      <div className="edit-box">
                        <strong>{comment.writer}</strong>

                        <input
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                        />

                        <div className="inline-actions">
                          <button onClick={() => handleUpdateComment(comment.id)}>
                            저장
                          </button>

                          <button
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditingContent("");
                            }}
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="comment-main">
                        <div>
                          <strong>{comment.writer}</strong>
                          <span>{comment.content}</span>
                        </div>

                        <small>{comment.createdAt}</small>
                      </div>
                    )}

                    {editingCommentId !== comment.id && (
                      <div className="comment-actions">
                        <button
                          type="button"
                          onClick={() =>
                            setReplyTargetCommentId(
                              replyTargetCommentId === comment.id
                                ? null
                                : comment.id
                            )
                          }
                        >
                          답글
                        </button>

                        {currentUser && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStartEditComment(comment)}
                            >
                              수정
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              삭제
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    {replyTargetCommentId === comment.id && (
                      <div className="reply-form">
                        <input
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="대댓글을 입력하세요."
                        />

                        <button onClick={() => handleCreateReply(comment.id)}>
                          등록
                        </button>
                      </div>
                    )}

                    {commentReplies.length > 0 && (
                      <ul className="reply-list">
                        {commentReplies.map((reply) => {
                          const isReplyOwner =
                            currentUser?.email === reply.writerEmail;

                          return (
                            <li key={reply.id} className="reply-item">
                              {editingReplyId === reply.id ? (
                                <div className="edit-box">
                                  <strong>{reply.writer}</strong>

                                  <input
                                    value={editingReplyContent}
                                    onChange={(e) =>
                                      setEditingReplyContent(e.target.value)
                                    }
                                  />

                                  <div className="inline-actions">
                                    <button
                                      onClick={() => handleUpdateReply(reply.id)}
                                    >
                                      저장
                                    </button>

                                    <button
                                      onClick={() => {
                                        setEditingReplyId(null);
                                        setEditingReplyContent("");
                                      }}
                                    >
                                      취소
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="reply-main">
                                    <span className="reply-mark">ㄴ</span>

                                    <div>
                                      <strong>{reply.writer}</strong>
                                      <span>{reply.content}</span>
                                    </div>

                                    <small>{reply.createdAt}</small>
                                  </div>

                                  {isReplyOwner && (
                                    <div className="comment-actions">
                                      <button
                                        type="button"
                                        onClick={() => handleStartEditReply(reply)}
                                      >
                                        수정
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleDeleteReply(reply)}
                                      >
                                        삭제
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default PostDetailPage;