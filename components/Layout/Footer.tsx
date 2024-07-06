import {
  faCirclePlus,
  faDumbbell,
  faHouse,
  faUser,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.div`
  left: 0;
  width: 100%;
  font-size: 32px;
  padding-bottom: 10px;
  margin-top: 10px;
  position: sticky;
  bottom: 0;
  background-color: #fcefef;
  .footer__bottom {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid #a1a1a1;
    position: relative;
    .footer__menu {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
      position: absolute;
      bottom: 90%;
      svg {
        width: 40px;
        height: 40px;
        margin: 0 10px;
        border: 1px solid #0e5b10;
        border-radius: 50%;
        padding: 10px;
        background-color: rgba(14, 91, 16, 0.3);
      }
    }
    .bottom__plus {
      cursor: pointer;
    }
  }
  a {
    color: #000;
  }
`;

export default function Footer() {
  const [hideMenu, setHideMenu] = useState(false);

  useEffect(() => {
    setHideMenu(false);
  }, []);

  return (
    <FooterWrapper>
      <div className='footer__bottom'>
        {hideMenu ? (
          <div className='footer__menu'>
            <Link href='/food/list' onClick={() => setHideMenu(false)}>
              <FontAwesomeIcon icon={faUtensils} />
            </Link>
            <Link href='/exercise/list' onClick={() => setHideMenu(false)}>
              <FontAwesomeIcon icon={faDumbbell} />
            </Link>
          </div>
        ) : (
          ''
        )}
        <Link href='/' onClick={() => setHideMenu(false)}>
          <FontAwesomeIcon icon={faHouse} />
        </Link>
        <div className='bottom__plus' onClick={() => setHideMenu(!hideMenu)}>
          <FontAwesomeIcon icon={faCirclePlus} />
        </div>
        <Link href='' onClick={() => setHideMenu(false)}>
          <FontAwesomeIcon icon={faUser} />
        </Link>
      </div>
    </FooterWrapper>
  );
}
