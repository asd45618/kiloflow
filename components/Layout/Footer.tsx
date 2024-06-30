import {
  faCirclePlus,
  faDumbbell,
  faHouse,
  faUser,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";

const FooterWrapper = styled.div`
  position: absolute;
  bottom: 2.5%;
  left: 0;
  width: 100%;
  font-size: 32px;
  padding-top: 10px;
  .footer__top {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
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
  .footer__bottom {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid #a1a1a1;
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
      {hideMenu ? (
        <div className='footer__top'>
          <Link href='/food/list'>
            <FontAwesomeIcon icon={faUtensils} />
          </Link>
          <Link href='/exercise/list'>
            <FontAwesomeIcon icon={faDumbbell} />
          </Link>
        </div>
      ) : (
        ""
      )}
      <div className='footer__bottom'>
        <Link href='/'>
          <FontAwesomeIcon icon={faHouse} />
        </Link>
        <div className='bottom__plus' onClick={() => setHideMenu(!hideMenu)}>
          <FontAwesomeIcon icon={faCirclePlus} />
        </div>
        <Link href=''>
          <FontAwesomeIcon icon={faUser} />
        </Link>
      </div>
    </FooterWrapper>
  );
}
