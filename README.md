Overview

This project is a fully interactive analytics dashboard built to analyze and visualize insights from the Electric Vehicle Population dataset.
The dashboard is designed to help users quickly understand EV adoption patterns, distribution, and characteristics through metrics, charts, maps, and tabular exploration.

The focus was on clarity, usability, and insight-driven design, rather than just displaying raw data.

Key metrics at a glance

The dashboard provides high-level summary metrics, including:

Total Vehicles – total number of registered electric vehicles

Unique Models – count of distinct EV models

Unique Counties – number of counties represented

Legislative Districts – total districts with EV registrations

Postal Codes – total unique postal codes in the dataset

These metrics give an immediate snapshot of the dataset’s scale and coverage.

Visual analytics & insights

The dashboard includes multiple visualizations to explore trends and distributions:

Vehicles Registered by Year
A time-series chart showing EV adoption growth from early years to recent registrations.

Vehicles by Legislative District (Top 15)
A ranked bar chart highlighting districts with the highest number of EV registrations.

Top Vehicle Makes
Distribution of the most common EV manufacturers, highlighting market dominance and diversity.

Top Vehicle Models
Breakdown of the most frequently registered EV models.

Electric Range Distribution
Vehicles grouped into electric range bins (in miles) to understand real-world usability trends.



Base MSRP Distribution
Price range distribution based on manufacturer’s suggested retail price, showing affordability spread.

Geospatial analysis

To add spatial context, the dashboard includes interactive maps:

EV Locations Map
A point map where each dot represents an individual EV registration.

EV Registrations by County (Choropleth Map)
A county-level heatmap visualizing EV concentration across Washington state.

These maps help identify geographic clusters and regional adoption patterns.

Detailed data exploration

Transactions Table
A paginated, searchable table displaying individual EV records with details such as:

Make & model

Model year & EV type (BEV / PHEV)

County and city

Electric range

This allows users to drill down from high-level trends to individual records.

User experience features

Theme toggle (light/dark mode)

Customizable layout

Responsive design for different screen sizes

Intuitive navigation and filtering for smooth exploration

Tech stack

Next.js – frontend framework

React – component-based UI



Leaflet + OpenStreetMap – for interactive maps

CSV-based data processing – lightweight frontend data handling

Modern UI styling – clean, dashboard-style interface



Deployment

The dashboard is deployed and publicly accessible:

👉 Live Dashboard URL: https://demosubmit.vercel.app
