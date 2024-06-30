import {
  faCirclePlus,
  faHouse,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import styled from "styled-components";

const FooterWrapper = styled.div`
  position: absolute;
  bottom: 2.5%;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 32px;
  border-top: 1px solid #a1a1a1;
  padding-top: 10px;
  a {
    color: #000;
  }
`;

export default function Footer() {
  return (
    <FooterWrapper>
      <Link href='/'>
        <FontAwesomeIcon icon={faHouse} />
      </Link>
      <FontAwesomeIcon icon={faCirclePlus} />
      <Link href=''>
        <FontAwesomeIcon icon={faUser} />
      </Link>
    </FooterWrapper>
  );
}
