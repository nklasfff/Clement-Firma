# Supabase Setup Guide — Clement WellbeingAtWork

## Hurtig opsætning (15 minutter)

### 1. Opret Supabase-projekt

1. Gå til [supabase.com](https://supabase.com) og opret en gratis konto
2. Klik **New Project** og vælg et navn (f.eks. "clement-wellbeing")
3. Vælg en region tæt på dig (f.eks. "West EU - Frankfurt")
4. Sæt et database-password og gem det sikkert

### 2. Kør database-schema

1. I dit Supabase dashboard, gå til **SQL Editor**
2. Klik **New query**
3. Copy-paste hele indholdet af `schema.sql` og kør det
4. Copy-paste hele indholdet af `seed.sql` og kør det (dette tilføjer eksisterende øvelser og refleksioner)

### 3. Opret admin-bruger

1. Gå til **Authentication** → **Users**
2. Klik **Add user** → **Create new user**
3. Skriv din email og adgangskode
4. Denne bruger bruges til at logge ind i admin-panelet

### 4. Tilslut appen

1. Gå til **Settings** → **API** i dit Supabase dashboard
2. Kopiér **Project URL** og **anon/public key**
3. Åbn `index.html` og tilføj disse meta tags i `<head>`:

```html
<meta name="supabase-url" content="https://DIT-PROJEKT-ID.supabase.co">
<meta name="supabase-key" content="din-anon-key-her">
```

4. Gør det samme i `admin.html`

### 5. Test det

1. Åbn `admin.html` i browseren
2. Log ind med din admin-bruger
3. Du bør nu se øvelser og refleksioner fra databasen
4. Prøv at tilføje en ny øvelse
5. Åbn `index.html` — den nye øvelse vises automatisk

## Sådan fungerer det

```
index.html (brugeren)          admin.html (Anne Marie)
    │                               │
    │  Hent indhold                 │  CRUD operationer
    ▼                               ▼
┌─────────────────────────────────────┐
│         Supabase (gratis)           │
│  ┌──────────┐  ┌──────────────────┐ │
│  │ Database  │  │ Authentication   │ │
│  │ exercises │  │ admin login      │ │
│  │ reflec... │  │                  │ │
│  │ subscri.. │  │                  │ │
│  └──────────┘  └──────────────────┘ │
└─────────────────────────────────────┘
```

- **Appen (index.html)** henter indhold fra Supabase. Hvis Supabase ikke er konfigureret eller utilgængeligt, falder den automatisk tilbage til de lokale JavaScript-filer (data.js/data-en.js).
- **Admin-panelet (admin.html)** kræver login og giver adgang til at redigere øvelser, refleksioner, og se email-tilmeldinger.
- **Email-tilmeldinger** gemmes i Supabase når en bruger tilmelder sig i app-menuen.

## Sikkerhed

- **Row Level Security (RLS)** er aktiveret på alle tabeller
- Offentlige brugere kan kun *læse* aktivt indhold
- Kun autentificerede admin-brugere kan oprette, redigere og slette
- Email-tilmeldinger: alle kan *tilmelde sig*, kun admin kan *se* listen

## Email-notifikationer (valgfrit)

For at sende rigtige email-notifikationer skal du:

1. Oprette en Supabase Edge Function eller bruge en tredjeparts email-service (Resend, SendGrid)
2. Opsætte en database trigger der kalder funktionen når nye subscribers tilføjes
3. Se Supabase docs for Edge Functions: https://supabase.com/docs/guides/functions
