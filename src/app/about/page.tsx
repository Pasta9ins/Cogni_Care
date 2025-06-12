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
          CogniCare is your personal AI-powered wellness companion, designed to help you understand and manage your health effectively. We leverage cutting-edge artificial intelligence to provide insights into your symptom reports and engage in supportive conversations about your general well-being.
        </p>
        <p className="text-lg leading-relaxed mb-4">
          Our goal is to empower you with information and guidance, helping you make informed decisions about your health journey. From initial symptom assessment to ongoing wellness discussions, CogniCare is here to support you every step of the way.
        </p>
        <p className="text-lg leading-relaxed">
          Please remember that CogniCare is an AI assistant and not a substitute for professional medical advice. Always consult with a qualified healthcare provider for diagnosis and treatment.
        </p>
      </div>
    </div>
  );
}