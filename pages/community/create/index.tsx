import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import styled from "styled-components";
import { useRouter } from "next/router";
import { IoIosArrowBack } from "react-icons/io";
import communityThumb from "../../../public/communityThumb.png";
import styles from "../../../styles/components.module.css";

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  form {
    width: 100%;
    max-width: 500px;
    padding: 20px;
    .form__group {
      margin-bottom: 20px;
      text-align: center;
      label {
        text-align: left;
        font-weight: bold;
        margin-bottom: 10px;
        display: block;
      }
      .image__preview {
        border-radius: 50%;
        width: 150px;
        height: 150px;
        border: 1px solid #ddd;
        display: inline-block;
        margin-bottom: 10px;
      }

      .image-buttons {
        text-align: center;
        button {
          background: none;
          border: none;
          color: #6e9c6f99;
          cursor: pointer;
        }
      }
    }
    .hashtags {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;

      .hashtag {
        display: flex;
        align-items: center;

        .input {
          background: #dfdfdf;
          border-radius: 15px;
          padding: 8px 10px;
          font-size: 1rem;
          margin-left: 5px;
          span {
            font-size: 1rem;
            color: #555;
            padding-right: 5px;
          }
          input {
            background: #dfdfdf;
          }
        }

        .add__btn,
        .remove__btn {
          // background: #6e9c6f99;
          border: none;
          color: #000;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 10px;
          cursor: pointer;
        }

        .remove__btn {
          // background: #d1d1d1;
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
  const [image, setImage] = useState<File | string>(communityThumb.src);
  const [imagePreview, setImagePreview] = useState<string>(communityThumb.src);
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

    formData.append("image", image);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const fileUrl = URL.createObjectURL(file);
      setImagePreview(fileUrl);
    }
  };

  const handleDefaultImage = () => {
    setImage(communityThumb.src);
    setImagePreview(communityThumb.src);
  };

  return (
    <FormWrapper>
      <div className={styles.top}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <IoIosArrowBack />
        </button>
        <h2 className={styles.h2}>채팅방 만들기</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form__group">
          <div>
            <Image
              className="image__preview"
              src={imagePreview}
              alt="Image Preview"
              width={100}
              height={100}
              onClick={() => document.getElementById("customImage")?.click()}
            />
            <div className="image-buttons">
              {image === communityThumb.src ? (
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("customImage")?.click()
                  }
                >
                  나만의 채팅방 이미지 선택
                </button>
              ) : (
                <button type="button" onClick={handleDefaultImage}>
                  기본이미지 선택
                </button>
              )}
            </div>
            <input
              type="file"
              id="customImage"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className="form__group">
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

        <div className="form__group">
          <label>최대 인원</label>
          <input
            type="number"
            value={maxMembers}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setMaxMembers(Number(e.target.value))
            }
            className={styles.input__big}
            required
          />
        </div>
        <div className="form__group hashtags">
          {hashtags.map((hashtag, idx) => (
            <div className="hashtag" key={idx}>
              <div className="input">
                <span>#</span>
                <input
                  type="text"
                  placeholder={`${idx + 1}번째 해시태그를 입력하세요`}
                  value={hashtag}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleHashtagChange(idx, e.target.value)
                  }
                />
              </div>
              {idx === hashtags.length - 1 && (
                <>
                  <button
                    type="button"
                    className="add__btn"
                    onClick={handleAddHashtag}
                  >
                    +
                  </button>
                  {hashtags.length > 1 && (
                    <button
                      type="button"
                      className="remove__btn"
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
