import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { IoIosArrowBack } from "react-icons/io";
import styles from "../../../styles/components.module.css";

const FormWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  form {
    width: 100%;
    max-width: 500px;
    .form-group {
      margin-bottom: 15px;
      display: flex;
      flex-direction: column;
    }
    .hashtags {
      display: flex;
      flex-wrap: wrap;
      .hashtag {
        display: flex;
        align-items: center;
        margin-right: 10px;
        span {
          margin-right: 5px;
        }
      }
    }
    .actions {
      text-align: center;
    }
  }
`;

const ChatroomForm = () => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([""]);
  const [maxMembers, setMaxMembers] = useState<number>(100);
  const router = useRouter();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        } else {
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
      } else {
        router.push("/auth/login");
      }
    };

    fetchCurrentUser();
  }, [router]);

  const handleHashtagChange = (index: number, value: string) => {
    const newHashtags = [...hashtags];
    newHashtags[index] = value;
    setHashtags(newHashtags);
  };

  const handleAddHashtag = () => {
    setHashtags([...hashtags, ""]);
  };

  const handleRemoveHashtag = (index: number) => {
    const newHashtags = [...hashtags];
    newHashtags.splice(index, 1);
    setHashtags(newHashtags);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return router.push("/auth/login");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("tags", hashtags.join(" "));
    formData.append("max_members", maxMembers.toString());
    formData.append("owner_id", currentUser.user_id.toString());
    if (image) {
      formData.append("image", image);
    }

    const res = await fetch("/api/community", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const chatroom = await res.json();

      const joinRes = await fetch("/api/community/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatroom_id: chatroom.id,
          user_id: currentUser.user_id,
        }),
      });

      if (joinRes.ok) {
        alert("채팅방이 생성되었습니다.");
        router.push(`/community/chat/${chatroom.id}`);
      } else {
        alert("채팅방에 참가하는 중 오류가 발생했습니다.");
      }
    } else {
      alert("채팅방 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <FormWrapper>
      <div className={styles.top}>
        <button className={styles.backButton}>
          <IoIosArrowBack />
        </button>
        <h2 className={styles.h2}>채팅방 만들기</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>채팅방 이름</label>
          <input
            type="text"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            className={styles.input__big}
            required
          />
        </div>
        <div className="form-group">
          <label>채팅방 이미지</label>
          <input
            type="file"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setImage(e.target.files ? e.target.files[0] : null)
            }
            accept="image/*"
            className={styles.input__small}
          />
        </div>
        <div className="form-group">
          <label>최대 인원</label>
          <input
            type="number"
            value={maxMembers}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setMaxMembers(Number(e.target.value))
            }
            className={styles.input__small}
            required
          />
        </div>
        <div className="form-group hashtags">
          {hashtags.map((hashtag, idx) => (
            <div className="hashtag" key={idx}>
              <span>#</span>
              <input
                type="text"
                placeholder={`${idx + 1}번째 해시태그를 입력하세요`}
                value={hashtag}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleHashtagChange(idx, e.target.value)
                }
                className={styles.input__small}
              />
              {idx === hashtags.length - 1 && (
                <>
                  <button type="button" onClick={handleAddHashtag}>
                    +
                  </button>
                  {hashtags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveHashtag(idx)}
                    >
                      -
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <div className="actions">
          <button type="submit" className={styles.button__small}>
            생성
          </button>
        </div>
      </form>
    </FormWrapper>
  );
};

export default ChatroomForm;
