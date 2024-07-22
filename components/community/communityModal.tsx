import React from "react";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/router";
import socket from "../../lib/socket";
import { IoIosClose } from "react-icons/io";

const ModalWrapper = styled.div`
  .modal-dialog {
    width: 390px;

    .modal-content {
      border-radius: 15px;
      border: 2px solid #fff;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

      .modal-header {
        border-bottom: 0.5px solid #e1e5eb;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        padding: 2rem;
        background-color: #fff;
        .modal__img {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          overflow: hidden;
          margin-top: -5px;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
      }

      .modal-body {
        padding: 20px;
        text-align: center;
        background-color: #fff;

        p {
          margin: 0;

          &:first-child {
            font-size: 24px;
            font-weight: bold;
            margin: 1px;
          }

          &:last-child {
            margin-top: 10px;
            font-size: 16px;
            color: #6c757d;
          }
        }
      }

      .modal-footer {
        justify-content: center;
        padding: 20px;
        background-color: #fff;
        border-top: none;

        button {
          width: 100%;
          padding: 12px;
          border-radius: 15px;
          background-color: #007bff;
          border: none;
          color: white;
          font-size: 16px;

          &:hover {
            background-color: #0056b3;
          }
        }
      }
    }
  }
`;

interface Chatroom {
  id: number;
  name: string;
  tags: string;
  image_url: string | null;
  max_members: number;
  owner_id: number;
}

interface CommunityModalProps {
  chatroom: Chatroom | null;
  currentUser: any;
  onHide: () => void;
}

const CommunityModal: React.FC<CommunityModalProps> = ({
  chatroom,
  currentUser,
  onHide,
}) => {
  const router = useRouter();

  if (!chatroom) return null;

  const handleJoin = async () => {
    const user_id = currentUser.user_id; // 현재 사용자 ID

    const res = await fetch(
      `/api/community/members-count?chatroomId=${chatroom.id}`
    );
    const data = await res.json();
    const membersCount = data.count;

    if (membersCount >= chatroom.max_members) {
      alert("채팅방 인원이 가득 찼습니다.");
      return;
    }

    const joinRes = await fetch("/api/community/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatroom_id: chatroom.id, user_id }),
    });

    if (joinRes.ok) {
      alert("채팅방에 참가하였습니다.");
      socket.emit("send_entry_message", {
        roomId: chatroom.id,
        userId: user_id,
      });
      onHide();
      router.push(`/community/chat/${chatroom.id}`);
    }
  };

  return (
    <ModalWrapper>
      <Modal.Dialog>
        <div className="modal-content">
          <div className="modal-header">
            <button className="close-btn" onClick={onHide}>
              <IoIosClose />
            </button>
            <div className="modal__img">
              <img
                src={chatroom.image_url || "/communityThumb.png"}
                alt="채팅방 이미지"
              />
            </div>
          </div>
          <div className="modal-body">
            <p>{chatroom.name}</p>
            <p>{chatroom.tags}</p>
          </div>
          <div className="modal-footer">
            <Button variant="primary" onClick={handleJoin}>
              채팅방 참여하기
            </Button>
          </div>
        </div>
      </Modal.Dialog>
    </ModalWrapper>
  );
};

export default CommunityModal;
