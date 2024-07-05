import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Modal from "react-modal";
import Image from "next/image";
import styles from "../../../styles/components.module.css";
import minion1 from "../../../public/minion1.png";
import minion2 from "../../../public/minion2.png";
import minion3 from "../../../public/minion3.png";
import minion4 from "../../../public/minion4.png";
import minion5 from "../../../public/minion5.png";
import minion6 from "../../../public/minion6.png";
import minion7 from "../../../public/minion7.png";
import minion8 from "../../../public/minion8.png";
import minion9 from "../../../public/minion9.png";
import minion10 from "../../../public/minion10.png";
import minion11 from "../../../public/minion11.png";

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

const Join = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState<File | string>(minion1.src);
  const [profilePreview, setProfilePreview] = useState<string>(minion1.src);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imageSelectModalIsOpen, setImageSelectModalIsOpen] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (email) {
      checkEmail();
    }
  }, [email]);

  useEffect(() => {
    if (nickname) {
      checkNickname();
    }
  }, [nickname]);

  useEffect(() => {
    if (confirmPassword) {
      checkPasswordMatch();
    }
  }, [password, confirmPassword]);

  const checkEmail = async () => {
    const res = await fetch(`/api/auth/check?email=${email}`);
    const data = await res.json();
    setEmailMessage(data.message);
  };

  const checkNickname = async () => {
    const res = await fetch(`/api/auth/check?nickname=${nickname}`);
    const data = await res.json();
    setNicknameMessage(data.message);
  };

  const checkPasswordMatch = () => {
    if (password !== confirmPassword) {
      setPasswordMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordMessage("비밀번호가 일치합니다.");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (!password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }
    if (!confirmPassword) {
      setError("비밀번호 확인을 입력해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!nickname) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("nickname", nickname);
    formData.append("profile_image", profileImage);

    // if (typeof profileImage === "string") {
    //   formData.append("profile_image", profileImage);
    // } else {
    //   formData.append("profile_image", profileImage);
    // }

    try {
      const res = await fetch("/api/auth/join", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.push("/auth/login");
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  const handleProfileImageClick = () => {
    setModalIsOpen(true);
  };

  const handleImageSelect = (src: string) => {
    setProfilePreview(src);
    setProfileImage(src);
    setImageSelectModalIsOpen(false);
    setModalIsOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      const fileUrl = URL.createObjectURL(file);
      setProfilePreview(fileUrl);
      setModalIsOpen(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className="text-3xl font-bold mb-4">회원가입</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {emailMessage && <p className={styles.message}>{emailMessage}</p>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {passwordMessage && (
            <p className={styles.message}>{passwordMessage}</p>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="nickname">Nickname:</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
          {nicknameMessage && (
            <p className={styles.message}>{nicknameMessage}</p>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="profile_image">Profile Image:</label>
          <div
            className={styles.profilePreview}
            onClick={handleProfileImageClick}
          >
            <Image
              src={profilePreview}
              alt="Profile Preview"
              width={100}
              height={100}
            />
          </div>
          <input
            type="file"
            id="profile_image"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.btn}>
          회원가입
        </button>
      </form>

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <h2>프로필 이미지 선택</h2>
        <button onClick={() => setImageSelectModalIsOpen(true)}>
          기본이미지 선택
        </button>
        <label htmlFor="customProfileImage" className={styles.uploadLabel}>
          나만의 프로필 이미지 선택
        </label>
        <input
          type="file"
          id="customProfileImage"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button onClick={() => setModalIsOpen(false)}>닫기</button>
      </Modal>

      <Modal
        isOpen={imageSelectModalIsOpen}
        onRequestClose={() => setImageSelectModalIsOpen(false)}
      >
        <h2>기본 이미지 선택</h2>
        <div className={styles.imageGrid}>
          {minionImages.map((img, index) => (
            <div key={index} className={styles.imageItem}>
              <Image
                src={img}
                alt={`Minion ${index + 1}`}
                width={50}
                height={50}
                onClick={() => handleImageSelect(img.src)}
              />
            </div>
          ))}
        </div>
        <button onClick={() => setImageSelectModalIsOpen(false)}>닫기</button>
      </Modal>
    </div>
  );
};

export default Join;
