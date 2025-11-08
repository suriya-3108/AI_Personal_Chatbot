import speech_recognition as sr
import pyttsx3
import threading
import tempfile
import os

class SpeechModule:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.tts_engine = pyttsx3.init()
        self.setup_tts()
    
    def setup_tts(self):
        """Setup text-to-speech engine"""
        voices = self.tts_engine.getProperty('voices')
        if voices:
            self.tts_engine.setProperty('voice', voices[0].id)
        self.tts_engine.setProperty('rate', 150)
        self.tts_engine.setProperty('volume', 0.8)
    
    def speech_to_text(self, audio_file):
        """Convert speech to text"""
        try:
            with sr.AudioFile(audio_file) as source:
                audio = self.recognizer.record(source)
                text = self.recognizer.recognize_google(audio)
                return text
        except sr.UnknownValueError:
            return "Sorry, I could not understand the audio"
        except sr.RequestError as e:
            return f"Error with speech recognition service: {e}"
        except Exception as e:
            return f"Error processing audio: {e}"
    
    def text_to_speech(self, text):
        """Convert text to speech and return audio file path"""
        try:
            # Create temporary file for audio
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')
            temp_file.close()
            
            # Save speech to file
            self.tts_engine.save_to_file(text, temp_file.name)
            self.tts_engine.runAndWait()
            
            return temp_file.name
            
        except Exception as e:
            print(f"TTS error: {e}")
            return None
    
    def cleanup_audio_file(self, file_path):
        """Clean up temporary audio file"""
        try:
            if os.path.exists(file_path):
                os.unlink(file_path)
        except Exception as e:
            print(f"Error cleaning up audio file: {e}")

# Global instance
speech_module = SpeechModule()