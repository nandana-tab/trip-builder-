# TripBuilder

### Build your own journey, your way.

TripBuilder is a personalized travel planning application that turns traveler preferences, budgets, and travel styles into a customized itinerary. Instead of relying on fixed travel packages or spending hours researching across fragmented sources, users can build and personalize a trip around what matters most to them.

## Problem

Travel planning often involves a trade-off. Travel packages are convenient but restrictive, while planning independently gives travelers more control but requires significant time spent researching destinations, activities, restaurants, stays, and transportation.

TripBuilder aims to bridge this gap by providing curated recommendations while keeping the traveler in control of the final itinerary.

## Key Features

* **Personalized Trip Planning** — Build a trip based on destination, dates, travel group, budget, travel style, food preferences, and preferred pace.
* **Travel DNA** — Personal preferences are used to tailor recommendations to the user's travel style.
* **Curated Recommendations** — Discover activities, attractions, restaurants, hotels, and experiences suited to the trip.
* **Day-by-Day Itinerary Builder** — Add, remove, swap, and organize recommendations across different days.
* **One-Click Recommendation Swaps** — Replace an itinerary item with an alternative while maintaining relevance to the trip.
* **Live Budget Tracking** — Track estimated spending against the selected budget tier as the itinerary changes.
* **Saved Journeys** — View and manage previously created trips.
* **Shareable Itineraries** — Finalized itineraries can be exported/printed and shared with travel companions.

## Core User Flow

```text
Google Sign-In
      ↓
Plan a Trip
      ↓
Select Destination
      ↓
Choose Dates & Travel Group
      ↓
Select Budget
      ↓
Define Travel DNA & Food Preferences
      ↓
Choose Travel Pace
      ↓
Generate Curated Itinerary
      ↓
Customize Activities & Recommendations
      ↓
Track Budget
      ↓
Finalize & Share Journey
```

## Tech Stack

* **Google Stitch** — UI and frontend design/prototyping
* **Google AI Studio** — AI-powered application logic and personalization
* **Firebase Authentication** — User authentication and Google Sign-In
* **Cloud Firestore** — Storage of user, trip, preference, and itinerary data
* **GitHub** — Source code management and version control

## Data & Personalization

The application uses structured destination and activity data to generate recommendations based on the user's selected:

* Destination
* Travel dates
* Travel group
* Budget tier
* Travel style
* Food preferences
* Daily itinerary pace

The recommendation experience is designed to evolve toward incorporating broader traveler insights such as reviews, travel blogs, vlogs, forums, and other trusted travel content.

## Current MVP Limitations

The current MVP has a **limited destination and activity database**. Only a small number of locations are currently available in the repository, with a limited set of activities and recommendations for each destination.

Therefore, users can currently build trips only around the supported destinations, and the variety of recommendations within each destination is limited.

The next stage would be to expand the destination database and connect the application to broader, dynamically updated travel data sources.

## Future Scope

Potential future enhancements include:

* Expanding destination coverage
* Integrating real-time travel and recommendation data
* Incorporating larger-scale traveler reviews and testimonials
* More sophisticated AI-based itinerary personalization
* Real-time pricing and availability
* Hotel, restaurant, activity, and transportation booking integrations
* Intelligent budget trade-offs and cost-saving recommendations
* More advanced geographic and route optimization

## Project Objective

TripBuilder demonstrates how AI and modern application-building tools can be used to create a personalized travel planning experience that combines **the convenience of curated recommendations with the freedom of independent travel planning**.


