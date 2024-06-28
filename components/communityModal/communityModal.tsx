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

export default function modal() {
  return (
    <ModalWrapper className='modal show'>
      <Modal.Dialog>
        <Modal.Header closeButton>
          <div className='modal__img'>
            <img src='../../communityThumb.png' alt='채팅방 이미지' />
          </div>
        </Modal.Header>

        <Modal.Body>
          <p>고독 34/100</p>
          <p>#강남#장연빌딩#고독#프로젝트#kilo#다이어트#식단관리</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='primary'>채팅방 참여하기</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </ModalWrapper>
  );
}
