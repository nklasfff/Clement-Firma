/* ═══════════════════════════════════════════
   Clement WellbeingAtWork — Data
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
      handlinger: [
        "Tag den sværeste eller vigtigste opgave nu — dit nervesystem er klar til kompleks tænkning",
        "Brug tiden til vigtige samtaler, feedback og kreativt arbejde",
        "Beskyt tilstanden: tag dine pauser, drik vand, bevæg dig",
        "Mærk bevidst hvordan kroppen føles — jo bedre du kender grøn, desto hurtigere finder du tilbage"
      ],
      oevelse: "Mærk denne tilstand bevidst — læg mærke til hvordan kroppen føles lige nu. Jo bedre du kender din grønne tilstand, desto hurtigere kan du finde tilbage til den.",
      hvadMaerkerAndre: {
        kolleger: "Dine kolleger mærker det. Når du er reguleret, skaber du en roligere energi i rummet. Du lytter bedre, reagerer mere nuanceret, og konflikter løser sig lettere. Du er den kollega, folk søger hen til — fordi dit nervesystem signalerer sikkerhed.",
        teamet: "Hele teamet arbejder bedre, når flere er i grøn. Samarbejdet flyder, ideerne kommer, og der er plads til fejl uden frygt. Det er denne tilstand, der skaber psykologisk tryghed — ikke en politik, men en kropslig realitet."
      }
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
      handlinger: [
        "Planlæg kreative sessioner, strategimøder og vigtige beslutninger til dette tidspunkt",
        "Navngiv det for teamet: 'Vi er i et godt sted — lad os bruge det'",
        "Giv plads til ærlighed og sårbarhed — det er nu, det er sikkert",
        "Bevidsthed om den gode tilstand forstærker den — tal om hvad der virker"
      ],
      oevelse: "Navngiv det for teamet: 'Vi er i et godt sted lige nu — lad os bruge det.' Bevidsthed om den gode tilstand forstærker den.",
      hvadMaerkerAndre: {
        medarbejderne: "Dine medarbejdere mærker din regulering øjeblikkeligt. De tager flere chancer, stiller flere spørgsmål, og kommer med de idéer de ellers holder for sig selv. Dit rolige nervesystem giver dem permission til at være hele mennesker på arbejdet.",
        organisationen: "Regulerede teams præsterer bedre, har lavere sygefravær og højere fastholdelse. Det er ikke wellness — det er bundlinje. Den grønne tilstand er organisationens vigtigste ressource."
      }
    }
  },
  gul: {
    navn: "Gul tilstand",
    undertitel: "Aktivering og alarm",
    farve: "amber",
    medarbejder: {
      beskrivelse: "Dit sympatiske nervesystem er aktiveret — kamp-eller-flugt. Du mærker det som stress, uro, irritation eller en intens trang til at handle LIGE NU. Denne tilstand kan trigges af en provokerende mail, en presset deadline, en vanskelig kollega eller en stemme der lyder som noget fra fortiden. Din krop reagerer, som om faren er akut — selvom situationen objektivt set er håndterbar.",
      kropsSignaler: [
        "Hjertet banker hurtigt — du kan mærke pulsen i halsen",
        "Musklerne spænder, særligt kæbe, skuldre og hænder",
        "Åndedrættet er hurtigt og højt i brystet",
        "Du kan ikke tænke klart — hjernen lukker ned for nuancer",
        "Du har svært ved at lytte og vil helst bare reagere"
      ],
      handlinger: [
        "STOP før du reagerer. 20 sekunder vagus-åndedræt kan ændre alt: 4 sekunder ind, 8 sekunder ud",
        "Mærk fødderne mod gulvet — det fortæller dit nervesystem, at du er HER, ikke i faren",
        "Sig til dig selv: 'Min krop reagerer på pres. Faren er ikke reel lige nu.'",
        "Hvis du mærker, at du er ved at sende den vrede mail eller sige noget skarpt: gå væk i 2 minutter. Ikke som flugt. Som bevidst regulering."
      ],
      oevelse: "Sæt begge fødder på gulvet. Tag 4 langsomme vejrtrækninger med forlænget udånding (4 sek ind, 6-8 sek ud). Mærk skuldrene sænke sig. Du bevæger dig ned ad trappen.",
      hvadMaerkerAndre: {
        kolleger: "Dine kolleger mærker det øjeblikkeligt. Nogle trækker sig og undgår dig — de har lært, at det er sikrest. Andre eskalerer, fordi de prøver at 'nå dig' gennem din alarm. Begge dele er normale reaktioner på et dysreguleret nervesystem.",
        teamet: "Stemningen i teamet bliver elektrisk. Alle er på vagt. Selv de gode samarbejdsstunder er skrøbelige, fordi alle venter på den næste eskalering. Kommunikationen bliver kortere, fejlene flere, og tilliden skrøbelig."
      }
    },
    leder: {
      beskrivelse: "Dit teams nervesystemer er i alarm — og de orienterer sig efter dit. Hvis du også er i panik, forstærker det uroen eksponentielt. Dit vigtigste job lige nu er at være ankeret — den stabile kraft der regulerer rummet ned.",
      kropsSignaler: [
        "Tempoet er skruet op, folk taler hurtigere",
        "Der er kortere tålmodighed og flere afbrydelser",
        "Humoren forsvinder, stemningen er anspændt",
        "Folk arbejder i siloer og kommunikerer mindre",
        "Fejl og misforståelser stiger"
      ],
      handlinger: [
        "Skab klarhed og prioritering. Sig højt: 'Hvad er det vigtigste vi skal nå? Hvad kan vente?'",
        "Fjern usikkerhed — det er det mest regulerende du kan gøre for et presset team",
        "Sænk dit eget tempo bevidst. Tal langsommere. Dit nervesystem smitter",
        "Giv tydelig retning: 'Her er de tre ting vi fokuserer på. Resten parkerer vi.'"
      ],
      oevelse: "Saml teamet kort. Brug 30 sekunder på fælles åndedræt. Prioritér tre ting. Fjern alt andet fra bordet. Klarhed regulerer.",
      hvadMaerkerAndre: {
        medarbejderne: "Dine medarbejdere aflæser dig konstant — det er neurologisk programmeret i hierarkiske relationer. Når du er i alarm, går hele teamet i alarm. Når du regulerer dig ned, mærker de det og følger efter. Du er teamets primære reguleringskilde.",
        organisationen: "Pressede teams laver flere fejl, har flere konflikter og mister de bedste medarbejdere først. Et team i vedvarende gul tilstand er på vej mod udbrændthed — og prisen betales i sygefravær, flugtuation og tabt innovation."
      }
    }
  },
  roed: {
    navn: "Rød tilstand",
    undertitel: "Nedlukning og udmattelse",
    farve: "rose",
    medarbejder: {
      beskrivelse: "Dit nervesystem er lukket ned. Du er træt, tom eller følelsesmæssigt fraværende. Det sker ikke fordi du er svag — det er dit nervesystems nødstop, når presset har varet for længe uden tilstrækkelig recovery. Nedlukning er kroppens måde at beskytte sig selv på. Du har brug for omsorg, ikke præstation.",
      kropsSignaler: [
        "Du føler dig tom, flad eller følelsesløs",
        "Alt føles tungt og meningsløst",
        "Du har svært ved at koncentrere dig, zoner ud i møder",
        "Du har lyst til at isolere dig eller 'gemme dig'",
        "Kroppen føles tung, du er udmattet men kan måske ikke sove"
      ],
      handlinger: [
        "Rejs dig. Gå væk fra skærmen i 10 minutter. Drik vand. Mærk dine fødder mod gulvet",
        "Blid bevægelse er vejen op: stræk armene, gå et par skridt, mærk kontakten med gulvet",
        "Kold vand i ansigtet aktiverer vagusnerven og hjælper dit system med at 'genstarte'",
        "Ring til eller skriv til en person der giver dig ro. Du er ikke alene med dette"
      ],
      oevelse: "Blid bevægelse er vejen op fra rød: rejs dig langsomt, stræk armene, gå et par skridt. Mærk kontakten med gulvet. Kold vand i ansigtet. Ring til en person der giver dig ro.",
      hvadMaerkerAndre: {
        kolleger: "Dine kolleger mærker dit fravær, selvom du fysisk er til stede. Du svarer kortfattet, undgår øjenkontakt, og trækker dig fra fællesskabet. Nogle kolleger prøver at nå dig — andre respekterer tavsheden men bekymrer sig.",
        teamet: "Et team med flere i rød tilstand fungerer på overfladen, men mangler energi, kreativitet og forbindelse. Opgaver løses mekanisk, innovation stopper, og den usynlige distance mellem mennesker vokser. Det er ofte her, de bedste mennesker stille og roligt begynder at lede efter noget andet."
      }
    },
    leder: {
      beskrivelse: "Teamet er udkørt. Nervesystemerne er i nedlukning, og der produceres dårligt arbejde med risiko for fejl og sygemeldinger. Det er tid til akut aflastning — ikke endnu et motivationsoplæg, men reel reduktion af belastning.",
      kropsSignaler: [
        "Folk virker fraværende og uengagerede",
        "Der er stilhed — men ikke den gode slags",
        "Sygefravær stiger, folk melder sig syge oftere",
        "Kvaliteten falder, deadlines glipper",
        "Kynisme og resignation præger samtaler"
      ],
      handlinger: [
        "Aflys ikke-kritiske møder. Fjern opgaver fra bordet. Sig: 'Det er okay at gøre mindre lige nu'",
        "Model omsorg synligt: send teamet tidligt hjem, annullér en deadline",
        "Spørg hver enkelt: 'Hvad har du brug for lige nu?' — og mene det",
        "Skab rammer for recovery: bevægelse, pauser, nedsat tempo. Det kræver mod, men det er ansvarligt"
      ],
      oevelse: "Gør omsorg synlig. Et simpelt 'Hvordan går det helt ærligt?' fulgt af tavshed. Sit sammen. Vær til stede. Mennesker vender tilbage fra rød gennem forbindelse, ikke gennem krav.",
      hvadMaerkerAndre: {
        medarbejderne: "Dine medarbejdere venter på et signal om at det er okay at være menneske. Når du som leder anerkender at teamet er overbelastet — uden at bagatellisere eller problematisere — giver du dem permission til at trække vejret. Det signal er mere regulerende end enhver strategi.",
        organisationen: "Vedvarende rød tilstand i teams koster dyrt: sygemeldinger, opsigelser, fejl, tabt innovation og en kultur der langsomt eroderer. At gribe ind tidligt — med omsorg, ikke kontrol — er den mest omkostningseffektive investering en organisation kan lave."
      }
    }
  }
};

// ── Forstå dit nervesystem (uddybende trappen-tekster) ──
const TRAPPEN_FORSTAAELSE = {
  medarbejder: [
    {
      titel: "Hvorfor dine kolleger reagerer på DIT nervesystem",
      tekst: "Nervesystemer synkroniserer sig med hinanden — særligt i tætte samarbejdsrelationer. Når du er stresset, mærker din sidemand det. Når du er rolig, regulerer du dem ned. Det kaldes co-regulering, og det er ikke noget du vælger — det er biologisk. Det betyder, at det vigtigste du kan gøre for dit team i en presset situation, er at regulere dig selv først. Ikke fordi dine følelser er forkerte — men fordi dine kolleger ubevidst låner din tilstand."
    },
    {
      titel: "Dine reaktioner er ikke din skyld — men de er dit ansvar",
      tekst: "Hvis du voksede op i et miljø med uforudsigelighed, pres eller mangel på tryghed, har dit nervesystem lært at være på vagt. Det er ikke en fejl — det var en overlevelsesstrategi. Men den strategi kan gøre det svært at være den kollega eller det menneske, du gerne vil være. Når en deadline rammer, og du mærker paniken vælte op, er det ofte ikke opgaven, du reagerer på — det er et ekko fra en tidligere erfaring. At forstå det er ikke en undskyldning. Det er begyndelsen på at vælge anderledes."
    },
    {
      titel: "Regulering kommer før samtale",
      tekst: "Mange prøver at løse konflikter eller tage svære samtaler, når nervesystemet stadig er i alarm. Men hjernen kan ikke lytte, tænke nuanceret eller finde kreative løsninger, når den er i kamp-eller-flugt. Det er biologisk umuligt. Derfor er rækkefølgen afgørende: først regulering (åndedræt, grounding, pause), så kontakt (øjenkontakt, tilstedeværelse, lytning), og først til sidst samtale. Trappen hjælper dig med at genkende, hvor du er — så du ved, hvad der er muligt lige nu."
    }
  ],
  leder: [
    {
      titel: "Hvorfor dit team reagerer på DIT nervesystem",
      tekst: "Forskning i interpersonel neurobiologi viser, at nervesystemer synkroniserer sig i hierarkiske relationer. Dit teams nervesystemer orienterer sig bogstaveligt talt efter dit. Når du er stresset og reaktiv, forstærkes den reaktion i hele teamet. Når du er rolig og til stede, skaber du en kaskade af regulering. Det hedder co-regulering, og det er den mest kraftfulde ledelsesmekanisme der findes. Din vigtigste forberedelse til ethvert møde er derfor ikke slides — det er din egen regulering."
    },
    {
      titel: "Kultur er nervesystemets sprog",
      tekst: "Arbejdspladskultur er ikke en vision på væggen — det er det samlede nervesystems tilstand i organisationen. En kultur med psykologisk tryghed er en kultur hvor nervesystemerne signalerer sikkerhed. En kultur med frygt og kontrol er en kultur hvor nervesystemerne er i kronisk alarm. Som leder former du kulturen ikke gennem det du siger, men gennem det din krop signalerer. Dit tempo, dit tonefald, din evne til at rumme fejl og usikkerhed — det er kulturens byggesten."
    },
    {
      titel: "Ledelse fra det rigtige trin på trappen",
      tekst: "Der er beslutninger du kun bør tage fra grøn: opsigelser, strategiændringer, svære samtaler. Der er opgaver der fungerer i gul: korte sprints, deadline-pres, problemløsning. Og der er øjeblikke i rød, hvor det eneste ansvarlige er at stoppe maskinen. At kende dit eget trin — og turde handle derefter — er den mest modige form for ledelse. Det kræver, at du prioriterer din egen regulering som en strategisk investering, ikke en personlig luksus."
    }
  ]
};

// ── Temaer med dybt indhold ──
const TEMA_INDHOLD = {
  generelt: {
    titel: "Hverdagens trivsel",
    ikon: "☀",
    spoergsmaal: "Føler du dig generelt træt eller urolig — uden at vide præcis hvorfor?",
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
    spoergsmaal: "Sidder du i møde efter møde — uden pause, uden landing?",
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
    spoergsmaal: "Mærker du presset i kroppen — hurtig puls, spændt kæbe, kort åndedræt?",
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
    spoergsmaal: "Har du ondt i øjnene, nakken eller hovedet efter en lang dag foran skærmen?",
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
    spoergsmaal: "Har du en svær samtale foran dig — eller bærer du stadig på en der er sket?",
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
    spoergsmaal: "Føler du at arbejdet følger med hjem — i tanker, krop eller skærm?",
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
    ],
    refleksion: "Hvad lagde du mærke til i kroppen, da du landede? Var der et sted der holdt mere end andre?"
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
    ],
    refleksion: "Mærkede du en forskel i din tilstedeværelse efter øvelsen? Hvordan vil du beskrive skiftet?"
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
    ],
    refleksion: "Hvilken tilstand startede du i — og hvor endte du? Hvad fortæller det dig om dit stressmønster lige nu?"
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
    ],
    refleksion: "Hvad opdagede du om din reaktion? Er der et mønster i hvad der trigger dig på arbejdet?"
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
    ],
    refleksion: "Hvad tager du med fra i dag — ikke en opgave, men en følelse eller en erkendelse?"
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
    ],
    refleksion: "Hvor i kroppen mærkede du roen først? Kan du huske den fornemmelse næste gang presset stiger?"
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
    ],
    refleksion: "Hvilken kvalitet valgte du for dagen? Hvad ville det betyde, hvis du faktisk bar den med dig?"
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
    ],
    refleksion: "Lagde du mærke til en forandring i rummets energi? Hvad sker der med dit team, når I lander sammen?"
  },
  {
    titel: "Skærmpause for øjnene",
    tid: "2 min",
    sted: "Ved skrivebordet",
    cirkel: "krop",
    temaer: ["skaerm", "generelt"],
    intro: "Dine øjne er direkte forbundet til dit nervesystem — når de er spændte og overbelastede, sender de konstante stresssignaler til hjernen. Efter timer foran skærmen låser øjenmusklerne sig i nærfokus, og det skaber træthed, hovedpine og en følelse af at være 'brugt op'. Denne øvelse nulstiller øjnenes muskler og giver dit nervesystem en dyb pause.",
    steps: [
      "Læn dig tilbage fra skærmen. Luk øjnene og læg håndfladerne let over dem — mærk varmen og mørket. Hold i 20 sekunder.",
      "Åbn øjnene og kig på det mest fjerne punkt du kan se — ud af vinduet eller mod den fjerneste væg. Hold blikket der i 20 sekunder. Lad øjnene slappe af i afstanden.",
      "Lav langsomme øjencirkler: kig op, til højre, ned, til venstre. Tre cirkler i hver retning. Mærk strækket i de små muskler omkring øjnene.",
      "Blink bevidst 10-15 gange i træk — hurtige, lette blink. Skærmarbejde halverer din naturlige blinkfrekvens, og det udtørrer øjnene.",
      "Afslut med at kigge ud i det fjerne igen. Tag tre dybe vejrtrækninger. Mærk forskellen — øjnene er blødere, blikket er roligere, nervesystemet har fået en pause."
    ],
    refleksion: "Hvor meget af din træthed sidder i øjnene? Hvornår på dagen mærker du det mest?"
  },
  {
    titel: "Nakke-og-skulder-reset",
    tid: "3 min",
    sted: "Ved skrivebordet",
    cirkel: "krop",
    temaer: ["skaerm", "generelt"],
    intro: "Nakken og skuldrene er kroppens stresslager — det er her spænding fra skærmarbejde, pres og bekymring samler sig time efter time. Spændt fascia i nakke og skuldre sender konstante alarmsignaler til nervesystemet og kan udløse hovedpine, koncentrationsbesvær og en følelse af at være 'låst'. Denne øvelse løsner de mest belastede muskelgrupper og giver dit nervesystem besked om at det er sikkert at slippe.",
    steps: [
      "Sid oprejst og sænk skuldrene bevidst væk fra ørerne. Mærk hvor højt de sad — det er din krops stressrespons. Lav tre langsomme skulderrul baglæns: op mod ørerne, bagud, og ned. Mærk brystkassen åbne sig.",
      "Drej hovedet langsomt mod højre — kun så langt det er behageligt. Hold i 15 sekunder og ånd dybt. Mærk strækket langs venstre side af halsen. Gentag mod venstre.",
      "Sænk højre øre mod højre skulder — uden at hæve skulderen. Hold i 15 sekunder. Mærk strækket langs venstre side af nakken. Gentag den anden side.",
      "Flét fingrene bag hovedet. Pres hovedet let bagud mod hænderne mens hænderne holder imod. Hold i 5 sekunder og slip. Gentag tre gange — dette aktiverer og afspænder de dybe nakkemuskler.",
      "Afslut med tre dybe vejrtrækninger. Ved hver udånding: slip skuldrene bevidst. Mærk tyngden forlade nakke og skuldre. Dit nervesystem har fået besked om at alarmen er slukket."
    ],
    refleksion: "Lagde du mærke til hvor højt skuldrene sad? Hvad gør du normalt, når spændingen bygger sig op?"
  },
  {
    titel: "Hovedpine-regulering",
    tid: "4 min",
    sted: "Ved skrivebordet eller et stille sted",
    cirkel: "krop",
    temaer: ["skaerm", "generelt"],
    intro: "Spændingshovedpine fra skærmarbejde er ikke 'bare ondt i hovedet' — det er dit nervesystems alarm om at kroppen har været i konstant spænding for længe. Stramme muskler i pande, tindinger, kæbe og nakke komprimerer nerver og blodkar. Denne øvelse kombinerer akupressur, muskelafspænding og åndedræt for at adressere de tre vigtigste kilder til skærmrelateret hovedpine.",
    steps: [
      "Start med kæben — den glemte stressholder. Lad munden åbne let så tænderne ikke rører hinanden. Læg fingerspidserne på kæbeleddet (foran ørerne) og lav små, bløde cirkler i 20 sekunder. Mærk spændingen slippe.",
      "Placer begge tommelfingre i nakkebunden — lige hvor kraniet møder nakken. Pres let opad og indad mens du langsomt bøjer hovedet fremad. Hold trykket i 20 sekunder med lukkede øjne. Her sidder occipitalnerverne, som ofte er kilden til spændingshovedpine.",
      "Placer fingerspidserne på begge tindinger. Lav langsomme, bløde cirkler med et let tryk. Ånd dybt ind gennem næsen og langsomt ud gennem munden. 30 sekunder. Lad trykket være blidt — det er berøringen der signalerer sikkerhed til nervesystemet.",
      "Luk øjnene. Forestil dig at dit åndedræt strømmer op til toppen af hovedet ved indånding og ned langs nakken ved udånding — som en blød bølge. Gentag 5-6 gange. Denne visualisering kombineret med åndedræt sænker muskelspændingen i hele hovedet.",
      "Afslut med at gnide håndfladerne hurtigt mod hinanden til de er varme. Læg dem over øjnene. Mærk varmen. Sid stille i 20 sekunder. Når du fjerner hænderne, mærk forskellen — et lettere hoved, en blødere pande, et roligere nervesystem."
    ],
    refleksion: "Hvornår begynder hovedpinen typisk? Er der et mønster — og kan du nå at bryde det tidligere?"
  },
  {
    titel: "Sensorisk landing",
    tid: "3 min",
    sted: "Skrivebordet, mødelokale, eller et stille sted",
    cirkel: "krop",
    temaer: ["generelt"],
    intro: "Åbne kontorlandskaber, konstant støj, telefonsamtaler, skærmskift og mennesker i periferien — dit nervesystem behandler det hele, også det du ikke bevidst registrerer. Sensorisk overbelastning aktiverer det samme alarmsystem som en trussel, og resultatet er udmattelse, irritabilitet og en følelse af at 'ikke kunne rumme mere'. Denne øvelse lukker bevidst ned for sensorisk input og giver dit nervesystem mulighed for at nulstille.",
    steps: [
      "Stop alt hvad du laver. Hvis du kan, sæt høretelefoner på uden musik — bare stilhed. Hvis du har ørepropper, brug dem. Bare det at reducere lydinput sænker nervesystemets arousal mærkbart.",
      "Luk øjnene eller sænk blikket mod skrivebordet. Visuelt input er den største sensoriske belastning i åbne kontorer. Giv øjnene og synssystemet en bevidst pause i 30 sekunder.",
      "Læg hænderne fladt på bordpladen eller i skødet. Fokusér al din opmærksomhed på berøringssansen — temperaturen, teksturen, tyngden af dine hænder. Når du giver nervesystemet én rolig sans at fokusere på, slipper det de andre.",
      "Tag fem langsomme vejrtrækninger med forlænget udånding: ind for 4, ud for 7. Ved hver udånding, forestil dig at du skruer ned for en lydstyrkeknap — alle indtryk bliver lidt fjernere, lidt mere dæmpede.",
      "Åbn øjnene langsomt. Kig på én ting. Lyt til én lyd. Mærk én berøring. Vend langsomt tilbage til omgivelserne — på dine betingelser, i dit tempo. Du har nulstillet dit sensoriske system."
    ],
    refleksion: "Hvad overrasker dig mest om din sensoriske belastning? Hvad kunne du ændre i dit arbejdsmiljø?"
  },
  {
    titel: "Mikro-bevægelse ved skrivebordet",
    tid: "2 min",
    sted: "Ved skrivebordet",
    cirkel: "krop",
    temaer: ["skaerm", "generelt"],
    intro: "Stillesiddende arbejde aktiverer det samme system som kroppens 'freeze'-respons — efter bare 45 minutter uden bevægelse begynder stresshormonerne at stige. Din krop er designet til bevægelse, og når den ikke får det, sender den alarmssignaler som indre uro, stivhed og koncentrationsbesvær. Denne øvelse genaktiverer kroppens bevægelsessystem direkte ved skrivebordet — diskret nok til ethvert kontormiljø.",
    steps: [
      "Pres begge fødder hårdt mod gulvet i 5 sekunder — som om du vil rejse dig, men bliver siddende. Slip. Gentag tre gange. Dette aktiverer de store muskelgrupper i benene og sender 'bevægelse'-signaler til nervesystemet.",
      "Sid på kanten af stolen. Vip bækkenet langsomt fremad og bagud — som en blød vuggende bevægelse. 5-6 gentagelser. Dette mobiliserer lænden og ryggen, der låser sig fast ved stillesiddende arbejde.",
      "Stræk begge arme over hovedet med flettede fingre. Pres håndfladerne mod loftet og stræk — mærk hele siden af kroppen forlænge sig. Hold i 10 sekunder. Læn dig let til højre i 5 sekunder, derefter til venstre.",
      "Klem begge hænder hårdt sammen i 5 sekunder og slip helt. Spred fingrene vidt ud og hold i 5 sekunder. Gentag tre gange. Ryst hænderne løst i 10 sekunder. Dine hænder og underarme bærer en enorm belastning fra tastatur og mus.",
      "Afslut med en 'usynlig' hel-krops-aktivering: spænd alle muskler i kroppen samtidig — ben, mave, arme, ansigt — hold i 5 sekunder og slip alt på én gang. Tag en dyb vejrtrækning. Mærk kontrasten mellem spænding og afslapning. Dit nervesystem har fået en genstart."
    ],
    refleksion: "Hvad sker der i din krop, når du sidder stille for længe? Hvor mærker du det først?"
  }
];

// ── Standalone refleksioner (5 stk) ──
const REFLEKSIONER = [
  {
    id: "forbindelse",
    titel: "Forbindelse",
    ikon: "◎",
    farve: "sage",
    spoergsmaal: "Hvornår følte du dig sidst ægte forbundet med en kollega — ikke bare professionelt, men menneskeligt? Hvad skabte den forbindelse?",
    uddybning: "Vi er neurologisk designet til forbindelse. Dit nervesystem regulerer sig bedst i trygge relationer. Læg mærke til de øjeblikke på arbejdet, hvor du føler dig set og hørt — de er ikke bare rare. De er regulerende."
  },
  {
    id: "moenstre",
    titel: "Mønstre",
    ikon: "◈",
    farve: "amber",
    spoergsmaal: "Hvilket mønster gentager sig i din arbejdsdag, som du gerne ville ændre? Hvad tror du mønsteret beskytter dig mod?",
    uddybning: "Mønstre er nervesystemets autopilot — de opstod for at beskytte dig. At se dem er første skridt. At forstå hvad de beskytter, er andet. Forandring begynder ikke med viljestyrke, men med nysgerrighed."
  },
  {
    id: "styrke",
    titel: "Styrke",
    ikon: "◉",
    farve: "primary",
    spoergsmaal: "Hvad er du god til, som du aldrig får anerkendelse for? Hvad ville det betyde, hvis du selv anerkendte det?",
    uddybning: "Mange af dine vigtigste bidrag er usynlige — den ro du bringer, den omsorg du viser, de konflikter du forebygger. Dit nervesystem har brug for at du ser dine egne styrker, ikke kun dem andre definerer."
  },
  {
    id: "grænser",
    titel: "Grænser",
    ikon: "◇",
    farve: "rose",
    spoergsmaal: "Hvor siger du ja, når din krop siger nej? Hvad ville der ske, hvis du lyttede til kroppen i stedet?",
    uddybning: "Grænser er ikke egoistiske — de er neurobiologisk nødvendige. Hver gang du overskrider dine egne grænser, sender du et signal til nervesystemet om at dine behov ikke tæller. Over tid fører det til udmattelse, frustration og afkobling."
  },
  {
    id: "retning",
    titel: "Retning",
    ikon: "◆",
    farve: "accent",
    spoergsmaal: "Hvis dit arbejdsliv kunne føles anderledes om seks måneder — ikke opgaverne, men fornemmelsen — hvordan ville det føles?",
    uddybning: "Forandring starter ikke med en plan, men med en fornemmelse. Når du kan mærke den tilstand du ønsker dig hen imod, giver du dit nervesystem et mål at orientere sig efter. Det er ikke drømmeri — det er regulering gennem retning."
  }
];

// ── Dynamiske sammenhænge mellem cirkler (21 par × 2 perspektiver) ──
const SAMMENHAENGE = {

  // ─── Centrum (Stressregulering) ↔ alle andre ───

  'centrum-tilstande': {
    medarbejder: "Stressregulering og dine tre nervesystemstilstande er uløseligt forbundne. Regulering er selve evnen til at bevæge dig bevidst mellem tilstandene — fra gul alarm tilbage til grøn sikkerhed, eller fra rød nedlukning op til gul aktivering. Uden reguleringsredskaber sidder du fast i den tilstand dit nervesystem automatisk vælger. Med dem har du et konkret kort og en konkret vej. Når du mærker at du skifter til gul — hjertet banker, skuldrene stiger — er det selve reguleringsøvelsen (tre vejrtrækninger, grounding, en micro-pause) der bringer dig tilbage. Stressregulering er ikke noget du gør ved siden af dit arbejde. Det er den kompetence der afgør hvilken tilstand du arbejder fra — og dermed kvaliteten af alt du gør.",
    leder: "Din evne til at regulere stress er direkte forbundet med din evne til at aflæse og påvirke dit teams tilstande. Når du selv er reguleret, kan du se klart om teamet er i grøn, gul eller rød — og handle derefter. Når du selv er dysreguleret, mister du denne aflæsningsevne og risikerer at presse et team der allerede er i rød, eller bremse et team der er i grøn flow. Co-regulering begynder med din egen regulering: dit nervesystems tilstand sætter tonen for hele rummets tilstand. Start med dig selv, og du starter med teamet."
  },

  'centrum-ledelse': {
    medarbejder: "Din oplevelse af ledelse og kultur påvirker direkte dit nervesystems regulering — hver eneste dag. En leder der skaber psykologisk tryghed sender sikkerhedssignaler til dit nervesystem, og det giver dig adgang til kreativitet, ærlighed og engagement. En leder der skaber uforudsigelighed eller frygt aktiverer dit alarmsystem, og du bruger energi på selvbeskyttelse i stedet for godt arbejde. At forstå denne sammenhæng giver dig sprog for din oplevelse: det er ikke 'bare stress' — det er dit nervesystem der reagerer på de sociale signaler i din arbejdskultur. Og det giver dig mulighed for at søge co-regulering fra de relationer der giver dig ro.",
    leder: "Ledelse er regulering. Det er ikke en metafor — det er neurobiologi. Forskning viser at nervesystemer synkroniserer sig i hierarkiske relationer, og dit teams systemer orienterer sig efter dit. Når du er rolig og tilstede, skaber du en kaskade af regulering. Når du er stresset og reaktiv, forstærkes den reaktion i hele teamet. Din vigtigste forberedelse til ethvert møde er derfor ikke slides — det er din egen regulering. De 60 sekunder du bruger på at lande inden du går ind i lokalet er den mest effektive ledelsesinvestering du kan lave."
  },

  'centrum-samarbejde': {
    medarbejder: "Dit nervesystems reguleringstilstand afgør fundamentalt hvilken samarbejdsstil du bringer ind i teamet. Når du er reguleret og i grøn tilstand, har du adgang til din trygge samarbejdsstil — du kan lytte, give plads, bede om hjælp og håndtere uenighed. Når du er dysreguleret, aktiveres dine tidlige tilknytningsmønstre automatisk: den undvigende trækker sig, den ambivalente overtilpasser, den desorganiserede svinger mellem begge. At regulere dit nervesystem er derfor den mest direkte vej til bedre samarbejde — ikke fordi du 'kontrollerer dig selv,' men fordi regulering giver dig adgang til de dele af dig der samarbejder bedst.",
    leder: "Teamets samarbejdsmønstre formes direkte af det reguleringsmiljø du skaber. I et reguleret team — hvor der er psykologisk tryghed og konsistent ledelse — vil selv medarbejdere med utrygge tilknytningsmønstre begynde at samarbejde mere fleksibelt. I et dysreguleret team aktiveres alles forsvarsmønstre: den undvigende isolerer sig mere, den ambivalente overtilpasser mere, og konflikter eskalerer. Din investering i teamets regulering er samtidig en investering i teamets samarbejdsevne."
  },

  'centrum-krop': {
    medarbejder: "Kroppen og nervesystemet er en uadskillelig helhed — du kan ikke regulere det ene uden det andet. Når du sidder spændt foran skærmen i timevis, sender din krop konstante stresssignaler til nervesystemet gennem fascia, muskler og åndedræt. Modsat sender bevidst bevægelse, stretch og sensorisk kontakt (mærk fødderne, mærk stolen) direkte reguleringssignaler. Din krop er den mest umiddelbare adgang til stressregulering — hurtigere end tanker, hurtigere end samtale. Tre skulderrul og fem dybe vejrtrækninger ændrer din fysiologiske tilstand målbart på under et minut.",
    leder: "Kropsbevidsthed i teamet er en direkte forlængelse af stressregulering. Når du skaber en kultur hvor bevægelse, pauser og kropslig opmærksomhed er naturlige dele af arbejdsdagen, investerer du direkte i teamets reguleringskkapacitet. Gå-møder, stå-borde, bevægelsespauser — det er ikke wellness-pynt. Det er nervesystemsinfrastruktur. Et team der bevæger sig er et team der regulerer sig."
  },

  'centrum-aandedraet': {
    medarbejder: "Åndedræt er den hurtigste og mest direkte vej til stressregulering — det er selve nøglen til dit nervesystems dashboard. Vagusnerven, den længste nerve i dit autonome nervesystem, stimuleres direkte af forlænget udånding. Når du forlænger din udånding, sender du bogstaveligt talt et signal til hjernen om at det er sikkert at slappe af. Det er derfor 4-7-8 åndedræt virker: fordi udåndingen er dobbelt så lang som indåndingen. Stressregulering på kontoret handler i sin mest destillerede form om én ting: bevidst åndedræt spredt over din dag.",
    leder: "Kollektivt åndedræt er det mest kraftfulde reguleringsredskab du har som leder. Når du starter et møde med 30 sekunders fælles åndedræt, synkroniserer du bogstaveligt talt dit teams nervesystemer. Den biologiske mekanisme hedder respiratorisk synkronisering, og den skaber en fælles reguleret baseline for hele gruppen. Det føles måske uvant de første gange, men effekten er målbar: bedre lytning, klarere tænkning, dybere samtaler."
  },

  'centrum-resiliens': {
    medarbejder: "Resiliens er ikke evnen til at holde ud — det er evnen til at vende tilbage. Og den evne afhænger direkte af dit nervesystems reguleringskapacitet. Jo bedre du er til daglig stressregulering, desto mere fleksibelt er dit system når presset stiger. Tænk på det som en muskel: daglige micro-pauser, bevidst åndedræt og grounding træner dit nervesystems evne til at skifte mellem aktivering og hvile. Når den store deadline eller den svære samtale kommer, har du et system der kan håndtere det — fordi det er trænet i hverdagen.",
    leder: "Teamets resiliens bygges i hverdagen, ikke i krisen. De daglige reguleringsrutiner du skaber — pauser mellem møder, bevidste check-ins, synlig omsorg — opbygger den autonome fleksibilitet der bærer teamet gennem pressede perioder. Et team der har stærke daglige reguleringsritualer kan absorbere langt mere pres end et team der kører på konstant alarm. Din investering i hverdagens regulering er din forsikring mod morgendagens overbelastning."
  },

  // ─── Tilstande ↔ alle andre (excl. centrum) ───

  'tilstande-ledelse': {
    medarbejder: "Din leders adfærd påvirker direkte hvilken tilstand dit nervesystem befinder sig i. En leder der er konsistent, tilgængelig og anerkendende sender sikkerhedssignaler der holder dit system i grøn. En leder der er uforudsigelig, kritisk eller utilgængelig aktiverer gul alarm — og over tid kan det skubbe dig mod rød nedlukning. At forstå denne sammenhæng giver dig sprog for din oplevelse og mulighed for at handle: søg regulering fra andre relationer, sæt grænser, og vær bevidst om hvilke ledelsessignaler der aktiverer dit system.",
    leder: "Din evne til at aflæse dit teams tilstande er direkte forbundet med din ledelseseffektivitet. Når du kan se at teamet er i gul alarm, ved du at de har brug for klarhed og prioritering — ikke flere opgaver. Når du kan se rød nedlukning, ved du at aflastning er nødvendig — ikke motivation. Og din egen tilstand smitter: et team med en leder i gul alarm vil selv eskalere til gul. Din mest effektive ledelsesstrategi er at regulere dig selv ned, så du kan aflæse klart og handle præcist."
  },

  'tilstande-samarbejde': {
    medarbejder: "Dine tre nervesystemstilstande former direkte din samarbejdsevne. I grøn tilstand har du adgang til empati, fleksibilitet og kreativt samarbejde. I gul tilstand bliver du reaktiv — du afbryder, misforstår, eller trækker dig. I rød tilstand er du fraværende — du sidder i mødet men er ikke rigtig der. Dine samarbejdsmønstre fra barndommen (tryg, undvigende, ambivalent) forstærkes under pres: jo mere dysreguleret du er, desto mere falder du tilbage i gamle mønstre. At genkende din tilstand er første skridt til at vælge en anden samarbejdsstrategi.",
    leder: "Teamets samarbejdskvalitet er et direkte spejl af teamets kollektive nervesystemstilstand. Et team i grøn tilstand samarbejder naturligt: de lytter, bygger videre på hinandens idéer, og håndterer uenighed konstruktivt. Et team i gul tilstand fragmenterer: folk arbejder i siloer, misforståelser stiger, og konflikter eskalerer. Et team i rød tilstand er funktionelt afkoblet. Din vigtigste samarbejdsindsats som leder er at skabe betingelserne for grøn tilstand — klarhed, tryghed, pauser og realistiske forventninger."
  },

  'tilstande-krop': {
    medarbejder: "Dine tre nervesystemstilstande bor i kroppen — ikke i hovedet. Grøn tilstand mærkes som afslappede skuldre, dybt åndedræt og en følelse af at være tilstede. Gul tilstand mærkes som spændte muskler, hurtig puls og overfladisk åndedræt. Rød tilstand mærkes som tyngde, tomhed og følelsesløshed. Kroppen er dit mest pålidelige instrument til at vide hvilken tilstand du er i — og den er samtidig din mest direkte vej til at ændre tilstanden. Bevægelse bringer dig op fra rød, grounding bringer dig ned fra gul.",
    leder: "At aflæse dit teams tilstande kræver at du kigger på kroppe, ikke bare lytter til ord. Spændte skuldre, hurtige bevægelser og anspændte stemmer signalerer gul alarm. Sammensunkne holdninger, fraværende blikke og monotone stemmer signalerer rød nedlukning. Energi, humor og afslappede kroppe signalerer grøn. Når du introducerer bevægelsespauser, gå-møder og kropslig opmærksomhed, giver du teamet redskaber til at skifte tilstand gennem kroppen — den mest direkte vej."
  },

  'tilstande-aandedraet': {
    medarbejder: "Åndedræt er det mest præcise instrument til at bevæge dig mellem tilstandene. Fra gul til grøn: forlænget udånding (4-7-8 åndedræt) aktiverer det beroligende system og sænker arousal. Fra rød til gul: energiserende åndedræt (hurtigere indånding, kortere udånding) aktiverer systemet blidt. Respiratorisk sinus arrhytmi — den naturlige variation i puls ved ind- og udånding — er et direkte mål for din autonome fleksibilitet. Jo bedre du er til bevidst åndedræt, desto mere fleksibelt kan dit system skifte mellem tilstandene.",
    leder: "Fælles åndedræt er det mest effektive redskab til at flytte et helt teams tilstand. Når et team i gul alarm tager tre fælles vejrtrækninger med forlænget udånding, synkroniseres nervesystemerne og tilstanden skifter mod grøn. Det er den biologiske mekanisme bag hvorfor sang, meditation og fælles bevægelse føles samlende — og du kan bruge den bevidst i dit lederskab. Start møder med åndedræt, indbyg pauser i workshops, og model det selv."
  },

  'tilstande-resiliens': {
    medarbejder: "Resiliens handler fundamentalt om din evne til at bevæge dig mellem tilstandene — særligt at vende tilbage fra gul og rød til grøn. Burnout er når du har mistet denne fleksibilitet: dit system er låst i kronisk gul alarm eller rød nedlukning og kan ikke længere skifte. De tre tilstande er derfor dit tidlige varslingssystem: hvis du tilbringer mere og mere tid i gul eller rød, og det tager længere og længere at vende tilbage til grøn, er det et signal om at din resiliens er under pres. Recovery handler om at genoprette denne fleksibilitet.",
    leder: "Teamets resiliens kan aflæses direkte i teamets tilstandsmønstre. Et resilient team tilbringer størstedelen af tiden i grøn, kan håndtere perioder i gul uden at fragmentere, og vender hurtigt tilbage efter pres. Et team i risiko for overbelastning tilbringer stadig mere tid i gul, har sværere ved at finde grøn, og begynder at vise tegn på rød. Hold øje med disse mønstre i dit team — de er det mest pålidelige early warning system du har."
  },

  // ─── Ledelse ↔ alle andre (excl. centrum, tilstande) ───

  'ledelse-samarbejde': {
    medarbejder: "Din leders stil former direkte teamets samarbejdsmønstre. En leder der skaber psykologisk tryghed muliggør trygt samarbejde — folk tør bede om hjælp, indrømme fejl og være uenige. En leder der skaber frygt aktiverer alles forsvarsstrategier: den undvigende isolerer sig, den ambivalente overtilpasser, og konflikterne går under jorden. Din leders relation til dig fungerer som en slags tilknytningsrelation på arbejdspladsen — den former fundamentalt hvordan du knytter dig til teamet og opgaverne.",
    leder: "Du er den vigtigste arkitekt af dit teams samarbejdsmønstre. Gennem din konsistens, tilgængelighed og responsivitet skaber du det der i tilknytningsteorien hedder en 'sikker base' — et fundament hvorfra teamet kan udforske, tage risici og samarbejde trygt. Konkret betyder det: reager nogenlunde ens på fejl, hold dine løfter, vær tilgængelig når det er svært. Når du skaber denne base, vil selv medarbejdere med utrygge samarbejdsmønstre gradvist begynde at samarbejde mere fleksibelt."
  },

  'ledelse-krop': {
    medarbejder: "Kulturen på din arbejdsplads bestemmer i høj grad hvor meget plads din krop har i din arbejdsdag. I en kultur hvor det er legitimt at rejse sig, strække sig og tage bevægelsespauser, støttes dit nervesystem. I en kultur hvor det forventes at du sidder stille og producerer uafbrudt, undertrykkes dit systems grundlæggende behov. Mærk efter: holder du vejret under møder? Spænder du kæben når du læser mails? Din krops reaktioner afslører kulturen — og din krop fortjener at blive lyttet til.",
    leder: "Kropslig bevidsthed i teamet er et ledelsesspørgsmål — ikke et wellness-spørgsmål. Når du gør det legitimt at bevæge sig, tage pauser og lytte til kroppen, skaber du en kultur der støtter nervesystemets grundlæggende behov. Gå-møder, stå-borde, bevægelsespauser — det er ikke ekstra. Det er infrastruktur for regulering. Og det starter med at du selv modellerer det: rejs dig under møder, foreslå gåture, og vis at kroppen er velkommen i arbejdet."
  },

  'ledelse-aandedraet': {
    medarbejder: "Fælles åndedrætspauser i teamet er et signal om ledelseskvalitet. Når din leder starter et møde med 30 sekunders stille åndedræt, kommunikerer det: 'Vi har tid. Vi er til stede. Det her er vigtigt nok til at vi lander først.' Det er en handling der regulerer hele rummets nervesystem — og det kræver en leder der forstår at tilstedeværelse er mere produktivt end tempo.",
    leder: "Åndedræt er dit mest tilgængelige co-reguleringsredskab. Når du tager en synlig, bevidst vejrtrækning inden du taler, regulerer det dit eget system og sender et signal til rummets nervesystemer. Når du guider fælles åndedræt i starten af møder, synkroniserer du teamet. Det er den simpleste og mest evidensbaserede ledelsesintervention der findes — og den tager 30 sekunder."
  },

  'ledelse-resiliens': {
    medarbejder: "Din leders evne til at skabe realistiske forventninger, beskytte grænser og anerkende belastning er den vigtigste faktor for din resiliens på arbejdspladsen. En leder der siger 'vi gør mindre lige nu' i en presset periode beskytter dit nervesystem. En leder der tilføjer opgaver oven i overbelastning nedbryder det. Psykologisk tryghed er ikke blot rart — det er resiliens-infrastruktur. Når du ved at det er okay at sige 'jeg har for meget,' kan du handle inden du rammer muren.",
    leder: "Du er dit teams primære resiliens-faktor. Ikke fordi du skal bære deres byrder, men fordi du skaber de rammer der enten opbygger eller nedbryder deres autonome fleksibilitet. Realistiske forventninger, beskyttede pauser, legitime grænser og ægte 1:1-check-ins er resiliens-byggeklodser. Og husk: du kan ikke bygge resiliens i dit team fra en tom tank. Din egen recovery, dine egne grænser er forudsætningen — ikke luksus."
  },

  // ─── Samarbejde ↔ alle andre (excl. centrum, tilstande, ledelse) ───

  'samarbejde-krop': {
    medarbejder: "Dine samarbejdsmønstre sidder i kroppen — ikke kun i hovedet. Den undvigende stil viser sig som tilbagetrukne skuldre, korslagte arme og en krop der vender let væk. Den ambivalente stil viser sig som konstant spænding, fremadlænet krop og en hyperårvågenhed over for andres reaktioner. Disse kropslige mønstre blev formet i dine tidligste relationer og gentager sig automatisk i teamet. Kropsbevidsthed giver dig mulighed for at opdage mønstret i kroppen før det styrer din adfærd — og dermed et valg om at gøre noget anderledes.",
    leder: "Teamets samarbejdsmønstre kan aflæses i kroppe lige så tydeligt som i ord. Hvem trækker sig fysisk tilbage under diskussioner? Hvem læner sig konstant frem og overtager? Hvem sidder stivt og spændt? Disse kropslige signaler fortæller dig om teamets tilknytningsmønstre og reguleringstilstand. Når du introducerer bevægelse, gåture og kropslig variation i teamets hverdag, giver du mulighed for at bryde fastlåste mønstre — kroppen kan åbne for nye samarbejdsformer."
  },

  'samarbejde-aandedraet': {
    medarbejder: "Når samarbejdet bliver spændt — uenigheder, misforståelser, konflikter — er åndedræt din mest umiddelbare udvej fra den automatiske reaktion. Tre bevidste vejrtrækninger under bordet giver dit nervesystem de få sekunder det behøver for at skifte fra reaktion til respons. Det er forskellen mellem at sige noget du fortryder, og at vælge dine ord bevidst. Åndedræt er ikke bare en reguleringsøvelse — det er en samarbejdskompetence.",
    leder: "Fælles åndedræt transformerer samarbejdskvaliteten i et team. Når du starter møder med tre fælles vejrtrækninger, skaber du en fælles reguleret baseline der gør alle bedre i stand til at lytte, bidrage og håndtere uenighed. Det er særligt kraftfuldt før svære samtaler, feedback-sessioner eller strategidiskussioner — præcis de situationer hvor nervesystemerne er mest aktiverede og samarbejdsmønstrene mest udfordrede."
  },

  'samarbejde-resiliens': {
    medarbejder: "Dine samarbejdsmønstre påvirker direkte din resiliens. Hvis du har en undvigende stil og isolerer dig under pres, mister du adgangen til co-regulering fra kolleger — og dit nervesystem bærer hele belastningen alene. Hvis du har en ambivalent stil og overtilpasser, bruger du energi på andres behov og glemmer dine egne grænser. Begge mønstre nedbryder resiliens over tid. At udvikle en mere tryg samarbejdsstil — hvor du kan bede om hjælp og sætte grænser — er en af de mest effektive resiliens-strategier der findes.",
    leder: "Teamets samarbejdsmønstre er en direkte indikator for teamets resiliens. Et team med trygge samarbejdsmønstre — hvor folk beder om hjælp, deler belastning og støtter hinanden — er langt mere resilient end et team hvor alle bærer alene. Din opgave er at skabe de betingelser der muliggør trygt samarbejde: klarhed om roller, eksplicit permission til at sige fra, og en kultur hvor det at bede om hjælp er styrke, ikke svaghed."
  },

  // ─── Krop ↔ alle andre (excl. centrum, tilstande, ledelse, samarbejde) ───

  'krop-aandedraet': {
    medarbejder: "Kroppen og åndedrættet er to sider af samme reguleringsmekanisme. Når kroppen er spændt, bliver åndedrættet overfladisk — og omvendt. Fascia, dit krops bindevæv, er tæt forbundet med mellemgulvet og påvirker direkte din åndedrætskvalitet. Når du sidder sammensunket foran skærmen, komprimeres mellemgulvet og åndedrættet begrænses. Når du rejser dig, strækker ud og åbner brystkassen, frigives åndedrættet naturligt. De to redskaber forstærker hinanden: bevægelse frigør åndedræt, og dybere åndedræt afslapper kroppen. Sammen er de det mest kraftfulde reguleringspar du har.",
    leder: "Kroppen og åndedrættet er de to mest direkte reguleringsredskaber dit team har adgang til — og de forstærker hinanden. Når du kombinerer bevægelsespauser med bevidst åndedræt — f.eks. 'rejs jer op, stræk armene, og tag tre dybe vejrtrækninger' — får du en dobbelt reguleringseffekt. Det tager 60 sekunder og ændrer hele rummets energi. Gør det til en vane midt i lange møder og workshops."
  },

  'krop-resiliens': {
    medarbejder: "Din krops tilstand er et direkte barometer for din resiliens. Kroniske spændinger, dårlig søvn, hovedpine og fordøjelsesproblemer er ikke tilfældige — de er dit nervesystems signaler om at din kapacitet er under pres. Kroppen taler før psyken gør. Når du mærker at nakken er konstant spændt, at du har ondt i maven eller ikke kan sove, er det tid til at lytte — ikke til at tage en smertestillende og køre videre. Kropslig bevidsthed er dit tidligste varslingssystem for overbelastning.",
    leder: "Kropslige signaler i teamet er early warning indicators for resiliens under pres. Når flere i teamet rapporterer hovedpine, dårlig søvn eller konstante spændinger, er det ikke individuelle problemer — det er et systemproblem. Det er nervesystemer der fortæller dig at belastningen er for høj. Tag disse signaler alvorligt: juster tempoet, reducer belastning, og skab rum for fysisk genopladning. Kroppen løser ikke."
  },

  // ─── Åndedræt ↔ Resiliens ───

  'aandedraet-resiliens': {
    medarbejder: "Daglig åndedrætspraksis er en af de mest evidensbaserede måder at opbygge resiliens på. Respiratorisk sinus arrhytmi — den naturlige variation i din puls ved ind- og udånding — er et direkte mål for din autonome fleksibilitet, altså dit nervesystems evne til at skifte mellem aktivering og hvile. Jo højere RSA, desto mere resilient er dit system. Og RSA styrkes direkte af regelmæssig bevidst åndedræt. Tre minutter om dagen med forlænget udånding træner bogstaveligt talt dit nervesystems bounceevne. Det er den billigste og mest tilgængelige resiliens-investering der findes.",
    leder: "Fælles åndedrætspauser opbygger ikke bare momentan regulering — de opbygger teamets langsigtede resiliens. Hver gang teamet ånder bevidst sammen, styrkes den kollektive evne til at regulere under pres. Det er som træning: effekten akkumulerer over tid. Teams der har regelmæssige åndedrætspauser som del af deres mødekultur rapporterer højere stressresistens, bedre recovery efter pressede perioder, og lavere sygefravær. Det er 30 sekunder der betaler sig mange gange tilbage."
  }
};

// ── Hjælpefunktioner til sammenhænge ──
function hentSammenhaenge(cirkelId) {
  var result = [];
  var keys = Object.keys(SAMMENHAENGE);
  for (var i = 0; i < keys.length; i++) {
    var parts = keys[i].split('-');
    if (parts[0] === cirkelId || parts[1] === cirkelId) {
      var andenCirkel = parts[0] === cirkelId ? parts[1] : parts[0];
      result.push({
        id: andenCirkel,
        titel: CIRKLER[andenCirkel] ? CIRKLER[andenCirkel].titel : andenCirkel,
        data: SAMMENHAENGE[keys[i]]
      });
    }
  }
  return result;
}

// Titler til sammenhænge-visning
var CIRKEL_NAVNE = {
  centrum: 'Stressregulering',
  tilstande: 'Tre tilstande',
  ledelse: 'Ledelse & kultur',
  samarbejde: 'Samarbejdsmønstre',
  krop: 'Krop & bevægelse',
  aandedraet: 'Åndedræt & pauser',
  resiliens: 'Resiliens & grænser'
};

// ── Personlig vurdering: 7 dimensioner × 6 vinkler ──
var ASSESSMENT_DATA = {
  centrum: {
    titel: 'Stressregulering',
    ikon: '◉',
    generelt: {
      medarbejder: 'Hvordan oplever du din evne til at regulere stress i din arbejdsdag?',
      leder: 'Hvordan vurderer du dit teams samlede evne til at regulere stress?'
    },
    vinkler: [
      {
        id: 'micropauser',
        titel: 'Micro-pauser',
        medarbejder: 'Tager du bevidste pauser i løbet af din arbejdsdag?',
        leder: 'Er der en kultur for at tage pauser i dit team?'
      },
      {
        id: 'kropssignaler',
        titel: 'Kroppens signaler',
        medarbejder: 'Kan du mærke når din krop signalerer stress (spændte skuldre, hurtig puls)?',
        leder: 'Er du opmærksom på fysiske stresssignaler hos dine medarbejdere?'
      },
      {
        id: 'reguleringsredskaber',
        titel: 'Reguleringsredskaber',
        medarbejder: 'Har du konkrete redskaber til at regulere dig selv, når presset stiger?',
        leder: 'Har dit team adgang til og kendskab til reguleringsredskaber?'
      },
      {
        id: 'miljoe',
        titel: 'Arbejdsmiljø',
        medarbejder: 'Støtter dit fysiske arbejdsmiljø (lys, lyd, temperatur) din regulering?',
        leder: 'Prioriterer du arbejdsmiljøet som en reguleringsfaktor for teamet?'
      },
      {
        id: 'recovery',
        titel: 'Recovery efter pres',
        medarbejder: 'Kan du komme dig efter intense perioder uden at bære stressen videre?',
        leder: 'Skaber du rum for recovery i teamet efter pressede perioder?'
      },
      {
        id: 'energi',
        titel: 'Generelt energiniveau',
        medarbejder: 'Har du generelt energi og overskud i din arbejdsdag?',
        leder: 'Oplever du at teamet generelt har energi og overskud?'
      }
    ]
  },

  tilstande: {
    titel: 'Tre tilstande',
    ikon: '◎',
    generelt: {
      medarbejder: 'Hvor godt kender du dine nervesystemstilstande (grøn/gul/rød) i hverdagen?',
      leder: 'Hvor godt kan du aflæse dit teams nervesystemstilstande?'
    },
    vinkler: [
      {
        id: 'genkendelse',
        titel: 'Genkendelse',
        medarbejder: 'Kan du genkende når du skifter mellem grøn, gul og rød tilstand?',
        leder: 'Kan du aflæse når teamet skifter mellem tilstandene?'
      },
      {
        id: 'groen_tid',
        titel: 'Tid i grøn',
        medarbejder: 'Tilbringer du en god del af din arbejdsdag i grøn tilstand (ro, fokus, kreativitet)?',
        leder: 'Tilbringer dit team tilstrækkelig tid i grøn tilstand?'
      },
      {
        id: 'gul_haandtering',
        titel: 'Håndtering af gul',
        medarbejder: 'Kan du regulere dig selv ned, når du mærker gul alarm (stress, irritation)?',
        leder: 'Kan du hjælpe teamet med at regulere ned fra gul alarm?'
      },
      {
        id: 'roed_bevidsthed',
        titel: 'Bevidsthed om rød',
        medarbejder: 'Genkender du når du er i rød tilstand (udmattet, fraværende, lukket ned)?',
        leder: 'Genkender du når medarbejdere er i rød tilstand (nedlukning)?'
      },
      {
        id: 'skift_evne',
        titel: 'Evne til at skifte',
        medarbejder: 'Har du redskaber til bevidst at bevæge dig fra én tilstand til en anden?',
        leder: 'Tilpasser du din ledelse til teamets aktuelle tilstand?'
      },
      {
        id: 'tilstandssprog',
        titel: 'Fælles sprog',
        medarbejder: 'Har du og dine kolleger et sprog for jeres tilstande?',
        leder: 'Har teamet et fælles sprog for nervesystemtilstande?'
      }
    ]
  },

  ledelse: {
    titel: 'Ledelse & kultur',
    ikon: '◈',
    generelt: {
      medarbejder: 'Hvordan oplever du ledelse og kultur på din arbejdsplads?',
      leder: 'Hvordan vurderer du din egen ledelse og den kultur du skaber?'
    },
    vinkler: [
      {
        id: 'psyk_tryghed',
        titel: 'Psykologisk tryghed',
        medarbejder: 'Kan du sige "jeg ved det ikke" eller indrømme fejl uden frygt?',
        leder: 'Kan dine medarbejdere indrømme fejl og stille spørgsmål uden frygt?'
      },
      {
        id: 'feedback',
        titel: 'Feedback',
        medarbejder: 'Får du feedback der er specifik, respektfuld og brugbar?',
        leder: 'Giver du feedback der er specifik, rettidig og venlig?'
      },
      {
        id: 'tillid',
        titel: 'Tillid',
        medarbejder: 'Oplever du tillidsbaseret ledelse (autonomi, ansvar) fremfor kontrol?',
        leder: 'Leder du med tillid og autonomi fremfor kontrol og overvågning?'
      },
      {
        id: 'coregulering',
        titel: 'Co-regulering',
        medarbejder: 'Oplever du at din leder er en rolig og regulerende tilstedeværelse?',
        leder: 'Er du bevidst om at dit nervesystem smitter direkte over på teamet?'
      },
      {
        id: 'konsistens',
        titel: 'Konsistens',
        medarbejder: 'Er din leders reaktioner forudsigelige og konsistente?',
        leder: 'Er dine reaktioner konsistente — reagerer du ens på fejl og succes?'
      },
      {
        id: 'kultur_signaler',
        titel: 'Kultursignaler',
        medarbejder: 'Understøtter kulturen ægte trivsel — eller er det bare fine ord?',
        leder: 'Matcher dine handlinger de værdier du kommunikerer om trivsel?'
      }
    ]
  },

  samarbejde: {
    titel: 'Samarbejdsmønstre',
    ikon: '◇',
    generelt: {
      medarbejder: 'Hvordan fungerer dit samarbejde med kolleger i hverdagen?',
      leder: 'Hvordan vurderer du samarbejdskvaliteten i dit team?'
    },
    vinkler: [
      {
        id: 'hjælp',
        titel: 'Bede om hjælp',
        medarbejder: 'Kan du bede om hjælp uden at føle dig svag eller utilstrækkelig?',
        leder: 'Er det legitimt i teamet at bede om hjælp og støtte?'
      },
      {
        id: 'konflikter',
        titel: 'Konflikthåndtering',
        medarbejder: 'Kan du håndtere uenigheder uden at trække dig eller eskalere?',
        leder: 'Håndteres konflikter konstruktivt i teamet — eller går de under jorden?'
      },
      {
        id: 'graenser',
        titel: 'Grænser i samarbejde',
        medarbejder: 'Kan du sige fra og sætte grænser overfor kolleger?',
        leder: 'Respekteres individuelle grænser i teamsamarbejdet?'
      },
      {
        id: 'moenstre',
        titel: 'Bevidsthed om mønstre',
        medarbejder: 'Er du bevidst om dine egne samarbejdsmønstre (tilbagetrækning, overtilpasning)?',
        leder: 'Forstår du de forskellige samarbejdsstile i dit team?'
      },
      {
        id: 'forbindelse',
        titel: 'Ægte forbindelse',
        medarbejder: 'Føler du dig ægte forbundet med dine kolleger — ikke bare professionelt?',
        leder: 'Er der reel menneskelig forbindelse i teamet — udover opgaver?'
      },
      {
        id: 'fleksibilitet',
        titel: 'Fleksibilitet',
        medarbejder: 'Kan du tilpasse din samarbejdsstil til forskellige kolleger og situationer?',
        leder: 'Er teamets samarbejde fleksibelt nok til at rumme forskelle?'
      }
    ]
  },

  krop: {
    titel: 'Krop & bevægelse',
    ikon: '○',
    generelt: {
      medarbejder: 'Hvordan har din krop det i din arbejdshverdag?',
      leder: 'Hvor godt understøtter du kropslig bevidsthed og bevægelse i teamet?'
    },
    vinkler: [
      {
        id: 'bevaegelse',
        titel: 'Bevægelse i hverdagen',
        medarbejder: 'Bevæger du dig regelmæssigt i løbet af din arbejdsdag?',
        leder: 'Er der plads til bevægelse og kropslige pauser i teamets hverdag?'
      },
      {
        id: 'spaending',
        titel: 'Kropslig spænding',
        medarbejder: 'Er du fri for kronisk spænding (nakke, skuldre, kæbe)?',
        leder: 'Er du opmærksom på fysiske spændingssignaler i dit team?'
      },
      {
        id: 'interoception',
        titel: 'Kropsbevidsthed',
        medarbejder: 'Kan du mærke hvad din krop har brug for (bevægelse, hvile, mad)?',
        leder: 'Opfordrer du teamet til at lytte til kroppens signaler?'
      },
      {
        id: 'ergonomi',
        titel: 'Fysiske rammer',
        medarbejder: 'Støtter din fysiske arbejdsplads din krop (stol, bord, variation)?',
        leder: 'Investerer du i fysiske rammer der støtter kroppens behov?'
      },
      {
        id: 'skaerm',
        titel: 'Skærmbalance',
        medarbejder: 'Tager du bevidste pauser fra skærmen (øjne, nakke, hænder)?',
        leder: 'Er der kultur for skærmpauser og variation i arbejdsstillinger?'
      },
      {
        id: 'gaa_moeder',
        titel: 'Bevægelse i samarbejde',
        medarbejder: 'Bruger du bevægelse som del af dit arbejde (gå-møder, stående arbejde)?',
        leder: 'Bruger du gå-møder eller bevægelse som del af teamets arbejdsformer?'
      }
    ]
  },

  aandedraet: {
    titel: 'Åndedræt & pauser',
    ikon: '◌',
    generelt: {
      medarbejder: 'Hvor bevidst er du om dit åndedræt og dine pauser i arbejdsdagen?',
      leder: 'Hvor godt understøtter du bevidst åndedræt og pauser i teamet?'
    },
    vinkler: [
      {
        id: 'bevidst_aande',
        titel: 'Bevidst åndedræt',
        medarbejder: 'Bruger du bevidst åndedræt som reguleringsredskab i din hverdag?',
        leder: 'Bruger du selv bevidst åndedræt — og viser du det for teamet?'
      },
      {
        id: 'pauser',
        titel: 'Ægte pauser',
        medarbejder: 'Tager du ægte pauser (ikke skærm-scroll) i din arbejdsdag?',
        leder: 'Skaber du rum for ægte pauser i teamets kalender?'
      },
      {
        id: 'vejr_under_pres',
        titel: 'Åndedræt under pres',
        medarbejder: 'Kan du bruge åndedræt til at regulere dig selv i pressede situationer?',
        leder: 'Bruger du åndedræt bevidst til at regulere rummet i pressede møder?'
      },
      {
        id: 'udaanding',
        titel: 'Forlænget udånding',
        medarbejder: 'Kender og bruger du teknikker som 4-7-8 eller box breathing?',
        leder: 'Har du introduceret åndedrætstekniker i teamet?'
      },
      {
        id: 'faelles_aande',
        titel: 'Fælles åndedræt',
        medarbejder: 'Oplever du fælles åndedræts- eller landingsøjeblikke i dit team?',
        leder: 'Starter du møder med fælles landing eller åndedræt?'
      },
      {
        id: 'mellemrum',
        titel: 'Mellemrum mellem opgaver',
        medarbejder: 'Har du bevidste overgange mellem opgaver — eller kører du non-stop?',
        leder: 'Er der bevidste overgange og mellemrum i teamets arbejdsrytme?'
      }
    ]
  },

  resiliens: {
    titel: 'Resiliens & grænser',
    ikon: '◆',
    generelt: {
      medarbejder: 'Hvordan oplever du din modstandskraft og evne til at sætte grænser?',
      leder: 'Hvordan vurderer du teamets resiliens og evne til at beskytte grænser?'
    },
    vinkler: [
      {
        id: 'graenser_arbejdstid',
        titel: 'Grænser for arbejdstid',
        medarbejder: 'Har du klare grænser for hvornår arbejdsdagen slutter?',
        leder: 'Respekterer du og kulturen medarbejdernes grænser for arbejdstid?'
      },
      {
        id: 'overbelastning',
        titel: 'Tegn på overbelastning',
        medarbejder: 'Genkender du tidlige tegn på overbelastning hos dig selv?',
        leder: 'Genkender du tidlige tegn på overbelastning i dit team?'
      },
      {
        id: 'nej_sige',
        titel: 'At sige nej',
        medarbejder: 'Kan du sige nej til opgaver, når du har for meget?',
        leder: 'Er det legitimt i teamet at sige "jeg har for meget lige nu"?'
      },
      {
        id: 'recovery_evne',
        titel: 'Recovery-evne',
        medarbejder: 'Kan du vende tilbage til normal funktion efter pressede perioder?',
        leder: 'Vender teamet hurtigt tilbage efter pressede perioder?'
      },
      {
        id: 'soevn_hvile',
        titel: 'Søvn og hvile',
        medarbejder: 'Sover du godt — uden at arbejdstanker holder dig vågen?',
        leder: 'Tager du din egen hvile og recovery alvorligt som leder?'
      },
      {
        id: 'langsigtighed',
        titel: 'Langsigtet bæredygtighed',
        medarbejder: 'Føler du at dit nuværende tempo er bæredygtigt på lang sigt?',
        leder: 'Er teamets nuværende tempo bæredygtigt på lang sigt?'
      }
    ]
  }
};

// ── Assessment: Opsummeringstekster per score-niveau ──
var ASSESSMENT_NIVEAUER = {
  lav: { min: 1, max: 4, label: 'Udfordret', farve: 'var(--rose)' },
  middel: { min: 5, max: 7, label: 'I udvikling', farve: 'var(--amber)' },
  hoej: { min: 8, max: 10, label: 'Velfungerende', farve: 'var(--sage)' }
};

function getNiveau(score) {
  if (score <= 4) return ASSESSMENT_NIVEAUER.lav;
  if (score <= 7) return ASSESSMENT_NIVEAUER.middel;
  return ASSESSMENT_NIVEAUER.hoej;
}

// ── Assessment: Anbefalinger baseret på dimension og niveau ──
var ASSESSMENT_ANBEFALINGER = {
  centrum: {
    lav: 'Din stressregulering har brug for opmærksomhed. Start med de mest basale redskaber: micro-pauser og grounding. Prøv øvelsen "Skrivebordsgrounding" — den tager 2 minutter og kan ændre din dag.',
    middel: 'Du har et fundament for regulering, men der er plads til at styrke det. Fokusér på at gøre pauser og regulering til en fast del af din dag — ikke kun når presset stiger.',
    hoej: 'Din stressregulering er stærk. Bliv ved med det du gør — og overvej at dele dine strategier med kolleger. Du kan være en regulerende kraft i dit team.'
  },
  tilstande: {
    lav: 'Du har brug for at lære dit nervesystems tilstande bedre at kende. Start med at tjekke ind på Trappen én gang dagligt — bare det at navngive din tilstand er et stort skridt.',
    middel: 'Du begynder at genkende dine tilstande. Næste skridt er at øve dig i at skifte bevidst — brug åndedræt til at gå fra gul til grøn, og bevægelse til at gå fra rød til gul.',
    hoej: 'Du har et stærkt kendskab til dine tilstande. Du kan navigere bevidst — og det giver dig frihed til at vælge din respons i stedet for at reagere automatisk.'
  },
  ledelse: {
    lav: 'Din oplevelse af ledelse og kultur er udfordret. Søg co-regulering fra de kolleger der giver dig ro, og overvej at tale med din leder om hvad du har brug for.',
    middel: 'Der er gode elementer i din oplevelse af ledelse, men også områder der kan styrkes. Overvej hvad der specifikt giver dig tryghed — og hvad der aktiverer din alarm.',
    hoej: 'Du oplever en ledelse og kultur der støtter dit nervesystem. Det er et stærkt fundament — værdsæt det og bidrag aktivt til at bevare det.'
  },
  samarbejde: {
    lav: 'Dine samarbejdsmønstre er under pres. Det er normalt — og det kan ændres. Start med at lægge mærke til dine mønstre under stress: trækker du dig, overtilpasser du, eller eskalerer du?',
    middel: 'Dit samarbejde fungerer, men der er mønstre du kan blive mere bevidst om. Reflektér over hvad der trigger dig i samarbejdet — det er ofte gamle mønstre, ikke den aktuelle situation.',
    hoej: 'Dit samarbejde er fleksibelt og trygt. Du kan navigere forskellige relationer med ro. Det er en styrke — brug den bevidst til at skabe tryghed for andre.'
  },
  krop: {
    lav: 'Din krop bærer presset. Begynd med det simpleste: rejs dig hvert 45. minut, rul skuldrene, mærk fødderne. Din krop er dit vigtigste reguleringsredskab.',
    middel: 'Du har en vis kontakt med din krop, men den kan styrkes. Prøv at integrere mere bevægelse i din arbejdsdag — gå-møder, stående arbejde, bevidste stretchpauser.',
    hoej: 'Du har god kontakt med din krop og bruger bevægelse som regulering. Det er en af de mest effektive strategier — bliv ved.'
  },
  aandedraet: {
    lav: 'Dit åndedræt og dine pauser har brug for opmærksomhed. Start med det mest basale: tre bevidste vejrtrækninger mellem opgaver. Det tager 30 sekunder og ændrer din fysiologi.',
    middel: 'Du har begyndt at bruge åndedræt bevidst. Styrk det ved at gøre det til en vane: før møder, efter mails, i overgange. Jo mere automatisk det bliver, jo mere regulerer det.',
    hoej: 'Dit åndedræt er et aktivt reguleringsredskab for dig. Du bruger det bevidst og det gør en forskel. Overvej fælles åndedræt med kolleger — co-regulering forstærker effekten.'
  },
  resiliens: {
    lav: 'Din resiliens er under pres — og det er vigtigt at handle nu. Sæt én konkret grænse denne uge. Recovery er ikke luksus, det er nødvendigt for at du kan fortsætte.',
    middel: 'Du har elementer af resiliens, men der er områder der kan styrkes. Fokusér på recovery: ægte pauser, grænser for arbejdstid, og bevægelse uden for arbejdet.',
    hoej: 'Din resiliens er stærk. Du kender dine grænser og respekterer dem. Det er fundamentet for langsigtigt godt arbejde — og et eksempel for andre.'
  }
};
