import MainLayout from '@/components/layout/MainLayout'
import React, { useState} from 'react'

// Step 1: Create a state for selecting the number of words
// Step 2: Create a sentence container which contains a sentence from the 
//         sentence config (which is a mapping of words to sentences)
// Step 3: On keydown, highlight that particular word (At every key press, check if the letter is the same
//         as the current cursor position, if yes change its color to bright white and move the 
//         cursor ahead a letter, if not show a red sign for a second and dont move the cursor ahead)
// Step 4: Create a info container which shows a dynamic WPM, highest WPM in the leadboard

const Type = () => {

  const [wordCount, setWordCount] =  useState(10);

  const sentenceConfig = [
    {
      count: 10,
      sentence: "The quick brown fox jumps over the lazy dog"
    },
    {
      count: 25,
      sentence: "The quick brown fox jumps over the lazy dog and the quick brown fox jumps over"
    },
    {
      count: 30,
      sentence: "The quick brown fox jumps over the lazy dog and the quick brown fox jumps"
    }
  ]

  const handleWordCountChange = (newWordCount) => {
    setWordCount(newWordCount);
  }

  return (
    <MainLayout>
        <div className="main-container flex flex-col items-center gap-12 h-[50vh] justify-evenly">
            <div className='word-selector-container flex gap-4'>
              <div className='text-white font-bold text-4xl'>Select Words</div>
              {sentenceConfig.map((sentence) => (
                <button 
                  key={sentence.count}
                    onClick={() => handleWordCountChange(sentence.count)}
                    className={`cursor-pointer text-white border py-2 px-3 rounded-2xl ${wordCount === sentence.count ? 'bg-gray-500': ''} `}>
                    {sentence.count}
                </button>
              ))}
            </div>
            <div className='sentence-container'>
              <p className='text-white font-medium text-2xl font-mono'>
                {sentenceConfig.find(sentence => sentence.count === wordCount).sentence}
              </p>
            </div>
            <div className='info-container'></div>
        </div>
    </MainLayout>
  )
}

export default Type