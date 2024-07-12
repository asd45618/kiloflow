import React, { useState, useEffect } from "react";
import NumericInput from "react-numeric-input";
import styled from "styled-components";

const PickerBlock = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 300px;
  margin: 5px 0;
  .numeric__input__wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    .label {
      font-size: 1.2rem;
      font-weight: 500;
      margin-bottom: 5px;
      text-align: center;
      color: #333;
    }
    .input__group {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: center;
      .number__picker {
        width: 130px;
        padding: 10px;
        font-size: 1rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        margin-right: 10px;
        text-align: center;
      }
      .confirm__button {
        padding: 10px 15px;
        background-color: #6e9c6f;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s ease;
        &:hover {
          background-color: #5a7f5c;
        }
      }
    }
  }
`;

interface PickerProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

const Picker: React.FC<PickerProps> = ({
  label,
  min,
  max,
  value,
  onChange,
}) => {
  const [tempValue, setTempValue] = useState<number>(value);

  const handleChange = (value: number | null) => {
    if (value !== null) {
      setTempValue(value);
    }
  };

  const handleConfirm = () => {
    onChange(tempValue);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleConfirm();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [tempValue]);

  return (
    <PickerBlock>
      <div className="numeric__input__wrap">
        <div className="label">
          <label>{label}</label>
        </div>
        <div className="input__group">
          <NumericInput
            value={tempValue}
            onChange={handleChange}
            min={min}
            max={max}
            className="number__picker"
          />
          <button onClick={handleConfirm} className="confirm__button">
            전송
          </button>
        </div>
      </div>
    </PickerBlock>
  );
};

export default Picker;
