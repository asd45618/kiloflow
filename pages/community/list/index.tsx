import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import Dropdown from "react-bootstrap/Dropdown";
import Search from "../../../components/search/Search";
import Modal from "../../../components/communityModal/communityModal";

const CommunityListWrapper = styled.div`
  position: relative;
  .search {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: 20px 0;
    .dropdown-toggle {
      background-color: inherit;
      color: #000;
      border: none;
    }
    .dropdown-menu {
      min-width: 0;
    }
    input {
      border-bottom: 1px solid #000;
      outline: none;
      background-color: inherit;
    }
    svg {
      cursor: pointer;
    }
  }
  .list__info {
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid #aeaeae;
    padding: 20px 0;
    .info__img {
      flex: 0 0 15%;
      margin-right: 5%;
      img {
        width: 100%;
      }
    }
    .info__text__wrapper {
      flex: 0 0 80%;
      .text__top {
        display: flex;
        justify-content: space-between;
      }
      .text__bottom {
        p {
          font-size: 12px;
          color: #979797;
        }
      }
    }
  }
`;

export default function communityList() {
  return (
    <CommunityListWrapper>
      <div className='search'>
        <Dropdown onClick={(e) => e.preventDefault()}>
          <Dropdown.Toggle variant='success' id='dropdown-basic'>
            제목
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href='#/action-1'>제목</Dropdown.Item>
            <Dropdown.Item href='#/action-2'>태그</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <input type='text' />
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </div>
      <div className='list__info'>
        <div className='info__img'>
          <img src='../../communityThumb.png' alt='thumb' />
        </div>
        <div className='info__text__wrapper'>
          <div className='text__top'>
            <div className='top__title'>고독</div>
            <div className='top__num'>34/100</div>
          </div>
          <div className='text__bottom'>
            <p>#강남#장연빌딩#고독#프로젝트#kilo#flow#다이어트#식단관리</p>
          </div>
        </div>
      </div>
      <div className='list__info'>
        <div className='info__img'>
          <img src='../../communityThumb.png' alt='thumb' />
        </div>
        <div className='info__text__wrapper'>
          <div className='text__top'>
            <div className='top__title'>고독</div>
            <div className='top__num'>34/100</div>
          </div>
          <div className='text__bottom'>
            <p>#강남#장연빌딩#고독#프로젝트#kilo#flow#다이어트#식단관리</p>
          </div>
        </div>
      </div>
      <div className='list__info'>
        <div className='info__img'>
          <img src='../../communityThumb.png' alt='thumb' />
        </div>
        <div className='info__text__wrapper'>
          <div className='text__top'>
            <div className='top__title'>고독</div>
            <div className='top__num'>34/100</div>
          </div>
          <div className='text__bottom'>
            <p>#강남#장연빌딩#고독#프로젝트#kilo#flow#다이어트#식단관리</p>
          </div>
        </div>
      </div>
      <div className='list__info'>
        <div className='info__img'>
          <img src='../../communityThumb.png' alt='thumb' />
        </div>
        <div className='info__text__wrapper'>
          <div className='text__top'>
            <div className='top__title'>고독</div>
            <div className='top__num'>34/100</div>
          </div>
          <div className='text__bottom'>
            <p>#강남#장연빌딩#고독#프로젝트#kilo#flow#다이어트#식단관리</p>
          </div>
        </div>
      </div>
      {/* <Search /> */}
      <Modal />
    </CommunityListWrapper>
  );
}
