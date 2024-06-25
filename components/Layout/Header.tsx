'use client';

import Link from 'next/link';
import styled from 'styled-components';

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
      &:first-child {
        margin-right: 10px;
      }
    }
  }
`;

export default function Header() {
  return (
    <HeaderBlock>
      <Link href='/' className='header__image'>
        <img src='../../kiloflow1.png' alt='logo' />
      </Link>
      <div className='link'>
        <Link href=''>스크랩</Link>
        <Link href=''>채팅</Link>
      </div>
    </HeaderBlock>
  );
}
