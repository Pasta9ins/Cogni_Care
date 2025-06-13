// C:\Users\Anirudha\Desktop\CogniCare\frontend\src\app\components\ProfilePageContent.tsx
'use client';

import React, { useEffect, useState } from 'react';
//import axios from 'axios';
import { useAuthStore } from '../../../store/useAuthStore.js';
import toast from 'react-hot-toast';
import { User, FileText, MessageSquare, Loader2 } from 'lucide-react'; // Using Lucide icons
import api from '@/lib/axios.js';

interface Symptom {
  symptom: string;
  severity: 'mild' | 'moderate' | 'severe' | '';
}

interface AiSuggestion {
  suggestion: string;
  type: 'self_care' | 'seek_professional' | 'informational' | '';
}

interface SymptomReport {
  _id: string;
  userId: string;
  reportedSymptoms: Symptom[];
  aiAssessmentSummary: string;
  aiSuggestions: AiSuggestion[];
  status: string;
  dateReported: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface Conversation {
  _id: string;
  userId: string;
  messages: ChatMessage[];
  type: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePageContent() {
  const { authUser } = useAuthStore();//isLoading: isAuthLoading, error: authError
  const [symptomReports, setSymptomReports] = useState<SymptomReport[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);//----------------check if error
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!authUser) {
        setIsLoadingData(false);
        return;
      }
      setIsLoadingData(true); // Start data fetching loading state
      setError(null);//new----------------

      try {
        // Fetch Symptom Reports
        const symptomRes = await api.get<SymptomReport[]>('/api/symptoms', { withCredentials: true });
        setSymptomReports(symptomRes.data);

        // Fetch Conversations
        const conversationRes = await api.get<Conversation[]>('/api/conversations', { withCredentials: true });
        // Sort messages within each conversation by timestamp
        const sortedConversations = conversationRes.data.map(conv => ({
          ...conv,
          messages: conv.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        }));
        setConversations(sortedConversations);

        setIsLoadingData(false);
      } catch (err: any) {
        console.error('Error fetching profile data:', err);
        setError(err.response?.data?.message || 'Failed to fetch profile data.');
        toast.error('Failed to load profile data.');
        setIsLoadingData(false);
      }
      finally{
        setIsLoadingData(false);
      }
    };

    // if (!isAuthLoading) {
    //   fetchData();
    // }
    fetchData();
  }, [authUser]);//, isAuthLoading, authError --------------------------------------------------------------

  // if (isAuthLoading || isLoadingData) {
  //   return (
  //     <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
  //       <User className="animate-spin text-indigo-600 mb-4" size={48} />
  //       <h1 className="text-4xl font-bold mb-8 text-gray-800">Loading Profile...</h1>
  //       <p className="text-xl text-gray-600">Gathering your data.</p>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-red-50">
  //       <h1 className="text-4xl font-bold mb-8 text-red-800">Error</h1>
  //       <p className="text-xl text-red-600">{error}</p>
  //     </div>
  //   );
  // }

  // if (!authUser) {
  //   return (
  //     <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-yellow-50">
  //       <h1 className="text-4xl font-bold mb-8 text-yellow-800">Access Denied</h1>
  //       <p className="text-xl text-yellow-600">Please log in to view your profile.</p>
  //     </div>
  //   );
  // }


  //this is the one------------------------------------------------------down
  // if (isAuthLoading) {
  //   return (
  //     <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
  //       <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} /> {/* Using Loader2 for spin */}
  //       <h1 className="text-4xl font-bold mb-8 text-gray-800">Checking Authentication...</h1>
  //       <p className="text-xl text-gray-600">Please wait.</p>
  //     </div>
  //   );
  // }

  // Now, if authUser is null and isAuthLoading is false, it means the auth check failed
  if (!authUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-yellow-50">
        <h1 className="text-4xl font-bold mb-8 text-yellow-800">Access Denied</h1>
        <p className="text-xl text-yellow-600">Please log in to view your profile.</p>
      </div>
    );
  }

  // If we reach here, authUser is present. Now handle data fetching loading/error.
  if (isLoadingData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Loading Profile Data...</h1>
        <p className="text-xl text-gray-600">Gathering your reports and conversations.</p>
      </div>
    );
  }

  if (error) { // This error is specifically for data fetching, not auth
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-red-50">
        <h1 className="text-4xl font-bold mb-8 text-red-800">Error Loading Data</h1>
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 pt-20 bg-gradient-to-br from-gray-50 to-purple-100 min-h-screen text-gray-800">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-purple-800 mb-8 drop-shadow">
        <User className="inline-block mr-2 text-purple-600" size={36} /> {authUser.username}&apos;s Profile
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Symptom Reports Summary */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <FileText className="mr-3 text-indigo-600" size={28} /> Your Symptom Reports ({symptomReports.length})
          </h2>
          {symptomReports.length === 0 ? (
            <p className="text-gray-600 italic text-center py-10">No symptom reports found. Submit one to see it here!</p>
          ) : (
            <div className="space-y-6 max-h-96 overflow-y-auto pr-2"> {/* Added max-height and overflow for scrolling */}
              {symptomReports.map((report) => (
                <div key={report._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm">
                  <p className="text-sm text-gray-500 mb-2">Reported on: {new Date(report.createdAt).toLocaleDateString()}</p>
                  <h3 className="text-lg font-semibold text-indigo-700 mb-2">Symptoms:</h3>
                  <ul className="list-disc list-inside text-gray-700 mb-3">
                    {report.reportedSymptoms.map((s, idx) => (
                      <li key={idx}>{s.symptom} (Severity: {s.severity || 'N/A'})</li>
                    ))}
                  </ul>
                  <h3 className="text-lg font-semibold text-purple-700 mb-2">AI Assessment:</h3>
                  <p className="text-gray-700 italic">{report.aiAssessmentSummary}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conversation Timeline */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <MessageSquare className="mr-3 text-blue-600" size={28} /> Your Conversations ({conversations.length})
          </h2>
          {conversations.length === 0 ? (
            <p className="text-gray-600 italic text-center py-10">No conversations found. Start chatting with the AI!</p>
          ) : (
            <div className="space-y-6 max-h-96 overflow-y-auto pr-2"> {/* Added max-height and overflow for scrolling */}
              {conversations.map((conv) => (
                <div key={conv._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm">
                  <p className="text-sm text-gray-500 mb-2">Started on: {new Date(conv.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600 mb-3">Type: <span className="capitalize">{conv.type.replace('_', ' ')}</span></p>
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">Latest Messages:</h3>
                  <div className="space-y-2">
                    {conv.messages.slice(-3).map((msg, idx) => ( // Show last 3 messages
                      <div key={idx} className={`p-2 rounded-md ${msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left'}`}>
                        <span className="font-semibold">{msg.role === 'user' ? 'You' : 'AI'}:</span> {msg.content}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




