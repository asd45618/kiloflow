import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styled from "styled-components";
import styles from "../../../styles/components.module.css";
import Image from "next/image";
import logo from "../../../public/kiloflow1.png";

const LoginBlock = styled.div`
  max-width: 345px;
  margin: 100px auto;
  text-align: center;
  color: gray;
  .top {
    margin: 20px 0;
    div {
      margin: 15px 0 40px;
      white-space: nowrap;
    }
  }
  table {
    width: 100%;
    td {
      padding: 10px;
      text-align: left;
    }
  }
  .error {
    color: red;
    font-size: 0.875rem;
    margin-top: 5px;
  }
  .link__join {
    .text__color {
      color: #6e9c6f;
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        if (data.isInitialSetupComplete) {
          router.push("/"); // 초기 설정이 완료된 경우 메인 화면으로 이동
        } else {
          router.push("/initialSetting"); // 초기 설정이 완료되지 않은 경우 초기 설정 페이지로 이동
        }
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <LoginBlock>
      <form onSubmit={handleSubmit}>
        <div className="top">
          <Image src={logo} alt="logo" />
          <div>
            <p>건강한 삶을 원하시나요?</p>
            <p>로그인하여 시작하세요.</p>
          </div>
        </div>
        <table>
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
          {error && (
            <tr>
              <td colSpan={2}>
                <p className="error">{error}</p>
              </td>
            </tr>
          )}
        </table>

        <button className={styles.button__big} type="submit">
          로그인
        </button>
      </form>
      <div className="link__join">
        <p>
          계정이 없으신가요?&nbsp;&nbsp;
          <Link href="/auth/join">
            <button className="text__color">회원가입</button>
          </Link>
        </p>
      </div>
    </LoginBlock>
  );
};

export default Login;
