-- Run this in Supabase SQL Editor (bypasses RLS)
-- Seeds system exercises visible to all users

INSERT INTO exercises (id, name, category, muscle, equipment, difficulty, instructions, is_custom, owner_id)
VALUES
  (gen_random_uuid(), 'Bench Press', 'push', 'Klatka', 'Sztanga', 'intermediate', ARRAY['Poloz sie na lawce, stopy plasko na podlodze','Chwyc sztange szerzej niz biodra','Opuszczaj sztange do klatki kontrolowanym ruchem','Wypchnij do pelnego wyprostu ramion'], false, NULL),
  (gen_random_uuid(), 'Incline Bench Press', 'push', 'Klatka (gorna)', 'Sztanga', 'intermediate', ARRAY['Ustaw lawke pod katem 30-45 stopni','Chwyc sztange szerzej niz biodra','Opuszczaj do gornej czesci klatki','Wypchnij do pelnego wyprostu'], false, NULL),
  (gen_random_uuid(), 'Overhead Press', 'push', 'Barki', 'Sztanga', 'intermediate', ARRAY['Stoj prosto, sztanga na obojczykach','Chwyc sztange na szerokosc barkow','Wypchnij nad glowe do pelnego wyprostu','Opuszczaj kontrolowany do obojczykow'], false, NULL),
  (gen_random_uuid(), 'Weighted Dip', 'push', 'Klatka / Tricepsy', 'Poręcze', 'advanced', ARRAY['Chwyc poręcze, wyprostuj ramiona','Opuszczaj cialo az ramiona beda pod katem 90 stopni','Wypchnij do pelnego wyprostu'], false, NULL),
  (gen_random_uuid(), 'Tricep Pushdown', 'push', 'Tricepsy', 'Wyciąg', 'beginner', ARRAY['Stoj przodem do wyciagu, chwyc linki','Opuszczaj ramiona do pelnego wyprostu','Kontroluj powrot do pozycji poczatkowej'], false, NULL),
  (gen_random_uuid(), 'Back Squat', 'legs', 'Cwiczki / Posladki', 'Sztanga', 'intermediate', ARRAY['Sztanga na obojczykach, stopy na szerokosc bioder','Opuszczaj biodra do dolu jak na krzeslo','Utrzymuj klatke prosto','Wypchnij do pelnego wyprostu'], false, NULL),
  (gen_random_uuid(), 'Romanian Deadlift', 'legs', 'Posladki', 'Sztanga', 'intermediate', ARRAY['Stoj prosto, sztanga przed biodrami','Pochylaj tułowiidol do przodu z prostymi plecami','Opuszczaj sztange blisko nog','Czuj napięcie w posladkach i udach'], false, NULL),
  (gen_random_uuid(), 'Leg Press', 'legs', 'Cwiczki', 'Maszyna', 'beginner', ARRAY['Usiasdz na maszynie, stopy na szerokosc bioder','Opuszczaj poraz az kolana beda pod katem 90 stopni','Wypchnij do pelnego wyprostu'], false, NULL),
  (gen_random_uuid(), 'Deadlift', 'pull', 'Plecy', 'Sztanga', 'advanced', ARRAY['Stoj za sztanga, stopy na szerokosc bioder','Chwyc sztange szerzej niz kolana','Wypnij klatke, napnij brzuch','Wypchnij biodra do przodu stajac prosto'], false, NULL),
  (gen_random_uuid(), 'Barbell Row', 'pull', 'Gorna czesc plecow', 'Sztanga', 'intermediate', ARRAY['Pochyl tułowiidol do przodu z prostymi plecami','Przyciągaj sztange do brzucha','Sciskaj lopatki na gorze','Opuszczaj kontrolowany'], false, NULL),
  (gen_random_uuid(), 'Cable Row', 'pull', 'Srodkowa czesc plecow', 'Wyciąg', 'beginner', ARRAY['Usiasdz prosto, stopy na stopniach','Przyciągaj uchwyty do brzucha','Sciskaj lopatki na gorze','Opuszczaj kontrolowany'], false, NULL),
  (gen_random_uuid(), 'Pull-up', 'pull', 'Latosy', 'Drazek', 'advanced', ARRAY['Chwyc drazek szerokim chwytem','Przyciągaj sie az podbrodek bedzie nad drazkiem','Opuszczaj kontrolowany do pelnego wyprostu'], false, NULL),
  (gen_random_uuid(), 'Lat Pulldown', 'pull', 'Latosy', 'Wyciąg', 'beginner', ARRAY['Usiasdz pod maszyna, chwyc szeroko','Przyciągaj uchwyty do gornej czesci klatki','Opuszczaj kontrolowany'], false, NULL),
  (gen_random_uuid(), 'Barbell Curl', 'pull', 'Bicepsy', 'Sztanga', 'beginner', ARRAY['Stoj prosto, sztanga przed biodrami','Przyciągaj sztaze do barkow','Nie bujaj tułowiem','Opuszczaj kontrolowany'], false, NULL),
  (gen_random_uuid(), 'Face Pull', 'pull', 'Tylna czesc barkow', 'Wyciąg', 'beginner', ARRAY['Ustaw wycig na wysokosci twarzy','Przyciągaj linki do twarzy','Rozszerzaj lopatki','Opuszczaj kontrolowany'], false, NULL),
  (gen_random_uuid(), 'Plank', 'core', 'Core', 'Wlasne cialo', 'beginner', ARRAY['Podpieraj sie na przedramionach i palcach stop','Utrzymuj prosta linie ciala','Napnij brzuch i posladki'], false, NULL),
  (gen_random_uuid(), 'Ab Rollout', 'core', 'Core', 'Kolko do brzuszkow', 'intermediate', ARRAY['Klęcz na podlodze z kolkem','Przewalaj kolko do przodu','Wroc do pozycji poczatkowej'], false, NULL),
  (gen_random_uuid(), 'Cable Crunch', 'core', 'Core', 'Wyciąg', 'beginner', ARRAY['Klęcz przodem do wyciagu','Przyciągaj uchwyty do kolan','Skracaj odleglosc miedzy zebrem a biodrem'], false, NULL);
