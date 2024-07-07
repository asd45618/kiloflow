import React, { useState } from "react";
import NumericInput from "react-numeric-input";
import styles from "../../styles/picker.module.css";

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

  return (
    <div className={styles.picker}>
      <div className={styles.numericInputWrap}>
        <div className={styles.label}>
          <label>{label}</label>
        </div>
        <div className={styles.inputGroup}>
          <NumericInput
            value={tempValue}
            onChange={handleChange}
            min={min}
            max={max}
            className={styles.numberPicker}
          />
          <button onClick={handleConfirm} className={styles.confirmButton}>
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default Picker;
