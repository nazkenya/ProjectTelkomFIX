import React, { useState, useRef, useEffect } from "react";

export default function MultiSearchInput({ 
  values = [], 
  onChange, 
  placeholder = "Search ID, NIK or Name...", 
  maxValues = 5,
  onSearch 
}) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addValue = (value) => {
    const trimmed = value.trim();
    if (!trimmed || values.includes(trimmed) || values.length >= maxValues) return;

    const newValues = [...values, trimmed];
    onChange(newValues);
    setInputValue("");
    
    if (onSearch) onSearch(newValues);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addValue(inputValue);
    }
  };

  const removeValue = (index) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
    
    if (onSearch) onSearch(newValues);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const items = pastedText
      .split(/[,;\n]/)
      .map((item) => item.trim())
      .filter((item) => item && !values.includes(item));

    const newValues = [...values, ...items].slice(0, maxValues);
    onChange(newValues);
    
    if (onSearch) onSearch(newValues);
  };

  useEffect(() => {
    if (values.length > 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [values]);

  return (
    <div className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg shadow-sm bg-white min-h-[42px] flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          {/* Values Chips */}
          {values.map((value, index) => (
            <span
              key={index}
              className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              {value}
              <button
                type="button"
                onClick={() => removeValue(index)}
                className="ml-1 hover:text-blue-900"
                title="Remove"
              >
                ×
              </button>
            </span>
          ))}

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={values.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[100px] border-none outline-none focus:ring-0 p-0 text-sm"
            disabled={values.length >= maxValues}
          />
        </div>
      </div>

      {/* Helper Text */}
      <div className="mt-1 flex justify-between items-center text-xs">
        <span className="text-gray-500">
          {values.length}/{maxValues} items • Press Enter or paste (comma/semicolon separated)
        </span>
        {values.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}