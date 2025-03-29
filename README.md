# Dogifier

An extension that adds dogs to your images. Made as a trial run for an internship position at YourMove.AI

## Techstack

- React
- TypeScript
- Vite

## Features

- Adds playful dog images to user photos using Google's experimental image editing AI
- Seamless integration as a browser extension
- Simple and fast UI
- Copy & Save features for easy usage

## Setup

1. Clone the repository.
2. Run `pnpm install`.
3. Create a `.env` file in the root directory with the following content:
   ```env
   VITE_GEMINI_KEY=your_api_key_here
   ```
4. Replace `your_api_key_here` with a Google Gemini API key.

## Building

1. Run `pnpm run build` to create a build folder.
2. Load the extension by going to `chrome://extensions` (or whatever your browser uses) and click Load Unpacked and selecting the `build` folder.

## Developing

You don't have to build every time you want to see a change happen. Simply run `pnpm run dev` and the extension popup will be within a webpage hosted locally.
