// components/community/chatroomForm.tsx
import { useState, ChangeEvent, FormEvent } from "react";
import styled from "styled-components";

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  form {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 500px;
    .form-group {
      margin-bottom: 15px;
      input,
      textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
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
        input {
          width: auto;
        }
      }
    }
    .actions {
      display: flex;
      justify-content: space-between;
      button {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        &.submit {
          background-color: #007bff;
          color: #fff;
        }
        &.cancel {
          background-color: #ccc;
        }
      }
    }
  }
`;

interface ChatroomFormProps {
  onSubmit: (formData: FormData) => void;
  onClose: () => void;
}

const ChatroomForm: React.FC<ChatroomFormProps> = ({ onSubmit, onClose }) => {
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([""]);
  const [maxMembers, setMaxMembers] = useState<number>(100);

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("tags", hashtags.join(" "));
    formData.append("max_members", maxMembers.toString());
    if (image) {
      formData.append("image", image);
    }
    onSubmit(formData);
  };

  return (
    <FormWrapper>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>채팅방 이름</label>
          <input
            type="text"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
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
          <button type="button" className="cancel" onClick={onClose}>
            취소
          </button>
          <button type="submit" className="submit">
            생성
          </button>
        </div>
      </form>
    </FormWrapper>
  );
};

export default ChatroomForm;
