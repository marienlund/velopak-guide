# 🚴 Velopak Guide

Intern adresseguide for Velopak — en cykelkurer-virksomhed. Kontorpersonale tilføjer leveringsadresser med fotos, og kurerer slår dem op på telefonen.

## Features

- 🔍 Søgbar adresseliste (firma, adresse, postnr., by, noter)
- 📍 Per adresse: firmanavn, adresse, fotos af indgang/leveringssted, noter, Google Maps-link
- 👤 To roller: **admin** (CRUD) og **kurer** (kun læsning)
- 🔐 Login via Supabase (email/password)
- 📱 Mobilvenligt dark theme med grøn accent
- 🇩🇰 Dansk UI

## Tech Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS v4**
- **Supabase** (Auth, Database, Storage)
- **Lucide React** (ikoner)

## Kom i gang

### 1. Installer dependencies

```bash
npm install
```

### 2. Opsæt Supabase

1. Opret et projekt på [supabase.com](https://supabase.com)
2. Kør SQL fra `supabase-schema.sql` i SQL Editor
3. Kopiér `.env.example` til `.env.local` og udfyld dine Supabase-nøgler

```bash
cp .env.example .env.local
```

### 3. Start udviklingsserver

```bash
npm run dev
```

Åbn [http://localhost:3000](http://localhost:3000)

### Mock-tilstand

Sæt `NEXT_PUBLIC_USE_MOCK_DATA=true` i `.env.local` for at teste uden Supabase. Appen viser eksempeldata og springer login over.

## Database

Se `supabase-schema.sql` for komplet schema inkl.:

- **profiles** — brugerprofiler med roller
- **addresses** — leveringsadresser
- **address_photos** — fotos tilknyttet adresser
- RLS policies for sikkerhed
- Auto-oprettelse af profil ved signup
- Auto-opdatering af `updated_at`

## Projektstruktur

```
src/
├── app/
│   ├── layout.tsx          # Root layout (dark theme)
│   ├── page.tsx            # Adresseliste (forside)
│   ├── login/page.tsx      # Login-side
│   └── adresse/[id]/       # Adresse-detaljer
├── components/
│   ├── Header.tsx          # Navigation
│   ├── SearchBar.tsx       # Søgefelt
│   ├── AddressCard.tsx     # Adressekort i listen
│   ├── AddressForm.tsx     # Opret/rediger formular
│   └── PhotoUpload.tsx     # Foto-upload komponent
└── lib/
    ├── types.ts            # TypeScript typer
    ├── mock-data.ts        # Mock data til test
    ├── hooks/
    │   ├── use-auth.ts     # Auth hook
    │   └── use-addresses.ts # Adresse CRUD hook
    └── supabase/
        ├── client.ts       # Browser client
        ├── server.ts       # Server client
        └── middleware.ts    # Auth middleware
```
