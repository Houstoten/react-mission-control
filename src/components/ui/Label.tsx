import React from 'react';
import '../../styles/exposeWrapper.css';

interface LabelProps {
  text?: string;
  visible: boolean;
  className?: string;
}

/**
 * Component for displaying labels in Exposé view
 */
export const Label: React.FC<LabelProps> = ({
  text,
  visible,
  className
}) => {
  if (!text) return null;

  return (
    <div 
      className={`expose-window-label ${className || ''}`}
      style={{ 
        opacity: visible ? 1 : 0
      }}
    >
      {text}
    </div>
  );
};