// C:\Users\Anirudha\Desktop\CogniCare\frontend\src\app\components\DashboardContent.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../../store/useAuthStore.js';
import toast from 'react-hot-toast';
// CURSOR ADDED: Import Lucide icons for better UI
import { PlusCircle, MinusCircle, Send, ClipboardList, Lightbulb, UserRound, MessageSquare } from 'lucide-react';
// import Link from "next/link"; deploy error
interface Symptom {
  symptom: string;
  severity: 'mild' | 'moderate' | 'severe' | '';
}

interface AiSuggestion {
  suggestion: string;
  type: 'self_care' | 'seek_professional' | 'informational' | '';
}

interface SymptomReportResponseData {
  userId: string;
  reportedSymptoms: Symptom[];
  aiAssessmentSummary: string;
  aiSuggestions: AiSuggestion[];
  status: string;
  _id: string;
  dateReported: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// New interfaces for chat messages
interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp?: string; // Optional for new messages, but usually present from backend
}

interface ConversationResponseData {
  message: string;
  conversation: {
    _id: string;
    userId: string;
    messages: ChatMessage[];
    type: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  aiResponse: ChatMessage;
}
// CURSOR ADDED: Define Conversation interface here, as it's used in this file
interface Conversation {
  _id: string;
  userId: string;
  messages: ChatMessage[];
  type: string;
  createdAt: string;
  updatedAt: string;
}


export default function DashboardContent() {
  //Use auth store to get user information and log symptoms
  const { authUser } = useAuthStore();
  const [symptoms, setSymptoms] = useState<Symptom[]>([{ symptom: '', severity: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResponse, setAiResponse] = useState<SymptomReportResponseData | null>(null);

  //chat related state
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isChatting, setIsChatting] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null); // Ref to scroll chat to bottom

  //Scroll chat to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);


  // CURSOR ADDED: Fetch initial conversation history for chat when component mounts
  useEffect(() => {
    const fetchConversationHistory = async () => {
      if (authUser) {
        try {
          const res = await axios.get<Conversation[]>('/api/conversations', { withCredentials: true });
        if (res.data && res.data.length > 0) {
          // Find the most recent 'general_chat' conversation
          const generalChat = res.data
            // CURSOR ADDED: Explicitly type 'a' and 'b' in the sort function
            .filter((conv: Conversation) => conv.type === 'general_chat')
            .sort((a: Conversation, b: Conversation) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
          
          if (generalChat) {
            setConversationId(generalChat._id);
            // Sort messages within the conversation by timestamp
            // CURSOR ADDED: Explicitly type 'a' and 'b' in the sort function
            const sortedMessages = generalChat.messages.sort((a: ChatMessage, b: ChatMessage) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime());
            setChatMessages(sortedMessages);
          }
        }
        } catch (error) {
          console.error('Error fetching conversation history:', error);
          toast.error('Failed to load chat history.');
        }
      }
    };
    if (authUser && !useAuthStore.getState().isLoading) {
      fetchConversationHistory();
    }
  }, [authUser]); // Run once when authUser is available

  const handleSymptomChange = (index: number, field: keyof Symptom, value: string) => {
    const newSymptoms = [...symptoms];
    newSymptoms[index][field] = value as 'mild' | 'moderate' | 'severe' | '';
    setSymptoms(newSymptoms);
  };

  const addSymptomField = () => {
    setSymptoms([...symptoms, { symptom: '', severity: '' }]);
  };

  const removeSymptomField = (index: number) => {
    const newSymptoms = symptoms.filter((_, i) => i !== index);
    setSymptoms(newSymptoms);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAiResponse(null);

    const filteredSymptoms = symptoms.filter(s => s.symptom.trim() !== '');

    if (filteredSymptoms.length === 0) {
      toast.error('Please add at least one symptom.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await axios.post('/api/symptoms', {
        reportedSymptoms: filteredSymptoms,
        status: 'pending',
      }, {
        withCredentials: true
      });

      if (res.status === 201) {
        toast.success('Symptom report submitted successfully!');
        setAiResponse(res.data.data);
        setSymptoms([{ symptom: '', severity: '' }]);
      } else {
        toast.error(res.data.message || 'Failed to submit symptom report.');
      }
    } catch (error: any ) {//--------------------------------------------------------------------deploy error
      console.error('Error submitting symptom report:', error);
      toast.error( error.response?.data?.message || 'Error submitting symptom report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMessage.trim() === '') return;

    setIsChatting(true); // Indicate that chat is in progress

    const userMessage: ChatMessage = { role: 'user', content: currentMessage };
    setChatMessages(prevMessages => [...prevMessages, userMessage]); // Add user message immediately

    const messageToSend = currentMessage;
    setCurrentMessage(''); // Clear input

    try {
      const payload: { messageContent: string; messageRole: string; conversationId?: string; type?: string } = {
        messageContent: messageToSend,
        messageRole: 'user',
      };
      if (conversationId) {
        payload.conversationId = conversationId;
      } else {
        payload.type = 'general_chat'; // For starting a new conversation
      }

      const res = await axios.post<ConversationResponseData>('/api/conversations', payload, {
        withCredentials: true,
      });

      if (res.status === 200) {
        const { conversation } = res.data;// removed aiResponse from inside-------------------deploy error
        setConversationId(conversation._id); // Save conversation ID for subsequent messages
        setChatMessages(conversation.messages); // Update with full history from backend
      } else {
        toast.error(res.data.message || 'Failed to get AI response.');
        setChatMessages(prevMessages => [...prevMessages, { role: 'ai', content: 'Sorry, Im having trouble responding right now.' }]);
      }
    } catch (error: any) {
      console.error('Error sending chat message:', error);
      toast.error(error.response?.data?.message || 'Error sending chat message.');
      setChatMessages(prevMessages => [...prevMessages, { role: 'ai', content: 'Sorry, an error occurred while connecting to the AI.' }]);
    } finally {
      setIsChatting(false);
    }
  };
  // END

  return (
    // CURSOR ADDED: Enhanced overall container styling
    <div className="container mx-auto p-4 md:p-8 pt-20 bg-gradient-to-br from-gray-50 to-indigo-100 min-h-screen text-gray-800">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-indigo-800 mb-8 drop-shadow">
        <UserRound className="inline-block mr-2 text-indigo-600" size={36} /> Welcome, {authUser?.username || 'User'}!
      </h1>
      {/* CURSOR ADDED: Navigation to Profile Page */}
      {/* <div className="flex justify-center mb-6">
        <Link href="/profile" className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105 flex items-center shadow-md">
          <UserCircle size={20} className="mr-2" /> Your Profile
        </Link>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"> {/* CURSOR ADDED: Changed to lg:grid-cols-2 for larger screens */}
        {/* Symptom Reporting Form */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200"> {/* CURSOR ADDED: Enhanced card styling */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <ClipboardList className="mr-3 text-indigo-600" size={28} /> Report Your Symptoms
          </h2>
          <form onSubmit={handleSubmit}>
            {symptoms.map((symptom, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center gap-3 mb-4 p-3 bg-gray-50 rounded-md border border-gray-200"> {/* CURSOR ADDED: Symptom field styling */}
                <input
                  type="text"
                  placeholder="Symptom (e.g., headache)"
                  value={symptom.symptom}
                  onChange={(e) => handleSymptomChange(index, 'symptom', e.target.value)}
                  className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-base"
                  required
                />
                <select
                  value={symptom.severity}
                  onChange={(e) => handleSymptomChange(index, 'severity', e.target.value)}
                  className="p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-white text-base"
                >
                  <option value="">Select Severity</option>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
                {symptoms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSymptomField(index)}
                    className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-full transition duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500"
                    title="Remove Symptom"
                  >
                    <MinusCircle size={24} /> {/* CURSOR ADDED: Lucide icon */}
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSymptomField}
              className="mt-2 mb-6 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
            >
              <PlusCircle size={20} className="mr-2" /> Add Another Symptom {/* CURSOR ADDED: Lucide icon */}
            </button>
            <button
              type="submit"
              className="w-full p-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : <>Submit Report <Send size={20} className="ml-2" /></>} {/* CURSOR ADDED: Lucide icon */}
            </button>
          </form>
        </div>

        {/* AI Assessment & Suggestions Display */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200"> {/* CURSOR ADDED: Enhanced card styling */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <Lightbulb className="mr-3 text-yellow-500" size={28} /> AI Assessment & Suggestions
          </h2>
          {aiResponse ? (
            <div>
              <h3 className="text-xl font-bold mb-3 text-indigo-700 border-b pb-2">Assessment Summary:</h3>
              <p className="text-gray-700 leading-relaxed mb-6">{aiResponse.aiAssessmentSummary}</p>
              
              <h3 className="text-xl font-bold mb-3 text-indigo-700 border-b pb-2">Suggestions:</h3>
              <ul className="list-none space-y-3 text-gray-700"> {/* CURSOR ADDED: Changed to list-none for custom bullet */}
                {aiResponse.aiSuggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start"> {/* CURSOR ADDED: Flexbox for custom bullet */}
                    <span className="text-indigo-500 text-2xl mr-3 leading-none">•</span> {/* CURSOR ADDED: Custom bullet */}
                    <div>
                      <span className="font-semibold capitalize text-indigo-600">{suggestion.type.replace('_', ' ')}:</span>{' '}
                      {suggestion.suggestion}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-600 italic text-center py-10">Submit a symptom report to get AI-powered assessment and suggestions tailored for you.</p>
          )}
        </div>
      </div>



      {/* Placeholder for Chat Interface - will be added later */}
      <div className="mt-8 bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <MessageSquare className="mr-3 text-blue-600" size={28} /> Your Personal Chat
        </h2>
        <div className="flex flex-col h-[500px] border border-gray-300 rounded-lg overflow-hidden">
          {/* Message Display Area */}
          <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {chatMessages.length === 0 ? (
              <p className="text-gray-500 italic text-center py-10">Start a conversation with CogniCare AI!</p>
            ) : (
              chatMessages.map((msg, index) => (
                <div key={index} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`inline-block p-3 rounded-lg max-w-[70%] ${
                      msg.role === 'user'
                        ? 'bg-indigo-500 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : 'Just now'}
                  </div>
                </div>
              ))
            )}
            {isChatting && (
              <div className="text-center mt-2">
                <span className="text-gray-500 italic">AI is typing...</span>
              </div>
            )}
          </div>

          {/* Message Input Area */}
          <form onSubmit={handleSendMessage} className="flex p-4 border-t border-gray-300 bg-white">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-indigo-500 focus:border-indigo-500 text-base"
              disabled={isChatting}
            />
            <button
              type="submit"
              className="p-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
              disabled={isChatting}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}