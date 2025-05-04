# Video QA Next.js Frontend

This directory contains the Next.js frontend application based on the content you provided.

## Running the Project Locally

1.  **Prerequisites:** Ensure you have Node.js (v20 or later) and pnpm installed.
2.  **Navigate to the project directory:** Open your terminal and change the directory to `/home/ubuntu/extracted_content` (or wherever you extract the final zip file).
3.  **Install dependencies:** Run the command `pnpm install`.
4.  **Start the development server:** Run the command `pnpm run dev`.
5.  **Open in browser:** Access the application at `http://localhost:3000`.

## Backend Integration

As requested, the frontend is set up to interact with a backend service. You will need to:

1.  **Develop the backend:** Create a backend service that accepts user questions (likely via an API endpoint).
2.  **Implement logic:** The backend should process the question, generate or retrieve the explanation and animated video.
3.  **Configure API endpoint:** Update the frontend code (likely within the components that handle user input and data fetching, e.g., `/home/ubuntu/extracted_content/components/search-interface.tsx` or similar) to point to your backend API endpoint.
4.  **Handle responses:** Ensure the frontend correctly processes the responses (explanation text and video URL/data) from your backend and displays them in the UI.

The current UI includes an input field (`/home/ubuntu/extracted_content/components/search-interface.tsx`) and components potentially used for displaying results (`/home/ubuntu/extracted_content/components/video-player.tsx`, etc.). You will need to connect these components to your backend API calls.

## Project Files

The main project files are located in the `extracted_content` directory, which is provided in the attached zip file.
