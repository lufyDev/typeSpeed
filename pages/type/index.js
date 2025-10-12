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
    { 
      count: 10, 
      sentence: "Kenspeckle pupfishes skibobbing through dongola dreams imblazed his chin." },
    { 
      count: 25, 
      sentence: "Amid dongola coppices, a squirrely expressman soliloquised about mothery frivolity and kenspeckle pupfishes, misreporting replevied pasts while bowpots imblazed his eisegetical chin with collectivized dreams." },
    { 
      count: 30, 
      sentence: "Amid kenspeckle coppices, a squirrely expressman soliloquised about skibobbing pupfishes and mothery frivolity, misreporting ternaries of replevied pasts while bowpots of dongola dreams imblazed his eisegetical chin, considering concomitantly collectivized regrets."}
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
    if (typedText.length > 0 && startTime) {
      const correct = checkCorrectWords(typedText);
      setCorrectWordCount(correct);

      const elapsed = (performance.now() - startTime) / 1000; // in seconds
      setElapsedTime(elapsed);

      const minutes = elapsed / 60;
      const wpm = minutes > 0 ? correct / minutes : 0;
      setWPM(wpm);

      if (typedText.length === sentence.length) {
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
          <p className='text-white font-medium text-2xl font-mono flex flex-wrap justify-center gap-2.5'>
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
