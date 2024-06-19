import { GetServerSideProps } from 'next';
import styles from '../styles/components.module.css';

type User = {
  id: number;
  name: string;
  email: string;
};

type Props = {
  users: User[];
};

const Home = ({ users }: Props) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Users List</h1>
      <ul>
        {users?.map((user) => (
          <li key={user.email}>
            {user.name} ({user.email})
          </li>
        ))}
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>
        <p>건강한 흐름, 가벼운 삶</p>

        <button className={styles.btn}>확인</button>
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('http://localhost:3000/api/user');
  const users = await res.json();

  return {
    props: {
      users,
    },
  };
};

export default Home;
