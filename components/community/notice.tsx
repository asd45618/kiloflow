import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { TbSpeakerphone } from "react-icons/tb";

const NoticeContainer = styled.div`
  background-color: #f8f9fa;
  padding: 15px;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 10px;
  cursor: pointer;
  .subject {
    display: flex;
    align-items: center;
  }
  .actions {
    margin-top: 10px;
    button {
      margin-right: 10px;
    }
  }
`;

interface NoticeProps {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

const Notice: React.FC<NoticeProps> = ({ id, title, content, createdAt }) => {
  const storageKey = `notice-${id}`;
  const savedState = localStorage.getItem(storageKey);
  const initialState = savedState
    ? JSON.parse(savedState)
    : { open: true, visible: true, lastCreatedAt: createdAt };

  const [isOpen, setIsOpen] = useState(initialState.open);
  const [isVisible, setIsVisible] = useState(initialState.visible);
  const [lastCreatedAt, setLastCreatedAt] = useState(
    initialState.lastCreatedAt
  );

  useEffect(() => {
    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      const { open, visible, lastCreatedAt } = JSON.parse(savedState);
      if (lastCreatedAt === createdAt) {
        setIsOpen(open);
        setIsVisible(visible);
      } else {
        // 새로운 공지가 올라왔을 때 상태 초기화
        setIsOpen(true);
        setIsVisible(true);
        setLastCreatedAt(createdAt); // 마지막 생성 시간 업데이트
      }
    } else {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ open: true, visible: true, lastCreatedAt: createdAt })
      );
    }
  }, [id, createdAt, storageKey]);

  useEffect(() => {
    if (lastCreatedAt === createdAt) {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          open: isOpen,
          visible: isVisible,
          lastCreatedAt: createdAt,
        })
      );
    }
  }, [isOpen, isVisible, storageKey, createdAt, lastCreatedAt]);

  if (!isVisible) {
    return null;
  }

  return (
    <NoticeContainer onClick={() => setIsOpen(!isOpen)}>
      <div className="subject">
        <TbSpeakerphone />
        <h4>{title}</h4>
      </div>
      {isOpen && <p>{content}</p>}
      {isOpen && (
        <div className="actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          >
            공지 닫기
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
          >
            다시 보지 않기
          </button>
        </div>
      )}
    </NoticeContainer>
  );
};

export default Notice;
