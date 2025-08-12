import React, { useState, useEffect } from 'react';
import {Cursor} from 'typewriter-effect'

const Typing = ({ text, typingSpeed, deletionSpeed }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let timeoutId;

    const typeText = (index) => {
      setDisplayedText(text.substring(0, index));

      if (index < text.length) {
        timeoutId = setTimeout(() => typeText(index + 1), typingSpeed);
      } else {
        timeoutId = setTimeout(() => deleteText(text.length), 1000);
      }
    };

    const deleteText = (index) => {
      setDisplayedText(text.substring(0, index));

      if (index > 0) {
        timeoutId = setTimeout(() => deleteText(index - 1), deletionSpeed);
      } else {
        timeoutId = setTimeout(() => typeText(0), 1000);
      }
    };

    typeText(0);

    return () => clearTimeout(timeoutId);
  }, [text, typingSpeed, deletionSpeed]);

  return (
    <>
      {displayedText}
      <Cursor />
    </>
  );
};

export default Typing;