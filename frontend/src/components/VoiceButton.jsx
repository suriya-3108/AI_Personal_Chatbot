import React, { useState } from 'react';
import RecordRTC from 'recordrtc';
import { Mic, Square } from 'lucide-react';

const VoiceButton = ({ onTranscript, disabled = false, className = '' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioRecorder = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: RecordRTC.StereoAudioRecorder,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
      });

      audioRecorder.startRecording();
      setRecorder(audioRecorder);
      setIsRecording(true);

    } catch (error) {
      console.error('Mic error:', error);
      alert('Microphone access failed.');
    }
  };

  const stopRecording = async () => {
    if (!recorder) return;

    recorder.stopRecording(async () => {
      const audioBlob = recorder.getBlob();

      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice.wav');

      try {
        const response = await fetch('http://localhost:5000/api/chat/speech-to-text', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        const data = await response.json();
        if (data.text) {
          onTranscript(data.text);
        } else {
          alert('Could not understand audio.');
        }

      } catch (err) {
        console.error('Speech-to-text error:', err);
        alert('Something went wrong. Please try again.');
      }

      setIsRecording(false);
      setRecorder(null);
    });
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={disabled}
      className={`relative p-3 rounded-xl transition-all duration-300 focus:outline-none
        ${isRecording 
          ? 'bg-red-600 text-white shadow-lg scale-110 animate-pulse' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
        }
        ${className}
      `}
      title={isRecording ? 'Stop recording' : 'Start voice input'}
    >
      {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}

      {/* 🔴 Blinking Red Dot While Recording */}
      {isRecording && (
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full">
          <span className="absolute inset-0 h-3 w-3 bg-red-500 rounded-full animate-ping"></span>
        </span>
      )}
    </button>
  );
};

export default VoiceButton;
