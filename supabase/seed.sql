-- ============================================
-- Clement WellbeingAtWork — Seed Data
-- ============================================
-- Kør dette EFTER schema.sql for at populere
-- Supabase med det eksisterende app-indhold.
-- ============================================

-- ── Exercises ──
INSERT INTO exercises (titel, titel_en, tid, sted, sted_en, cirkel, temaer, intro, intro_en, steps, steps_en, refleksion, refleksion_en, sort_order) VALUES

('Desk grounding', 'Desk grounding', '2 min', 'Ved skrivebordet', 'At your desk', 'centrum',
 ARRAY['generelt', 'skaerm'],
 'En enkel måde at komme tilbage til dig selv midt i en travl dag. Denne øvelse bruger de overflader der allerede er omkring dig til at forbinde dig med din krop og nuet.',
 'A simple way to come back to yourself in the middle of a busy day. This exercise uses the surfaces already around you to reconnect with your body and the present moment.',
 ARRAY['Sæt begge fødder fladt på gulvet. Mærk vægten af din krop i stolen og den solide grund under dig.', 'Læg dine hænder på bordpladen. Læg mærke til temperaturen og teksturen under dine håndflader.', 'Tag tre langsomme, dybe vejrtrækninger. Lad hver udånding være lidt længere end indåndingen.', 'Uden at bevæge hovedet for meget, navngiv tre ting du kan se lige nu. Se virkelig på dem.', 'Læg mærke til temperaturen af luften på din hud — dit ansigt, dine hænder, dine arme.', 'Tag en sidste vejrtrækning og vend tilbage til det du lavede, bare lidt mere nærværende end før.'],
 ARRAY['Place both feet flat on the floor. Feel the weight of your body in the chair and the solid ground beneath you.', 'Rest your hands on the desk surface. Notice the temperature and texture under your palms.', 'Take three slow, deep breaths. Let each exhale be a little longer than the inhale.', 'Without moving your head too much, name three things you can see right now. Really look at them.', 'Notice the temperature of the air on your skin — your face, your hands, your arms.', 'Take one final breath and return to what you were doing, just a little more present than before.'],
 'Hvad lagde du mærke til da du holdt pause? Var det sværere eller lettere end du forventede at lande i nuet?',
 'What did you notice when you paused? Was it harder or easier than you expected to land in the moment?',
 0),

('Møde-reset', 'Meeting reset', '1 min', 'Mødelokale', 'Meeting room', 'aandedraet',
 ARRAY['moeder'],
 'Et minut før et møde kan ændre alt ved hvordan du viser dig. Denne hurtige åndedrætøvelse hjælper dig med at ankomme med klarhed i stedet for at bære den sidste time med dig.',
 'One minute before a meeting can change everything about how you show up. This quick breathing exercise helps you arrive with clarity instead of carrying the last hour with you.',
 ARRAY['Før mødet begynder, læn dig tilbage i stolen og lad dine hænder hvile i skødet.', 'Ånd ind gennem næsen i 4 takter, hold forsigtigt i 7 takter, og ånd langsomt ud gennem munden i 8 takter.', 'Gentag cyklussen to gange mere — tre runder i alt.', 'Når du er færdig, sæt en stille intention for mødet. Ikke et mål, men en kvalitet: nærvær, nysgerrighed, ro.', 'Åbn øjnene og begynd.'],
 ARRAY['Before the meeting begins, sit back in your chair and let your hands rest in your lap.', 'Breathe in through your nose for 4 counts, hold gently for 7 counts, and exhale slowly through your mouth for 8 counts.', 'Repeat this cycle twice more — three rounds in total.', 'As you finish, set a quiet intention for the meeting. Not a goal, but a quality: presence, curiosity, calm.', 'Open your eyes and begin.'],
 'Hvordan havde du det da du gik ind til mødet sammenlignet med hvordan du normalt har det? Ændrede intentionen noget?',
 'How did you feel walking into the meeting compared to how you usually feel? Did setting an intention change anything?',
 1),

('Deadline-åndedræt', 'Deadline breathing', '3 min', 'Overalt', 'Anywhere', 'tilstande',
 ARRAY['deadlines'],
 'Når en deadline presser, skifter dit nervesystem ofte til overgearet uden du opdager det. Denne øvelse hjælper dig med at tjekke ind, regulere og vende tilbage til opgaven med mere fokus.',
 'When a deadline is pressing, your nervous system often shifts into overdrive without you realizing it. This exercise helps you check in, regulate, and return to the task with more focus.',
 ARRAY['Pause det du laver. Tag et øjeblik til at bemærke din nuværende tilstand — er du anspændt, forhastet, spredt eller overraskende rolig?', 'Navngiv hvad du bemærker uden at dømme det. Anerkend simpelthen hvor du er lige nu.', 'Begynd boks-åndedræt: ånd ind i 4 takter, hold i 4 takter, ånd ud i 4 takter, hold i 4 takter.', 'Fortsæt i seks til otte runder. Lad rytmen blive stabil og forudsigelig.', 'Efter den sidste runde, tjek ind igen. Har noget skiftet i din krop eller dit sind?', 'Bemærk forskellen, uanset hvor lille, og bær den bevidsthed med tilbage til dit arbejde.'],
 ARRAY['Pause what you are doing. Take a moment to notice your current state — are you tense, rushed, scattered, or surprisingly calm?', 'Name what you notice without judging it. Simply acknowledge where you are right now.', 'Begin box breathing: inhale for 4 counts, hold for 4 counts, exhale for 4 counts, hold for 4 counts.', 'Continue for six to eight rounds. Let the rhythm become steady and predictable.', 'After the final round, check in again. Has anything shifted in your body or your mind?', 'Notice the difference, however small, and carry that awareness back into your work.'],
 'Hvilken tilstand var du i før øvelsen, og hvilken tilstand er du i nu? Hvad fortæller det dig om hvad din krop havde brug for?',
 'What state were you in before the exercise, and what state are you in now? What does that tell you about what your body needed?',
 2),

('Vagus-aktivering', 'Vagus activation', '2 min', 'Ved skrivebordet eller på badeværelset', 'At your desk or in the bathroom', 'aandedraet',
 ARRAY['generelt', 'deadlines', 'skaerm'],
 'Din vagusnerve er en af kroppens mest kraftfulde veje til at falde til ro. Dette åndedrætmønster aktiverer den direkte og skifter dit nervesystem mod hvile og restitution.',
 'Your vagus nerve is one of the body''s most powerful pathways for calming down. This breathing pattern activates it directly, shifting your nervous system toward rest and recovery.',
 ARRAY['Sid oprejst med begge fødder på gulvet. Lad skuldrene falde og hænderne hvile behageligt.', 'Ånd ind gennem næsen i 4 takter.', 'Hold forsigtigt i 4 takter — ingen spænding, bare en pause.', 'Ånd langsomt ud gennem munden i 6 til 8 takter. Den lange udånding er det der aktiverer vagusnerven.', 'Gentag cyklussen 8 til 10 gange, lad hver runde blive lidt mere ubesværet.', 'Når du er færdig, sid stille et øjeblik og bemærk hvordan din krop føles.'],
 ARRAY['Sit upright with both feet on the floor. Let your shoulders drop and your hands rest where they are comfortable.', 'Breathe in through your nose for 4 counts.', 'Hold gently for 4 counts — no tension, just a pause.', 'Exhale slowly through your mouth for 6 to 8 counts. The long exhale is what activates the vagus nerve.', 'Repeat this cycle 8 to 10 times, letting each round become a little more effortless.', 'When you finish, sit still for a moment and notice how your body feels.'],
 'Bemærkede du et skifte under de lange udåndinger? Hvor i kroppen mærkede du forandringen tydeligst?',
 'Did you notice a shift during the long exhales? Where in your body did you feel the change most clearly?',
 3),

('Morgen-landing', 'Morning landing', '3 min', 'Derhjemme eller ved skrivebordet', 'At home or at your desk', 'centrum',
 ARRAY['generelt', 'balance'],
 'Hvordan du starter dagen former alt der følger. Før du åbner din email eller tjekker din telefon, tag et par minutter til at ankomme — i din krop, dit åndedræt, din intention.',
 'How you start the day shapes everything that follows. Before you open your email or check your phone, take a few minutes to arrive — in your body, in your breath, in your intention.',
 ARRAY['Sid behageligt og luk øjnene. Der er intet du behøver at gøre endnu.', 'Bemærk din krop. Hvor er der spænding? Hvor er der lethed? Bare bemærk, uden at ændre noget.', 'Tag tre dybe vejrtrækninger. Med hver én, lad dig selv falde lidt mere til ro.', 'Sæt en intention for dagen — ikke en opgave eller et to-do, men en kvalitet. Hvordan vil du bevæge dig gennem denne dag? Nærværende. Tålmodig. Jordet. Åben.', 'Lad intentionen lande. Tag en vejrtrækning mere.', 'Åbn øjnene og begynd din dag herfra.'],
 ARRAY['Sit comfortably and close your eyes. There is nothing you need to do yet.', 'Notice your body. Where is there tension? Where is there ease? Just notice, without changing anything.', 'Take three deep breaths. With each one, let yourself settle a little further.', 'Set an intention for the day — not a task or a to-do, but a quality. How do you want to move through this day? Present. Patient. Grounded. Open.', 'Let the intention land. Take one more breath.', 'Open your eyes and begin your day from here.'],
 'Hvilken kvalitet valgte du? Hvordan føles det at starte fra en intention i stedet for fra din indbakke?',
 'What quality did you choose? How does it feel to start from intention rather than from your inbox?',
 4);

-- ── Reflections ──
INSERT INTO reflections (id, titel, titel_en, ikon, farve, spoergsmaal, spoergsmaal_en, uddybning, uddybning_en, sort_order) VALUES

('forbindelse', 'Forbindelse', 'Connection', '◎', 'sage',
 'Hvornår følte du sidst en ægte forbindelse med en kollega — ikke bare professionelt, men menneskeligt? Hvad skabte den forbindelse?',
 'When did you last feel genuinely connected to a colleague — not just professionally, but humanly? What created that connection?',
 'Vi bruger størstedelen af vores vågne timer på arbejdet, men ægte menneskelig forbindelse der kan være sjælden. Denne refleksion inviterer dig til at lægge mærke til de øjeblikke hvor den professionelle maske glider og noget mere ærligt dukker op.',
 'We spend most of our waking hours at work, yet real human connection there can be rare. This reflection invites you to notice the moments when the professional mask slips and something more honest appears.',
 0),

('moenstre', 'Mønstre', 'Patterns', '⟳', 'amber',
 'Hvilket mønster gentager sig i din arbejdsdag som du gerne ville ændre? Hvad tror du det mønster beskytter dig mod?',
 'What pattern repeats in your workday that you would like to change? What do you think that pattern is protecting you from?',
 'Mønstre er ikke tilfældige. De begyndte som regel som noget nyttigt — en måde at klare sig, forblive sikker, håndtere noget overvældende. At forstå hvad et mønster beskytter kan være mere kraftfuldt end blot at forsøge at bryde det.',
 'Patterns are not random. They usually began as something useful — a way to cope, to stay safe, to manage something overwhelming. Understanding what a pattern protects can be more powerful than simply trying to break it.',
 1),

('styrke', 'Styrke', 'Strength', '◇', 'primary',
 'Hvad er du god til som du aldrig får anerkendelse for? Hvad ville det betyde hvis du anerkendte det selv?',
 'What are you good at that you never receive recognition for? What would it mean if you recognized it yourself?',
 'Nogle af dine største styrker er usynlige netop fordi de kommer så naturligt for dig. De ting ingen takker dig for — at holde rummet, bemærke hvad andre overser, forblive stabil når tingene bliver kaotiske — er ofte de kvaliteter der betyder mest.',
 'Some of your greatest strengths are invisible precisely because they come so naturally to you. The things no one thanks you for — holding the room, noticing what others miss, staying steady when things get chaotic — these are often the qualities that matter most.',
 2),

('graenser', 'Grænser', 'Boundaries', '◯', 'rose',
 'Hvor siger du ja når din krop siger nej? Hvad ville der ske hvis du lyttede til din krop i stedet?',
 'Where do you say yes when your body says no? What would happen if you listened to your body instead?',
 'Grænser er ikke mure. De er praksis med at ære din egen kapacitet. De fleste af os er opvokset med at det er egoistisk at sige nej, men din krop kender ofte dine grænser længe før dit sind er villig til at indrømme dem.',
 'Boundaries are not walls. They are the practice of honoring your own capacity. Most of us were taught that saying no is selfish, but your body often knows your limits long before your mind is willing to admit them.',
 3),

('retning', 'Retning', 'Direction', '➚', 'accent',
 'Hvis dit arbejdsliv kunne føles anderledes om seks måneder — ikke opgaverne, men fornemmelsen — hvordan ville det føles?',
 'If your work life could feel different six months from now — not the tasks, but the sensation — how would it feel?',
 'Vi tænker ofte på karriereretning i form af titler, projekter og præstationer. Men under alt det er der en mærket fornemmelse — hvordan det føles at bevæge sig gennem en arbejdsdag. At navngive den følelse kan være et overraskende klart kompas.',
 'We often think about career direction in terms of titles, projects, and achievements. But beneath all of that is a felt sense — how it feels to move through a workday. Naming that feeling can be a surprisingly clear compass.',
 4);
