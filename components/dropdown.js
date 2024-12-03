// Dropdown.js
"use client"
import React, { useState } from 'react';

const Dropdown = ({ options, label }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <label>{label}</label>
      <select value={selectedOption} onChange={handleChange}>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
