import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link"; // Link 컴포넌트 import
import styles from "../../../styles/components.module.css";

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
    <div className={styles.container}>
      <h1 className="text-3xl font-bold mb-4">로그인</h1>
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
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.btn}>
          로그인
        </button>
      </form>
      <div className={styles.signupContainer}>
        <p>계정이 없으신가요?</p>
        <Link href="/auth/join">
          <button className={styles.signupButton}>회원가입</button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
