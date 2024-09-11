import React, { useState, useEffect } from "react";

const TranscriptEditor = ({ initialTranscript }) => {
  const [transcript, setTranscript] = useState(initialTranscript);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editedWord, setEditedWord] = useState(null);

  // Effect to handle the automatic word highlighting during playback
  useEffect(() => {
    let interval;

    if (
      isPlaying &&
      currentWordIndex < transcript.length &&
      currentWordIndex >= 0
    ) {
      const { duration } = transcript[currentWordIndex]; // Safely access duration
      interval = setTimeout(() => {
        setCurrentWordIndex((prev) => prev + 1);
      }, duration);
    }

    if (currentWordIndex >= transcript.length) {
      setIsPlaying(false); // Stop playing when we reach the end
    }

    return () => clearTimeout(interval);
  }, [isPlaying, currentWordIndex, transcript]);

  // Function to start or resume playback from the current position
  const handlePlay = () => {
    if (currentWordIndex === -1 || currentWordIndex >= transcript.length) {
      setCurrentWordIndex(0); // Start from the beginning if not started yet
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  // Handle word editing
  const handleEdit = (index, newText) => {
    const updatedTranscript = [...transcript];
    const newWords = newText.split(" "); // Split the input into words

    // Map the new words to inherit the duration of the original word
    const newWordObjects = newWords.map((word) => ({
      word,
      duration: updatedTranscript[index].duration, // Inherit original duration
    }));

    // Update the transcript by replacing the old word with the new words
    updatedTranscript.splice(index, 1, ...newWordObjects);

    setTranscript(updatedTranscript);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-y-12">
      <h2 className="text-4xl text-white font-bold ">Transcript Editor</h2>
      <div className="w-full flex items-center justify-center">
        <button
          onClick={handlePlay}
          className="bg-blue-500 text-white px-4 py-2 mr-2 w-36 rounded-full"
          disabled={isPlaying || transcript.length === 0}
        >
          Play
        </button>
        <button
          onClick={handlePause}
          className="bg-gray-500 text-white px-4 py-2 w-36 rounded-full"
          disabled={!isPlaying}
        >
          Pause
        </button>
      </div>
      <div className="text-white text-2xl font-bold">
        {transcript.map((wordObj, index) => (
          <span
            key={index}
            className={`mr-2 ${
              currentWordIndex === index
                ? "border-2 border-yellow-500 text-blue-600 bg-white px-2 py-3 rounded-md"
                : ""
            }`}
            onClick={() => setEditedWord(index)}
          >
            {editedWord === index ? (
              <input
                type="text"
                className="border-b border-gray-500 bg-transparent  focus:outline-none focus:border-blue-500"
                value={wordObj.word}
                onChange={(e) => handleEdit(index, e.target.value)}
                onBlur={() => setEditedWord(null)}
              />
            ) : (
              wordObj.word
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TranscriptEditor;
