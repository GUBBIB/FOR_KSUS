import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";

type User = {
  email: string;
  nickname: string;
};

type Post = {
  id: number;
  title: string;
  content: string;
  writer: string;
  writerEmail: string;
  viewCount: number;
  createdAt: string;
};

type Comment = {
  id: number;
  postId: number;
  content: string;
  writer: string;
  writerEmail: string;
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

const defaultComments: Comment[] = [
  {
    id: 1,
    postId: 1,
    content: "저도 궁금했어요.",
    writer: "익명1",
    writerEmail: "test1@ks.ac.kr",
    createdAt: "2026-06-05",
  },
];

function PostDetailPage() {
  const navigate = useNavigate();
  const { postId } = useParams();

  const currentUser: User | null = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const [posts, setPosts] = useState<Post[]>(
    JSON.parse(localStorage.getItem("posts") || "[]")
  );

  const [comments, setComments] = useState<Comment[]>(() => {
    const savedComments = localStorage.getItem("comments");

    if (savedComments) {
      return JSON.parse(savedComments);
    }

    localStorage.setItem("comments", JSON.stringify(defaultComments));
    return defaultComments;
  });

  const [replies, setReplies] = useState<Reply[]>(() => {
    const savedReplies = localStorage.getItem("replies");

    if (savedReplies) {
      return JSON.parse(savedReplies);
    }

    localStorage.setItem("replies", JSON.stringify([]));
    return [];
  });

  const [commentContent, setCommentContent] = useState("");

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const [replyTargetCommentId, setReplyTargetCommentId] = useState<number | null>(
    null
  );
  const [replyContent, setReplyContent] = useState("");

  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editingReplyContent, setEditingReplyContent] = useState("");

  useEffect(() => {
    if (!postId) return;

    const viewedPosts: number[] = JSON.parse(
      localStorage.getItem("viewedPosts") || "[]"
    );

    if (viewedPosts.includes(Number(postId))) {
      return;
    }

    const savedPosts: Post[] = JSON.parse(localStorage.getItem("posts") || "[]");

    const updatedPosts = savedPosts.map((item) =>
      item.id === Number(postId)
        ? {
            ...item,
            viewCount: item.viewCount + 1,
          }
        : item
    );

    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    localStorage.setItem(
      "viewedPosts",
      JSON.stringify([...viewedPosts, Number(postId)])
    );

    setPosts(updatedPosts);
  }, [postId]);

  const post = posts.find((item) => item.id === Number(postId));

  const postComments = comments.filter(
    (comment) => comment.postId === Number(postId)
  );

  const isPostOwner = currentUser?.email === post?.writerEmail;

  const saveComments = (nextComments: Comment[]) => {
    setComments(nextComments);
    localStorage.setItem("comments", JSON.stringify(nextComments));
  };

  const saveReplies = (nextReplies: Reply[]) => {
    setReplies(nextReplies);
    localStorage.setItem("replies", JSON.stringify(nextReplies));
  };

  const handleCreateComment = (e: React.FormEvent) => {
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

    const newComment: Comment = {
      id: Date.now(),
      postId: Number(postId),
      content: commentContent,
      writer: currentUser.nickname,
      writerEmail: currentUser.email,
      createdAt: "방금 전",
    };

    saveComments([...comments, newComment]);
    setCommentContent("");
  };

  const handleStartEditComment = (comment: Comment) => {
    if (!currentUser || currentUser.email !== comment.writerEmail) {
      alert("본인이 작성한 댓글만 수정할 수 있습니다.");
      return;
    }

    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleUpdateComment = (commentId: number) => {
    if (!editingContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    const updatedComments = comments.map((comment) =>
      comment.id === commentId
        ? {
            ...comment,
            content: editingContent,
          }
        : comment
    );

    saveComments(updatedComments);
    setEditingCommentId(null);
    setEditingContent("");
    alert("댓글 수정 완료");
  };

  const handleDeleteComment = (comment: Comment) => {
    if (!currentUser || currentUser.email !== comment.writerEmail) {
      alert("본인이 작성한 댓글만 삭제할 수 있습니다.");
      return;
    }

    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    const updatedComments = comments.filter((item) => item.id !== comment.id);
    const updatedReplies = replies.filter(
      (reply) => reply.commentId !== comment.id
    );

    saveComments(updatedComments);
    saveReplies(updatedReplies);
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

  const handleDeletePost = () => {
    if (!post) return;

    if (!currentUser) {
      alert("로그인 후 이용해주세요.");
      navigate("/login");
      return;
    }

    if (!isPostOwner) {
      alert("본인이 작성한 게시글만 삭제할 수 있습니다.");
      return;
    }

    if (!window.confirm("게시글을 삭제하시겠습니까?")) return;

    const updatedPosts = posts.filter((item) => item.id !== post.id);
    const updatedComments = comments.filter(
      (comment) => comment.postId !== post.id
    );
    const updatedReplies = replies.filter((reply) => reply.postId !== post.id);

    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    saveComments(updatedComments);
    saveReplies(updatedReplies);
    setPosts(updatedPosts);

    alert("게시글 삭제 완료");
    navigate("/community");
  };

  if (!post) {
    return (
      <div>
        <Header />
        <p>게시글을 찾을 수 없습니다.</p>
        <button onClick={() => navigate("/community")}>목록으로</button>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <main>
        <h1>{post.title}</h1>

        <p>{post.content}</p>

        <small>
          작성자: {post.writer} / 조회수: {post.viewCount} / 작성일:{" "}
          {post.createdAt}
        </small>

        {isPostOwner && (
          <div>
            <button onClick={() => navigate(`/community/write?postId=${post.id}`)}>
              수정
            </button>

            <button onClick={handleDeletePost}>삭제</button>
          </div>
        )}

        <hr />

        <h2>댓글</h2>

        <form onSubmit={handleCreateComment}>
          <input
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="댓글 입력"
          />

          <button type="submit">댓글 작성</button>
        </form>

        <ul>
          {postComments.map((comment) => {
            const isCommentOwner = currentUser?.email === comment.writerEmail;
            const commentReplies = replies.filter(
              (reply) => reply.commentId === comment.id
            );

            return (
              <li key={comment.id}>
                {editingCommentId === comment.id ? (
                  <div>
                    <strong>{comment.writer}</strong>{" "}
                    <input
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                    />

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
                ) : (
                  <div>
                    <strong>{comment.writer}</strong>{" "}
                    <span>{comment.content}</span>{" "}
                    <small>{comment.createdAt}</small>{" "}

                    <button
                      type="button"
                      onClick={() =>
                        setReplyTargetCommentId(
                          replyTargetCommentId === comment.id ? null : comment.id
                        )
                      }
                    >
                      답글
                    </button>

                    {isCommentOwner && (
                      <>
                        <button onClick={() => handleStartEditComment(comment)}>
                          수정
                        </button>

                        <button onClick={() => handleDeleteComment(comment)}>
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                )}

                {replyTargetCommentId === comment.id && (
                  <div style={{ marginLeft: "24px" }}>
                    <input
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="대댓글 입력"
                    />

                    <button onClick={() => handleCreateReply(comment.id)}>
                      대댓글 작성
                    </button>
                  </div>
                )}

                {commentReplies.length > 0 && (
                  <ul style={{ marginLeft: "24px" }}>
                    {commentReplies.map((reply) => {
                      const isReplyOwner =
                        currentUser?.email === reply.writerEmail;

                      return (
                        <li key={reply.id}>
                          {editingReplyId === reply.id ? (
                            <div>
                              <strong>{reply.writer}</strong>{" "}
                              <input
                                value={editingReplyContent}
                                onChange={(e) =>
                                  setEditingReplyContent(e.target.value)
                                }
                              />

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
                          ) : (
                            <div>
                              <span>ㄴ </span>
                              <strong>{reply.writer}</strong>{" "}
                              <span>{reply.content}</span>{" "}
                              <small>{reply.createdAt}</small>{" "}

                              {isReplyOwner && (
                                <>
                                  <button
                                    onClick={() => handleStartEditReply(reply)}
                                  >
                                    수정
                                  </button>

                                  <button
                                    onClick={() => handleDeleteReply(reply)}
                                  >
                                    삭제
                                  </button>
                                </>
                              )}
                            </div>
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
      </main>
    </div>
  );
}

export default PostDetailPage;