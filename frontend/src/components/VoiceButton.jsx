import React, { useState, useRef } from 'react';
import { Mic, Square } from 'lucide-react';

const VoiceButton = ({ 
  onTranscript, 
  theme, 
  disabled = false,
  className = '' 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !window.MediaRecorder) {
        alert('Voice recording is not supported in your browser. Please use Chrome, Firefox, or Edge.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.wav');
          
          const response = await fetch('http://localhost:5000/api/chat/speech-to-text', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
          });

          const data = await response.json();
          if (data.text && data.text !== 'Sorry, I could not understand the audio') {
            onTranscript(data.text);
          } else {
            alert('Could not understand audio. Please try again.');
          }
        } catch (error) {
          console.error('Speech to text error:', error);
          alert('Error processing voice input. Please try again.');
        }

        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      if (error.name === 'NotAllowedError') {
        alert('Microphone access denied. Please allow microphone access to use voice input.');
      } else {
        alert('Error accessing microphone. Please check your microphone settings.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`p-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-30 disabled:cursor-not-allowed ${
        isRecording 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } ${className}`}
      title={isRecording ? 'Stop recording' : 'Start voice input'}
    >
      {isRecording ? (
        <Square className="h-5 w-5" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
      
      {/* Recording indicator */}
      {isRecording && (
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full">
          <span className="absolute inset-0 h-3 w-3 bg-red-500 rounded-full animate-ping"></span>
        </span>
      )}
    </button>
  );
};

export default VoiceButton;