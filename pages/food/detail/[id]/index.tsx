import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./foodDetail.module.css";
import {
  faSquarePlus,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-regular-svg-icons";
import styled from "styled-components";
import { useRouter } from "next/router";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

const FoodDetailWrapper = styled.div`
  text-align: center;
  padding: 10px;
  .detail__top {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
      width: 50%;
      border: 1px solid #000;
      border-radius: 10px;
      padding: 1px 7px;
      margin-right: 3px;
      font-size: 18px;
      margin: 15px 15px 0;
    }
    h2 {
      width: 80%;
      font-size: 28px;
      font-weight: bold;
      margin-top: 13px;
      margin-bottom: 25px;
    }
    .back {
      position: absolute;
      top: 20px;
      left: 15px;
      cursor: pointer;
      font-size: 24px;
    }
  }
  .detail__img {
    display: flex;
    justify-content: center;
    height: 200px;
    margin-bottom: 25px;
  }
  .thumb__wrapper {
    padding: 0 30px;
    .thumb {
      display: flex;
      justify-content: space-between;
      font-size: 24px;
      svg {
        padding-bottom: 5px;
        margin: 0 10px;
        cursor: pointer;
        &:first-child {
          &.up {
            color: blue;
          }
        }
        &:last-child {
          &.down {
            color: red;
          }
          transform: scale(-1, 1);
        }
      }
    }
    .progress {
      padding: 5px;
      --bs-progress-bg: red;
      --bs-progress-height: 0.5rem;
    }
    .left {
      text-align: left;
      font-size: 12px;
    }
    .right {
      text-align: right;
      font-size: 12px;
    }
  }
  .detail__info {
    p {
      font-size: 18px;
      font-weight: bold;
      margin: 30px;
    }
  }
  .detail__plus {
    svg {
      font-size: 30px;
      cursor: pointer;
    }
  }
  .detail__btn {
    button {
      border: 1px solid #000;
      padding: 1px 20px;
      margin-top: 20px;
      border-radius: 5px;
      &:first-child {
        border-color: green;
        margin-right: 20px;
      }
      &:last-child {
        border-color: red;
      }
    }
  }
`;

interface Recommendation {
  id: number;
  user_id: number;
  food_id: number;
  recommend: string;
}

interface FoodData {
  id: string;
  name: string;
  protein: number;
  carbohydrate: number;
  fat: number;
  calorie: number;
  img: string;
  food_seq: string;
  user_id: number;
}

export default function FoodDetail() {
  const router = useRouter();
  const [recommend, setRecommend] = useState("");
  const [allRecommend, setAllRecommend] = useState(0);
  const [upRecommend, setUpRecommend] = useState(0);
  const [currentUserRecommend, setCurrentUserRecommend] = useState("");
  const {
    id,
    name,
    protein,
    carbohydrate,
    fat,
    calorie,
    img,
    food_seq,
    user_id,
  } = JSON.parse(router.query.data as string) as FoodData;
  const [currentUserId, setCurrentUserID] = useState(0);

  const clickThumb = async (thumb: string) => {
    try {
      const res = await fetch("/api/food/recommend-click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          thumb,
          currentUserId,
          id,
        }),
      });

      if (res.ok) {
        const rec = await res.json();
        setRecommend(rec.message);
        router.back();
      } else {
        alert("추천에 실패했습니다.");
      }
    } catch (err) {
      alert("추천에 실패했습니다.");
    }
  };

  const goToModify = () => {
    router.push({
      pathname: `/food/modify/${id}`,
      query: {
        id,
        name,
        protein,
        carbohydrate,
        fat,
        calorie,
        img,
        food_seq,
        user_id,
      },
    });
  };

  const deleteFood = async () => {
    const result = confirm("정말 삭제하시겠습니까?");
    if (result) {
      try {
        const res = await fetch("/api/food/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, user_id }),
        });

        if (res.ok) {
          alert("삭제가 완료되었습니다.");
          router.push("/food/list");
        } else {
          alert("삭제에 실패했습니다.");
        }
      } catch (err) {
        alert("An unexpected error occurred");
      }
    }
  };

  const addTodayFood = async () => {
    try {
      const res = await fetch("/api/food/todayFood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: currentUserId,
          food_id: id,
        }),
      });

      if (res.ok) {
        const rec = await res.json();
        alert(`${name} ${rec.message}`);
      } else {
        alert("추가에 실패했습니다.");
      }
    } catch (err) {
      alert("추가에 실패했습니다.");
    }
  };

  useEffect(() => {
    const fetchRecommendList = async () => {
      try {
        const res = await fetch("/api/food/recommend-list", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        if (res.ok) {
          const data = await res.json();
          console.log(data.data.length);
          const currentUserRecommendData = data.data.find(
            (val: Recommendation) => val.user_id === currentUserId
          );
          currentUserRecommendData
            ? setCurrentUserRecommend(currentUserRecommendData.recommend)
            : setCurrentUserRecommend("");
          setUpRecommend(
            data.data.filter((val: Recommendation) => val.recommend === "up")
              .length
          );
          setAllRecommend(data.data.length);
        } else {
          alert("추천 목록을 불러오는 데 실패했습니다1.");
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (id.startsWith("user")) {
      fetchRecommendList();
    }
  }, [id, currentUserId, recommend]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setCurrentUserID(data.user.user_id);
          } else {
            throw new Error("데이터를 불러오는 데 실패했습니다.");
          }
        }
      } catch (error) {
        console.error("API 요청 에러:", error);
        // 에러 처리 로직 추가
      }
    };
    fetchData();
  }, []);

  const percentage =
    allRecommend > 0 ? Math.round((upRecommend / allRecommend) * 100) : 0;

  return (
    <FoodDetailWrapper className="detail__wrapper">
      <div className="detail__top">
        {id.startsWith("user") ? <p>유저등록</p> : ""}
        <h2>{name}</h2>
        <div className="back" onClick={() => router.back()}>
          <IoIosArrowBack />
        </div>
      </div>
      <div className="detail__img">
        <img src={`${img}`} alt={name} />
      </div>
      <div className="thumb__wrapper">
        {id.startsWith("user") ? (
          <div className="thumb">
            <FontAwesomeIcon
              icon={faThumbsUp}
              onClick={() => clickThumb("up")}
              className={currentUserRecommend === "up" ? "up" : ""}
            />
            <FontAwesomeIcon
              icon={faThumbsDown}
              onClick={() => clickThumb("down")}
              className={currentUserRecommend === "down" ? "down" : ""}
            />
          </div>
        ) : (
          ""
        )}
        {id.startsWith("user") ? <ProgressBar now={percentage} /> : ""}
        {id.startsWith("user") ? (
          <div>
            {upRecommend >= allRecommend - upRecommend ? (
              <p className="left">
                {percentage}%의 유저가 {name}을 추천해요!
              </p>
            ) : (
              <p className="right">
                {Math.round(
                  ((allRecommend - upRecommend) / allRecommend) * 100
                )}
                %의 유저가 비추천해요!
              </p>
            )}
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="detail__info">
        <p>
          단: {protein} 탄: {carbohydrate} 지: {fat}
        </p>
        <p>열량: {calorie}kcal</p>
        {/* <p>그 외 정보들</p> */}
      </div>
      <div className="detail__plus" onClick={addTodayFood}>
        <FontAwesomeIcon icon={faSquarePlus} />
      </div>
      {id.startsWith("user") && user_id === currentUserId ? (
        <div className="detail__btn">
          <button onClick={goToModify}>수정</button>
          <button onClick={deleteFood}>삭제</button>
        </div>
      ) : (
        ""
      )}
    </FoodDetailWrapper>
  );
}
