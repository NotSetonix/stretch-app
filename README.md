# Desk Reset

A React Native mobile application built with Expo for CSI2114 Sprint 1.

## Target Domain

Health & Fitness — specifically workplace and screen-related musculoskeletal health.

## Problem Statement

This is for people who spend very long stretches at a screen. I'm at around 12 hours a day between addon production work and study.
This is because of my shoulder pain and numbness that builds over a working day
In the past I tried physiotherapy, balms and ointments. The treatments themselves work; what fails is doing them consistently once I'm back at the desk.
I realized because it's an inconsistency problem rather than a knowledge problem, what's needed is something that makes the right stretch quick to find in the moment, not another long guide to read.

## How the App Solves It

Tapping "Shoulders" shows only shoulder stretches, so finding something relevant takes seconds. Connect it to your consistency point: the faster it is to find, the more likely you actually do it.
Numbered steps and a common mistake, so the stretch is done correctly rather than guessed at.
Each stretch states its duration, which removes the "how long is enough" question.
The app doesn't try to replace physiotherapy, it just lowers the effort of doing the right thing during a work session.

## Features

- Browse 12 stretches organised by body area
- Filter by body area (Wrists, Neck, Shoulders, Back, Hips, Eyes)
- Detail view with step-by-step instructions, hold time, difficulty, and common mistakes
- Settings screen with display preferences
- Counter tracking how many stretches have been viewed this session

## Technical Implementation

- **Navigation:** Expo Router file-based routing. A root stack contains a tab group (Home, Settings); the detail screen is a dynamic route at `app/stretch/[id].tsx` that sits in the root stack so it slides over the tabs with a back button.
- **FlatList:** Renders 12 items from a local array in `data/stretches.js`, with `keyExtractor` using each item's unique `id`.
- **State:** `useState` hooks manage the selected body-area filter and the viewed counter on Home, and two display toggles on Settings. Changing state via its setter triggers a re-render, which is how the filtered list updates on tap.
- **Data:** Static local array, separated from presentation so screens import rather than contain content.

## Setup Instructions

1. Clone the repository:
   `git clone https://github.com/NotSetonix/stretch-app.git`
2. Install dependencies:
   `npm install`
3. Start the development server:
   `npx expo start`
4. Scan the QR code with the Expo Go app on an Android device, or press `a` to open an Android emulator.

Requires Node.js (LTS) and the Expo Go app.

## Screenshots

### Home
![Home screen](screenshots/home.png)

### Detail
![Detail screen](screenshots/detail.png)

### Settings
![Settings screen](screenshots/settings.png)

## Note

Stretch guidance in this app is general information, not medical advice.