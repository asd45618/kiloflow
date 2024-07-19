//pages>community>chat>notice>[id]>index.tsx

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import styles from "../../../../../styles/components.module.css";
import { IoIosArrowBack } from "react-icons/io";

const Container = styled.div`
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  width: 300px;
  .form-group {
    margin-bottom: 20px;
  }
  label {
    margin-bottom: 5px;
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
      <div className={styles.top}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <IoIosArrowBack />
        </button>
        <h2 className={styles.h2}>공지 작성</h2>
      </div>
      <Form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            className={styles.input__big}
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
            className={styles.input__big}
            id="content"
            value={content}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setContent(e.target.value)
            }
          />
        </div>
        <button type="submit" className={styles.button__big}>
          저장
        </button>
      </Form>
    </Container>
  );
};

export default Notice;
