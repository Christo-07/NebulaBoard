import React, { useMemo, useState } from 'react';

const MouseEnterContext = React.createContext();

export function MouseEnterProvider({ children }) {
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const value = useMemo(
    () => ({ isMouseEntered, setIsMouseEntered }),
    [isMouseEntered]
  );

  return (
    <MouseEnterContext.Provider value={value}>
      {children}
    </MouseEnterContext.Provider>
  );
}

export function useMouseEnter() {
  const context = React.useContext(MouseEnterContext);
  if (!context) {
    console.error("useMouseEnter called outside MouseEnterProvider");
    throw new Error('useMouseEnter must be used within a MouseEnterProvider');
  }
  return context;
}