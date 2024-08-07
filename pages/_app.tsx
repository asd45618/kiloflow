'use client';

import '../styles/globals.css'; // Tailwind CSS 적용
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Header from '@/components/Layout/Header';
// import Footer from '@/components/Layout/Footer';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive';
import styles from '../styles/components.module.css';
import { useEffect, useState } from 'react';
import Main from '@/components/main/Main';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '@/components/Layout/Footer';

const LayoutWrapper = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;
  background-image: url('../../fullbg2.png');
  background-repeat: no-repeat;
  background-size: cover;

  @media (max-width: 1140px) {
    align-items: center;
  }
`;

const LeftLayout = styled.div`
  flex: 0 0 414px;
  height: 100vh;
  position: sticky;
  top: 0;
  margin: 0 70px;
  padding-top: 350px;
  text-align: center;
  display: flex;
  flex-direction: column;
  .left__wrapper {
    position: relative;
    .abocado {
      position: absolute;
      width: 150px;
      left: 35%;
      top: -75%;
      transform: translateX(-50%);
      transform: rotate(30deg);
    }
    .logo {
      width: 350px;
      margin: 0 auto;
    }
    p {
      font-size: 18px;
      font-weight: 600;
      margin: 20px auto;
      color: #0d0d0d;
    }
  }

  @media (max-width: 1140px) {
    display: none;
  }
`;

const RightLayoutWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  margin: 0 70px;
  width: 450px;
  height: 772px;
  border-radius: 50px;

  .dynamic {
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 20px;
    background: #000;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    z-index: 99999;
  }
  @media (max-width: 1140px) {
    margin: 0;
  }
`;

const RightLayout = styled.div`
  border-radius: 50px;
  flex: 1;
  max-width: 434px;
  height: 756px;
  background-color: #fcefef;
  padding: 0 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ContentWrapper = styled.div`
  overflow-y: scroll;
  height: 100vh;

  padding: 10px 0;
  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    cursor: pointer;
    background: rgba(102, 153, 51, 0.6); /* 스크롤바 막대 색상 */
    border-radius: 12px;
    border: 10px solid rgba(14, 91, 16, 0.8);
    &:hover {
      background-color: rgba(102, 153, 51, 0.4);
    }
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0); /* 스크롤바 뒷 배경 색상 */
    border-radius: 12px;
  }
  &::-webkit-scrollbar-button {
    display: block;
    height: 20px;
  }
`;

export default function App({ Component, pageProps }: AppProps) {
  const [mainWait, setMainWait] = useState(false);
  const path = usePathname();
  const mobile = useMediaQuery({ query: '(max-width: 1140px)' });

  // useEffect(() => {
  //   setTimeout(() => {
  //     setMainWait(false);
  //   }, 3000);
  // }, []);

  return (
    <LayoutWrapper>
      {!mobile && (
        <LeftLayout>
          <div className='left__wrapper'>
            <div className='abocado'>
              <img src='../../abocado.png' alt='아보카도' />
            </div>
            <Link href='/' className='logo'>
              <img src='../../kiloflow1.png' alt='로고' />
            </Link>
            <p>건강한 흐름, 가벼운 삶</p>
          </div>
        </LeftLayout>
      )}
      <RightLayoutWrapper>
        <div className='dynamic'></div>
        {mainWait ? (
          <Main />
        ) : (
          <RightLayout>
            <Head>
              <title>kiloflow</title>
              <meta name='description' content='Generated by Next.js' />
              {/* Other meta tags */}
            </Head>
            {path === '/auth/join' || path === '/auth/login' ? (
              <ContentWrapper>
                <Component {...pageProps} />
              </ContentWrapper>
            ) : (
              <>
                <Header />
                <ContentWrapper>
                  <Component {...pageProps} />
                </ContentWrapper>

                <Footer />
              </>
            )}
          </RightLayout>
        )}
      </RightLayoutWrapper>
    </LayoutWrapper>
  );
}
