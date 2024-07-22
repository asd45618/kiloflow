import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';

const FoodRegisterWrapper = styled.div`
  max-width: 350px;
  margin: 0 auto;
  p {
    margin-bottom: 3px;
  }
  input {
    border: 1px solid #8b8b8b;
    border-radius: 5px;
    padding-left: 5px;
  }
  .register__title {
    margin: 30px 0;
    input {
      width: 100%;
    }
  }
  .register__img {
    margin-bottom: 20px;
    span {
      margin-right: 15px;
    }
    input {
      border: none;
    }
  }
  .register__info {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
    div {
      &:nth-child(1) {
        flex: 0 0 33%;
        margin-bottom: 15px;
      }
      &:nth-child(2) {
        flex: 0 0 33%;
      }
      &:nth-child(3) {
        flex: 0 0 33%;
      }
      &:nth-child(4) {
        flex: 0 0 33%;
      }
    }
    input {
      width: 80px;
    }
  }
  .register__btn {
    display: flex;
    justify-content: center;
    a {
      border: 1px solid #000;
      padding: 1px 20px;
      margin-top: 20px;
      border-radius: 5px;
      border-color: red;
      margin-right: 20px;
      text-decoration: none;
      color: black;
    }
    button {
      border: 1px solid #000;
      padding: 1px 20px;
      margin-top: 20px;
      border-radius: 5px;
      border-color: green;
    }
  }
  .error_message {
    font-size: 9px;
    color: red;
  }
`;

export default function FoodRegister() {
  const router = useRouter();

  const [menu, setMenu] = useState('');
  const [img, setImg] = useState<File | string>('');
  const [foodPreview, setFoodPreview] = useState<string>('');
  const [pro, setPro] = useState(0);
  const [carb, setCarb] = useState(0);
  const [fat, setFat] = useState(0);
  const [calorie, setCalorie] = useState(0);
  const [user_id, setUser_id] = useState(0);
  const [error, setError] = useState('');

  const changeMenu = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMenu(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImg(file);
      const fileUrl = URL.createObjectURL(file);
      setFoodPreview(fileUrl);
    }
  };

  const changePro = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPro(parseInt(e.target.value));
  };

  const changeCar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCarb(parseInt(e.target.value));
  };

  const changeFat = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFat(parseInt(e.target.value));
  };

  const changeKcal = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCalorie(parseInt(e.target.value));
  };

  const registerFood = async (e: React.FormEvent) => {
    e.preventDefault();
    const food_id = v4();
    setError('');

    if (!menu) {
      setError('음식 이름을 입력해주세요.');
      return;
    }
    if (!img) {
      setError('사진을 선택해주세요.');
      return;
    }
    if (!pro) {
      setError('단백질을 입력해주세요.');
      return;
    }
    if (!carb) {
      setError('탄수화물을 입력해주세요.');
      return;
    }
    if (!fat) {
      setError('지방을 입력해주세요.');
      return;
    }
    if (!calorie) {
      setError('열량을 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('food_id', food_id);
    formData.append('menu', menu);
    formData.append('img', img);
    formData.append('pro', pro.toString());
    formData.append('carb', carb.toString());
    formData.append('fat', fat.toString());
    formData.append('calorie', calorie.toString());
    formData.append('user_id', user_id.toString());

    try {
      const res = await fetch('/api/food/register', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('등록이 완료되었습니다.');
        router.push('/food/list');
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUser_id(data.user.user_id);
          } else {
            throw new Error('데이터를 불러오는 데 실패했습니다.');
          }
        }
      } catch (error) {
        console.error('API 요청 에러:', error);
        // 에러 처리 로직 추가
      }
    };
    fetchData();
  }, []);

  return (
    <FoodRegisterWrapper>
      <div className='register__title'>
        <p>음식 이름</p>
        <input type='text' value={menu} onChange={changeMenu} />
        {!menu && error ? (
          <p className='error_message'>음식 이름을 작성해주세요.</p>
        ) : (
          ''
        )}
      </div>
      <div className='register__img'>
        <span>사진</span>
        {foodPreview ? (
          <Image
            className='image'
            src={foodPreview}
            alt='Profile Preview'
            width={100}
            height={100}
          />
        ) : (
          ''
        )}
        <input type='file' onChange={handleFileChange} />
        {!img && error ? (
          <p className='error_message'>사진을 선택해주세요.</p>
        ) : (
          ''
        )}
      </div>
      <div className='register__info'>
        <div>
          <p>단백질</p>
          <input type='number' value={pro} onChange={changePro} />
          <span> g</span>
          {!pro && error ? (
            <p className='error_message'>단백질을 입력해주세요.</p>
          ) : (
            ''
          )}
        </div>
        <div>
          <p>탄수화물</p>
          <input type='number' value={carb} onChange={changeCar} />
          <span> g</span>
          {!carb && error ? (
            <p className='error_message'>탄수화물을 입력해주세요.</p>
          ) : (
            ''
          )}
        </div>
        <div>
          <p>지방</p>
          <input type='number' value={fat} onChange={changeFat} />
          <span> g</span>
          {!fat && error ? (
            <p className='error_message'>지방을 입력해주세요.</p>
          ) : (
            ''
          )}
        </div>
        <div>
          <p>열량</p>
          <input type='number' value={calorie} onChange={changeKcal} />
          <span> kcal</span>
          {!calorie && error ? (
            <p className='error_message'>열량을 입력해주세요.</p>
          ) : (
            ''
          )}
        </div>
      </div>
      <div className='register__btn'>
        <Link href='/food/list'>취소</Link>
        <button onClick={registerFood}>등록</button>
      </div>
    </FoodRegisterWrapper>
  );
}
