'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore.js';
import api from '@/lib/axios.js';
import toast, { Toaster } from 'react-hot-toast';
import PlanContentForm from './PlanForm';
import { Loader2 } from 'lucide-react';

// --- TypeScript Interfaces ---
interface PlanDay {
  day: string;
  meals?: { time: string; items: string[] }[];
  exercises?: { name: string; sets?: number; reps?: number; duration?: string }[];
  guide?: string;
  audioUrl?: string;
}

type PlanType = 'diet' | 'exercise' | 'meditation';

interface Plan {
  _id: string;
  user: string;
  type: PlanType;
  title: string;
  content: PlanDay[];
  personalizedFor: { age: number; conditions?: string[] };
  progress: { completedDays: string[]; lastUpdated: string | null };
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

// --- Plan Types for UI ---
const PLAN_TYPES: { type: PlanType; label: string; color: string; icon: string }[] = [
  { type: 'diet', label: 'Diet Plan', color: 'bg-green-100', icon: '🥗' },
  { type: 'exercise', label: 'Exercise Routine', color: 'bg-blue-100', icon: '🏋️' },
  { type: 'meditation', label: 'Meditation Guide', color: 'bg-purple-100', icon: '🧘' },
];

export default function MyPlanPage() {
  // Zustand auth
  const { authUser } = useAuthStore();

  // State
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState<PlanDay[]>([]);
  const [creatingType, setCreatingType] = useState<PlanType | ''>('');
  const [createTitle, setCreateTitle] = useState('');
  const [createContent, setCreateContent] = useState<PlanDay[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch plans on mount
  useEffect(() => {
    if (authUser) fetchPlans();
    // eslint-disable-next-line
  }, [authUser]);

  // Fetch all active plans for the user
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/plans/my');
      setPlans(res.data.plans || []);
    } catch (err : any) {
      toast.error(err.response?.data?.message || 'Failed to fetch plans');
    }
    setLoading(false);
  };

  // Start editing a plan (open modal)
  const startEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setEditTitle(plan.title);
    setEditContent(plan.content);
  };

  // Save edited plan (PUT request)
  const saveEdit = async () => {
    if (!editingPlan) return;
    setIsSaving(true);
    try {
      const res = await api.put(`/api/plans/${editingPlan._id}`, {
        title: editTitle,
        content: editContent,
      });
      if (res.status === 200) {
        toast.success('Plan updated!');
        setEditingPlan(null);
        fetchPlans();
      } else {
        toast.error('Failed to update plan');
      }
    } catch {
      toast.error('Failed to update plan');
    }
    setIsSaving(false);
  };

  // Mark a day as completed for a plan (progress tracking)
  const markDayCompleted = async (planId: string, day: string) => {
    try {
      const res = await api.put(`/api/plans/${planId}/progress`, {
        completedDay: day,
      });
      if (res.status === 200) {
        toast.success('Progress updated!');
        fetchPlans();
      } else {
        toast.error('Failed to update progress');
      }
    } catch {
      toast.error('Failed to update progress');
    }
  };

  // NEW: Mark a day as incomplete (remove from completedDays)
  const markDayIncomplete = async (planId: string, day: string) => {
    try {
      const res = await api.put(`/api/plans/${planId}/progress`, {
        completedDay: day,
        undo: true, // We'll use this flag to indicate removal
      });
      if (res.status === 200) {
        toast.success('Progress updated!');
        fetchPlans();
      } else {
        toast.error('Failed to update progress');
      }
    } catch {
      toast.error('Failed to update progress');
    }
  };

  // Start creating a new plan (open modal)
  const startCreate = (type: PlanType) => {
    setCreatingType(type);
    setCreateTitle('');
    setCreateContent([]);
  };

  // Save new plan (POST request)
  const saveCreate = async () => {
    setIsSaving(true);
    try {
      const res = await api.post('/api/plans', {
        type: creatingType,
        title: createTitle,
        content: createContent,
      });
      if (res.status === 201) {
        toast.success('Plan created!');
        setCreatingType('');
        fetchPlans();
      } else {
        toast.error('Failed to create plan');
      }
    } catch {
      toast.error('Failed to create plan');
    }
    setIsSaving(false);
  };

  // Helper: get plan by type
  const getPlanByType = (type: PlanType) => plans.find((p) => p.type === type);

  // If not logged in, show access denied
  if (!authUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-yellow-50">
        <h1 className="text-4xl font-bold mb-8 text-yellow-800">Access Denied</h1>
        <p className="text-xl text-yellow-600">Please log in to view your plans.</p>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Loading Plans...</h1>
        <p className="text-xl text-gray-600">Fetching your personalized plans.</p>
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Toaster />
      <h1 className="text-3xl font-bold mb-8 text-center">My Plan</h1>
      {/* Plan cards for each type */}
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        {PLAN_TYPES.map(({ type, label, color, icon }) => {
          const plan = getPlanByType(type);
          return (
            <div key={type} className={`rounded-2xl shadow-lg p-8 ${color} flex flex-col w-full transition-transform hover:scale-[1.01]`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{icon}</span>
                <h2 className="text-xl font-semibold">{label}</h2>
              </div>
              {plan ? (
                <>
                  {/* Plan title */}
                  <div className="mb-2">
                    <span className="font-bold">Title:</span> {plan.title}
                  </div>
                  
                  
                  {/* Plan content (structured and beautified) */}
                  {/* <div className="mb-2">
                    <span className="font-bold block mb-1">Plan Details:</span>
                    <div className="bg-white rounded p-3 mt-1 text-sm max-h-52 overflow-y-auto border border-gray-200">
                      {plan.content.length === 0 && <div className="text-gray-400 italic">No days added yet.</div>}
                      {plan.content.map((day, idx) => (
                        <div key={idx} className="mb-3 pb-2 border-b last:border-b-0 last:pb-0">
                          <div className="font-semibold text-indigo-700 mb-1">{day.day}</div>
                          {type === 'diet' && day.meals && day.meals.length > 0 && (
                            <div className="mb-1">
                              <span className="font-medium text-green-700">Meals:</span>
                              <ul className="ml-4 list-disc">
                                {day.meals.map((meal, mIdx) => (
                                  <li key={mIdx} className="mb-1">
                                    <span className="font-semibold">{meal.time}:</span> {meal.items.join(', ')}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {type === 'exercise' && day.exercises && day.exercises.length > 0 && (
                            <div className="mb-1">
                              <span className="font-medium text-blue-700">Exercises:</span>
                              <ul className="ml-4 list-disc">
                                {day.exercises.map((ex, eIdx) => (
                                  <li key={eIdx}>
                                    <span className="font-semibold">{ex.name}</span>
                                    {ex.sets && ` | Sets: ${ex.sets}`}
                                    {ex.reps && ` | Reps: ${ex.reps}`}
                                    {ex.duration && ` | Duration: ${ex.duration}`}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {type === 'meditation' && (day.guide || day.audioUrl) && (
                            <div className="mb-1">
                              <span className="font-medium text-purple-700">Guide:</span>
                              <div className="ml-2 text-gray-700 whitespace-pre-line">{day.guide}</div>
                              {day.audioUrl && (
                                <div className="ml-2 mt-1 text-xs text-blue-600">
                                  <a href={day.audioUrl} target="_blank" rel="noopener noreferrer" className="underline">Link to Video</a>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div> */}


                  <div className="mb-2">
  <span className="font-bold block mb-1 text-lg text-gray-800">Plan Details:</span>
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 mt-1 text-sm max-h-60 overflow-y-auto border border-gray-200 shadow-inner">
    {plan.content.length === 0 && (
      <div className="text-gray-400 italic">No days added yet.</div>
    )}
    {plan.content.map((day, idx) => (
      <div
        key={idx}
        className="mb-4 pb-3 border-b last:border-b-0 last:pb-0 transition-shadow hover:shadow-md rounded-lg bg-white/80"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block text-indigo-600 text-xl">📅</span>
          <span className="font-semibold text-indigo-800 text-base">{day.day}</span>
        </div>
        {type === 'diet' && day.meals && day.meals.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-green-700">🥗 Meals:</span>
            </div>
            <ul className="ml-6 list-disc space-y-1">
              {day.meals.map((meal, mIdx) => (
                <li key={mIdx}>
                  <span className="font-semibold text-green-800">{meal.time}:</span>
                  <span className="ml-1 text-gray-700">{meal.items.join(', ')}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {type === 'exercise' && day.exercises && day.exercises.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-blue-700">🏋️ Exercises:</span>
            </div>
            <ul className="ml-6 list-disc space-y-1">
              {day.exercises.map((ex, eIdx) => (
                <li key={eIdx}>
                  <span className="font-semibold text-blue-800">{ex.name}</span>
                  {ex.sets && <span className="ml-2 text-gray-600">| Sets: {ex.sets}</span>}
                  {ex.reps && <span className="ml-2 text-gray-600">| Reps: {ex.reps}</span>}
                  {ex.duration && <span className="ml-2 text-gray-600">| Duration: {ex.duration}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
        {type === 'meditation' && (day.guide || day.audioUrl) && (
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-purple-700">🧘 Guide:</span>
            </div>
            <div className="ml-6 text-gray-700 whitespace-pre-line">{day.guide}</div>
            {day.audioUrl && (
              <div className="ml-6 mt-1 text-xs text-blue-600">
                <a
                  href={day.audioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800"
                >
                  ▶️ Link to Guide
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    ))}
  </div>
</div>



                  
                  {/* Progress tracking */}
                  <div className="mb-2">
                    <span className="font-bold">Progress:</span>
                    <div className="flex flex-row flex-wrap gap-3 mt-1">
                      {plan.content.map((day: PlanDay, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 bg-gray-100 rounded px-2 py-1">
                          <span className="font-medium text-gray-700">{day.day}</span>
                          {plan.progress.completedDays.includes(day.day) ? (
                            <button
                              className="text-green-600 font-bold focus:outline-none hover:text-red-500"
                              title="Mark as incomplete"
                              onClick={() => markDayIncomplete(plan._id, day.day)}
                            >
                              ✓
                            </button>
                          ) : (
                            <button
                              className="text-xs bg-green-200 px-2 py-1 rounded hover:bg-green-300"
                              onClick={() => markDayCompleted(plan._id, day.day)}
                            >
                              Done
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Edit button */}
                  <button
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => startEdit(plan)}
                  >
                    Edit Plan
                  </button>
                </>
              ) : (
                // Create button if plan doesn't exist
                <button
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  onClick={() => startCreate(type)}
                >
                  Create {label}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Plan</h2>
            <label className="block mb-2 font-semibold">Title</label>
            <input
              className="w-full border rounded p-2 mb-4"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <label className="block mb-2 font-semibold">Content</label>
            <PlanContentForm
              type={editingPlan.type}
              value={editContent}
              onChange={setEditContent}
            />
            <div className="flex gap-2 mt-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={saveEdit}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setEditingPlan(null)}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Plan Modal */}
      {creatingType && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create {PLAN_TYPES.find(pt => pt.type === creatingType)?.label}</h2>
            <label className="block mb-2 font-semibold">Title</label>
            <input
              className="w-full border rounded p-2 mb-4"
              value={createTitle}
              onChange={(e) => setCreateTitle(e.target.value)}
            />
            <label className="block mb-2 font-semibold">Content</label>
            <PlanContentForm
              type={creatingType as PlanType}
              value={createContent}
              onChange={setCreateContent}
            />
            <div className="flex gap-2 mt-4">
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                onClick={saveCreate}
                disabled={isSaving}
              >
                {isSaving ? 'Creating...' : 'Create'}
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setCreatingType('')}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}