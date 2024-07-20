import React from "react";
import Modal from "react-modal";
import Image from "next/image";
import modalStyles from "../../styles/profileModal.module.css";

import minion1 from "../../public/minion1.png";
import minion2 from "../../public/minion2.png";
import minion3 from "../../public/minion3.png";
import minion4 from "../../public/minion4.png";
import minion5 from "../../public/minion5.png";
import minion6 from "../../public/minion6.png";
import minion7 from "../../public/minion7.png";
import minion8 from "../../public/minion8.png";
import minion9 from "../../public/minion9.png";
import minion10 from "../../public/minion10.png";
import minion11 from "../../public/minion11.png";

const minionImages = [
  minion1,
  minion2,
  minion3,
  minion4,
  minion5,
  minion6,
  minion7,
  minion8,
  minion9,
  minion10,
  minion11,
];

type ProfileImageModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  onSelectImage: (src: string) => void;
  onConfirm: () => void;
};

const ProfileImageModal: React.FC<ProfileImageModalProps> = ({
  isOpen,
  onRequestClose,
  onSelectImage,
  onConfirm,
}) => {
  return (
    <div className="modal__wrap">
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        className={modalStyles.modal__content}
        overlayClassName={modalStyles.modal__overlay}
      >
        <h2>기본 이미지 선택</h2>
        <div className={modalStyles.image__grid}>
          {minionImages.map((img, index) => (
            <div key={index} className={modalStyles.image__item}>
              <Image
                src={img}
                alt={`Minion ${index + 1}`}
                width={50}
                height={50}
                onClick={() => onSelectImage(img.src)}
              />
            </div>
          ))}
        </div>
        <button onClick={onConfirm}>이미지 확인</button>
        <button onClick={onRequestClose}>닫기</button>
      </Modal>
    </div>
  );
};

export default ProfileImageModal;
