import type { Exercise, SetLog, Workout, Routine, Settings } from "../types";

export const DEFAULT_SETTINGS: Settings = {
  language: "pl",
  theme: "dark",
  restTimerDefault: 90,
};

export const EXERCISES: Exercise[] = [
  {
    id: "bench", name: "Bench Press", category: "push", muscle: "Klatka",
    equipment: "Sztanga", difficulty: "intermediate",
    instructions: [
      "Poloz sie na lawce, stopy plasko na podlodze",
      "Chwyć sztange szerzej niz biodra",
      "Opuszczaj sztange do klatki kontrolowanym ruchem",
      "Wypchnij do pelnego wyprostu ramion",
    ],
  },
  {
    id: "incline-bench", name: "Incline Bench Press", category: "push", muscle: "Klatka (gorna)",
    equipment: "Sztanga", difficulty: "intermediate",
    instructions: [
      "Ustaw lawke pod katem 30-45 stopni",
      "Chwyć sztange szerzej niz biodra",
      "Opuszczaj do gornej czesci klatki",
      "Wypchnij do pelnego wyprostu",
    ],
  },
  {
    id: "ohp", name: "Overhead Press", category: "push", muscle: "Barki",
    equipment: "Sztanga", difficulty: "intermediate",
    instructions: [
      "Stoj prosto, sztanga na obojczykach",
      "Chwyc sztange na szerokosc barkow",
      "Wypchnij nad glowe do pelnego wyprostu",
      "Opuszczaj kontrolowany do obojczykow",
    ],
  },
  {
    id: "dip", name: "Weighted Dip", category: "push", muscle: "Klatka / Tricepsy",
    equipment: "Poręcze", difficulty: "advanced",
    instructions: [
      "Chwyت poręcze, wyprostuj ramiona",
      "Opuszczaj cialo az ramiona beda pod katem 90 stopni",
      "Wypchnij do pelnego wyprostu",
    ],
  },
  {
    id: "tricep-pd", name: "Tricep Pushdown", category: "push", muscle: "Tricepsy",
    equipment: "Wyciąg", difficulty: "beginner",
    instructions: [
      "Stoj przodem do wyciagu, chwyc linki",
      "Opuszczaj ramiona do pelnego wyprostu",
      "Kontroluj powrot do pozycji poczatkowej",
    ],
  },
  {
    id: "squat", name: "Back Squat", category: "legs", muscle: "Cwiczki / Posladki",
    equipment: "Sztanga", difficulty: "intermediate",
    instructions: [
      "Sztanga na obojczykach, stopy na szerokosc bioder",
      "Opuszczaj biodra do dolu jak na krzeslo",
      "Utrzymuj klatke prosto",
      "Wypchnij do pelnego wyprostu",
    ],
  },
  {
    id: "rdl", name: "Romanian Deadlift", category: "legs", muscle: "Posladki",
    equipment: "Sztanga", difficulty: "intermediate",
    instructions: [
      "Stoj prosto, sztanga przed biodrami",
      "Pochylaj tułowiidol do przodu z prostymi plecami",
      "Opuszczaj sztange blisko nog",
      "Czuj napięcie w posladkach i udach",
    ],
  },
  {
    id: "leg-press", name: "Leg Press", category: "legs", muscle: "Cwiczki",
    equipment: "Maszyna", difficulty: "beginner",
    instructions: [
      "Usiasdz na maszynie, stopy na szerokosc bioder",
      "Opuszczaj poraz az kolana beda pod katem 90 stopni",
      "Wypchnij do pelnego wyprostu",
    ],
  },
  {
    id: "deadlift", name: "Deadlift", category: "pull", muscle: "Plecy",
    equipment: "Sztanga", difficulty: "advanced",
    instructions: [
      "Stoj za sztanga, stopy na szerokosc bioder",
      "Chwytc sztange szerzej niz kolana",
      "Wypnij klatke, napnij brzuch",
      "Wypchnij biodra do przodu stajac prosto",
    ],
  },
  {
    id: "row", name: "Barbell Row", category: "pull", muscle: "Gorna czesc plecow",
    equipment: "Sztanga", difficulty: "intermediate",
    instructions: [
      "Pochyl tułowiidol do przodu z prostymi plecami",
      "Przyciągaj sztange do brzucha",
      "Sciskaj lopatki na gorze",
      "Opuszczaj kontrolowany",
    ],
  },
  {
    id: "cable-row", name: "Cable Row", category: "pull", muscle: "Srodkowa czesc plecow",
    equipment: "Wyciąg", difficulty: "beginner",
    instructions: [
      "Usiasdz prosto, stopy na stopniach",
      "Przyciągaj uchwyty do brzucha",
      "Sciskaj lopatki na gorze",
      "Opuszczaj kontrolowany",
    ],
  },
  {
    id: "pullup", name: "Pull-up", category: "pull", muscle: "Latosy",
    equipment: "Drazek", difficulty: "advanced",
    instructions: [
      "Chwytc drazek szerokim chwytem",
      "Przyciągaj sie az podbrodek bedzie nad drazkiem",
      "Opuszczaj kontrolowany do pelnego wyprostu",
    ],
  },
  {
    id: "lat-pd", name: "Lat Pulldown", category: "pull", muscle: "Latosy",
    equipment: "Wyciąg", difficulty: "beginner",
    instructions: [
      "Usiasdz pod maszyna, chwytc szeroko",
      "Przyciągaj uchwyty do gornej czesci klatki",
      "Opuszczaj kontrolowany",
    ],
  },
  {
    id: "curl", name: "Barbell Curl", category: "pull", muscle: "Bicepsy",
    equipment: "Sztanga", difficulty: "beginner",
    instructions: [
      "Stoj prosto, sztanga przed biodrami",
      "Przyciągaj sztaze do barkow",
      "Nie bujaj tułowiem",
      "Opuszczaj kontrolowany",
    ],
  },
  {
    id: "face-pull", name: "Face Pull", category: "pull", muscle: "Tylna czesc barkow",
    equipment: "Wyciąg", difficulty: "beginner",
    instructions: [
      "Ustaw wycig na wysokosci twarzy",
      "Przyciągaj linki do twarzy",
      "Rozszerzaj lopatki",
      "Opuszczaj kontrolowany",
    ],
  },
  {
    id: "plank", name: "Plank", category: "core", muscle: "Core",
    equipment: "Wlasne cialo", difficulty: "beginner",
    instructions: [
      "Podpieraj sie na przedramionach i palcach stop",
      "Utrzymuj prosta linie ciala",
      "Napnij brzuch i posladki",
    ],
  },
  {
    id: "ab-rollout", name: "Ab Rollout", category: "core", muscle: "Core",
    equipment: "Kolko do brzuszkow", difficulty: "intermediate",
    instructions: [
      "Klęcz na podlodze z kolkem",
      "Przewalaj kolko do przodu",
      "Wroc do pozycji poczatkowej",
    ],
  },
  {
    id: "cable-crunch", name: "Cable Crunch", category: "core", muscle: "Core",
    equipment: "Wyciąg", difficulty: "beginner",
    instructions: [
      "Klęcz przodem do wyciagu",
      "Przyciągaj uchwyty do kolan",
      "Skracaj odleglosc miedzy zebrem a biodrem",
    ],
  },
];

const mkSet = (weight: number, reps: number): SetLog => ({
  id: Math.random().toString(36).slice(2),
  weight,
  reps,
  rpe: null,
  done: true,
});

export const SEED_WORKOUTS: Workout[] = [
  {
    id: "w1",
    routineId: "r1",
    routineName: "Push A",
    date: "2026-09-01",
    duration: 62,
    exercises: [
      { exerciseId: "bench", sets: [mkSet(80, 5), mkSet(80, 5), mkSet(80, 4)] },
      { exerciseId: "ohp", sets: [mkSet(52.5, 8), mkSet(52.5, 7)] },
      { exerciseId: "dip", sets: [mkSet(20, 10), mkSet(20, 9)] },
    ],
  },
  {
    id: "w2",
    routineId: "r2",
    routineName: "Pull A",
    date: "2026-09-03",
    duration: 55,
    exercises: [
      { exerciseId: "deadlift", sets: [mkSet(120, 5), mkSet(120, 5), mkSet(120, 5)] },
      { exerciseId: "row", sets: [mkSet(70, 8), mkSet(70, 8)] },
      { exerciseId: "pullup", sets: [mkSet(0, 10), mkSet(0, 9), mkSet(0, 8)] },
    ],
  },
  {
    id: "w3",
    routineId: "r3",
    routineName: "Legs A",
    date: "2026-09-05",
    duration: 70,
    exercises: [
      { exerciseId: "squat", sets: [mkSet(100, 5), mkSet(100, 5), mkSet(100, 5)] },
      { exerciseId: "rdl", sets: [mkSet(80, 10), mkSet(80, 10)] },
      { exerciseId: "leg-press", sets: [mkSet(150, 12), mkSet(150, 12)] },
    ],
  },
  {
    id: "w4",
    routineId: "r1",
    routineName: "Push A",
    date: "2026-09-07",
    duration: 60,
    exercises: [
      { exerciseId: "bench", sets: [mkSet(82.5, 5), mkSet(82.5, 5), mkSet(82.5, 5)] },
      { exerciseId: "ohp", sets: [mkSet(55, 7), mkSet(55, 6)] },
    ],
  },
  {
    id: "w5",
    routineId: "r1",
    routineName: "Push A",
    date: "2026-09-09",
    duration: 58,
    exercises: [
      { exerciseId: "bench", sets: [mkSet(85, 5), mkSet(85, 4), mkSet(82.5, 5)] },
      { exerciseId: "ohp", sets: [mkSet(55, 8), mkSet(55, 7)] },
    ],
  },
];

export const SEED_ROUTINES: Routine[] = [
  {
    id: "r1",
    name: "Push A",
    exercises: [
      { exerciseId: "bench", targetSets: 3, targetReps: 5 },
      { exerciseId: "ohp", targetSets: 3, targetReps: 8 },
      { exerciseId: "dip", targetSets: 3, targetReps: 10 },
      { exerciseId: "tricep-pd", targetSets: 3, targetReps: 12 },
    ],
  },
  {
    id: "r2",
    name: "Pull A",
    exercises: [
      { exerciseId: "deadlift", targetSets: 3, targetReps: 5 },
      { exerciseId: "row", targetSets: 3, targetReps: 8 },
      { exerciseId: "pullup", targetSets: 3, targetReps: 8 },
      { exerciseId: "curl", targetSets: 3, targetReps: 12 },
    ],
  },
  {
    id: "r3",
    name: "Legs A",
    exercises: [
      { exerciseId: "squat", targetSets: 3, targetReps: 5 },
      { exerciseId: "rdl", targetSets: 3, targetReps: 10 },
      { exerciseId: "leg-press", targetSets: 3, targetReps: 12 },
    ],
  },
];
