import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import prisma from "../lib/prisma";
import styles from "../styles/components.module.css";

type User = {
  user_id: number;
  nickname: string;
  email: string;
  profile_image: string;
  password: string;
};

type Props = {
  users: User[];
};

const Home = ({ users }: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button className={styles.btn} onClick={handleLogout}>
        로그아웃
      </button>

      <h1 className="text-3xl font-bold mb-4">Users List</h1>
      <ul>
        {users?.map((user) => (
          <li key={user.email}>
            {user.nickname} ({user.email})({user.profile_image})({user.password}
            )
            <Image src={user.profile_image} alt="" width={50} height={50} />
          </li>
        ))}
      </ul>
      <div>
        <h2 className="text-2xl font-bold mb-4">현재 로그인된 사용자</h2>
        <p>이메일: {currentUser.email}</p>
        <p>닉네임: {currentUser.nickname}</p>
        <p>패스워드: {currentUser.password}</p>
        <Image
          src={currentUser.profile_image}
          alt="프로필 이미지"
          width={50}
          height={50}
        />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const users = await prisma.users.findMany({
    select: {
      user_id: true,
      nickname: true,
      email: true,
      profile_image: true,
      password: true,
    },
  });

  return {
    props: {
      users,
    },
  };
};

export default Home;
