/* ═══════════════════════════════════════════
   Clement Firma — Data
   Dybt indhold baseret på Annemarie Clements
   nervesystemsarbejde, tilpasset arbejdspladsen
   ═══════════════════════════════════════════ */

// ── Dynamiske SVG-cirkeltekster ──
const CIRKEL_TEKSTER = {
  centrum: {
    medarbejder: ["Stressregulering", "i din hverdag"],
    leder: ["Stressregulering", "i dit team"]
  },
  tilstande: {
    medarbejder: ["Tre tilstande", "i din arbejdsdag"],
    leder: ["Tre tilstande", "i dit team"]
  },
  ledelse: {
    medarbejder: ["Din leder", "og din trivsel"],
    leder: ["Dit lederskab", "og kulturen"]
  },
  samarbejde: {
    medarbejder: ["Dine", "samarbejds-", "mønstre"],
    leder: ["Teamets", "samarbejds-", "mønstre"]
  },
  krop: {
    medarbejder: ["Din krop", "i hverdagen"],
    leder: ["Bevægelse", "i teamet"]
  },
  aandedraet: {
    medarbejder: ["Dit åndedræt", "og dine pauser"],
    leder: ["Fælles pauser", "og åndedræt"]
  },
  resiliens: {
    medarbejder: ["Dit mentale", "overskud"],
    leder: ["Teamets resiliens", "og grænser"]
  }
};

// ── Cirkler: 3 lag per cirkel (overblik / dybde / øvelse) ──
const CIRKLER = {
  centrum: {
    titel: "Stressregulering på kontoret",
    ikon: "◉",
    medarbejder: {
      overblik: {
        beskrivelse: "Dit nervesystem er dit vigtigste arbejdsredskab. Når det er reguleret, tænker du klarere, samarbejder bedre og holder længere. Regulering er ikke et luksusprojekt — det er fundamentet for alt andet.",
        punkter: [
          "Tag micro-pauser mellem møder — bare 60 sekunder kan nulstille dit system",
          "Brug grounding: mærk fødderne mod gulvet, hænderne mod bordet",
          "Regulér dit miljø: juster lys, lyd og temperatur så det passer dig",
          "Læg mærke til hvornår du holder vejret — det er et tegn på spænding"
        ],
        tip: "Prøv det nu: Mærk dine fødder mod gulvet. Tag tre langsomme vejrtrækninger. Det er stressregulering."
      },
      dybde: [
        "Dit nervesystem styrer langt mere end du måske er bevidst om. Det regulerer hvordan du tænker, hvordan du samarbejder, hvordan du håndterer pres, og hvor hurtigt du bliver træt. Et nervesystem i balance giver dig adgang til kreativitet, overblik og empati — de kvaliteter der kendetegner godt arbejde. Når systemet er dysreguleret, mister du adgang til præcis de ressourcer du har mest brug for.",
        "Annemarie Clement kalder det 'nervesystemets nektar' — den daglige næring dit system har brug for for at fungere optimalt. Ligesom en plante har brug for vand og sollys hver dag, har dit nervesystem brug for regulering hver dag. Det er ikke noget du gør én gang og så er det fikset. Det er en daglig praksis, ligesom at børste tænder. Micro-pauser, bevidst åndedræt, grounding og sensorisk regulering er alle former for nektar.",
        "Forskningen bag dette er solid: dit autonome nervesystem har to hovedgrene — det sympatiske system der aktiverer dig, og det parasympatiske system der beroliorer dig. Vagusnerven er den primære nerve i det parasympatiske system, og den kan stimuleres direkte gennem åndedræt, berøring og bevægelse. Når du tager en forlænget udånding, aktiverer du bogstaveligt talt din krops beroligende system.",
        "I en arbejdsdag skifter du konstant mellem aktivering og ro. Problemet opstår når du bliver i aktivering for længe uden pauser — så begynder systemet at overbelaste. Det viser sig som irritabilitet, glemsomhed, indre uro, spændingshovedpine og dårlig søvn. Alt sammen signaler fra dit nervesystem om at det har brug for regulering. At lytte til disse signaler er ikke svaghed — det er intelligent selvledelse."
      ]
    },
    leder: {
      overblik: {
        beskrivelse: "Et reguleret team præsterer bedre. Som leder sætter du tonen for hele teamets nervesystem — din egen regulering smitter direkte over på dem omkring dig.",
        punkter: [
          "Start møder med et øjebliks stilhed — det regulerer hele rummet",
          "Skab pauser i kalenderen: 50-minutters møder i stedet for 60",
          "Vær opmærksom på teamets energiniveau og juster tempoet",
          "Model regulering: vis at det er okay at tage pauser"
        ],
        tip: "Som leder regulerer du ikke bare dig selv — du regulerer rummet. Dit nervesystem smitter."
      },
      dybde: [
        "Som leder er du den vigtigste reguleringsfaktor i dit team. Det er ikke en metafor — det er neurobiologi. Forskning i interpersonel neurobiologi viser at nervesystemer synkroniserer sig med hinanden, særligt i hierarkiske relationer. Dit teams nervesystemer orienterer sig bogstaveligt talt efter dit. Når du er rolig og fokuseret, skaber det en kaskadeeffekt af regulering i hele teamet.",
        "Dette fænomen hedder co-regulering, og det er en af de mest kraftfulde ledelsesmekanismer der findes. Co-regulering sker gennem dit tonefald, dit ansigtsudtryk, dit tempo og din kropslige tilstedeværelse. Når du starter et møde med ro i stedet for stress, sender du et neuroceptivt signal til hele rummet om at det er sikkert. Og det er først i denne sikkerhed at kreativitet, ærlighed og godt samarbejde kan udfolde sig.",
        "Konkret betyder det at din vigtigste forberedelse til ethvert møde ikke er slides — det er din egen regulering. Tag 60 sekunder inden du går ind i lokalet til at mærke dine fødder, tage tre dybe vejrtrækninger, og sætte en intention. Det lyder simpelt, men effekten er målbar. Teams med regulerede ledere rapporterer højere psykologisk tryghed, bedre beslutningskvalitet og lavere sygefravær.",
        "Skab strukturer der støtter regulering: 50-minutters møder i stedet for 60 giver alle en pause. Mødefrie perioder beskytter dybdearbejde. Synlige pauser fra din side giver permission til resten af teamet. Og husk: du kan ikke regulere dit team fra en tom tank. Din egen trivsel er ikke egoistisk — det er en ledelsesmæssig nødvendighed."
      ]
    }
  },

  tilstande: {
    titel: "Tre tilstande i din arbejdsdag",
    ikon: "◎",
    medarbejder: {
      overblik: {
        beskrivelse: "I løbet af en arbejdsdag skifter du mellem tre nervesystemstilstande. At genkende dem er første skridt til at regulere dig selv og vælge din respons.",
        punkter: [
          "<strong class='zone-sage'>Grøn tilstand:</strong> Du er fokuseret, kreativ og samarbejdende — her sker det bedste arbejde",
          "<strong class='zone-amber'>Gul tilstand:</strong> Du mærker stress, pres eller irritation — kroppen er i alarmberedskab",
          "<strong class='zone-rose'>Rød tilstand:</strong> Du er udmattet, lukket ned eller fraværende — energien er brugt op",
          "Det er normalt at skifte mellem tilstandene — det handler om at opdage skiftet og handle på det"
        ],
        tip: "Check ind med dig selv lige nu: Hvilken tilstand er du i? Der er intet forkert svar."
      },
      dybde: [
        "Dit nervesystem har tre fundamentalt forskellige tilstande der konstant skifter i løbet af din arbejdsdag. Denne model bygger på polyvagal teori, udviklet af professor Stephen Porges, og den forklarer hvorfor du nogle gange er i flow og andre gange helt låst. At forstå disse tre tilstande giver dig et konkret kort over din indre verden — og dermed mulighed for at navigere bevidst.",
        "Den grønne tilstand (ventral vagal) er din optimale arbejdstilstand. Her har du adgang til kreativitet, empati, overblik og nuanceret tænkning. Dit nervesystem signalerer sikkerhed, og det er først i denne tilstand at ægte samarbejde, innovation og kompleks problemløsning kan finde sted. Kroppen er afslappet men energisk, åndedrættes er dybt og roligt, og du føler dig tilstede og forbundet med dine kolleger.",
        "Den gule tilstand (sympatisk aktivering) er din alarmtilstand. Her forbereder kroppen sig på handling — hjertet slår hurtigere, musklerne spænder, åndedrættes bliver overfladisk. I arbejdslivet opleves det som stress, irritabilitet, rastløshed eller en følelse af at 'køre på højtryk'. I korte perioder er det funktionelt — det giver energi til deadlines og akutte opgaver. Men når du bliver i gul for længe uden pauser, begynder det at koste: fejl, konflikter, udmattelse.",
        "Den røde tilstand (dorsal vagal) er nedlukning. Her har nervesystemet opgivet kampen og trukket stikket. Du føler dig tom, fraværende, følelsesløs eller resigneret. I arbejdslivet viser det sig som at 'gå på autopilot', zone ud i møder, miste interesse eller føle sig helt afkoblet. Det er ikke dovenskab — det er et nervesystem der er overbelastet og har brug for genopladning.",
        "Nøglen er ikke at være i grøn hele tiden — det er urealistisk. Nøglen er at genkende dine skift og have redskaber til at vende tilbage. Annemarie Clement kalder dette 'nervesystemstrappen' — en trappe du kan bevæge dig op og ned af med bevidsthed. Hvert trin kræver forskellige strategier: fra rød til gul kræver det blid aktivering (bevægelse, koldt vand, social kontakt). Fra gul til grøn kræver det beroligelse (åndedræt, grounding, pauser)."
      ]
    },
    leder: {
      overblik: {
        beskrivelse: "Som leder kan du lære at aflæse dit teams tilstande og tilpasse din kommunikation derefter. Det er en af de mest effektive ledelseskompetencer der findes.",
        punkter: [
          "Et team i grøn tilstand er klar til kreativt og strategisk arbejde",
          "Et team i gul tilstand har brug for klarhed, struktur og tryghed",
          "Et team i rød tilstand har brug for pause, omsorg og reduceret belastning",
          "Spørg i 1:1-samtaler: 'Hvilken tilstand er du mest i for tiden?'"
        ],
        tip: "Start dit næste møde med: 'Giv et tal fra 1-10 for jeres energi lige nu.' Det åbner for ærlighed."
      },
      dybde: [
        "Din evne til at aflæse dit teams nervesystemstilstande er en af de mest værdifulde ledelseskompetencer du kan udvikle. Når du kan se om dit team er i grøn, gul eller rød, kan du tilpasse din kommunikation, dine forventninger og dine beslutninger derefter. Det er forskellen mellem at lede med eller mod nervesystemet.",
        "Et team i grøn tilstand er klar til det bedste arbejde. Her kan du stille de store spørgsmål, facilitere kreative workshops, og træffe vigtige beslutninger. Grøn tilstand kendetegnes af energi, humor, engagement og villighed til at tage risici. Planlæg dine vigtigste strategimøder og kreative sessioner til tidspunkter hvor teamet typisk er i grøn — ofte om formiddagen eller efter en god pause.",
        "Et team i gul tilstand har brug for noget helt andet: klarhed og struktur. Når nervesystemer er i alarm, har mennesker brug for at vide hvad der er vigtigst, hvad der kan vente, og at nogen har overblikket. Din vigtigste opgave her er at prioritere og fjerne usikkerhed. Sig højt: 'Her er de tre ting der er vigtigst nu. Resten venter.' Klarhed regulerer nervesystemer.",
        "Et team i rød tilstand producerer dårligt arbejde og risikerer fejl og sygemeldinger. Det er ikke tidspunktet for nye initiativer eller ekstra opgaver. Det er tidspunktet for at aflaste: aflys ikke-kritiske møder, fjern opgaver fra bordet, giv explicit permission til at sænke tempoet. Sig: 'Vi trækker vejret og prioriterer. Det er okay at gøre mindre lige nu.' Det kræver mod som leder, men det er det rigtige."
      ]
    }
  },

  ledelse: {
    titel: "Ledelse og arbejdskultur",
    ikon: "◈",
    medarbejder: {
      overblik: {
        beskrivelse: "Din relation til din leder og din oplevelse af kulturen påvirker dit nervesystem hver eneste dag. Psykologisk tryghed er ikke bare et buzzword — det er en neurobiologisk nødvendighed.",
        punkter: [
          "Psykologisk tryghed betyder at du kan sige 'jeg ved det ikke' uden frygt",
          "God feedback regulerer nervesystemet — dårlig feedback dysregulerer det",
          "Du har ret til at sætte grænser, også overfor din leder",
          "Søg alliancer: find kolleger der giver dig ro og energi"
        ],
        tip: "Tænk på én person på arbejdet der får dig til at føle dig tryg. Hvad gør de? Kan du gøre det samme for andre?"
      },
      dybde: [
        "Healing og trivsel sker først og fremmest i relationer — ikke i isolation. Det gælder også på arbejdspladsen. Din relation til din nærmeste leder er en af de mest afgørende faktorer for dit daglige velbefindende, og forskning viser at den påvirker alt fra søvnkvalitet til hjerte-kar-sundhed. Det er ikke overdrevet — det er neurobiologi.",
        "Psykologisk tryghed er det faglige begreb for en kultur hvor dit nervesystem kan være i grøn tilstand. Det betyder at du kan stille spørgsmål, indrømme fejl, bede om hjælp og komme med nye idéer uden at frygte straf eller ydmygelse. Når psykologisk tryghed mangler, skifter nervesystemet til gul alarm — og du bruger energi på selvbeskyttelse i stedet for godt arbejde.",
        "Din leders nervesystem smitter direkte over på dit. Forskning i interbrain synchrony viser at nervesystemer synkroniserer i relationer, særligt asymmetriske relationer som leder-medarbejder. Når din leder er stresset og reaktiv, aktiverer det automatisk dit alarmsystem. Når din leder er rolig og tilstede, giver det dit nervesystem signal om at det er sikkert. Det sker ubevidst og automatisk.",
        "Hvad kan du selv gøre? Søg co-regulering fra de kolleger der giver dig ro og energi — det er ikke tilfældigt, det er nervesystemer der matcher godt. Sæt bevidste grænser for hvad du siger ja til. Og husk at feedback der gives med respekt og specificiket regulerer dit system, mens feedback der gives i vrede eller med uklarhed dysregulerer det. Du har ret til at bede om feedback på en måde der fungerer for dig."
      ]
    },
    leder: {
      overblik: {
        beskrivelse: "Du er den vigtigste reguleringsfaktor i dit team. Din adfærd former kulturen — ikke dine ord, men din tilstedeværelse, dit tempo og din evne til at rumme.",
        punkter: [
          "Psykologisk tryghed skabes gennem konsistens, ikke perfektion",
          "Giv feedback der er specifik, rettidig og venlig — det regulerer",
          "Tillidsbaseret ledelse giver bedre resultater end kontrolbaseret",
          "Dine egne stressreaktioner smitter — regulér dig selv først"
        ],
        tip: "Spørg dit team: 'Hvad har I brug for fra mig for at trives?' Og lyt uden at forsvare dig."
      },
      dybde: [
        "Den terapeutiske relation er det vigtigste helingsredskab der findes — det gælder også i oversættelsen til arbejdspladsen. Som leder er din relation til hver enkelt medarbejder den mest afgørende faktor for deres trivsel og præstation. Ikke strategien, ikke værktøjerne, ikke processerne — relationen. Dit nervesystems tilstand kommunikerer konstant sikkerhed eller fare til dem omkring dig.",
        "Co-regulering er den biologiske mekanisme bag dette. Når du som leder er i en stabil, rolig tilstand (ventral vagal i nervesystemets sprog), påvirker det aktivt dine medarbejderes nervesystemer mod regulering. Det sker gennem dit tonefald, dit ansigtsudtryk, dit tempo og din kropsholdning. Mirror neurons — spejlneuroner — i dine medarbejderes hjerner aflæser konstant disse signaler og justerer deres egen tilstand derefter.",
        "Psykologisk tryghed skabes ikke gennem én stor gestus, men gennem hundredvis af små, konsistente handlinger over tid. Det er den måde du reagerer når nogen laver en fejl. Den måde du lytter når nogen er uenig. Den måde du anerkender sårbarhed. Forskning fra Google's Project Aristotle viste at psykologisk tryghed var den vigtigste faktor i high-performing teams — vigtigere end kompetencer, struktur eller ressourcer.",
        "Tillidsbaseret ledelse handler om at skabe rammerne og så stole på at mennesker leverer. Kontrolbaseret ledelse aktiverer nervesystemets alarm — det kommunikerer 'jeg stoler ikke på dig,' og det koster kreativitet, engagement og loyalitet. Start med at give mere autonomi end du er komfortabel med. Spørg 'Hvad har du brug for?' i stedet for at diktere løsninger. Og husk: du kan ikke skabe psykologisk tryghed i dit team hvis du ikke selv har det. Din egen regulering er forudsætningen."
      ]
    }
  },

  samarbejde: {
    titel: "Samarbejdsmønstre",
    ikon: "◇",
    medarbejder: {
      overblik: {
        beskrivelse: "Måden du samarbejder på blev grundlagt tidligt i dit liv som tilknytningsmønstre. At forstå dem giver dig friheden til at vælge en anden vej.",
        punkter: [
          "Nogle trækker sig under pres, andre bliver kontrolerende — begge er nervesystemreaktioner",
          "Tryg samarbejdsstil: du kan bede om hjælp og sige fra",
          "Utryg samarbejdsstil: du overarbejder for at bevise dit værd, eller undgår konflikter",
          "Bevidsthed om dine mønstre giver dig valget om at gøre noget anderledes"
        ],
        tip: "Næste gang du mærker spænding med en kollega, spørg dig selv: 'Er det situationen, eller er det et mønster jeg kender?'"
      },
      dybde: [
        "Måden du knytter dig til andre mennesker på blev grundlagt meget tidligt i dit liv — allerede fra de første levemåneder. Tilknytningsforskerne John Bowlby og Mary Ainsworth identificerede fire grundmønstre: tryg, undvigende, ambivalent og desorganiseret tilknytning. Disse mønstre er ikke bare barndomspsykologi — de former aktivt hvordan du fungerer som kollega, samarbejdspartner og teammedlem i dag.",
        "Tryg samarbejdsstil viser sig som fleksibilitet og balance. Du kan bede om hjælp uden at føle dig svag, sige fra uden at føle skyld, og håndtere uenighed uden at gå i panik eller lukke ned. Dit nervesystem har lært at relationer generelt er sikre, og det giver dig frihed til at fokusere på opgaven fremfor at navigere i frygt.",
        "Undvigende samarbejdsstil viser sig som overdreven selvstændighed. Du foretrækker at klare tingene selv, har svært ved at bede om hjælp, og trækker dig når det bliver følelsesmæssigt. I arbejdslivet kan det se ud som perfektionisme, isolation eller modvilje mod teamarbejde. Det er ikke arrogance — det er et nervesystem der har lært at nærhed er upålideligt.",
        "Ambivalent samarbejdsstil viser sig som overdreven tilpasning. Du siger ja til alt, arbejder over for at sikre dig accept, og har svært ved at sætte grænser. Du scanner konstant efter tegn på at andre er utilfredse med dig. I arbejdslivet kan det se ud som people-pleasing, overarbejde og en konstant følelse af ikke at være god nok. Dit nervesystem har lært at kærlighed og accept er betinget.",
        "Den gode nyhed er at disse mønstre kan ændres. Forskning i 'earned secure attachment' viser at nye, gentagende oplevelser af sikkerhed og pålidelighed i relationer kan omforme selv dybt indlejrede mønstre. På arbejdspladsen sker det gennem kolleger der er pålidelige, ledere der er konsistente, og en kultur der tillader fejl. Første skridt er bevidsthed: når du genkender dit mønster i en stressende situation, har du pludselig et valg."
      ]
    },
    leder: {
      overblik: {
        beskrivelse: "Forstå teamets samarbejdsmønstre for at skabe bedre dynamik og forebygge konflikter. Forskellige stilarter er ikke rigtige eller forkerte — de er overlevelsesstrategier.",
        punkter: [
          "Forskellige samarbejdsstile er strategier, ikke personlighedsfejl",
          "Skab klare roller og forventninger — det reducerer utryghed",
          "Facilitér aktiviteter der styrker tilhørsforhold og tillid",
          "Vær opmærksom på dem der bliver stille — de har ofte mest brug for dig"
        ],
        tip: "Overvej: Hvem i dit team har du mindst kontakt med? Ræk ud til dem denne uge."
      },
      dybde: [
        "Hvert medlem af dit team bringer deres tilknytningsmønster med ind i samarbejdet — ubevidst og automatisk. At forstå disse mønstre giver dig som leder et uvurderligt kort til at navigere i teamdynamik, forebygge konflikter og skabe de betingelser hvor hver enkelt kan præstere bedst.",
        "Medarbejdere med undvigende stil virker selvstændige og kompetente, men kan have svært ved at bede om hjælp eller dele viden. De trives med klare rammer og autonomi, men har brug for invitationer til samarbejde — de kommer sjældent af sig selv. Giv dem rum, men check ind regelmæssigt med konkrete spørgsmål: 'Hvad har du brug for fra mig lige nu?'",
        "Medarbejdere med ambivalent stil er ofte de mest engagerede og loyale, men de kan overarbejde sig selv i forsøget på at sikre accept. De har brug for eksplicit anerkendelse og tydelige forventninger — uklarhed aktiverer deres nervesystem. Sig direkte: 'Dit bidrag er værdifuldt. Du behøver ikke gøre mere.' Det regulerer.",
        "Din vigtigste opgave som leder er at skabe det der i tilknytningsteorien hedder 'en sikker base' — et fundament af forudsigelighed, tilgængelighed og responsivitet. Det betyder ikke at du skal være perfekt. Det betyder at du skal være konsistent: reagere nogenlunde ens på fejl, holde dine løfter, og vise at du er tilgængelig når det er svært. Det er earned secure attachment i ledelseskontekst."
      ]
    }
  },

  krop: {
    titel: "Krop og bevægelse i hverdagen",
    ikon: "○",
    medarbejder: {
      overblik: {
        beskrivelse: "Din krop er ikke bare transport til hovedet. Den er en aktiv del af hvordan du tænker, føler og præsterer. Kroppen husker, kroppen signalerer, kroppen regulerer.",
        punkter: [
          "Stillesiddende arbejde aktiverer stressresponsen over tid",
          "Rejs dig og bevæg dig hvert 45. minut — det nulstiller systemet",
          "Skrivebords-stretching: rul skuldrene, drej nakken, stræk armene",
          "Gå-møder aktiverer kreativiteten og regulerer nervesystemet"
        ],
        tip: "Rejs dig op lige nu. Rul skuldrene tre gange. Mærk forskellen. Det tager 10 sekunder."
      },
      dybde: [
        "Din krop husker alt hvad du har oplevet — både de gode og de svære erfaringer lagres som mønstre i muskelspænding, åndedræt og kropsholdning. Det er ikke poetisk — det er fysiologi. Fascia, dit krops bindevæv, er et af de mest innerverede vævstyper i kroppen med millioner af sensoriske nerveender. Når du sidder spændt foran en skærm i timevis, akkumuleres spænding i fascia der sender konstante stresssignaler til dit nervesystem.",
        "Annemarie Clements kropslige tilgang bygger på forståelsen af at kroppen besidder en iboende visdom om hvad den har brug for — vi har bare glemt at lytte. Interoception, evnen til at mærke kroppens indre signaler, er en fundamental reguleringsevne. Når du kan mærke at skuldrene er oppe om ørerne, at maven er knuget, at kæben er spændt, har du information om dit nervesystems tilstand — og dermed mulighed for at handle.",
        "Stillesiddende arbejde er ikke bare skadeligt for ryggen — det er skadeligt for dit nervesystem. Kroppen er designet til bevægelse, og immobilitet aktiverer over tid det samme system som 'freeze'-responsen i nervesystemet. Forskning viser at allerede 45 minutter uden bevægelse begynder at påvirke stresshormonniveauer. Modgiften er enkel: rejs dig, bevæg dig, stræk. Det behøver ikke være træning — bare bevægelse.",
        "Gå-møder er en af de mest undervurderede reguleringsstrategier på arbejdspladsen. Når du går, aktiverer du dit nervesystems bevægelsessystem på en måde der naturligt regulerer arousal. Samtaler under gåture bliver ofte dybere og mere ærlige, fordi den side-om-side bevægelse føles mindre konfronterende end ansigt-til-ansigt ved et bord. Kroppen ved hvad den har brug for — din opgave er at lytte og handle."
      ]
    },
    leder: {
      overblik: {
        beskrivelse: "Skab en kultur hvor bevægelse er en del af arbejdsdagen, ikke en afbrydelse af den.",
        punkter: [
          "Indfør gå-møder for 1:1-samtaler — det ændrer både samtalen og energien",
          "Gør det legitimt at rejse sig og bevæge sig under møder",
          "Stå-borde og fleksible arbejdspladser støtter kroppens behov",
          "Ergonomi er ikke luksus — det er nervesystem-støtte"
        ],
        tip: "Foreslå et gå-møde denne uge. Det ændrer både samtalen og energien."
      },
      dybde: [
        "Kroppen og nervesystemet udgør en uadskillelig helhed — du kan ikke regulere nervesystemet uden at involvere kroppen. Som leder har du mulighed for at skabe en kultur hvor kropslig bevidsthed og bevægelse er en naturlig del af arbejdsdagen, ikke noget der kun sker i fitnesscenteret efter kl. 17.",
        "Bevægelse i arbejdstiden er ikke spildtid — det er investering i regulering, kreativitet og præstation. Forskning viser at korte bevægelsespauser forbedrer koncentration, reducerer stresshormoner og styrker immunforsvaret. Når du som leder selv rejser dig, strækker dig eller foreslår et gå-møde, giver du dit team permission til at gøre det samme.",
        "Ergonomi handler ikke bare om stole og skærme — det handler om at skabe fysiske rammer der støtter nervesystemets behov. Variation er nøglen: mulighed for at stå, sidde, bevæge sig. Naturligt lys påvirker cortisol-rytmer. Temperatur og lyd påvirker arousal-niveau. At investere i det fysiske arbejdsmiljø er at investere direkte i dit teams nervesystemregulering."
      ]
    }
  },

  aandedraet: {
    titel: "Åndedræt og pauser",
    ikon: "◌",
    medarbejder: {
      overblik: {
        beskrivelse: "Dit åndedræt er den hurtigste og mest direkte vej til at regulere dit nervesystem. Det kræver ingen udstyr, ingen app — du har det altid med dig.",
        punkter: [
          "4-7-8 åndedræt: 4 sek ind, 7 sek hold, 8 sek ud — beroligende",
          "Box breathing: 4 sek ind, 4 sek hold, 4 sek ud, 4 sek hold — fokuserende",
          "Forlænget udånding aktiverer dit beroligende nervesystem direkte",
          "Bare tre bevidste vejrtrækninger kan ændre din tilstand målbart"
        ],
        tip: "Prøv det nu: Indånd 4 sekunder, hold 4 sekunder, udånd 4 sekunder, hold 4 sekunder. Gentag to gange."
      },
      dybde: [
        "Vagusnerven er motorvejen mellem din hjerne og din krop — den længste nerve i dit autonome nervesystem. Når du aktiverer den gennem bevidst åndedræt, sender du et direkte signal til hjernen om at det er sikkert at slappe af. Det er ikke mystik — det er fysiologi. Vagusnerven stimuleres særligt effektivt af forlænget udånding, dybt åndedræt og summende lyde.",
        "Respiratorisk sinus arrhytmi (RSA) er et mål for din vagale tone — altså dit nervesystems grundlæggende reguleringskapacitet. Når du indånder, stiger din puls let. Når du udånder, falder den. Denne naturlige variation er et sundhedstegn. Når du bevidst forlænger din udånding, forstærker du denne effekt og aktiverer det parasympatiske system direkte. Derfor virker 4-7-8 åndedræt: fordi udåndingen (8 sekunder) er dobbelt så lang som indåndingen (4 sekunder).",
        "Box breathing (4-4-4-4) bruges af Navy SEALs, eliteatleter og kirurger til at opretholde præstation under ekstremt pres. Det virker ved at skabe en regelmæssig rytme der stabiliserer det autonome nervesystem. I arbejdslivet er det ideelt før præsentationer, svære samtaler eller i deadline-pres. Du kan gøre det diskret ved skrivebordet — ingen behøver at vide det.",
        "Det vigtigste at forstå er at bare tre bevidste vejrtrækninger kan ændre din fysiologiske tilstand. Du behøver ikke 20 minutters meditation — du har brug for mikro-doser af bevidst åndedræt spredt over din dag. Før du svarer på en provokerende mail: tre vejrtrækninger. Mellem to møder: tre vejrtrækninger. Når du mærker indre uro: tre vejrtrækninger. Det er den mest tilgængelige reguleringsøvelse der findes."
      ]
    },
    leder: {
      overblik: {
        beskrivelse: "Kollektive åndedrætspauser er et af de mest effektive og evidensbaserede værktøjer til teamregulering.",
        punkter: [
          "Start møder med 30 sekunders stille åndedræt — det samler og regulerer gruppen",
          "Indbyg bevidste pauser i lange workshops og strategi-dage",
          "Model det selv: tag en synlig vejrtrækning før du taler",
          "Det er ikke 'mærkeligt' — det er evidensbaseret og effektivt"
        ],
        tip: "Start dit næste møde med: 'Lad os lige lande. Tre vejrtrækninger sammen.' Se hvad der sker."
      },
      dybde: [
        "Kollektiv åndedræt er en af de mest kraftfulde co-reguleringsstrategier der findes. Når en gruppe ånder sammen, synkroniserer deres nervesystemer sig — det er den biologiske mekanisme bag hvorfor sang, meditation og fælles bevægelse føles samlende. Du kan bruge dette bevidst som ledelsesredskab.",
        "Start med 30 sekunders stille åndedræt i starten af møder. Sig simpelthen: 'Lad os lige lande. Tre dybe vejrtrækninger sammen, så vi er tilstede.' De første gange vil det måske føles uvant, men de fleste teams opdager hurtigt at det ændrer hele mødets kvalitet. Folk er mere lyttende, mere ærlige og mere fokuserede.",
        "Under lange workshops og strategi-dage er bevidste pauser ikke spildtid — de er produktivitetstid. Forskning viser at koncentrationsevnen falder markant efter 45-60 minutter. En 5-minutters pause med bevidst åndedræt genoploader nervesystemet og giver bedre kvalitet i den næste arbejdsblok end hvis man kørte igennem. Hjernen har brug for pauser til at konsolidere og integrere information."
      ]
    }
  },

  resiliens: {
    titel: "Mentalt pres og resiliens",
    ikon: "◆",
    medarbejder: {
      overblik: {
        beskrivelse: "Overbelastning er ikke et tegn på svaghed — det er et signal fra dit nervesystem om at noget skal ændres. Resiliens er ikke at holde ud, men at vide hvornår du skal stoppe.",
        punkter: [
          "Tegn på overbelastning: du zoner ud, glemmer ting, føler dig følelsesløs",
          "Burnout kommer sjældent pludseligt — det bygger sig op over uger og måneder",
          "Sæt bevidste grænser: 'Jeg svarer ikke på mails efter kl. 18'",
          "Resiliens handler om recovery, ikke udholdenhed"
        ],
        tip: "Hvornår havde du sidst en hel weekend uden arbejdstanker? Hvis du ikke kan huske det, er det et signal."
      },
      dybde: [
        "Overbelastning er ikke et personligt svigt — det er en fysiologisk tilstand der kan forklares og forstås. Når du udsættes for vedvarende stress uden tilstrækkelig recovery, begynder dit nervesystem at miste sin fleksibilitet. HPA-aksen (din krops stressresponssystem) kører i overarbejde, cortisol-niveauerne forskubbes, og dit system mister evnen til at skifte mellem aktivering og hvile. Det er ikke mental svaghed — det er autonomisk udmattelse.",
        "Burnout er ikke bare at være træt. Det er når nervesystemet har brugt sine ressourcer og skifter til en kronisk dorsal vagal tilstand — nedlukning. Du mister interesse i ting der plejede at engagere dig, du føler dig kynisk eller afkoblet, og din præstation falder. Det kommer sjældent pludseligt — det bygger sig op over uger og måneder af manglende recovery. Signalerne er der tidligt: dårlig søvn, irritabilitet, glemsomhed, social tilbagetrækning.",
        "Resiliens er ikke evnen til at holde ud — det er evnen til at vende tilbage. Forskning viser at de mest resiliente mennesker ikke er dem der aldrig bliver ramt af stress, men dem der har effektive recovery-strategier. Det er forskellen mellem en bold der bouncer tilbage og en der flad. Recovery kræver bevidste handlinger: grænser for arbejdstid, ægte pauser (ikke scroll på telefonen), bevægelse, social kontakt udenfor arbejdet, og nok søvn.",
        "Grænser er nervesystemets vigtigste beskyttelse. Hvert 'ja' du siger til en opgave er et 'nej' til noget andet — ofte til din egen recovery. At sætte grænser er ikke egoistisk; det er neurobiologisk nødvendigt. Prøv dette: vælg én grænse du vil sætte denne uge. Måske 'ingen mails efter kl. 18' eller 'frokostpause uden skærm.' Start småt, vær konsistent, og mærk forskellen."
      ]
    },
    leder: {
      overblik: {
        beskrivelse: "Forebyg overbelastning i dit team ved at skabe en kultur hvor grænser er legitime og recovery er værdsat.",
        punkter: [
          "Hold øje med adfærdsændringer: den energiske der bliver stille, den præcise der glemmer",
          "Spørg direkte i 1:1: 'Hvordan har du det egentlig?' — og vent på svaret",
          "Fordel opgaver ud fra kapacitet, ikke bare kompetence",
          "Gør det okay at sige 'Jeg har for meget lige nu'"
        ],
        tip: "Tjek ind med dig selv: Er du selv i risiko for overbelastning? Du kan ikke støtte andre fra en tom tank."
      },
      dybde: [
        "Som leder er du i en unik position til at forebygge overbelastning — men kun hvis du selv er reguleret nok til at se signalerne. De tidligste tegn på overbelastning hos en medarbejder er subtile: den normalt energiske der bliver stille, den præcise der begynder at glemme, den humoristiske der bliver irritabel. Disse ændringer er nervesystemets signaler om at noget er ved at tippe.",
        "Den vigtigste intervention er den simpleste: spørg direkte og lyt ægte. '1:1-samtalen er din vigtigste reguleringsarena. Spørg: 'Hvordan har du det egentlig — ikke bare med arbejdet, men generelt?' Og vent derefter. Tavshed er okay. Mange medarbejdere har aldrig oplevet at en leder virkelig ville høre svaret. Din tålmodige tilstedeværelse er i sig selv co-regulering.",
        "Fordel opgaver ud fra kapacitet, ikke bare kompetence. Den dygtigste medarbejder er ikke nødvendigvis den der skal have den næste opgave — måske er de allerede overbelastet. Og skab eksplicit legitimitet for at sige stop: sig selv højt 'Jeg har for meget lige nu, dette må vente.' Når du modellerer grænser, giver du dit team permission til at gøre det samme.",
        "Husk også dig selv. Ledere har den højeste risiko for overbelastning, fordi de bærer andres byrder oven i deres egne. Du kan ikke regulere dit team fra en tom tank. Din egen recovery, dine egne grænser, dit eget velbefindende er ikke en luksus — det er en forudsætning for ansvarlig ledelse."
      ]
    }
  }
};

// ── Nervesystemstrappen (3 niveauer) ──
const TRAPPEN = {
  groen: {
    navn: "Grøn tilstand",
    undertitel: "Sikkerhed og forbindelse",
    farve: "sage",
    medarbejder: {
      beskrivelse: "Du er reguleret og i balance. Dit nervesystem signalerer sikkerhed, og du har adgang til dine bedste ressourcer: kreativitet, empati, overblik og nuanceret tænkning. Det er her det bedste arbejde sker.",
      kropsSignaler: [
        "Vejrtrækningen er dyb og rolig",
        "Skuldrene er sænkede, kæben afslappet",
        "Du føler dig tilstede og forbundet",
        "Du kan tænke klart og se nuancer",
        "Du har overskud til humor og nysgerrighed"
      ],
      handling: "Brug denne tilstand: Tag den sværeste eller vigtigste opgave nu. Dit nervesystem er klar til kompleks tænkning, kreativt arbejde og vigtige samtaler.",
      oevelse: "Mærk denne tilstand bevidst — læg mærke til hvordan kroppen føles lige nu. Jo bedre du kender din grønne tilstand, desto hurtigere kan du finde tilbage til den."
    },
    leder: {
      beskrivelse: "Teamet er i en optimal tilstand for kreativt og strategisk arbejde. Nervesystemerne signalerer sikkerhed, og der er plads til ærlighed, risiko-tagning og innovation.",
      kropsSignaler: [
        "Teamet er energisk og engageret",
        "Der er naturlig humor og lethed i rummet",
        "Folk lytter aktivt til hinanden",
        "Idéer flyder frit og der er villighed til at eksperimentere",
        "Konflikter håndteres konstruktivt"
      ],
      handling: "Planlæg kreative sessioner, strategimøder og vigtige beslutninger til dette tidspunkt. Det er her I kan tage de store skridt.",
      oevelse: "Navngiv det for teamet: 'Vi er i et godt sted lige nu — lad os bruge det.' Bevidsthed om den gode tilstand forstærker den."
    }
  },
  gul: {
    navn: "Gul tilstand",
    undertitel: "Aktivering og alarm",
    farve: "amber",
    medarbejder: {
      beskrivelse: "Dit nervesystem er aktiveret — det forbereder sig på handling. Det er ikke farligt i sig selv, men det er et signal om at du har brug for regulering. Undgå store beslutninger lige nu.",
      kropsSignaler: [
        "Hjertet slår hurtigere, hænderne er måske svede",
        "Åndedrættes er overfladisk og hurtigt",
        "Skuldrene er oppe, kæben er spændt",
        "Du føler dig rastløs, irritabel eller utålmodig",
        "Du har svært ved at lytte og vil helst bare handle"
      ],
      handling: "Pause først, handling bagefter. Dit nervesystem er i alarm, og beslutninger taget herfra er ofte reaktive. Regulér dig selv ned før du reagerer på den provokerende mail eller den stressende deadline.",
      oevelse: "Sæt begge fødder på gulvet. Tag 4 langsomme vejrtrækninger med forlænget udånding (4 sek ind, 6-8 sek ud). Mærk skuldrene sænke sig. Du bevæger dig ned ad trappen."
    },
    leder: {
      beskrivelse: "Teamet er under pres og nervesystemerne er i alarm. Der er brug for klarhed, struktur og tryghed — ikke flere opgaver.",
      kropsSignaler: [
        "Tempoet er skruet op, folk taler hurtigere",
        "Der er kortere tålmodighed og flere afbrydelser",
        "Humoren forsvinder, stemningen er anspændt",
        "Folk arbejder i siloer og kommunikerer mindre",
        "Fejl og misforståelser stiger"
      ],
      handling: "Skab klarhed og prioritering. Sig højt: 'Hvad er det vigtigste vi skal nå? Hvad kan vente?' Fjern usikkerhed — det er det mest regulerende du kan gøre for et presset team.",
      oevelse: "Saml teamet kort. Brug 30 sekunder på fælles åndedræt. Prioritér tre ting. Fjern alt andet fra bordet. Klarhed regulerer."
    }
  },
  roed: {
    navn: "Rød tilstand",
    undertitel: "Nedlukning og udmattelse",
    farve: "rose",
    medarbejder: {
      beskrivelse: "Dit system er overbelastet eller lukket ned. Det er ikke et tegn på svaghed — det er dit nervesystems nødstop. Du har brug for genopladning og omsorg, ikke præstation.",
      kropsSignaler: [
        "Du føler dig tom, flad eller følelsesløs",
        "Alt føles tungt og meningsløst",
        "Du har svært ved at koncentrere dig, zoner ud",
        "Du har lyst til at isolere dig eller 'gemme dig'",
        "Kroppen føles tung, du er udmattet men kan måske ikke sove"
      ],
      handling: "Det vigtigste lige nu er omsorg, ikke præstation. Rejs dig. Gå væk fra skærmen i 10 minutter. Drik vand. Mærk dine fødder mod gulvet. Du behøver ikke præstere lige nu.",
      oevelse: "Blid bevægelse er vejen op fra rød: rejs dig langsomt, stræk armene, gå et par skridt. Mærk kontakten med gulvet. Kold vand i ansigtet. Ring til en person der giver dig ro. Du er ikke alene med dette."
    },
    leder: {
      beskrivelse: "Teamet er udkørt. Nervesystemerne er i nedlukning, og der produceres dårligt arbejde med risiko for fejl og sygemeldinger. Det er tid til akut aflastning.",
      kropsSignaler: [
        "Folk virker fraværende og uengagerede",
        "Der er stilhed — men ikke den gode slags",
        "Sygefravær stiger, folk melder sig syge oftere",
        "Kvaliteten falder, deadlines glipper",
        "Kynisme og resignation præger samtaler"
      ],
      handling: "Aflys ikke-kritiske møder. Fjern opgaver fra bordet. Sig højt: 'Vi trækker vejret og prioriterer. Det er okay at gøre mindre lige nu.' Det kræver mod, men det er det ansvarlige.",
      oevelse: "Model omsorg: send teamet tidligt hjem en dag. Annullér en deadline. Spørg hver enkelt: 'Hvad har du brug for lige nu?' — og mene det. Recovery er ikke luksus, det er nødvendigt."
    }
  }
};

// ── Temaer med dybt indhold ──
const TEMA_INDHOLD = {
  generelt: {
    titel: "Hverdagens trivsel",
    ikon: "☀",
    medarbejder: {
      intro: "Trivsel er ikke noget der sker af sig selv — det er en daglig praksis. Ligesom dit nervesystem har brug for 'nektar' hver dag, har din arbejdsdag brug for bevidste ritualer der støtter din regulering og dit velbefindende.",
      tekst: "Start din dag med et bevidst check-in: Hvilken tilstand er du i? Hvad har du brug for? Små daglige ritualer bygger langsigtet trivsel — det er den daglige konsistens, ikke de store gestusser, der skaber forandring. En morgenrutine med tre vejrtrækninger, en frokostpause uden skærm, et afslutningsritual sidst på dagen. Disse små handlinger sender gentagne signaler til dit nervesystem om at du tager vare på det.",
      relateredeCirkler: ["centrum", "tilstande", "aandedraet"]
    },
    leder: {
      intro: "Kultur bygges i hverdagen — ikke på seminarer. De små daglige handlinger og ritualer former dit teams nervesystem langt mere end kvartalsvise wellness-initiativer.",
      tekst: "Skab daglige rutiner der støtter trivsel: korte check-ins om morgenen, bevidste pauser mellem møder, synlig omsorg i 1:1-samtaler. Det behøver ikke være stort. Et 'Hvordan har du det?' der er ægte ment. En 50-minutters mødestandard der giver alle en pause. En kultur hvor det er okay at sige 'jeg har brug for fem minutter.' Disse mikrohandlinger akkumulerer over tid til en fundamentalt anderledes oplevelse af at gå på arbejde.",
      relateredeCirkler: ["centrum", "ledelse", "tilstande"]
    }
  },
  moeder: {
    titel: "Møder — tilstedeværelse og regulering",
    ikon: "◉",
    medarbejder: {
      intro: "Møder er nervesystemets stresstest. Flere mennesker, forskellige energier, forventninger og tidspres — alt sammen i ét rum. Din forberedelse handler ikke kun om indholdet.",
      tekst: "Mød forberedt — ikke bare fagligt, men nervemæssigt. Et reguleret nervesystem gør dig til en bedre lytter, en klarere kommunikatør og en mere kreativ bidragyder. Tag 60 sekunder før hvert møde til at lande: mærk fødderne, tag tre vejrtrækninger, sæt en intention. Under mødet: mærk efter om du lytter eller allerede formulerer dit svar. Hvis du mærker irritation eller utålmodighed, er det dit nervesystem der skifter til gul — tag en bevidst vejrtrækning under bordet.",
      relateredeCirkler: ["aandedraet", "tilstande", "samarbejde"]
    },
    leder: {
      intro: "Som mødeleder sætter du den neuroceptive tone for hele rummet. Din regulering — eller mangel på samme — påvirker hvert eneste nervesystem i lokalet.",
      tekst: "Start møder med landing — 30 sekunders stilhed eller tre fælles vejrtrækninger. Hold dem korte: 50 minutter maks. Giv plads til stilhed efter at nogen har talt — det signalerer at du virkelig lytter. Et reguleret møde er et produktivt møde. Og husk: de vigtigste signaler du sender er nonverbale. Dit tempo, dit ansigtsudtryk, din evne til at tåle tavshed — alt dette læses af dine medarbejderes nervesystemer og former deres oplevelse af mødet.",
      relateredeCirkler: ["ledelse", "aandedraet", "centrum"]
    }
  },
  deadlines: {
    titel: "Deadlines & pres — når tiden presser",
    ikon: "⏱",
    medarbejder: {
      intro: "Under pres skifter dit nervesystem til overlevelsesmode — og præcis de kognitive funktioner du har mest brug for (kreativitet, overblik, præcision) lukker ned. At regulere under pres er ikke luksus — det er din vigtigste kompetence.",
      tekst: "Når deadline presser, er dit nervesystem i gul alarm — hjertet banker, musklerne spænder, åndedrættes bliver overfladisk. Det er funktionelt i korte stød, men over timer og dage koster det kvalitet og helbred. Genkend tilstanden og regulér aktivt: box breathing mellem opgaver, micro-pauser hvert 45. minut, nok vand. Kvaliteten stiger når nervesystemet er med. Det virker kontraintuitivt at tage pauser under pres, men forskning viser konsistent at regulerede arbejdsblokke producerer bedre resultater end uafbrudt stress-arbejde.",
      relateredeCirkler: ["tilstande", "aandedraet", "resiliens"]
    },
    leder: {
      intro: "Når teamet er under pres, er din vigtigste opgave ikke at tilføje mere — det er at fjerne. Klarhed og prioritering er de mest regulerende interventioner en leder kan lave.",
      tekst: "Under deadline-pres er dit teams nervesystemer i gul alarm. De har brug for én ting frem for alt: klarhed om hvad der er vigtigst. Sig højt: 'Her er de tre ting vi fokuserer på. Alt andet venter.' Fjern støj, ikke tilføj den. Og tjek ind med dig selv: er dit eget stressniveau noget du sender videre til teamet? Din regulering — eller mangel på samme — forstærkes i et presset team. Tag en vejrtrækning inden du går ind i lokalet.",
      relateredeCirkler: ["ledelse", "tilstande", "centrum"]
    }
  },
  skaerm: {
    titel: "Skærmarbejde — krop og sind ved skærmen",
    ikon: "▢",
    medarbejder: {
      intro: "Skærmen fastholder dig i hovedet og afbryder forbindelsen til kroppen. Over tid kan det ligne en mild form for dissociation — du er 'oppe i tankerne' men mister kontakten med resten af dig selv.",
      tekst: "Skærmen er en dissociationsmaskin: den holder din opmærksomhed fast i et lille visuelt felt og afbryder kontakten med kroppen. Hvert 45. minut: rejs dig, bevæg dig, kig væk. Mærk dine fødder. Rul skuldrene. Din krop er ikke bare en holder til dit hoved. Indfør 20-20-20 reglen: hvert 20. minut, kig på noget 20 meter væk i 20 sekunder. Det giver øjnene og nervesystemet en micro-pause. Og husk at skifte position: stå, sid, bevæg dig. Variation er dit nervesystems ven.",
      relateredeCirkler: ["krop", "centrum", "aandedraet"]
    },
    leder: {
      intro: "Kontinuerlig skærmtid er en af de mest oversete stressfaktorer i moderne arbejdsliv. Skab rammer der beskytter dit teams krop og hjerne.",
      tekst: "Gør det legitimt at tage skærmpauser — det er ikke dovenskab, det er nervesystemshygiejne. Indfør mødefrie perioder der beskytter dybdearbejde. Skab rum for analog tænkning: whiteboards, post-its, gåture. Jo mere skærmtid, desto vigtigere er bevidste pauser. Og vær opmærksom på den usynlige belastning af back-to-back online møder — det er mere udmattende end fysiske møder, fordi hjernen arbejder hårdere på at aflæse sociale signaler gennem en skærm.",
      relateredeCirkler: ["krop", "aandedraet", "resiliens"]
    }
  },
  konflikter: {
    titel: "Konflikter — spændinger og uenigheder",
    ikon: "⬡",
    medarbejder: {
      intro: "Konflikter aktiverer nervesystemet øjeblikkeligt — det er en af de stærkeste triggers der findes, fordi vores system er dybt programmeret til at reagere på social trussel.",
      tekst: "Før du reagerer: regulér. Mærk. Navngiv. Vælg derefter din respons — ikke din reaktion. Konflikter aktiverer de ældste dele af dit nervesystem, og din reaktion (kamp, flugt eller frys) afspejler ofte gamle mønstre mere end den aktuelle situation. Parkér konflikten bevidst hvis du er i gul eller rød tilstand: 'Jeg vil gerne tale om det her, men jeg har brug for 30 minutter først.' Det er ikke undvigelse — det er intelligent selvregulering der giver dig adgang til dine bedste kommunikationsevner.",
      relateredeCirkler: ["samarbejde", "tilstande", "resiliens"]
    },
    leder: {
      intro: "Konflikter er uundgåelige i ethvert team. Din opgave er ikke at undgå dem, men at skabe en kultur hvor uenighed er tryg og hvor konflikter løses — ikke gemmes.",
      tekst: "Konflikter der ikke adresseres, går ikke væk — de går under jorden og forgifter kulturen langsomt. Din opgave som leder er at skabe rammer hvor uenighed kan udtrykkes trygt. Det kræver at du selv kan rumme ubehaget: at sidde med spænding uden at løse den for hurtigt, at lytte til begge sider uden at dømme, at anerkende følelser uden at feje dem af bordet. Og husk: din egen konfliktprofil (kamp, flugt, frys) aktiveres også — regulér dig selv først, facilitér bagefter.",
      relateredeCirkler: ["ledelse", "samarbejde", "centrum"]
    }
  },
  balance: {
    titel: "Work-life balance — grænser og genopladning",
    ikon: "☯",
    medarbejder: {
      intro: "Balance er ikke 50/50 — det er at vide hvornår du skal give, og hvornår du skal stoppe. Dine grænser er ikke egoistiske. De er neurobiologisk nødvendige.",
      tekst: "Dit nervesystem har en endelig kapacitet — og den genopfyldes kun gennem ægte recovery. Det betyder ikke bare at stoppe med at arbejde, men aktivt at gøre ting der regulerer: bevægelse, natur, social kontakt, søvn, kreative aktiviteter. Scroll på telefonen er ikke recovery — det er stimulering. Bevidste grænser for arbejdstid, tilgængelighed og ansvar er ikke luksus. De er den mest basale form for nervesystemsbeskyttelse. Start med én grænse denne uge og vær konsistent med den.",
      relateredeCirkler: ["resiliens", "krop", "centrum"]
    },
    leder: {
      intro: "Du sætter standarden. Hvis du sender mails kl. 22, gør dit team det også. Model den balance du ønsker for dit team.",
      tekst: "Som leder er du den mest synlige rollemodel for balance. Dine handlinger taler højere end dine ord — hvis du siger 'tag fri' men sender mails i weekenden, er det mailen dit team hører. Model bevidste grænser: lad være med at sende efter kl. 18, tag synlige ferier, og sig nej til ting. Og skab strukturer der støtter balance: fleksibilitet i arbejdstider, respekt for ferie og fridage, og en eksplicit forventning om at recovery er en del af jobbet, ikke noget der sker trods jobbet.",
      relateredeCirkler: ["ledelse", "resiliens", "centrum"]
    }
  }
};

// ── Øvelser (8 stk) ──
const OEVELSER = [
  {
    titel: "Skrivebordsgrounding",
    tid: "2 min",
    sted: "Ved skrivebordet",
    cirkel: "centrum",
    temaer: ["generelt", "skaerm"],
    intro: "Denne øvelse er kernen i Clements tilgang til arbejdspladsen. Ved at lande i kroppen og mærke kontakten med omgivelserne, aktiverer du den del af nervesystemet der skaber ro og sikkerhed. Det er simpelt, men virkningen er dyb.",
    steps: [
      "Mærk dine fødder mod gulvet. Pres dem let ned — mærk underlaget.",
      "Mærk hænderne mod bordet eller tastaturet. Mærk temperaturen og teksturen.",
      "Tag tre dybe vejrtrækninger — indånd gennem næsen, udånd langsomt gennem munden.",
      "Kig på tre ting i rummet og navngiv dem stille for dig selv.",
      "Mærk temperaturen i rummet. Lyt til én lyd. Du er her. Du er tilstede."
    ]
  },
  {
    titel: "Møde-reset",
    tid: "1 min",
    sted: "Mødelokalet",
    cirkel: "aandedraet",
    temaer: ["moeder"],
    intro: "Et reguleret nervesystem gør dig til en bedre lytter og klarere kommunikatør. Denne øvelse bruger 4-7-8 åndedrættet til at aktivere dit beroligende system inden et møde, så du møder op med tilstedeværelse i stedet for stress.",
    steps: [
      "Find din plads i mødelokalet. Sæt dig med begge fødder på gulvet.",
      "Pust ind gennem næsen i 4 sekunder.",
      "Hold vejret i 7 sekunder.",
      "Pust langsomt ud gennem munden i 8 sekunder.",
      "Gentag to gange. Sæt derefter en intention: Hvad vil du bidrage med? Hvad har du brug for?"
    ]
  },
  {
    titel: "Deadline-åndedræt",
    tid: "3 min",
    sted: "Hvor som helst",
    cirkel: "tilstande",
    temaer: ["deadlines"],
    intro: "Under pres skifter kroppen til alarmberedskab. Denne øvelse bruger box breathing — den teknik Navy SEALs bruger under ekstremt pres — til at stabilisere dit nervesystem midt i deadline-stormen.",
    steps: [
      "Check ind: Hvilken tilstand er du i? Gul? Rød? Navngiv den.",
      "Box breathing: Pust ind i 4 sekunder.",
      "Hold vejret i 4 sekunder.",
      "Pust ud i 4 sekunder.",
      "Hold vejret i 4 sekunder. Gentag hele cyklussen 4 gange.",
      "Check ind igen: Har tilstanden ændret sig? Ofte er du flyttet et trin ned på trappen."
    ]
  },
  {
    titel: "Konflikt-parkering",
    tid: "5 min",
    sted: "Et stille sted",
    cirkel: "resiliens",
    temaer: ["konflikter"],
    intro: "Konflikter aktiverer nervesystemets ældste forsvarsmekanismer. Denne øvelse hjælper dig med at parkere den akutte reaktion, så du kan vende tilbage med et reguleret system og vælge din respons bevidst.",
    steps: [
      "Gå et stille sted hen — tomt mødelokale, trappeopgang, udendørs.",
      "Navngiv følelsen: Hvad mærker du? Frustration? Uretfærdighed? Angst? Sorg?",
      "Mærk hvor i kroppen følelsen sidder. Maven? Brystet? Kæben? Skuldrene?",
      "Ånd ind i det område. Ikke for at ændre det — bare for at mærke det.",
      "Spørg dig selv: 'Hvad har jeg brug for lige nu?' (ikke 'Hvad skal den anden gøre?')",
      "Parkér situationen bevidst: 'Jeg vender tilbage med et reguleret nervesystem.'"
    ]
  },
  {
    titel: "Afslutningsritual",
    tid: "3 min",
    sted: "Ved skrivebordet, sidst på dagen",
    cirkel: "resiliens",
    temaer: ["balance"],
    intro: "Overgangen fra arbejde til fri er en af dagens vigtigste nervesystemsskift. Uden et bevidst ritual bærer du arbejdsdagen med hjem i kroppen. Dette ritual markerer en klar grænse.",
    steps: [
      "Skriv tre ting du fik gjort i dag — det er nok. Du har bidraget.",
      "Skriv én ting du lader ligge til i morgen — og giv dig selv lov til at slippe den.",
      "Tre dybe vejrtrækninger med forlænget udånding.",
      "Luk computeren bevidst — ikke bare klap den i. Mærk handlingen.",
      "Sig til dig selv: 'Dagen er slut. Jeg har gjort nok.' — og mene det."
    ]
  },
  {
    titel: "Vagus-aktivering",
    tid: "2 min",
    sted: "Skrivebordet eller toilettet",
    cirkel: "aandedraet",
    temaer: ["generelt", "deadlines", "skaerm"],
    intro: "Vagusnerven er motorvejen mellem hjerne og krop. Denne øvelse stimulerer den direkte og sender et kraftfuldt signal til dit nervesystem om at det er sikkert at slappe af. Særligt effektivt ved stress og indre uro.",
    steps: [
      "Sid oprejst med en let lige ryg.",
      "Pust ind gennem næsen i 4 sekunder.",
      "Hold vejret i 4 sekunder.",
      "Pust langsomt ud gennem munden i 6-8 sekunder — jo længere udånding, jo stærkere effekt.",
      "Gentag 8-10 gange. Mærk roen brede sig fra brystet og ud i kroppen."
    ]
  },
  {
    titel: "Morgenlanding",
    tid: "3 min",
    sted: "Hjemme eller ved skrivebordet",
    cirkel: "centrum",
    temaer: ["generelt", "balance"],
    intro: "Hvordan du starter din dag, sætter tonen for dit nervesystem resten af dagen. Denne øvelse er Clements version af 'nervesystemets nektar' — den daglige næring dit system har brug for.",
    steps: [
      "Inden du åbner mail eller telefon: sæt dig med lukkede øjne i 30 sekunder.",
      "Mærk hvordan din krop har det lige nu. Ikke dømme, bare mærke.",
      "Tag tre dybe vejrtrækninger. Lad udåndingen være lang.",
      "Sæt en intention for dagen — ikke en to-do, men en kvalitet: 'Tilstedeværelse.' 'Ro.' 'Fokus.'",
      "Åbn øjnene. Du har givet dit nervesystem en morgengave."
    ]
  },
  {
    titel: "Team co-regulering",
    tid: "2 min",
    sted: "Mødelokalet",
    cirkel: "ledelse",
    temaer: ["moeder", "generelt"],
    intro: "Co-regulering er den biologiske mekanisme bag at nervesystemer synkroniserer sig. Denne øvelse bruger fælles åndedræt til at samle og regulere en gruppe — et af de mest kraftfulde teamregulerings-redskaber der findes.",
    steps: [
      "Sig til gruppen: 'Lad os lige lande inden vi begynder. To minutters stilhed.'",
      "Guid: 'Mærk fødderne mod gulvet. Mærk stolen under jer.'",
      "Guid: 'Tre fælles vejrtrækninger. Indånd... og langsomt udånd...'",
      "Lad der være 10 sekunders stilhed efter de tre vejrtrækninger.",
      "Åbn med: 'Godt. Vi er her. Lad os begynde.' — Mærk forskellen i rummet."
    ]
  }
];
