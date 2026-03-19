/* ═══════════════════════════════════════════
   Clement WellbeingAtWork — Internationalization (i18n)
   Language management and UI string translations
   ═══════════════════════════════════════════ */

var I18N = {
  current: localStorage.getItem('clementLang') || 'da',

  ui: {
    da: {
      // App title & hero
      appTitle: 'Clement WellbeingAtWork — Trivsel på arbejdspladsen',
      heroTitle: 'Clement WellbeingAtWork',
      heroSub: 'Trivsel på arbejdspladsen — baseret på nervesystemets intelligens',
      motto: 'Pas på dit nervesystem — det passer på dig',

      // Onboarding
      onboardingTitle: 'Velkommen til<br>Clement WellbeingAtWork',
      onboardingSub: 'Trivsel på arbejdspladsen — baseret på nervesystemets intelligens',
      onboardingPrompt: 'Hvordan vil du bruge denne app?',
      choiceEmployee: 'Jeg er medarbejder',
      choiceEmployeeDesc: 'Redskaber til din egen trivsel, regulering og hverdagsbalance',
      choiceLeader: 'Jeg er leder',
      choiceLeaderDesc: 'Forstå og understøt dit teams nervesystem og trivsel',
      choiceCompany: 'Vi er en virksomhed',
      choiceCompanyDesc: 'Se hvad et samarbejde med Anne Marie Clement kan give jeres organisation',

      // Bottom nav
      navHome: 'Hjem',
      navLadder: 'Trappen',
      navThemes: 'Temaer',
      navExercises: 'Øvelser',

      // Role bar
      roleLabel: 'Indhold tilpasset dig som',
      roleSwitch: 'Skift rolle',
      roleEmployee: 'medarbejder',
      roleLeader: 'leder',
      roleCompany: 'virksomhed',

      // Welcome
      welcomeLabel: 'Din rejse begynder her',
      welcomeTitleLeader: 'Velkommen. Dit nervesystem sætter tonen for hele dit team.',
      welcomeTextLeader: 'Denne app giver dig redskaber til at forstå og regulere dit eget nervesystem — og skabe de betingelser, der lader dine medarbejdere trives. Bygget på Anne Marie Clements 20 års erfaring med nervesystemet som nøgle til trivsel. Udforsk de syv dimensioner nedenfor.',
      welcomeTitleEmployee: 'Velkommen. Din trivsel begynder i dit nervesystem.',
      welcomeTextEmployee: 'Denne app er dit personlige rum for balance på arbejdspladsen — med øvelser, viden og redskaber baseret på Anne Marie Clements 20 års arbejde med nervesystemet. Syv dimensioner, der tilsammen skaber trivsel i din hverdag. Start hvor det føles rigtigt.',

      // Seven dimensions
      sevenDimensions: 'De syv dimensioner',
      circleHint: 'Tryk på en cirkel for at udforske',
      dynamikLinkTitle: 'Forstå dynamikken',
      dynamikLinkDesc: 'Hvordan alle syv dimensioner påvirker hinanden — og hvorfor helheden er afgørende',

      // Favorites
      favBack: '← Tilbage',
      favTitle: 'Mine favoritter',
      favSub: 'Indhold du har gemt til senere. Tryk på et element for at gå til det.',
      favEmpty: 'Du har ikke gemt noget endnu.',
      favEmptyHint: 'Tryk på {icon} Gem når du finder indhold, du vil vende tilbage til.',
      favSaved: 'Gemt',
      favTypeExercise: 'Øvelse',
      favTypeDeepDive: 'Fordybelse',
      favTypeLadder: 'Nervesystemet',
      favTypeTheme: 'Tema',

      // Circle detail
      back: '← Tilbage',
      backToHome: '← Tilbage til forsiden',
      tabOverview: 'Overblik',
      tabDeepDive: 'Fordybelse',
      tabExercise: 'Øvelse',
      dynamicConnections: 'Dynamiske sammenhænge',
      dynamicConnectionsIntro: 'Se hvordan {name} dynamisk påvirker og påvirkes af de andre dimensioner i dit arbejdsliv.',
      explore: 'Udforsk {name} →',
      noExercise: 'Ingen specifik øvelse til denne cirkel endnu.',

      // Dynamik
      dynamikTitle: 'Dynamikken bag cirkelmodellen',

      // Trappen
      ladderTitle: 'Nervesystemets trappe',
      ladderSub: 'Genkend hvor du er — og vælg hvad du har brug for',
      ladderIntro: 'Dit nervesystem skifter mellem tre tilstande i løbet af arbejdsdagen. Ingen af dem er forkerte — men det hjælper at genkende, hvor du er lige nu. Når du ved det, kan du vælge den rette handling i stedet for at reagere på autopilot.',
      ladderCheckinLabel: 'Hvor er du lige nu?',
      greenState: 'Grøn tilstand',
      greenSub: 'Sikkerhed og forbindelse',
      greenHint: 'Afslappede skuldre, dybt åndedræt, tilstede',
      yellowState: 'Gul tilstand',
      yellowSub: 'Aktivering og alarm',
      yellowHint: 'Hurtig puls, spændte skuldre, rastløshed',
      redState: 'Rød tilstand',
      redSub: 'Nedlukning og udmattelse',
      redHint: 'Tung krop, tomhed, svært at koncentrere sig',
      registered: 'Registreret',
      yourPattern: 'Dit mønster',
      dayNames: ['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø'],
      patternInsightLow: 'Du har mærket ind {count} gang{plural} denne uge. Det er helt okay — der er ingen krav her. Jo oftere du mærker ind, jo tydeligere bliver mønsteret.',
      patternInsightHigh: 'Denne uge har du oftest mærket dig i <strong>{state}</strong> tilstand. At se sit mønster er første skridt mod at ændre det.',
      understandTitle: 'Forstå dit nervesystem som {role}',
      bodySignals: 'Kropslige signaler',
      actions: 'Handlinger',
      whatOthersNotice: 'Hvad mærker andre?',
      yourColleagues: 'Dine kolleger',
      wholeTeam: 'Hele teamet',
      yourEmployees: 'Dine medarbejdere',
      organization: 'Organisationen',
      tryNow: 'Prøv nu',

      // Themes
      themesTitle: 'Hvad møder du lige nu?',
      themesSub: 'Genkend din situation — og find redskaber der passer',
      themesIntro: 'Arbejdslivet byder på situationer, der udfordrer nervesystemet på forskellige måder. Her finder du temaer, der matcher det du oplever lige nu — med baggrund, forståelse og konkrete øvelser, så du kan handle fra et roligere sted.',
      exerciseCount: '{count} øvelse{plural}',
      exercisesForTheme: 'Øvelser til dette tema',

      // Exercises
      exercisesTitle: 'Øvelser & refleksioner',
      exercisesSub: 'Konkrete redskaber og stille rum til eftertanke',
      exercisesIntro: 'Her finder du både øvelser, der regulerer dit nervesystem i hverdagen, og refleksionsspørgsmål, der hjælper dig med at se dybere ind i dine mønstre. Øvelserne har hver en lille refleksion, du kan bruge bagefter. Længere nede finder du selvstændige refleksioner — og til sidst kan du følge din egen proces.',
      exercisesSectionLabel: 'Øvelser',
      filterAll: 'Alle',
      filterBody: 'Krop',
      filterBreathing: 'Åndedræt',
      filterRegulation: 'Regulering',
      filterTeam: 'Team',
      showExercise: 'Vis øvelse',
      hideExercise: 'Skjul øvelse',
      startGuided: 'Start guidet',
      startExercise: 'Start øvelse',
      nextStep: 'Næste trin',
      finish: 'Afslut',
      startAgain: 'Start igen',
      reflectionAfter: 'Refleksion efter øvelsen',

      // Reflections
      reflectionsSectionLabel: 'Refleksioner',
      reflectionsIntro: 'Refleksioner kræver ikke handling — kun ærlighed. Sæt dig et stille sted, læs spørgsmålet, og lad svaret komme. Der er ingen rigtige svar. Der er kun dine.',
      reflectionPlaceholder: 'Skriv dine tanker her...',
      saveReflection: 'Gem refleksion',
      saved: 'Gemt!',

      // Process
      processSectionLabel: 'Din proces',
      processIntro: 'Hold øje med din udvikling. Hver gang du gennemfører en øvelse eller skriver en refleksion, gemmes det her — så du kan se, hvad der virker for dig.',
      exercisesCompleted: 'Øvelser gennemført',
      differentExercises: 'Forskellige øvelser',
      reflectionsWritten: 'Refleksioner skrevet',
      journalNotes: 'Journalnotater',
      journalTitle: 'Skriv et notat til dig selv',
      journalHint: 'Hvad fylder lige nu? En observation, en intention, en erkendelse. Det behøver ikke være perfekt.',
      journalPlaceholder: 'Skriv frit...',
      saveNote: 'Gem notat',
      yourTimeline: 'Din tidslinje',
      exerciseCompleted: 'Øvelse gennemført',
      reflection: 'Refleksion',
      journalNote: 'Journalnotat',
      atTime: 'kl.',
      earlier: 'tidligere',
      processEmpty: 'Du har ikke gennemført nogen øvelser eller skrevet refleksioner endnu.',
      processEmptyHint: 'Start med en øvelse herover — din proces begynder med det første skridt.',

      // Action bar
      save: 'Gem',
      savedLabel: 'Gemt',
      share: 'Del',
      copied: 'Kopieret!',

      // Menu
      perspectiveTitle: 'Dit perspektiv',
      switchPerspective: '→ Skift perspektiv',
      aboutTitle: 'Om Anne Marie Clement',
      aboutBio: 'Anne Marie Clement er nervesystemsspecialist med over 20 års erfaring som selvstændig psykoterapeut. Hun arbejder med nærvær, nysgerrighed og kropslig bevidsthed som veje til trivsel — for både individer og organisationer. Hendes tilgang bygger på polyvagal teori og tilknytningsforskning, oversat til et sprog og en praksis der virker i en travl hverdag.',
      menuNavTitle: 'Navigation',
      menuHome: 'Hjem',
      menuLadder: 'Nervesystemets trappe',
      menuThemes: 'Temaer',
      menuExercises: 'Øvelser',
      menuDynamik: 'Dynamikken bag cirkelmodellen',
      menuCompany: 'Samarbejde med virksomheder',
      menuFavorites: 'Mine favoritter',
      contactTitle: 'Kontakt',
      website: 'Hjemmeside',
      settingsTitle: 'Indstillinger',
      settingReminder: 'Daglig påmindelse',
      settingReminderDesc: 'En blid påmindelse om at tage en pause',
      settingMorning: 'Morgen check-in',
      settingMorningDesc: 'Start dagen med en kort reguleringsøvelse',
      settingWeekly: 'Ugentlig opsummering',
      settingWeeklyDesc: 'Overblik over din uges trivsel og øvelser',
      privacyTitle: 'Privatliv & data',
      privacyText: 'Denne app gemmer kun data lokalt på din enhed. Ingen sporing, ingen cookies, ingen tredjeparter.',
      shareApp: '✦ Del Clement WellbeingAtWork',
      resetData: '✕ Nulstil alle data',
      resetConfirm: 'Er du sikker? Dette sletter alle dine gemte data, favoritter og procesnotater.',
      linkCopied: '✓ Link kopieret!',
      appVersion: 'Clement WellbeingAtWork v1.0',
      language: 'Sprog',
      langDanish: 'Dansk',
      langEnglish: 'English',

      // Search
      searchPlaceholder: 'Søg i indhold...',
      searchEmpty: 'Søg efter et emne eller tryk på et tag',
      noResults: 'Ingen resultater for "{query}"',
      searchTags: ['Stress', 'Åndedræt', 'Nervesystem', 'Pauser', 'Samarbejde', 'Ledelse', 'Resiliens', 'Krop', 'Regulering', 'Tilknytning'],
      searchTypeCircle: 'Cirkel',
      searchTypeTheme: 'Tema',
      searchTypeLadder: 'Nervesystemstrappen',
      searchTypeConnection: 'Sammenhæng',
      searchTypeExercise: 'Øvelse',

      // Virksomhed
      companyTitle: 'Samarbejde med virksomheder',
      companyHeader: 'Nervesystemsspecialist',

      // Footer
      footerMain: 'Clement WellbeingAtWork — Trivsel på arbejdspladsen',
      footerSub: 'Baseret på Annemarie Clements nervesystemsarbejde',

      // Dynamik page labels
      balanceTitle: 'Når alt er i balance',
      balanceCaption: 'Systemet i balance — alle områder støtter hinanden',
      pressureTitle: 'Når systemet er under pres',
      pressureCaption: 'Systemet under pres — symmetrien er brudt',
      dominanceTitle: 'Når ét område dominerer',
      multipleTitle: 'Når flere områder belastes samtidig',
      multipleCaption: 'Flere områder under pres — systemet trækkes i flere retninger',
      wholenessTitle: 'Hvorfor helheden er afgørende',
      forYouLeader: 'For dig som leder',
      forYou: 'For dig',
      backToTop: '↑ Tilbage til toppen',

      // Dynamik dominant labels
      unaddressedStress: ['Uadresseret', 'stress'],
      culturalPressure: ['Kulturelt', 'pres']
    },

    en: {
      // App title & hero
      appTitle: 'Clement WellbeingAtWork — Workplace Wellbeing',
      heroTitle: 'Clement WellbeingAtWork',
      heroSub: 'Workplace wellbeing — built on the intelligence of the nervous system',
      motto: 'Take care of your nervous system — it takes care of you',

      // Onboarding
      onboardingTitle: 'Welcome to<br>Clement WellbeingAtWork',
      onboardingSub: 'Workplace wellbeing — built on the intelligence of the nervous system',
      onboardingPrompt: 'How will you use this app?',
      choiceEmployee: 'I am an employee',
      choiceEmployeeDesc: 'Tools for your own wellbeing, regulation and daily balance',
      choiceLeader: 'I am a leader',
      choiceLeaderDesc: 'Understand and support your team\'s nervous system and wellbeing',
      choiceCompany: 'We are a company',
      choiceCompanyDesc: 'See what a collaboration with Anne Marie Clement can offer your organization',

      // Bottom nav
      navHome: 'Home',
      navLadder: 'Ladder',
      navThemes: 'Themes',
      navExercises: 'Exercises',

      // Role bar
      roleLabel: 'Content tailored for you as',
      roleSwitch: 'Switch role',
      roleEmployee: 'employee',
      roleLeader: 'leader',
      roleCompany: 'company',

      // Welcome
      welcomeLabel: 'Your journey starts here',
      welcomeTitleLeader: 'Welcome. Your nervous system sets the tone for your entire team.',
      welcomeTextLeader: 'This app gives you tools to understand and regulate your own nervous system — and to create the conditions that allow your people to thrive. Built on Anne Marie Clement\'s 20 years of experience with the nervous system as the key to wellbeing. Explore the seven dimensions below.',
      welcomeTitleEmployee: 'Welcome. Your wellbeing begins in your nervous system.',
      welcomeTextEmployee: 'This app is your personal space for balance at work — with exercises, knowledge and tools based on Anne Marie Clement\'s 20 years of work with the nervous system. Seven dimensions that together create wellbeing in your daily life. Start wherever feels right.',

      // Seven dimensions
      sevenDimensions: 'The seven dimensions',
      circleHint: 'Tap a circle to explore',
      dynamikLinkTitle: 'Understand the dynamics',
      dynamikLinkDesc: 'How all seven dimensions influence each other — and why the whole picture matters',

      // Favorites
      favBack: '← Back',
      favTitle: 'My favorites',
      favSub: 'Content you\'ve saved for later. Tap an item to go to it.',
      favEmpty: 'You haven\'t saved anything yet.',
      favEmptyHint: 'Tap {icon} Save when you find content you\'d like to return to.',
      favSaved: 'Saved',
      favTypeExercise: 'Exercise',
      favTypeDeepDive: 'Deep dive',
      favTypeLadder: 'Nervous system',
      favTypeTheme: 'Theme',

      // Circle detail
      back: '← Back',
      backToHome: '← Back to home',
      tabOverview: 'Overview',
      tabDeepDive: 'Deep dive',
      tabExercise: 'Exercise',
      dynamicConnections: 'Dynamic connections',
      dynamicConnectionsIntro: 'See how {name} dynamically influences and is influenced by the other dimensions of your work life.',
      explore: 'Explore {name} →',
      noExercise: 'No specific exercise for this circle yet.',

      // Dynamik
      dynamikTitle: 'The dynamics behind the circle model',

      // Trappen
      ladderTitle: 'The nervous system ladder',
      ladderSub: 'Recognize where you are — and choose what you need',
      ladderIntro: 'Your nervous system shifts between three states throughout the workday. None of them are wrong — but it helps to recognize where you are right now. When you know that, you can choose the right action instead of reacting on autopilot.',
      ladderCheckinLabel: 'Where are you right now?',
      greenState: 'Green state',
      greenSub: 'Safety and connection',
      greenHint: 'Relaxed shoulders, deep breathing, present',
      yellowState: 'Yellow state',
      yellowSub: 'Activation and alarm',
      yellowHint: 'Rapid pulse, tense shoulders, restlessness',
      redState: 'Red state',
      redSub: 'Shutdown and exhaustion',
      redHint: 'Heavy body, emptiness, difficulty concentrating',
      registered: 'Registered',
      yourPattern: 'Your pattern',
      dayNames: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
      patternInsightLow: 'You\'ve checked in {count} time{plural} this week. That\'s perfectly fine — there\'s no pressure here. The more you check in, the clearer the pattern becomes.',
      patternInsightHigh: 'This week you\'ve most often found yourself in the <strong>{state}</strong> state. Seeing your pattern is the first step toward changing it.',
      understandTitle: 'Understand your nervous system as a {role}',
      bodySignals: 'Body signals',
      actions: 'Actions',
      whatOthersNotice: 'What others notice',
      yourColleagues: 'Your colleagues',
      wholeTeam: 'The whole team',
      yourEmployees: 'Your employees',
      organization: 'The organization',
      tryNow: 'Try now',

      // Themes
      themesTitle: 'What are you facing right now?',
      themesSub: 'Recognize your situation — and find the right tools',
      themesIntro: 'Work life brings situations that challenge the nervous system in different ways. Here you\'ll find themes that match what you\'re experiencing right now — with context, understanding and practical exercises so you can act from a calmer place.',
      exerciseCount: '{count} exercise{plural}',
      exercisesForTheme: 'Exercises for this theme',

      // Exercises
      exercisesTitle: 'Exercises & reflections',
      exercisesSub: 'Practical tools and quiet space for contemplation',
      exercisesIntro: 'Here you\'ll find both exercises that regulate your nervous system in everyday life and reflection prompts that help you look deeper into your patterns. Each exercise includes a small reflection for afterwards. Further down you\'ll find standalone reflections — and at the bottom you can follow your own progress.',
      exercisesSectionLabel: 'Exercises',
      filterAll: 'All',
      filterBody: 'Body',
      filterBreathing: 'Breathing',
      filterRegulation: 'Regulation',
      filterTeam: 'Team',
      showExercise: 'Show exercise',
      hideExercise: 'Hide exercise',
      startGuided: 'Start guided',
      startExercise: 'Start exercise',
      nextStep: 'Next step',
      finish: 'Finish',
      startAgain: 'Start again',
      reflectionAfter: 'Reflection after the exercise',

      // Reflections
      reflectionsSectionLabel: 'Reflections',
      reflectionsIntro: 'Reflections don\'t require action — only honesty. Find a quiet place, read the question, and let the answer come. There are no right answers. There are only yours.',
      reflectionPlaceholder: 'Write your thoughts here...',
      saveReflection: 'Save reflection',
      saved: 'Saved!',

      // Process
      processSectionLabel: 'Your progress',
      processIntro: 'Track your development. Every time you complete an exercise or write a reflection, it\'s saved here — so you can see what works for you.',
      exercisesCompleted: 'Exercises completed',
      differentExercises: 'Different exercises',
      reflectionsWritten: 'Reflections written',
      journalNotes: 'Journal notes',
      journalTitle: 'Write a note to yourself',
      journalHint: 'What\'s on your mind right now? An observation, an intention, a realization. It doesn\'t need to be perfect.',
      journalPlaceholder: 'Write freely...',
      saveNote: 'Save note',
      yourTimeline: 'Your timeline',
      exerciseCompleted: 'Exercise completed',
      reflection: 'Reflection',
      journalNote: 'Journal note',
      atTime: 'at',
      earlier: 'earlier',
      processEmpty: 'You haven\'t completed any exercises or written any reflections yet.',
      processEmptyHint: 'Start with an exercise above — your progress begins with the first step.',

      // Action bar
      save: 'Save',
      savedLabel: 'Saved',
      share: 'Share',
      copied: 'Copied!',

      // Menu
      perspectiveTitle: 'Your perspective',
      switchPerspective: '→ Switch perspective',
      aboutTitle: 'About Anne Marie Clement',
      aboutBio: 'Anne Marie Clement is a nervous system specialist with over 20 years of experience as an independent psychotherapist. She works with presence, curiosity and somatic awareness as pathways to wellbeing — for both individuals and organizations. Her approach draws on polyvagal theory and attachment research, translated into language and practices that work in a busy everyday life.',
      menuNavTitle: 'Navigation',
      menuHome: 'Home',
      menuLadder: 'The nervous system ladder',
      menuThemes: 'Themes',
      menuExercises: 'Exercises',
      menuDynamik: 'The dynamics behind the circle model',
      menuCompany: 'Working with companies',
      menuFavorites: 'My favorites',
      contactTitle: 'Contact',
      website: 'Website',
      settingsTitle: 'Settings',
      settingReminder: 'Daily reminder',
      settingReminderDesc: 'A gentle reminder to take a pause',
      settingMorning: 'Morning check-in',
      settingMorningDesc: 'Start the day with a short regulation exercise',
      settingWeekly: 'Weekly summary',
      settingWeeklyDesc: 'Overview of your week\'s wellbeing and exercises',
      privacyTitle: 'Privacy & data',
      privacyText: 'This app only stores data locally on your device. No tracking, no cookies, no third parties.',
      shareApp: '✦ Share Clement WellbeingAtWork',
      resetData: '✕ Reset all data',
      resetConfirm: 'Are you sure? This will delete all your saved data, favorites and journal notes.',
      linkCopied: '✓ Link copied!',
      appVersion: 'Clement WellbeingAtWork v1.0',
      language: 'Language',
      langDanish: 'Dansk',
      langEnglish: 'English',

      // Search
      searchPlaceholder: 'Search content...',
      searchEmpty: 'Search for a topic or tap a tag',
      noResults: 'No results for "{query}"',
      searchTags: ['Stress', 'Breathing', 'Nervous system', 'Breaks', 'Collaboration', 'Leadership', 'Resilience', 'Body', 'Regulation', 'Attachment'],
      searchTypeCircle: 'Circle',
      searchTypeTheme: 'Theme',
      searchTypeLadder: 'Nervous system ladder',
      searchTypeConnection: 'Connection',
      searchTypeExercise: 'Exercise',

      // Virksomhed
      companyTitle: 'Working with companies',
      companyHeader: 'Nervous system specialist',

      // Footer
      footerMain: 'Clement WellbeingAtWork — Workplace Wellbeing',
      footerSub: 'Based on Annemarie Clement\'s nervous system work',

      // Dynamik page labels
      balanceTitle: 'When everything is in balance',
      balanceCaption: 'The system in balance — all areas support each other',
      pressureTitle: 'When the system is under pressure',
      pressureCaption: 'The system under pressure — the symmetry is broken',
      dominanceTitle: 'When one area dominates',
      multipleTitle: 'When multiple areas are under strain',
      multipleCaption: 'Multiple areas under pressure — the system is pulled in several directions',
      wholenessTitle: 'Why the whole picture matters',
      forYouLeader: 'For you as a leader',
      forYou: 'For you',
      backToTop: '↑ Back to top',

      // Dynamik dominant labels
      unaddressedStress: ['Unaddressed', 'stress'],
      culturalPressure: ['Cultural', 'pressure']
    }
  }
};

function t(key) {
  return I18N.ui[I18N.current][key] || I18N.ui['da'][key] || key;
}

function getLang() {
  return I18N.current;
}

function setLang(lang) {
  I18N.current = lang;
  localStorage.setItem('clementLang', lang);
}

function isEn() {
  return I18N.current === 'en';
}
