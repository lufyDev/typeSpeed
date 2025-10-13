import MainLayout from '@/components/layout/MainLayout'
import React, { useCallback, useEffect, useState } from 'react'

const Type = () => {
  //Need to add WPM indicator in info section.
  //The timer starts when the user starts typing
  //When a word gets finished (when it gets a ' ' character) -> increment correct word count and 
  //calculate the time (Date.now()) -> calculate the WPM and update it)
  const [wordCount, setWordCount] = useState(10);
  const [typedText, setTypedText] = useState('');
  const [correctWordCount, setCorrectWordCount] = useState(0);
  const [WPM, setWPM] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTypingFinished, setIsTypingFinished] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  const sentenceConfig = [
    { 
      count: 10, 
      sentence: [
        "Kenspeckle", "pupfishes", "skibobbing", "through", "dongola", "dreams", "imblazed", "his", "chin."
      ]
    },
    { 
      count: 25, 
      sentence: [
        "Amid", "dongola", "coppices,", "a", "squirrely", "expressman", "soliloquised", "about", "mothery", "frivolity", 
        "and", "kenspeckle", "pupfishes,", "misreporting", "replevied", "pasts", "while", "bowpots", "imblazed", 
        "his", "eisegetical", "chin", "with", "collectivized", "dreams."
      ]
    },
    { 
      count: 30, 
      sentence: [
        "Amid", "kenspeckle", "coppices,", "a", "squirrely", "expressman", "soliloquised", "about", "skibobbing", 
        "pupfishes", "and", "mothery", "frivolity,", "misreporting", "ternaries", "of", "replevied", "pasts", 
        "while", "bowpots", "of", "dongola", "dreams", "imblazed", "his", "eisegetical", "chin,", "considering", 
        "concomitantly", "collectivized", "regrets."
      ]
    }
  ];


  const sentence = sentenceConfig.find(s => s.count === wordCount).sentence;

  const checkCorrectWords = () => {
    const originalText = sentence.join(" "); // Join words with spaces
    const typedTextTrimmed = typedText.trim(); // Trim spaces at the end

    let correct = 0;
    // Compare each character (including spaces)
    for (let i = 0; i < typedTextTrimmed.length; i++) {
      if (typedTextTrimmed[i] === originalText[i]) correct++;
    }
    return correct;
  };


  const handleKeyDown = useCallback((e) => {
    if (!startTime) setStartTime(performance.now());

    setTypedText((prev) => {
      let updatedText = prev;
      if (e.key === 'Backspace') {
        updatedText = prev.slice(0, -1); // Backspace to remove the last character
      }
      else if (e.key === ' ' || e.key.length === 1) { // Handle space as well
        updatedText = prev + e.key;
      }

      // Update cursor position after every key press
      setCursorPosition(updatedText.length);

      return updatedText;
    });
  }, [startTime]);

  useEffect(() => {
    if (typedText.length > 0 && startTime) {
      const correct = checkCorrectWords(typedText);
      setCorrectWordCount(correct);

      const elapsed = (performance.now() - startTime) / 1000; // in seconds
      setElapsedTime(elapsed);

      const minutes = elapsed / 60;
      const wpm = minutes > 0 ? correct / minutes : 0;
      setWPM(wpm);

      if (typedText.trim().split(" ").length === sentence.length) {
        console.log("typing finished");
        setIsTypingFinished(true);
      }
    }
  }, [typedText, startTime]);


  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleWordCountChange = (newWordCount) => {
    setTypedText('');
    setWordCount(newWordCount);
    setCorrectWordCount(0);
    setElapsedTime(0);
    setWPM(0);
    setCursorPosition(0)
  };
  return (
    <MainLayout>
      <div className="main-container flex flex-col items-center justify-between gap-24 mt-12">
        {/* Word Selector */}
        <div className='word-selector-container flex gap-4'>
          <div className='text-white font-bold text-4xl'>Select Words</div>
          {sentenceConfig.map((sentence) => (
            <button
              key={sentence.count}
              onClick={(e) => {
                e.currentTarget.blur();
                handleWordCountChange(sentence.count)
              }}
              className={`cursor-pointer text-white border py-2 px-3 rounded-2xl ${wordCount === sentence.count ? 'bg-gray-500' : ''} `}
            >
              {sentence.count}
            </button>
          ))}
        </div>

        {/* Sentence with highlighting */}
        <div className='sentence-container flex items-center justify-center min-h-32 max-w-3xl text-center'>
          <div className='text-white font-medium text-2xl font-mono flex flex-wrap justify-center gap-2'>
            {sentence.join(" ").split("").map((char, index) => {
              const currentCharTyped = typedText[index] || ''; // Get the corresponding character typed

              let textColor = 'text-gray-400'; // Default color for non-typed characters
              let bgColor = ''; // Default background color for spaces

              if (currentCharTyped === char) {
                textColor = 'text-white'; // Correctly typed characters
              } else if (currentCharTyped) {
                textColor = 'text-red-500'; // Incorrectly typed characters
              }

              // Handle spaces
              if (char === ' ' && currentCharTyped === '') {
                bgColor = ''; // No background for untapped spaces
              } else if (char === ' ' && currentCharTyped !== ' ') {
                bgColor = 'bg-red-500/20 px-[1px]'; // Red background if space is mistyped
              }

              return (
                <div className='flex'>
                  {index === cursorPosition && <span className="cursor cursor-light-blue inline-block bg-blue-300 rounded-lg mr-[-1px]"></span>}
                  <span key={index} className={`${textColor} ${bgColor} rounded-xl`}>
                    {char} {/* Space is rendered normally, no special symbol */}
                  </span>
                </div>);
            })}
            {/* Render the cursor at the end of the typed text */}
          </div>
        </div>

        {/* Info container */}
        <div className='info-container text-white text-xl flex flex-col gap-2'>
          <p>Correct Words: {correctWordCount}</p>
          <p>Elapsed Time: {elapsedTime.toFixed(1)} s</p>
          <p>WPM: {Math.round(WPM)}</p>
        </div>

      </div>
    </MainLayout>
  );
};

export default Type;
