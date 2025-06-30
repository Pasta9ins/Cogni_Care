// C:\Users\Anirudha\Desktop\CogniCare\frontend\src\app\about\page.tsx
import React from 'react';
import { Info } from 'lucide-react'; // Import icon

export default function AboutPage() {
  return (
    <div className="container mx-auto p-8 pt-20 bg-gradient-to-br from-blue-50 to-cyan-100 min-h-screen text-gray-800">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-blue-800 mb-8 drop-shadow">
        <Info className="inline-block mr-2 text-blue-600" size={36} /> About CogniCare
      </h1>
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 max-w-3xl mx-auto">
        <p className="text-lg leading-relaxed mb-4">
          CogniCare is your AI-powered wellness companion, designed to help you manage and improve your health with confidence. Powered by advanced AI and a rich knowledge base, CogniCare provides personalized insights, symptom analysis, and supportive wellness conversations.
        </p>
        <p className="text-lg leading-relaxed mb-4">
          Our goal is to empower you with information and guidance, helping you make informed decisions about your health journey. Beyond symptom assessments, CogniCare offers a comprehensive Plans section where you can access tailored diet, exercise, and meditation plans to support your daily well-being. Our new Find Doctor feature helps you locate nearby clinics and healthcare professionals quickly, making access to care more seamless than ever.
        </p>
        <p className="text-lg leading-relaxed">
          Please note that CogniCare is an AI assistant and not a substitute for professional medical advice. Always consult a qualified healthcare provider for diagnosis and treatment.
        </p>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <p className="text-lg leading-relaxed">
        Have questions, feedback, or suggestions? Feel free to reach out at anirudhachaudhary33@gmail.com
        </p>
      </div>
    </div>
  );
}