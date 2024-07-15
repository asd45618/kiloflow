// components/community/communityModal.tsx
import React from "react";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/router";

const ModalWrapper = styled.div`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  .modal-dialog {
    .modal-content {
      .modal-header {
        flex-direction: column-reverse;
        .modal__img {
          width: 50%;
          img {
            width: 100%;
          }
        }
      }
      .modal-body {
        text-align: center;
        p {
          &:last-child {
            margin-top: 10px;
            font-size: 12px;
            color: #979797;
          }
        }
      }
      .modal-footer {
        justify-content: center;
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
    const res = await fetch("/api/community/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatroom_id: chatroom.id, user_id }),
    });

    if (res.ok) {
      alert("채팅방에 참가하였습니다.");
      onHide();
      router.push(`/community/chat/${chatroom.id}`);
    }
  };

  return (
    <ModalWrapper className="modal show">
      <Modal.Dialog>
        <Modal.Header closeButton onClick={onHide}>
          <div className="modal__img">
            <img
              src={chatroom.image_url || "/communityThumb.png"}
              alt="채팅방 이미지"
            />
          </div>
        </Modal.Header>

        <Modal.Body>
          <p>{chatroom.name}</p>
          <p>{chatroom.tags}</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handleJoin}>
            채팅방 참여하기
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </ModalWrapper>
  );
};

export default CommunityModal;
