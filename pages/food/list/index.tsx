import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

const FoodListBlock = styled.div`
  .search {
    text-align: center;
    margin: 20px 0;
    input {
      border-bottom: 1px solid #000;
      outline: none;
    }
    svg {
      cursor: pointer;
    }
  }
  ul {
    li {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      padding: 20px 0;
      border-bottom: 1px solid #b8b8b8;
      .list__img {
        flex: 0 0 30%;
        width: 80px;
        height: 80px;
      }
      .list__info {
        flex: 0 0 60%;
        .user__regi {
          border: 1px solid #000;
          border-radius: 10px;
          padding: 1px 7px;
          margin-right: 3px;
        }
      }
      .detail__btn {
        display: flex;
        align-items: center;
        font-size: 30px;
        svg {
          cursor: pointer;
        }
      }
    }
  }
`;

export default function foodList() {
  return (
    <FoodListBlock>
      <div className='search'>
        <input type='text' />
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </div>
      <ul>
        <li>
          <div className='list__img'>
            <img src='../../foodListImg.png' alt='' />
          </div>
          <div className='list__info'>
            <p>만두</p>
            <p>단: 20 탄: 20 지: 20</p>
            <p>열량: 600kcal</p>
          </div>
          <div className='detail__btn'>
            <FontAwesomeIcon icon={faSquarePlus} />
          </div>
        </li>
        <li>
          <div className='list__img'>
            <img src='../../foodListImg.png' alt='' />
          </div>
          <div className='list__info'>
            <span className='user__regi'>유저등록</span>
            <span>만두</span>
            <p>단: 20 탄: 20 지: 20</p>
            <p>열량: 600kcal</p>
          </div>
          <div className='detail__btn'>
            <FontAwesomeIcon icon={faSquarePlus} />
          </div>
        </li>
        <li>
          <div className='list__img'>
            <img src='../../foodListImg.png' alt='' />
          </div>
          <div className='list__info'>
            <p>만두</p>
            <p>단: 20 탄: 20 지: 20</p>
            <p>열량: 600kcal</p>
          </div>
          <div className='detail__btn'>
            <FontAwesomeIcon icon={faSquarePlus} />
          </div>
        </li>
        <li>
          <div className='list__img'>
            <img src='../../foodListImg.png' alt='' />
          </div>
          <div className='list__info'>
            <p>만두</p>
            <p>단: 20 탄: 20 지: 20</p>
            <p>열량: 600kcal</p>
          </div>
          <div className='detail__btn'>
            <FontAwesomeIcon icon={faSquarePlus} />
          </div>
        </li>
        <li>
          <div className='list__img'>
            <img src='../../foodListImg.png' alt='' />
          </div>
          <div className='list__info'>
            <p>만두</p>
            <p>단: 20 탄: 20 지: 20</p>
            <p>열량: 600kcal</p>
          </div>
          <div className='detail__btn'>
            <FontAwesomeIcon icon={faSquarePlus} />
          </div>
        </li>
      </ul>
    </FoodListBlock>
  );
}
