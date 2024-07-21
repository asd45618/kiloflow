import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const FoodModifyBlock = styled.div`
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
  .modify__title {
    margin: 30px 0;
    input {
      width: 100%;
    }
  }
  .modify__img {
    margin-bottom: 20px;
    span {
      margin-right: 15px;
    }
    input {
      border: none;
    }
  }
  .modify__info {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
    input {
      width: 80px;
    }
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
  }
  .modify__btn {
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
      color: #000;
    }
    button {
      border: 1px solid #000;
      padding: 1px 20px;
      margin-top: 20px;
      border-radius: 5px;
      border-color: green;
    }
  }
`;

type FormDataType = {
  id: string;
  name: string;
  protein: string;
  carbohydrate: string;
  fat: string;
  calorie: string;
  img: File | string;
  food_seq: string;
  user_id: string;
};

export default function foodModify() {
  const router = useRouter();
  const { query } = router;

  const [foodPreview, setFoodPreview] = useState(query.img as string);
  const [formData, setFormData] = useState<FormDataType>({
    id: '',
    name: '',
    protein: '',
    carbohydrate: '',
    fat: '',
    calorie: '',
    img: '',
    food_seq: '',
    user_id: '',
  });
  const [error, setError] = useState('');

  const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const changeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, img: file });
      const fileUrl = URL.createObjectURL(file);
      setFoodPreview(fileUrl);
    }
  };

  const changeProtein = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, protein: e.target.value });
  };

  const changeCarb = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, carbohydrate: e.target.value });
  };

  const changeFat = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, fat: e.target.value });
  };

  const changeCalorie = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, calorie: e.target.value });
  };

  const handleModify = async (e: React.FormEvent) => {
    e.preventDefault();
    // setError('');

    if (!formData.name) {
      setError('음식 이름을 입력해주세요.');
      return;
    }
    if (!formData.img) {
      setError('사진을 선택해주세요.');
      return;
    }
    if (!formData.protein) {
      setError('단백질을 입력해주세요.');
      return;
    }
    if (!formData.carbohydrate) {
      setError('탄수화물을 입력해주세요.');
      return;
    }
    if (!formData.fat) {
      setError('지방을 입력해주세요.');
      return;
    }
    if (!formData.calorie) {
      setError('열량을 입력해주세요.');
      return;
    }

    const foodFormData = new FormData();
    foodFormData.append('food_id', formData.id);
    foodFormData.append('menu', formData.name);
    foodFormData.append('pro', formData.protein.toString());
    foodFormData.append('carb', formData.carbohydrate.toString());
    foodFormData.append('fat', formData.fat.toString());
    foodFormData.append('calorie', formData.calorie.toString());
    foodFormData.append('img', formData.img);
    foodFormData.append('food_seq', formData.food_seq);
    foodFormData.append('user_id', formData.user_id.toString());

    try {
      const res = await fetch('/api/food/modify', {
        method: 'POST',
        body: foodFormData,
      });

      if (res.ok) {
        alert('수정이 완료되었습니다.');
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
    if (query.id) {
      setFormData({
        id: query.id as string,
        name: query.name as string,
        protein: query.protein as string,
        carbohydrate: query.carbohydrate as string,
        fat: query.fat as string,
        calorie: query.calorie as string,
        img: query.img as string,
        food_seq: query.food_seq as string,
        user_id: query.user_id as string,
      });
    }
  }, [query]);

  return (
    <FoodModifyBlock>
      <div className='modify__title'>
        <p>음식 이름</p>
        <input type='text' value={formData.name} onChange={changeName} />
      </div>
      <div className='modify__img'>
        <span>사진</span>
        <Image
          className='image'
          src={foodPreview}
          alt='Profile Preview'
          width={100}
          height={100}
        />
        <input type='file' onChange={changeImg} />
      </div>
      <div className='modify__info'>
        <div>
          <p>단백질</p>
          <input
            type='number'
            value={formData.protein}
            onChange={changeProtein}
          />
          <span> g</span>
        </div>
        <div>
          <p>탄수화물</p>
          <input
            type='number'
            value={formData.carbohydrate}
            onChange={changeCarb}
          />
          <span> g</span>
        </div>
        <div>
          <p>지방</p>
          <input type='number' value={formData.fat} onChange={changeFat} />
          <span> g</span>
        </div>
        <div>
          <p>열량</p>
          <input
            type='number'
            value={formData.calorie}
            onChange={changeCalorie}
          />
          <span> kcal</span>
        </div>
      </div>
      <div className='modify__btn'>
        <Link href='/food/list'>취소</Link>
        <button onClick={handleModify}>수정</button>
      </div>
    </FoodModifyBlock>
  );
}
