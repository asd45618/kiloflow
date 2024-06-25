import styles from '../../../styles/foodmodify.module.css';

export default function foodModify() {
  return (
    <div className={styles.modify__wrapper}>
      <div className={styles.modify__title}>
        <p>음식 이름</p>
        <input type='text' />
      </div>
      <div className={styles.modify__img}>
        <span>사진</span>
        <input type='file' />
      </div>
      <div className={styles.modify__info}>
        <div>
          <p>단백질</p>
          <input type='number' />
          <span> g</span>
        </div>
        <div>
          <p>탄수화물</p>
          <input type='number' />
          <span> g</span>
        </div>
        <div>
          <p>지방</p>
          <input type='number' />
          <span> g</span>
        </div>
        <div>
          <p>열량</p>
          <input type='number' />
          <span> kcal</span>
        </div>
      </div>
      <div className={styles.modify__btn}>
        <button>취소</button>
        <button>수정</button>
      </div>
    </div>
  );
}
