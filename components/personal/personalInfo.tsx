import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import classnames from "classnames";
import styles from "../../styles/components.module.css";
import styled from "styled-components";
import ProfileImageModal from "../Layout/ProfileImageModal";

const PersonalInfoBlock = styled.div`
  position: relative;
  max-width: 345px;
  margin: 25px auto;
  text-align: center;
  color: gray;
  table {
    width: 100%;

    tr {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 2px 0;
      label {
        text-align: left;
        padding: 10px 10px 0 10px;
      }
      td {
        padding: 0px 10px;
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

const PersonalInfo = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [nickname, setNickname] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState<File | string>("");
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [showButtons, setShowButtons] = useState(false);
  const [imageSelectModalIsOpen, setImageSelectModalIsOpen] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
          setNickname(data.user.nickname);
          setProfilePreview(data.user.profile_image);
          setProfileImage(data.user.profile_image);
        } else {
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
      } else {
        router.push("/auth/login");
      }
    };

    fetchCurrentUser();
  }, []);

  const handleProfileImageClick = () => {
    setShowButtons((prevState) => !prevState);
  };

  const handleImageSelect = (src: string) => {
    setProfilePreview(src);
    setProfileImage(src);
    setImageSelectModalIsOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      const fileUrl = URL.createObjectURL(file);
      setProfilePreview(fileUrl);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("email", currentUser.email);
    formData.append("nickname", nickname);
    formData.append("profile_image", profileImage);
    if (currentPassword) formData.append("currentPassword", currentPassword);
    if (newPassword) formData.append("newPassword", newPassword);

    try {
      const res = await fetch("/api/modify/personal-info-modify", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
        setError("");
        window.alert("개인정보 수정이 완료되었습니다.");
        router.reload(); // 페이지 새로고침으로 변경사항 반영
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <PersonalInfoBlock className={styles.container}>
      <form onSubmit={handleSubmit}>
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
              <label htmlFor="email">이메일</label>
              <td>
                <input
                  className={styles.input__big}
                  type="email"
                  id="email"
                  value={currentUser.email}
                  disabled
                />
              </td>
            </tr>
            <tr>
              <label htmlFor="nickname">닉네임</label>
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
              </td>
            </tr>
            <tr>
              <label htmlFor="password">현재 비밀번호</label>
              <td>
                <input
                  className={styles.input__big}
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="현재 비밀번호"
                />
              </td>
            </tr>
            <tr>
              <label htmlFor="newPassword">변경할 비밀번호</label>
              <td>
                <input
                  className={styles.input__big}
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="변경할 비밀번호"
                />
              </td>
            </tr>
            <tr>
              <label htmlFor="confirmPassword">변경할 비밀번호 확인</label>
              <td>
                <input
                  className={styles.input__big}
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="변경할 비밀번호 확인"
                />
              </td>
            </tr>
          </tbody>
        </table>

        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button__small}>
          수정
        </button>
      </form>

      <ProfileImageModal
        isOpen={imageSelectModalIsOpen}
        onRequestClose={() => setImageSelectModalIsOpen(false)}
        onSelectImage={handleImageSelect}
      />
    </PersonalInfoBlock>
  );
};

export default PersonalInfo;
