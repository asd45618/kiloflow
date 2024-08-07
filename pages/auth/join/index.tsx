import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import classnames from "classnames";
import styles from "../../../styles/components.module.css";
import styled from "styled-components";
import ProfileImageModal from "../../../components/Layout/ProfileImageModal";

import minion1 from "../../../public/minion1.png";
import logo from "../../../public/kiloflow1.png";

const JoinBlock = styled.div`
  position: relative;
  max-width: 345px;
  margin: 50px auto;
  text-align: center;
  color: gray;
  .top {
    margin: 25px 0;
    p {
      margin: 10px 0;
    }
  }
  table {
    width: 100%;

    td {
      padding: 10px;
      text-align: center;
      position: relative;
      .image {
        display: inline-block;
        border-radius: 50%;
        width: 150px;
        height: 150px;
        border: 1px solid #ddd;
      }
    }
  }
  .link__join {
    .text__color {
      color: #6e9c6f;
    }
  }
  .buttonContainer {
    width: 100%;
    display: flex;
    justify-content: space-around;
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    .upload__label {
      padding: 10px 15px;
      background-color: #6e9c6f99;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 12px;
      &:hover {
        background-color: #6e9c6f;
      }
    }
  }
`;

const Join = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState<File | string>(minion1.src);
  const [profilePreview, setProfilePreview] = useState<string>(minion1.src);
  const [showButtons, setShowButtons] = useState(false);
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
    setShowButtons((prevState) => !prevState);
  };

  const handleImageSelect = (src: string) => {
    setProfilePreview(src);
    setProfileImage(src);

    setShowButtons(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      const fileUrl = URL.createObjectURL(file);
      setProfilePreview(fileUrl);
      setShowButtons(false);
    }
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      !(e.target as HTMLElement).closest(".buttonContainer") &&
      !(e.target as HTMLElement).closest(".profilePreview")
    ) {
      setShowButtons(false);
    }
  };

  useEffect(() => {
    if (showButtons) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showButtons]);

  return (
    <JoinBlock className={styles.container}>
      <form onSubmit={handleSubmit}>
        <div className="top">
          <Image src={logo} alt="logo" />

          <p>건강한 흐름속에서 건강한 삶을 시작해보세요.</p>
        </div>
        <table>
          <tbody>
            <tr>
              <td>
                <div
                  className={`${styles.profilePreview} profilePreview`}
                  onClick={handleProfileImageClick}
                >
                  <Image
                    className="image"
                    src={profilePreview}
                    alt="Profile Preview"
                    width={100}
                    height={100}
                  />
                </div>
                <label htmlFor="profile_image">
                  프로필 사진을 클릭하여 변경하세요.{" "}
                </label>
                <input
                  type="file"
                  id="profile_image"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                {showButtons && (
                  <div className="buttonContainer">
                    <button
                      type="button"
                      onClick={() => setImageSelectModalIsOpen(true)}
                      className="upload__label"
                    >
                      기본이미지 선택
                    </button>
                    <label
                      htmlFor="customProfileImage"
                      className="upload__label"
                    >
                      나만의 프로필 이미지 선택
                    </label>
                    <input
                      type="file"
                      id="customProfileImage"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <input
                  className={styles.input__big}
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소"
                  required
                />

                {emailMessage && (
                  <p
                    className={classnames(styles.message, {
                      [styles.error]: emailMessage.includes("이미 존재하는"),
                      [styles.success]: emailMessage.includes("사용가능한"),
                    })}
                  >
                    {emailMessage}
                  </p>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <input
                  className={styles.input__big}
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <input
                  className={styles.input__big}
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호 확인"
                  required
                />
                {passwordMessage && (
                  <p
                    className={classnames(styles.message, {
                      [styles.error]:
                        passwordMessage.includes("일치하지 않습니다"),
                      [styles.success]: passwordMessage.includes("일치합니다"),
                    })}
                  >
                    {passwordMessage}
                  </p>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <input
                  className={styles.input__big}
                  type="text"
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임"
                  required
                />
                {nicknameMessage && (
                  <p
                    className={classnames(styles.message, {
                      [styles.error]: nicknameMessage.includes("이미 존재하는"),
                      [styles.success]: nicknameMessage.includes("사용가능한"),
                    })}
                  >
                    {nicknameMessage}
                  </p>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button__big}>
          회원가입
        </button>
      </form>
      <div className="link__join">
        <p>
          이미 계정이 있으신가요?&nbsp;&nbsp;
          <Link href="/auth/login">
            <button className="text__color">로그인</button>
          </Link>
        </p>
      </div>

      <ProfileImageModal
        isOpen={imageSelectModalIsOpen}
        onRequestClose={() => setImageSelectModalIsOpen(false)}
        onSelectImage={handleImageSelect}
        onConfirm={() => setImageSelectModalIsOpen(false)}
      />
    </JoinBlock>
  );
};

export default Join;
