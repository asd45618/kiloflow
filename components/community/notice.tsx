//componets > community> notice.tsx
import React from "react";
import styled from "styled-components";

const NoticeContainer = styled.div`
  background-color: #f8f9fa;
  padding: 15px;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 20px;
`;

interface NoticeProps {
  title: string;
  content: string;
}

const Notice: React.FC<NoticeProps> = ({ title, content }) => {
  return (
    <NoticeContainer>
      <h4>{title}</h4>
      <p>{content}</p>
    </NoticeContainer>
  );
};

export default Notice;
