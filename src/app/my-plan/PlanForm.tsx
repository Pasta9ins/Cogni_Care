import React from 'react';

interface Meal {
  time: string;
  items: string[];
}

interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: string;
}

interface PlanDay {
  day: string;
  meals?: Meal[];
  exercises?: Exercise[];
  guide?: string;
  audioUrl?: string;
}

type PlanType = 'diet' | 'exercise' | 'meditation';

interface PlanContentFormProps {
  type: PlanType;
  value: PlanDay[];
  onChange: (content: PlanDay[]) => void;
}

const emptyDay = (type: PlanType): PlanDay => ({
  day: '',
  ...(type === 'diet' && { meals: [] }),
  ...(type === 'exercise' && { exercises: [] }),
  ...(type === 'meditation' && { guide: '', audioUrl: '' }),
});

export default function PlanContentForm({ type, value, onChange }: PlanContentFormProps) {
  // Add a new day
  const addDay = () => {
    onChange([...value, emptyDay(type)]);
  };

  // Remove a day
  const removeDay = (idx: number) => {
    const updated = value.filter((_, i) => i !== idx);
    onChange(updated);
  };

  // Update a day's field
  const updateDay = (idx: number, updatedDay: PlanDay) => {
    const updated = value.map((d, i) => (i === idx ? updatedDay : d));
    onChange(updated);
  };

  // Add meal to a day
  const addMeal = (dayIdx: number) => {
    const day = value[dayIdx];
    const meals = day.meals ? [...day.meals, { time: '', items: [''] }] : [{ time: '', items: [''] }];
    updateDay(dayIdx, { ...day, meals });
  };

  // Remove meal from a day
  const removeMeal = (dayIdx: number, mealIdx: number) => {
    const day = value[dayIdx];
    const meals = (day.meals || []).filter((_, i) => i !== mealIdx);
    updateDay(dayIdx, { ...day, meals });
  };

  // Update meal
  const updateMeal = (dayIdx: number, mealIdx: number, meal: Meal) => {
    const day = value[dayIdx];
    const meals = (day.meals || []).map((m, i) => (i === mealIdx ? meal : m));
    updateDay(dayIdx, { ...day, meals });
  };

  // Add exercise to a day
  const addExercise = (dayIdx: number) => {
    const day = value[dayIdx];
    const exercises = day.exercises ? [...day.exercises, { name: '', sets: undefined, reps: undefined, duration: '' }] : [{ name: '', sets: undefined, reps: undefined, duration: '' }];
    updateDay(dayIdx, { ...day, exercises });
  };

  // Remove exercise from a day
  const removeExercise = (dayIdx: number, exIdx: number) => {
    const day = value[dayIdx];
    const exercises = (day.exercises || []).filter((_, i) => i !== exIdx);
    updateDay(dayIdx, { ...day, exercises });
  };

  // Update exercise
  const updateExercise = (dayIdx: number, exIdx: number, ex: Exercise) => {
    const day = value[dayIdx];
    const exercises = (day.exercises || []).map((e, i) => (i === exIdx ? ex : e));
    updateDay(dayIdx, { ...day, exercises });
  };

  // Update guide/audioUrl for meditation
  const updateMeditation = (dayIdx: number, field: 'guide' | 'audioUrl', valueStr: string) => {
    const day = value[dayIdx];
    updateDay(dayIdx, { ...day, [field]: valueStr });
  };

  return (
    <div className="space-y-6">
      {value.map((day, dayIdx) => (
        <div key={dayIdx} className="border rounded p-4 bg-gray-50 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <label className="font-semibold">Day:</label>
            <input
              className="border rounded p-1 flex-1"
              value={day.day}
              onChange={e => updateDay(dayIdx, { ...day, day: e.target.value })}
              placeholder="e.g. Day 1, Monday"
            />
            <button
              className="ml-2 text-red-500 hover:underline"
              onClick={() => removeDay(dayIdx)}
              type="button"
            >
              Remove Day
            </button>
          </div>

          {/* Diet Plan: Meals */}
          {type === 'diet' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Meals</span>
                <button
                  className="text-green-600 hover:underline"
                  onClick={() => addMeal(dayIdx)}
                  type="button"
                >
                  + Add Meal
                </button>
              </div>
              {(day.meals || []).map((meal, mealIdx) => (
                <div key={mealIdx} className="mb-2 pl-2 border-l">
                  <div className="flex gap-2 items-center mb-1">
                    <input
                      className="border rounded p-1"
                      value={meal.time}
                      onChange={e => updateMeal(dayIdx, mealIdx, { ...meal, time: e.target.value })}
                      placeholder="Time (e.g. Breakfast, 8:00am)"
                    />
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => removeMeal(dayIdx, mealIdx)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                  <div>
                    <label className="text-sm">Items:</label>
                    {(meal.items || []).map((item, itemIdx) => (
                      <div key={itemIdx} className="flex gap-2 mb-1">
                        <input
                          className="border rounded p-1 flex-1"
                          value={item}
                          onChange={e => {
                            const newItems = [...meal.items];
                            newItems[itemIdx] = e.target.value;
                            updateMeal(dayIdx, mealIdx, { ...meal, items: newItems });
                          }}
                          placeholder="Meal item"
                        />
                        <button
                          className="text-red-400 hover:underline"
                          onClick={() => {
                            const newItems = meal.items.filter((_, i) => i !== itemIdx);
                            updateMeal(dayIdx, mealIdx, { ...meal, items: newItems });
                          }}
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      className="text-blue-500 hover:underline text-xs"
                      onClick={() => updateMeal(dayIdx, mealIdx, { ...meal, items: [...(meal.items || []), ''] })}
                      type="button"
                    >
                      + Add Item
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Exercise Plan: Exercises */}
          {type === 'exercise' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Exercises</span>
                <button
                  className="text-green-600 hover:underline"
                  onClick={() => addExercise(dayIdx)}
                  type="button"
                >
                  + Add Exercise
                </button>
              </div>
              {(day.exercises || []).map((ex, exIdx) => (
                <div key={exIdx} className="mb-2 pl-2 border-l">
                  <div className="flex gap-2 items-center mb-1">
                    <input
                      className="border rounded p-1"
                      value={ex.name}
                      onChange={e => updateExercise(dayIdx, exIdx, { ...ex, name: e.target.value })}
                      placeholder="Exercise name"
                    />
                    <input
                      className="border rounded p-1 w-16"
                      type="number"
                      value={ex.sets ?? ''}
                      onChange={e => updateExercise(dayIdx, exIdx, { ...ex, sets: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="Sets"
                    />
                    <input
                      className="border rounded p-1 w-16"
                      type="number"
                      value={ex.reps ?? ''}
                      onChange={e => updateExercise(dayIdx, exIdx, { ...ex, reps: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="Reps"
                    />
                    <input
                      className="border rounded p-1 w-24"
                      value={ex.duration ?? ''}
                      onChange={e => updateExercise(dayIdx, exIdx, { ...ex, duration: e.target.value })}
                      placeholder="Duration"
                    />
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => removeExercise(dayIdx, exIdx)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Meditation Plan: Guide & Audio */}
          {type === 'meditation' && (
            <div>
              <label className="block font-semibold mb-1">Guide</label>
              <textarea
                className="border rounded p-1 w-full mb-2"
                value={day.guide || ''}
                onChange={e => updateMeditation(dayIdx, 'guide', e.target.value)}
                placeholder="Meditation guide text"
                rows={3}
              />
              <label className="block font-semibold mb-1">Audio/Video URL</label>
              <input
                className="border rounded p-1 w-full"
                value={day.audioUrl || ''}
                onChange={e => updateMeditation(dayIdx, 'audioUrl', e.target.value)}
                placeholder="Audio URL (optional)"
              />
            </div>
          )}
        </div>
      ))}
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={addDay}
        type="button"
      >
        + Add Day
      </button>
    </div>
  );
}