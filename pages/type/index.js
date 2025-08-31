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

  const sentenceConfig = [
    { count: 10, sentence: "The quick brown fox jumps over the lazy dog" },
    { count: 25, sentence: "The quick brown fox jumps over the lazy dog and the quick brown fox jumps over" },
    { count: 30, sentence: "The quick brown fox jumps over the lazy dog and the quick brown fox jumps" }
  ];

  const sentence = sentenceConfig.find(s => s.count === wordCount).sentence;

  const checkCorrectWords = () => {

    const originalWords = sentence.split(" ");
    const typedWords = typedText.trim().split(" ");
    let correct = 0;
    for (let i = 0; i < typedWords.length; i++) {
      if (typedWords[i] === originalWords[i])
        correct++;
    }
    return correct;
  }

  const handleKeyDown = useCallback((e) => {

    if (!startTime) setStartTime(performance.now());

    setTypedText((prev) => {
      if (e.key === 'Backspace') {
        return prev.slice(0, -1);
      }
      else if (e.key.length === 1) {
        const updatedText = prev + e.key;
        return updatedText;
      }
      return prev;
    });

  }, [startTime]);

  useEffect(() => {
    if (typedText.length > 0) {
      const correct = checkCorrectWords(typedText);
      setCorrectWordCount(correct);

      if (typedText.length === sentence.length) {
        console.log("typing finished");
        const elapsedTime = startTime ? (performance.now() - startTime) / 1000 : 0; // seconds
        setElapsedTime(elapsedTime);
        setIsTypingFinished(true);

        // WPM = (correct words / time in minutes)
        const minutes = elapsedTime / 60;
        setWPM(correct / minutes);
      }
    }
  }, [typedText]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleWordCountChange = (newWordCount) => {
    setTypedText('');
    setWordCount(newWordCount);
  };

  return (
    <MainLayout>
      <div className="main-container flex flex-col items-center gap-12 h-[50vh] justify-evenly">
        {/* Word Selector */}
        <div className='word-selector-container flex gap-4'>
          <div className='text-white font-bold text-4xl'>Select Words</div>
          {sentenceConfig.map((sentence) => (
            <button
              key={sentence.count}
              onClick={() => handleWordCountChange(sentence.count)}
              className={`cursor-pointer text-white border py-2 px-3 rounded-2xl ${wordCount === sentence.count ? 'bg-gray-500' : ''} `}
            >
              {sentence.count}
            </button>
          ))}
        </div>

        {/* Sentence with highlighting */}
        <div className='sentence-container'>
          <p className='text-white font-medium text-2xl font-mono flex gap-2.5'>
            {sentence.split('').map((char, index) => {
              let color = 'text-gray-400'; // default
              if (index < typedText.length) {
                color = typedText[index] === char ? 'text-white' : 'text-red-500';
              }
              return (
                <span key={index} className={`${color}`}>
                  {char}
                </span>
              );
            })}
          </p>
        </div>

        {/* Info container */}
        <div className='info-container text-white'>
          <p>Correct Words: {correctWordCount}</p>
          <p>Elapsed Time: {Math.floor(elapsedTime)}s</p>
          <p>WPM: {Math.round(WPM)}</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Type;
