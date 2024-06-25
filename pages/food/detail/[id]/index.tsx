import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './foodDetail.module.css';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';

export default function foodDetail() {
  return (
    <div className={styles.detail__wrapper}>
      <h1>만두</h1>
      <div className={styles.detail__img}>
        <img src='../../foodListImg.png' alt='' />
      </div>
      <div className={styles.detail__info}>
        <p>단: 20 탄: 20 지: 20</p>
        <p>열량: 600kcal</p>
        <p>그 외 정보들</p>
      </div>
      <div className={styles.detail__plus}>
        <FontAwesomeIcon icon={faSquarePlus} />
      </div>
      <div className={styles.detail__btn}>
        <button>수정</button>
        <button>삭제</button>
      </div>
    </div>
  );
}
