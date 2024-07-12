// components/community/communityModal.tsx
import React from "react";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

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
  onHide: () => void;
  onJoin: (chatroom: Chatroom) => Promise<void>;
}

const CommunityModal: React.FC<CommunityModalProps> = ({
  chatroom,
  onHide,
  onJoin,
}) => {
  if (!chatroom) return null;

  return (
    <ModalWrapper className="modal show">
      <Modal.Dialog>
        <Modal.Header closeButton onClick={onHide}>
          <div className="modal__img">
            <img
              src={chatroom.image_url || "../../communityThumb.png"}
              alt="채팅방 이미지"
            />
          </div>
        </Modal.Header>

        <Modal.Body>
          <p>{chatroom.name}</p>
          <p>{chatroom.tags}</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={() => onJoin(chatroom)}>
            채팅방 참여하기
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </ModalWrapper>
  );
};

export default CommunityModal;
