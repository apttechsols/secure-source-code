import openai
import speech_recognition as sr
import pyttsx3
from vosk import Model, KaldiRecognizer
import pyaudio
import json

openai.api_key = "YOUR_OPEN_AI_API_KEY" 

ai = "AI:"
user = "Person:"


def load_in_prompt_text():
    # Datei öffnen
    file = open("prompt_text.txt", "r")
    # Aus Datei lesen
    prompt_text = file.read()
    file.close()
    return prompt_text


prompt_text_ = load_in_prompt_text()


def speak(text):
    # Initialisieren
    engine = pyttsx3.init()
    # Stimmeinstellungen
    engine.setProperty('voice', r"HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Speech\Voices\Tokens\TTS_MS_DE-DE_HEDDA_11.0")
    # Text sprechen
    engine.say(text)
    engine.runAndWait()


def ask(user_question):
    # Prompt Text mit Beispielen + Frage des Nutzers
    prompt_text = f"{load_in_prompt_text()}\n{user_question}"
    # Request über API schicken
    response = openai.Completion.create(
        model="text-davinci-002",
        prompt=prompt_text,
        temperature=0.7,
        max_tokens=256,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    # Antwort
    response = response['choices'][0]['text'].replace("\n", "")
    # Antwort zurückgeben
    return str(response)


def process(raw_user_question):
    # Frage ist zusammengestellt aus Name des Nutzers und der Frage
    user_question = user + raw_user_question + "\n"
    # Frage ausgeben
    print(user_question)

    # Antwort der AI speichern
    ai_answer = ask(user_question) + '\n'
    # Antwort der AI ausgeben
    print(ai_answer)
    # Antwort der AI (ohne Namen) sprechen
    speak(ai_answer.replace(ai, ""))


if __name__ == '__main__':

    speech_recognition_choice = input("Was soll für die Spracherkennung genutzt werden?\n[1] Vosk [Offline]\n[2] Das Python SpeechRecognition Package mit der Google API [Online]\n")

    if int(speech_recognition_choice) == 1:
        model = Model(r"D:\Windows\Desktop\pycharm\scripts\ai_chatbot\Vosk\vosk-model-de-0.21")
        recognizer = KaldiRecognizer(model, 16000)

        microphone = pyaudio.PyAudio()
        stream = microphone.open(rate=16000, channels=1, format=pyaudio.paInt16, input=True, frames_per_buffer=8192)
        stream.start_stream()

        while True:
            data = stream.read(4096, exception_on_overflow=False)
            if recognizer.AcceptWaveform(data):
                res = json.loads(recognizer.Result())

                raw_question = res['text'].lower()

                process(raw_question)

    if int(speech_recognition_choice) == 2:
        r = sr.Recognizer()

        while True:
            try:
                with sr.Microphone() as microphone:
                    r.adjust_for_ambient_noise(microphone, duration=0.01)
                    audio = r.listen(microphone)
                    question = r.recognize_google(audio, language='de-DE')

                    raw_question = question.lower()

                    process(raw_question)
            except:
                r = sr.Recognizer()
                continue
