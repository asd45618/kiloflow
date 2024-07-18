// pages/community/chat/detailSetting/[id]/index.tsx

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
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

const DetailSetting = () => {
  const router = useRouter();
  const { id: roomId } = router.query;
  const [chatroomInfo, setChatroomInfo] = useState<any>(null);
  const [name, setName] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [maxMembers, setMaxMembers] = useState<number>(0);
  const [image, setImage] = useState<File | string>("");
  const [previewImage, setPreviewImage] = useState<string>("");

  useEffect(() => {
    const fetchChatroomInfo = async () => {
      const res = await fetch(
        `/api/community/current-chatroom-info?roomId=${roomId}&action=info`
      );
      const data = await res.json();
      setChatroomInfo(data);
      setName(data.name);
      setTags(data.tags);
      setMaxMembers(data.max_members);
      setPreviewImage(data.image_url);
    };

    if (roomId) {
      fetchChatroomInfo();
    }
  }, [roomId]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("tags", tags);
    formData.append("max_members", maxMembers.toString());
    if (image) {
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
        router.reload();
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
    <Container>
      <h1>상세 설정</h1>
      <Form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">채팅방 이름</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="tags">태그</label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="maxMembers">최대 인원</label>
          <input
            id="maxMembers"
            type="number"
            value={maxMembers}
            onChange={(e) => setMaxMembers(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">채팅방 이미지</label>
          <input id="image" type="file" onChange={handleImageChange} />
          {previewImage && (
            <Image
              src={previewImage}
              alt="채팅방 이미지"
              width={100}
              height={100}
            />
          )}
        </div>
        <button type="submit">저장</button>
      </Form>
      <button
        onClick={handleDelete}
        style={{ marginTop: "20px", background: "#ff0000" }}
      >
        채팅방 삭제
      </button>
    </Container>
  );
};

export default DetailSetting;
