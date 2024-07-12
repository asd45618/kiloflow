import React, { useState } from "react";
import NumericInput from "react-numeric-input";
import styled from "styled-components";

const Picker2Block = styled.div`
  display: flex;
  align-items: center;
  .input__group {
    align-items: center;
    width: 100%;
    justify-content: center;
    .picker {
      width: 130px;
      padding: 10px;
      font-size: 1rem;
      border: 1px solid #ddd;
      border-radius: 5px;
      margin-right: 10px;
      text-align: center;
    }
  }
  .label {
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
      onChange(value); // 숫자 값이 변경될 때마다 즉시 onChange 함수 호출
    }
  };

  return (
    <Picker2Block>
      <div className="input__group">
        <NumericInput
          value={tempValue}
          onChange={handleChange}
          min={min}
          max={max}
          className="picker"
        />
      </div>
      <div className="label">
        <label>{label}</label>
      </div>
    </Picker2Block>
  );
};

export default Picker;
