"use client";

import { faBookmark, faCommentDots } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import styled from "styled-components";
import Image from "next/image";
import logo from "../../public/kiloflow1.png";

const HeaderBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #a1a1a1;
  padding-bottom: 5px;
  .header__image {
    width: 150px;
    cursor: pointer;
  }
  .link {
    a {
      font-size: 24px;
      &:first-child {
        margin-right: 15px;
      }
      &:last-child {
        svg {
          transform: scale(-1, 1);
        }
      }
    }
  }
`;

export default function Header() {
  return (
    <HeaderBlock>
      <Link href="/" className="header__image">
        <Image src={logo} alt="logo" />
      </Link>
      <div className="link">
        <Link href="">
          <FontAwesomeIcon icon={faBookmark} />
        </Link>
        <Link href="">
          <FontAwesomeIcon icon={faCommentDots} />
        </Link>
      </div>
    </HeaderBlock>
  );
}
