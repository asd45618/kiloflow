//pages>community>chat>notice>[id]>index.tsx

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  .form-group {
    margin-bottom: 20px;
  }
  label {
    margin-bottom: 5px;
  }
  input,
  textarea {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
  }
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background: #0070f3;
    color: #fff;
    cursor: pointer;
    &:hover {
      background: #005bb5;
    }
  }
`;

const Notice = () => {
  const router = useRouter();
  const { id: roomId } = router.query;
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const notice = { title, content, chatroom_id: roomId };

    const res = await fetch(`/api/community/notice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notice),
    });

    if (res.ok) {
      window.alert("공지사항이 작성되었습니다.");
      router.push(`/community/chat/${roomId}`);
    } else {
      const error = await res.json();
      console.error("공지사항 작성 실패:", error);
    }
  };

  return (
    <Container>
      <h1>공지 쓰기</h1>
      <Form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setContent(e.target.value)
            }
          />
        </div>
        <button type="submit">저장</button>
      </Form>
    </Container>
  );
};

export default Notice;
