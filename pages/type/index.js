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
        "Kenspeckle", "pupfishes", "skibobbing", "through", "dongola", "dreams", "imblazed", "his", "chin"
      ]
    },
    { 
      count: 25, 
      sentence: [
        "Amid", "dongola", "coppices,", "a", "squirrely", "expressman", "soliloquised", "about", "mothery", "frivolity", 
        "and", "kenspeckle", "pupfishes,", "misreporting", "replevied", "pasts", "while", "bowpots", "imblazed", 
        "his", "eisegetical", "chin", "with", "collectivized", "dreams"
      ]
    },
    { 
      count: 30, 
      sentence: [
        "Amid", "kenspeckle", "coppices,", "a", "squirrely", "expressman", "soliloquised", "about", "skibobbing", 
        "pupfishes", "and", "mothery", "frivolity,", "misreporting", "ternaries", "of", "replevied", "pasts", 
        "while", "bowpots", "of", "dongola", "dreams", "imblazed", "his", "eisegetical", "chin,", "considering", 
        "concomitantly", "collectivized", "regrets"
      ]
    }
  ];


  const sentence = sentenceConfig.find(s => s.count === wordCount).sentence;

  // counts how many completed words are correct (positionally exact)
  const checkCorrectCompletedWords = () => {
    const originalWords = sentence; // array
    if (!typedText) return 0;

    // Split typed words. The last chunk is "in-progress" unless the text ends with a space.
    const typedWords = typedText.trim().split(" ");
    const completedCount = Math.max(0, typedWords.length); // completed == everything before the current partial

    let correct = 0;
    for (let i = 0; i < Math.min(completedCount, originalWords.length); i++) {
      if (typedWords[i] === originalWords[i]) correct++;
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
    if (typedText.length === 0 || !startTime) {
      setCorrectWordCount(0);
      setElapsedTime(0);
      setWPM(0);
      setIsTypingFinished(false);
      return;
    }

    // word-based correctness
    const correctCompleted = checkCorrectCompletedWords();
    setCorrectWordCount(correctCompleted);

    // timing + WPM from correct completed words
    if (!isTypingFinished) { // Only update time if typing is not finished
      const elapsed = (performance.now() - startTime) / 1000; // seconds
      setElapsedTime(elapsed);
      const minutes = elapsed / 60;
      setWPM(minutes > 0 ? correctCompleted / minutes : 0);
    }

    // finish when the last word is completed (space after last word)
    const originalText = sentence.join(" ");
    const isAtEnd = typedText.length >= originalText.length;
    const completedAll =
      // either exactly matches full sentence
      typedText === originalText ||
      // or matches sentence + trailing spaces (user hit extra spaces at end)
      (typedText.startsWith(originalText) && /^\s*$/.test(typedText.slice(originalText.length)));

    if (completedAll || isAtEnd) {
      setIsTypingFinished(true);
    } else {
      setIsTypingFinished(false);
    }
  }, [typedText, startTime, sentence]);


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
    setCursorPosition(0);
    setStartTime(null);          // <— reset timer
    setIsTypingFinished(false);  // <— reset finished state
  };
  console.log(isTypingFinished, "isTypingFinished")
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
        {/* Sentence with highlighting (no mid-word breaks, no extra gaps) */}
        <div className="sentence-container flex items-center justify-center min-h-32 max-w-3xl text-center">
          <div className="text-white font-medium text-2xl font-mono flex flex-wrap justify-center gap-2">
            {(() => {
              // Build once for clarity: iterate words, then chars
              const words = sentence; // already an array
              let globalIndex = 0;    // tracks index into originalText

              const originalText = words.join(" ");
              return words.map((word, wIdx) => {
                // A word container that cannot wrap in the middle
                const wordChars = word.split("").map((char, cIdx) => {
                  const currentCharTyped = typedText[globalIndex] || "";
                  const isMatch = currentCharTyped === char;

                  let textColor = "text-gray-400";
                  if (currentCharTyped) {
                    textColor = isMatch ? "text-white" : "text-red-500";
                  }

                  // cursor logic: show cursor before this character if indices match
                  const showCursor = globalIndex === cursorPosition;

                  const node = (
                    <span key={`c-${wIdx}-${cIdx}`} className={`${textColor}`}>
                      {char}
                    </span>
                  );

                  const out = (
                    <span key={`wrap-${wIdx}-${cIdx}`} className="leading-none">
                      {showCursor && (
                        <span
                          className="inline-block align-middle"
                          style={{
                            width: 2,
                            height: "1.2em",
                            background: "#93c5fd", // light blue
                            marginRight: -1,
                            borderRadius: 2,
                          }}
                        />
                      )}
                      {node}
                    </span>
                  );

                  globalIndex += 1; // advance for each char
                  return out;
                });

                // After each word (except the last), render a space as its own span
                const spaceIndex = globalIndex; // where the space would be
                const spaceTyped = typedText[spaceIndex] || "";
                const spaceCorrect = spaceTyped === " ";
                const showCursorBeforeSpace = spaceIndex === cursorPosition;

                // advance globalIndex for the space (exists in originalText except after last word)
                const spaceSpan =
                  wIdx < words.length - 1 ? (
                    <span key={`space-${wIdx}`} className="inline-block">
                      {showCursorBeforeSpace && (
                        <span
                          className="inline-block align-middle"
                          style={{
                            width: 2,
                            height: "1.2em",
                            background: "#93c5fd",
                            marginRight: -1,
                            borderRadius: 2,
                          }}
                        />
                      )}
                      {/* Visible space between words; highlight if mistyped */}
                      <span
                        className={`${
                          spaceTyped
                            ? spaceCorrect
                              ? "" // correct space: nothing special
                              : "bg-red-500/20 px-[1px] rounded"
                            : ""
                        }`}
                      >
                        {" "}
                      </span>
                    </span>
                  ) : null;

                if (wIdx < words.length - 1) {
                  globalIndex += 1; // count the space in originalText
                }

                return (
                  <span
                    key={`w-${wIdx}`}
                    className="inline-flex whitespace-nowrap leading-none"
                  >
                    {/* characters of the word */}
                    {wordChars}
                    {/* the (wrappable) space after the word */}
                    {spaceSpan}
                  </span>
                );
              });
            })()}
            {/* Render cursor at very end if user is at the end */}
            {cursorPosition === sentence.join(" ").length && (
              <span
                className="inline-block align-middle"
                style={{
                  width: 2,
                  height: "1.2em",
                  background: "#93c5fd",
                  marginLeft: 1,
                  borderRadius: 2,
                }}
              />
            )}
          </div>
        </div>

        {/* Info container */}
        <div className='info-container text-white text-xl flex flex-col gap-2'>
          <p>Correct Words: {correctWordCount} / {sentence.length}</p>
          <p>Elapsed Time: {elapsedTime.toFixed(1)} s</p>
          <p>WPM: {Math.round(WPM)}</p>
        </div>

      </div>
    </MainLayout>
  );
};

export default Type;
