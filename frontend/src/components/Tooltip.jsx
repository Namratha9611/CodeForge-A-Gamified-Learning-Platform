import React, { useState } from 'react';

const Tooltip = ({ term, definition, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      <span
        className="text-purple-600 border-b-2 border-purple-300 cursor-help relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </span>
      
      {isVisible && (
        <div
          className="fixed z-50 bg-gray-900 text-white p-3 rounded-lg shadow-lg max-w-xs pointer-events-none"
          style={{
            left: position.x + 10,
            top: position.y - 40
          }}
        >
          <div className="font-semibold">{term}</div>
          <div className="text-sm text-gray-300 mt-1">{definition}</div>
        </div>
      )}
    </>
  );
};

export default Tooltip;
