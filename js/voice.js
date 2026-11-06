const voiceLangMap = {
  'kn': 'kn-IN',
  'hi': 'hi-IN',
  'ta': 'ta-IN',
  'en': 'en-IN'
};

function speakReminder(animalName, vaccineName, daysLeft) {
  const langCode = voiceLangMap[currentLang] || 'en-IN';
  const messages = {
    'kn': `${animalName} ಪ್ರಾಣಿಗೆ ${vaccineName} ಲಸಿಕೆ ${daysLeft} ದಿನಗಳಲ್ಲಿ ಬರಬೇಕು. ದಯವಿಟ್ಟು ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.`,
    'hi': `${animalName} पशु को ${vaccineName} टीका ${daysLeft} दिनों में लगाना है। कृपया डॉक्टर से संपर्क करें।`,
    'ta': `${animalName} விலங்குக்கு ${vaccineName} தடுப்பூசி ${daysLeft} நாட்களில் போட வேண்டும். தயவுசெய்து மருத்துவரை தொடர்பு கொள்ளவும்.`,
    'en': `${animalName} needs ${vaccineName} vaccine in ${daysLeft} days. Please contact the veterinarian.`
  };
  const utterance = new SpeechSynthesisUtterance(messages[currentLang]);
  utterance.lang = langCode;
  utterance.rate = 0.9;
  speechSynthesis.speak(utterance);
}
