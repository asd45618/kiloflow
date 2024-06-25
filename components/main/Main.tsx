import styled from 'styled-components';

const RightLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  flex: 1;
  max-width: 434px;
  height: 756px;
  background-color: #0e5b10;
  padding: 20px;
  overflow-y: scroll;
  color: #fff;
  &::-webkit-scrollbar {
    width: 3px;
  }
`;

export default function Main() {
  return (
    <RightLayout>
      <img src='../../kiloflow2.png' alt='logo' />
      <p>건강한 흐름, 가벼운 삶</p>
    </RightLayout>
  );
}
