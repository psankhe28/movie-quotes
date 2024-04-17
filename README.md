# Movie Quotes Website

## Overview
This project is a website where users can retrieve movie quotes. They can search for quotes using a search query and apply filters based on year and category.

### Features
- Search for movie quotes
- Filter quotes by year
- Filter quotes by category
- Ascending and descending sorting options for both year and category
- Option to go back to previous search result/ filter result.

## Technologies Used
- Frontend: React
- Backend: Node.js with Express

## Installation
1. Clone this repository: `git clone https://github.com/psankhe28/movie-quotes.git`
2. Navigate to the project directory: `cd movie-quotes`
3. Install dependencies:
   - Frontend: `cd frontend && npm install`
   - Backend: `cd backend && npm install`
4. Start the backend server: `cd backend && npm start`
5. Start the frontend development server: `cd frontend && npm start`
6. Open your browser and navigate to `http://localhost:3000` to view the website.
7. Open your browser and navigate to `http://localhost:5000` and you can use any api and test it.


## Backend API Endpoints
- `/search/query=${query}`: GET endpoint to retrieve movie quotes based on search query and filters.
- `/years/query=${query}`: GET endpoint to retrieve years for the filter.
- `/categories/query=${query}`: GET endpoint to retrieve categories for the filter.

## Deployment
- Backend: Link(https://movie-quotes-9e17.onrender.com/)
