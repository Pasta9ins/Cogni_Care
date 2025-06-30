// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useAuthStore } from '../../store/useAuthStore.js';
// import api from '@/lib/axios.js';
// import toast, { Toaster } from 'react-hot-toast';

// // --- TypeScript Interfaces ---
// interface PlanDay {
//   day: string;
//   meals?: { time: string; items: string[] }[];
//   exercises?: { name: string; sets?: number; reps?: number; duration?: string }[];
//   guide?: string;
//   audioUrl?: string;
// }

// type PlanType = 'diet' | 'exercise' | 'meditation';

// interface Plan {
//   _id: string;
//   user: string;
//   type: PlanType;
//   title: string;
//   content: PlanDay[];
//   personalizedFor: { age: number; conditions?: string[] };
//   progress: { completedDays: string[]; lastUpdated: string | null };
//   status: 'active' | 'archived';
//   createdAt: string;
//   updatedAt: string;
// }

// // --- Plan Types for UI ---
// const PLAN_TYPES: { type: PlanType; label: string; color: string; icon: string }[] = [
//   { type: 'diet', label: 'Diet Plan', color: 'bg-green-100', icon: '🥗' },
//   { type: 'exercise', label: 'Exercise Routine', color: 'bg-blue-100', icon: '🏋️' },
//   { type: 'meditation', label: 'Meditation Guide', color: 'bg-purple-100', icon: '🧘' },
// ];

// export default function MyPlanPage() {
//   // Zustand auth
//   const { authUser } = useAuthStore();

//   // State
//   const [plans, setPlans] = useState<Plan[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
//   const [editTitle, setEditTitle] = useState('');
//   const [editContent, setEditContent] = useState('');
//   const [creatingType, setCreatingType] = useState<PlanType | ''>('');
//   const [createTitle, setCreateTitle] = useState('');
//   const [createContent, setCreateContent] = useState('');
//   const [isSaving, setIsSaving] = useState(false);

//   // Fetch plans on mount
//   useEffect(() => {
//     if (authUser) fetchPlans();
//     // eslint-disable-next-line
//   }, [authUser]);

//   // Fetch all active plans for the user
//   const fetchPlans = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get('/api/plans/my');
//       setPlans(res.data.plans || []);
//     } catch (err) {
//       toast.error('Failed to fetch plans');
//     }
//     setLoading(false);
//   };

//   // Start editing a plan (open modal)
//   const startEdit = (plan: Plan) => {
//     setEditingPlan(plan);
//     setEditTitle(plan.title);
//     setEditContent(JSON.stringify(plan.content, null, 2));
//   };

//   // Save edited plan (PUT request)
//   const saveEdit = async () => {
//     if (!editingPlan) return;
//     setIsSaving(true);
//     try {
//       const res = await api.put(`/api/plans/${editingPlan._id}`, {
//         title: editTitle,
//         content: JSON.parse(editContent),
//       });
//       if (res.status === 200) {
//         toast.success('Plan updated!');
//         setEditingPlan(null);
//         fetchPlans();
//       } else {
//         toast.error('Failed to update plan');
//       }
//     } catch {
//       toast.error('Invalid content format');
//     }
//     setIsSaving(false);
//   };

//   // Mark a day as completed for a plan (progress tracking)
//   const markDayCompleted = async (planId: string, day: string) => {
//     try {
//       const res = await api.put(`/api/plans/${planId}/progress`, {
//         completedDay: day,
//       });
//       if (res.status === 200) {
//         toast.success('Progress updated!');
//         fetchPlans();
//       } else {
//         toast.error('Failed to update progress');
//       }
//     } catch {
//       toast.error('Failed to update progress');
//     }
//   };

//   // Start creating a new plan (open modal)
//   const startCreate = (type: PlanType) => {
//     setCreatingType(type);
//     setCreateTitle('');
//     setCreateContent('');
//   };

//   // Save new plan (POST request)
//   const saveCreate = async () => {
//     setIsSaving(true);
//     try {
//       const res = await api.post('/api/plans', {
//         type: creatingType,
//         title: createTitle,
//         content: createContent ? JSON.parse(createContent) : undefined,
//       });
//       if (res.status === 201) {
//         toast.success('Plan created!');
//         setCreatingType('');
//         fetchPlans();
//       } else {
//         toast.error('Failed to create plan');
//       }
//     } catch {
//       toast.error('Invalid content format');
//     }
//     setIsSaving(false);
//   };

//   // Helper: get plan by type
//   const getPlanByType = (type: PlanType) => plans.find((p) => p.type === type);

//   // If not logged in, show access denied
//   if (!authUser) {
//     return (
//       <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-yellow-50">
//         <h1 className="text-4xl font-bold mb-8 text-yellow-800">Access Denied</h1>
//         <p className="text-xl text-yellow-600">Please log in to view your plans.</p>
//       </div>
//     );
//   }

//   // Show loading state
//   if (loading) {
//     return (
//       <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
//         <span className="animate-spin text-indigo-600 mb-4 text-5xl">🌀</span>
//         <h1 className="text-4xl font-bold mb-8 text-gray-800">Loading Plans...</h1>
//         <p className="text-xl text-gray-600">Fetching your personalized plans.</p>
//       </div>
//     );
//   }

//   // Main UI
//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <Toaster />
//       <h1 className="text-3xl font-bold mb-8 text-center">My Plan</h1>
//       {/* Plan cards for each type */}
//       <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-3">
//         {PLAN_TYPES.map(({ type, label, color, icon }) => {
//           const plan = getPlanByType(type);
//           return (
//             <div key={type} className={`rounded-xl shadow-md p-6 ${color} flex flex-col`}>
//               <div className="flex items-center gap-2 mb-4">
//                 <span className="text-2xl">{icon}</span>
//                 <h2 className="text-xl font-semibold">{label}</h2>
//               </div>
//               {plan ? (
//                 <>
//                   {/* Plan title */}
//                   <div className="mb-2">
//                     <span className="font-bold">Title:</span> {plan.title}
//                   </div>
//                   {/* Plan content (as JSON for now) */}
//                   <div className="mb-2">
//                     <span className="font-bold">Content:</span>
//                     <pre className="bg-white rounded p-2 mt-1 text-xs max-h-40 overflow-y-auto">{JSON.stringify(plan.content, null, 2)}</pre>
//                   </div>
//                   {/* Progress tracking */}
//                   <div className="mb-2">
//                     <span className="font-bold">Progress:</span>
//                     <ul className="list-disc ml-5">
//                       {plan.content.map((day: PlanDay, idx: number) => (
//                         <li key={idx} className="flex items-center gap-2">
//                           <span>{day.day}</span>
//                           {plan.progress.completedDays.includes(day.day) ? (
//                             <span className="text-green-600 font-bold">✓</span>
//                           ) : (
//                             <button
//                               className="text-xs bg-green-200 px-2 py-1 rounded hover:bg-green-300"
//                               onClick={() => markDayCompleted(plan._id, day.day)}
//                             >
//                               Mark as done
//                             </button>
//                           )}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                   {/* Edit button */}
//                   <button
//                     className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                     onClick={() => startEdit(plan)}
//                   >
//                     Edit Plan
//                   </button>
//                 </>
//               ) : (
//                 // Create button if plan doesn't exist
//                 <button
//                   className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
//                   onClick={() => startCreate(type)}
//                 >
//                   Create {label}
//                 </button>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* Edit Plan Modal */}
//       {editingPlan && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
//             <h2 className="text-xl font-bold mb-4">Edit Plan</h2>
//             <label className="block mb-2 font-semibold">Title</label>
//             <input
//               className="w-full border rounded p-2 mb-4"
//               value={editTitle}
//               onChange={(e) => setEditTitle(e.target.value)}
//             />
//             <label className="block mb-2 font-semibold">Content (JSON)</label>
//             <textarea
//               className="w-full border rounded p-2 mb-4 font-mono"
//               rows={10}
//               value={editContent}
//               onChange={(e) => setEditContent(e.target.value)}
//             />
//             <div className="flex gap-2">
//               <button
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                 onClick={saveEdit}
//                 disabled={isSaving}
//               >
//                 {isSaving ? 'Saving...' : 'Save'}
//               </button>
//               <button
//                 className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
//                 onClick={() => setEditingPlan(null)}
//                 disabled={isSaving}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Create Plan Modal */}
//       {creatingType && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
//             <h2 className="text-xl font-bold mb-4">Create {PLAN_TYPES.find(pt => pt.type === creatingType)?.label}</h2>
//             <label className="block mb-2 font-semibold">Title</label>
//             <input
//               className="w-full border rounded p-2 mb-4"
//               value={createTitle}
//               onChange={(e) => setCreateTitle(e.target.value)}
//             />
//             <label className="block mb-2 font-semibold">Content (JSON, optional)</label>
//             <textarea
//               className="w-full border rounded p-2 mb-4 font-mono"
//               rows={10}
//               value={createContent}
//               onChange={(e) => setCreateContent(e.target.value)}
//               placeholder='Leave blank to auto-generate'
//             />
//             <div className="flex gap-2">
//               <button
//                 className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
//                 onClick={saveCreate}
//                 disabled={isSaving}
//               >
//                 {isSaving ? 'Creating...' : 'Create'}
//               </button>
//               <button
//                 className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
//                 onClick={() => setCreatingType('')}
//                 disabled={isSaving}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }