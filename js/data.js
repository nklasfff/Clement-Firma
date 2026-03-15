/* ═══════════════════════════════════════════
   Clement Firma — Data
   Alt indhold til cirkler, øvelser, zoner og temaer
   ═══════════════════════════════════════════ */

// Dynamiske tekster inde i SVG-cirklerne — skifter med perspektiv
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
    medarbejder: ["Dine samarbejds-", "mønstre"],
    leder: ["Teamets", "samarbejdsmønstre"]
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

const CIRKLER = {
  centrum: {
    titel: "Stressregulering på kontoret",
    medarbejder: {
      beskrivelse: "Dit nervesystem er dit vigtigste arbejdsredskab. Når det er reguleret, tænker du klarere, samarbejder bedre og holder længere.",
      punkter: [
        "Tag micro-pauser mellem møder — bare 60 sekunder kan nulstille dit system",
        "Brug grounding: mærk fødderne mod gulvet, hænderne mod bordet",
        "Regulér dit miljø: juster lys, lyd og temperatur så det passer dig",
        "Læg mærke til hvornår du holder vejret — det er et tegn på spænding"
      ],
      tip: "Prøv det nu: Mærk dine fødder mod gulvet. Tag tre langsomme vejrtrækninger. Det er stressregulering."
    },
    leder: {
      beskrivelse: "Et reguleret team præsterer bedre. Som leder sætter du tonen for hele teamets nervesystem.",
      punkter: [
        "Start møder med et øjebliks stilhed — det regulerer hele rummet",
        "Skab pauser i kalenderen: 50-minutters møder i stedet for 60",
        "Vær opmærksom på teamets energiniveau og juster tempoet",
        "Model regulering: vis at det er okay at tage pauser"
      ],
      tip: "Som leder regulerer du ikke bare dig selv — du regulerer rummet. Dit nervesystem smitter."
    }
  },

  tilstande: {
    titel: "Tre tilstande i din arbejdsdag",
    medarbejder: {
      beskrivelse: "I løbet af en arbejdsdag skifter du mellem tre tilstande. At genkende dem er første skridt til at regulere dig selv.",
      punkter: [
        "<strong style='color:#6B8F71'>Grøn zone:</strong> Du er fokuseret, kreativ og samarbejdende — flowet kører",
        "<strong style='color:#C4956A'>Gul zone:</strong> Du mærker stress, pres eller irritation — kroppen er i alarmberedskab",
        "<strong style='color:#A45B6E'>Rød zone:</strong> Du er udmattet, lukket ned eller fraværende — energien er brugt op",
        "Det er normalt at skifte mellem zonerne — det handler om at opdage det"
      ],
      tip: "Check ind med dig selv lige nu: Hvilken farve er du i? Der er intet forkert svar."
    },
    leder: {
      beskrivelse: "Som leder kan du lære at aflæse dit teams tilstande og tilpasse din kommunikation derefter.",
      punkter: [
        "Et team i grøn zone er klar til kreativt og strategisk arbejde",
        "Et team i gul zone har brug for klarhed, struktur og tryghed",
        "Et team i rød zone har brug for pause, omsorg og reduceret belastning",
        "Spørg i 1:1-samtaler: 'Hvilken zone er du mest i for tiden?'"
      ],
      tip: "Prøv at starte et møde med: 'Giv et tal fra 1-10 for jeres energi lige nu.' Det åbner for ærlighed."
    }
  },

  ledelse: {
    titel: "Ledelse og arbejdskultur",
    medarbejder: {
      beskrivelse: "Din relation til din leder og din oplevelse af kulturen påvirker dit nervesystem hver dag.",
      punkter: [
        "Psykologisk tryghed betyder at du kan sige 'jeg ved det ikke' uden frygt",
        "God feedback regulerer — dårlig feedback dysregulerer",
        "Du har ret til at sætte grænser, også overfor din leder",
        "Søg alliancer: find kolleger der giver dig ro og energi"
      ],
      tip: "Tænk på én person på arbejdet der får dig til at føle dig tryg. Hvad gør de? Kan du gøre det samme for andre?"
    },
    leder: {
      beskrivelse: "Du er den vigtigste reguleringsfaktor i dit team. Din adfærd former kulturen.",
      punkter: [
        "Psykologisk tryghed skabes gennem konsistens, ikke perfektion",
        "Giv feedback der er specifik, rettidig og venlig — det regulerer",
        "Tillidsbaseret ledelse giver bedre resultater end kontrolbaseret",
        "Dine egne stressreaktioner smitter — regulér dig selv først"
      ],
      tip: "Spørg dit team: 'Hvad har I brug for fra mig for at trives?' Og lyt uden at forsvare dig."
    }
  },

  samarbejde: {
    titel: "Samarbejdsmønstre",
    medarbejder: {
      beskrivelse: "Vi tager vores samarbejdsmønstre med os på arbejde. At forstå dem gør dig til en bedre kollega.",
      punkter: [
        "Nogle trækker sig under pres, andre bliver kontrolerende — begge er stressreaktioner",
        "Tryg samarbejdsstil: du kan bede om hjælp og sige fra",
        "Utryg samarbejdsstil: du overarbejder for at bevise dit værd, eller undgår konflikter",
        "Bevidsthed om dine mønstre giver dig valget om at gøre noget anderledes"
      ],
      tip: "Næste gang du mærker spænding med en kollega, spørg dig selv: 'Er det situationen, eller er det et mønster jeg kender?'"
    },
    leder: {
      beskrivelse: "Forstå teamets samarbejdsmønstre for at skabe bedre dynamik og forebygge konflikter.",
      punkter: [
        "Forskellige samarbejdsstile er ikke rigtige eller forkerte — de er strategier",
        "Skab klare roller og forventninger — det reducerer utryghed",
        "Facilitér teamøvelser der styrker tilhørsforhold",
        "Vær opmærksom på dem der bliver stille — de har ofte mest brug for dig"
      ],
      tip: "Overvej: Hvem i dit team har du mindst kontakt med? Ræk ud til dem denne uge."
    }
  },

  krop: {
    titel: "Krop og bevægelse i hverdagen",
    medarbejder: {
      beskrivelse: "Din krop er ikke bare transport til hovedet. Den er en aktiv del af hvordan du tænker, føler og præsterer.",
      punkter: [
        "Stillesiddende arbejde aktiverer stressresponsen over tid",
        "Rejse dig og bevæge dig hvert 45. minut nulstiller systemet",
        "Skrivebords-stretching: rul skuldrene, drej nakken, stræk armene",
        "Gå-møder aktiverer kreativiteten og regulerer nervesystemet"
      ],
      tip: "Rejs dig op lige nu. Rul skuldrene tre gange. Mærk forskellen. Det tager 10 sekunder."
    },
    leder: {
      beskrivelse: "Skab en kultur hvor bevægelse er en del af arbejdsdagen, ikke en afbrydelse.",
      punkter: [
        "Indfør gå-møder for 1:1-samtaler",
        "Gør det legitimt at rejse sig og bevæge sig under møder",
        "Stå-borde og fleksible arbejdspladser støtter kroppens behov",
        "Ergonomi er ikke luksus — det er nervesystem-støtte"
      ],
      tip: "Foreslå et gå-møde denne uge. Det ændrer både samtalen og energien."
    }
  },

  aandedraet: {
    titel: "Åndedræt og pauser",
    medarbejder: {
      beskrivelse: "Dit åndedræt er den hurtigste vej til at regulere dit nervesystem. Du har det altid med dig.",
      punkter: [
        "4-7-8 åndedræt: 4 sek ind, 7 sek hold, 8 sek ud — beroligende",
        "Box breathing: 4 sek ind, 4 sek hold, 4 sek ud, 4 sek hold — fokuserende",
        "Forlænget udånding aktiverer dit beroligende nervesystem",
        "Bare tre bevidste vejrtrækninger kan ændre din tilstand"
      ],
      tip: "Prøv det nu: Indånd 4 sekunder, hold 4 sekunder, udånd 4 sekunder, hold 4 sekunder. Gentag to gange."
    },
    leder: {
      beskrivelse: "Kollektive åndedrætspauser er et af de mest effektive værktøjer til teamregulering.",
      punkter: [
        "Start møder med 30 sekunders stille åndedræt — det samler gruppen",
        "Indbyg bevidste pauser i lange workshops og strategi-dage",
        "Model det selv: tag en synlig vejrtrækning før du taler",
        "Det er ikke 'mærkeligt' — det er evidensbaseret og effektivt"
      ],
      tip: "Prøv at starte dit næste møde med: 'Lad os lige lande. Tre vejrtrækninger sammen.' Se hvad der sker."
    }
  },

  resiliens: {
    titel: "Mentalt pres og resiliens",
    medarbejder: {
      beskrivelse: "Overbelastning er ikke et tegn på svaghed — det er et signal fra dit nervesystem om at noget skal ændres.",
      punkter: [
        "Tegn på overbelastning: du zoner ud, glemmer ting, føler dig følelsesløs",
        "Burnout kommer sjældent pludseligt — det bygger sig op over uger og måneder",
        "Sæt bevidste grænser: 'Jeg svarer ikke på mails efter kl. 18'",
        "Resiliens er ikke at holde ud — det er at vide hvornår du skal stoppe"
      ],
      tip: "Spørg dig selv: 'Hvornår havde jeg sidst en hel weekend uden arbejdstanker?' Hvis du ikke kan huske det, er det et signal."
    },
    leder: {
      beskrivelse: "Forebyg overbelastning i dit team ved at skabe en kultur hvor grænser er legitime.",
      punkter: [
        "Hold øje med ændringer i adfærd: den energiske der bliver stille, den præcise der begynder at glemme",
        "Spørg direkte i 1:1: 'Hvordan har du det egentlig?' — og vent på svaret",
        "Fordel opgaver ud fra kapacitet, ikke bare kompetence",
        "Gør det okay at sige 'Jeg har for meget lige nu'"
      ],
      tip: "Tjek ind med dig selv: Er du selv i risiko for overbelastning? Du kan ikke støtte andre fra en tom tank."
    }
  }
};

const ZONE_SVAR = {
  groen: {
    medarbejder: {
      titel: "Du er i grøn zone — godt!",
      tekst: "Du er reguleret og i balance. Det er det perfekte tidspunkt at tackle kreative opgaver, have vigtige samtaler eller planlægge fremad.",
      oevelse: "Brug denne tilstand: Tag den sværeste eller vigtigste opgave nu. Dit nervesystem er klar."
    },
    leder: {
      titel: "Dit team i grøn zone",
      tekst: "Når teamet er i grøn zone, er det tid til strategisk arbejde, kreative workshops og vigtige beslutninger.",
      oevelse: "Udnyt det: Planlæg kreative sessioner og strategimøder når teamet er i grøn zone — typisk om formiddagen."
    }
  },
  gul: {
    medarbejder: {
      titel: "Du er i gul zone — pres og stress",
      tekst: "Dit nervesystem er aktiveret. Det er ikke farligt, men det er et signal om at du har brug for regulering. Undgå store beslutninger lige nu.",
      oevelse: "Prøv nu: Sæt begge fødder på gulvet. Tag 4 langsomme vejrtrækninger med forlænget udånding. Mærk skuldrene sænke sig."
    },
    leder: {
      titel: "Teamet er presset",
      tekst: "Et team i gul zone har brug for klarhed og struktur, ikke flere opgaver. Prioritér og fjern usikkerhed.",
      oevelse: "Handling: Saml teamet kort. Sig: 'Hvad er det vigtigste vi skal nå? Hvad kan vente?' Klarhed regulerer."
    }
  },
  roed: {
    medarbejder: {
      titel: "Du er i rød zone — tid til omsorg",
      tekst: "Dit system er overbelastet eller lukket ned. Det er ikke et tegn på svaghed — det er et signal om at du har brug for genopladning. Nu.",
      oevelse: "Det vigtigste lige nu: Rejs dig. Gå væk fra skærmen i 10 minutter. Drik vand. Mærk dine fødder mod gulvet. Du behøver ikke præstere lige nu."
    },
    leder: {
      titel: "Teamet er udkørt",
      tekst: "Et team i rød zone producerer dårligt arbejde og risikerer fejl og sygemeldinger. Det er tid til at reducere belastning.",
      oevelse: "Akut handling: Aflys ikke-kritiske møder. Fjern opgaver fra bordet. Sig højt: 'Vi trækker vejret og prioriterer.' Det giver permission."
    }
  }
};

const OEVELSER = [
  {
    titel: "Skrivebordsgrounding",
    tid: "2 min",
    sted: "Ved skrivebordet",
    cirkel: "centrum",
    temaer: ["generelt", "skaerm"],
    instruktion: "Mærk dine fødder mod gulvet. Mærk hænderne mod bordet. Tag tre dybe vejrtrækninger.<br>Kig på tre ting i rummet og navngiv dem stille for dig selv.<br>Mærk temperaturen i rummet. Lyt til en lyd. Du er her."
  },
  {
    titel: "Møde-reset",
    tid: "1 min",
    sted: "Mødelokalet",
    cirkel: "aandedraet",
    temaer: ["moeder"],
    instruktion: "Inden mødet begynder: 4 sekunders indånding, 7 sekunders holde, 8 sekunders udånding.<br>Gentag to gange.<br>Sæt en intention for mødet: Hvad vil du bidrage med? Hvad har du brug for?"
  },
  {
    titel: "Deadline-åndedræt",
    tid: "3 min",
    sted: "Hvor som helst",
    cirkel: "tilstande",
    temaer: ["deadlines"],
    instruktion: "Check ind: Hvilken zone er du i? Gul? Rød?<br>Box breathing: 4 sek ind — 4 sek hold — 4 sek ud — 4 sek hold.<br>Gentag 4 gange.<br>Check ind igen: Har zonen ændret sig?"
  },
  {
    titel: "Konflikt-parkering",
    tid: "5 min",
    sted: "Et stille sted",
    cirkel: "resiliens",
    temaer: ["konflikter"],
    instruktion: "Navngiv følelsen: Hvad mærker du? Frustration? Uretfærdighed? Angst?<br>Mærk hvor i kroppen følelsen sidder.<br>Spørg dig selv: 'Hvad har jeg brug for lige nu?'<br>Parkér situationen bevidst — du vender tilbage med et reguleret nervesystem."
  },
  {
    titel: "Afslutningsritual",
    tid: "3 min",
    sted: "Ved skrivebordet, sidst på dagen",
    cirkel: "resiliens",
    temaer: ["balance"],
    instruktion: "Skriv tre ting du fik gjort i dag.<br>Skriv én ting du lader ligge til i morgen — og giv dig selv lov.<br>Tre dybe vejrtrækninger. Luk computeren bevidst.<br>Dagen er slut. Du har gjort nok."
  }
];

const TEMA_INDHOLD = {
  generelt: {
    titel: "Generelt — Hverdagens trivsel",
    medarbejder: "Start din dag med et bevidst check-in: Hvilken zone er du i? Hvad har du brug for? Små daglige ritualer bygger langsigtet trivsel.",
    leder: "Skab daglige rutiner der støtter trivsel: korte check-ins, bevidste pauser, synlig omsorg. Kultur bygges i hverdagen, ikke på seminarer."
  },
  moeder: {
    titel: "Møder — Tilstedeværelse og regulering",
    medarbejder: "Mød forberedt — ikke bare fagligt, men nervemæssigt. Et reguleret nervesystem gør dig til en bedre lytter og en klarere kommunikatør.",
    leder: "Start møder med landing. Hold dem korte. Giv plads til stilhed. Et reguleret møde er et produktivt møde."
  },
  deadlines: {
    titel: "Deadlines & Pres — Når tiden presser",
    medarbejder: "Under pres skifter kroppen til overlevelsesmode. Genkend det, regulér dig selv, og arbejd derefter. Kvaliteten stiger når nervesystemet er med.",
    leder: "Når teamet er under pres, er din vigtigste opgave at skabe klarhed og prioritere. Fjern støj, ikke tilføj den."
  },
  skaerm: {
    titel: "Skærmarbejde — Krop og sind ved skærmen",
    medarbejder: "Skærmen fastholder dig i hovedet. Hvert 45. minut: rejs dig, bevæg dig, kig væk. Din krop er ikke bare en stol-holder.",
    leder: "Gør det legitimt at tage skærmpauser. Indfør mødefrie perioder. Skab rum for dybdearbejde uden konstante afbrydelser."
  },
  konflikter: {
    titel: "Konflikter — Spændinger og uenigheder",
    medarbejder: "Konflikter aktiverer nervesystemet. Før du reagerer: regulér. Mærk. Navngiv. Vælg derefter din respons — ikke din reaktion.",
    leder: "Konflikter er uundgåelige. Din opgave er at skabe en kultur hvor uenighed er tryg, og hvor konflikter løses — ikke gemmes."
  },
  balance: {
    titel: "Work-Life Balance — Grænser og genopladning",
    medarbejder: "Balance er ikke 50/50 — det er at vide hvornår du skal give, og hvornår du skal stoppe. Dine grænser er ikke egoistiske. De er nødvendige.",
    leder: "Du sætter standarden. Hvis du sender mails kl. 22, gør dit team det også. Model den balance du ønsker for dit team."
  }
};
