import styled from "styled-components";

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .search__img {
    margin: 30px 0;
  }
  .search__text {
  }
`;

export default function search() {
  return (
    <SearchWrapper>
      <div className='search__img'>
        <img src='../../noSearch.png' alt='noSearch' />
      </div>
      <div className='search__text'>서초에 대한 검색 결과가 없습니다.</div>
    </SearchWrapper>
  );
}
