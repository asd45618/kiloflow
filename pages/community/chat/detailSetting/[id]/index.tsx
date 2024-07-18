// pages/community/chat/detailSetting/[id]/index.tsx

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styled from "styled-components";
import { IoIosArrowBack } from "react-icons/io";
import communityThumb from "../../../../../public/communityThumb.png";
import styles from "../../../../../styles/components.module.css";

const FormWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
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
      }
    }
    .actions {
      text-align: center;
    }
  }
  .delete {
    font-weight: bold;
    color: #d62727;
  }
`;

const DetailSetting = () => {
  const router = useRouter();
  const { id: roomId } = router.query;
  const [chatroomInfo, setChatroomInfo] = useState<any>(null);
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<File | string>(communityThumb.src);
  const [imagePreview, setImagePreview] = useState<string>(communityThumb.src);
  const [hashtags, setHashtags] = useState<string[]>([""]);
  const [maxMembers, setMaxMembers] = useState<number>(100);

  useEffect(() => {
    const fetchChatroomInfo = async () => {
      const res = await fetch(
        `/api/community/current-chatroom-info?roomId=${roomId}&action=info`
      );
      const data = await res.json();
      setChatroomInfo(data);
      setName(data.name);
      setHashtags(data.tags.split(" "));
      setMaxMembers(data.max_members);
      setImagePreview(data.image_url || communityThumb.src);
    };

    if (roomId) {
      fetchChatroomInfo();
    }
  }, [roomId]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

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

  const handleDefaultImage = () => {
    setImage(communityThumb.src);
    setImagePreview(communityThumb.src);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("tags", hashtags.join(" "));
    formData.append("max_members", maxMembers.toString());
    if (image !== communityThumb.src) {
      formData.append("image", image);
    }

    try {
      const res = await fetch(`/api/modify/chatroom-modify?roomId=${roomId}`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setChatroomInfo(data);
        window.alert("채팅방 정보가 업데이트되었습니다.");
        router.back();
      } else {
        const data = await res.json();
        console.log("채팅방 업데이트 데이터 오류", data);
      }
    } catch (err) {
      console.log("채팅방 업데이트 오류", err);
    }
  };

  const handleDelete = async () => {
    if (confirm("정말로 채팅방을 삭제하시겠습니까?")) {
      const res = await fetch(`/api/community/delete?roomId=${roomId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("채팅방이 삭제되었습니다.");
        router.push("/community/list");
      }
    }
  };

  return (
    <FormWrapper>
      <div className={styles.top}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <IoIosArrowBack />
        </button>
        <h2 className={styles.h2}>채팅방 설정</h2>
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
              onChange={handleImageChange}
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
            수정
          </button>
        </div>
      </form>
      <button className="delete" onClick={handleDelete}>
        채팅방 삭제
      </button>
    </FormWrapper>
  );
};

export default DetailSetting;
