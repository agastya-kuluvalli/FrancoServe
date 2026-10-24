# FrancoServe

FrancoServe is a volunteer-opportunity platform that connects students with French-related community service: tutoring, language exchange, translation, cultural events, and educational outreach.

Students who study French often struggle to find relevant volunteering and to keep their service in one place. FrancoServe gives them a searchable directory and an interactive map of opportunities near them. It is built for French students and French Honor Society chapters in California's Tri-Valley area, with a data model that can support more schools later.

Live site: https://francoserve.web.app

## Project History

FrancoServe was developed locally without version control. This repository is a single upload of the finished project, made in October 2026 for presentation and review, so the commit history does not reflect the development timeline.

## 1. How It Works

For students looking to volunteer (no account needed):

1. Browse. The homepage shows featured opportunities and a map preview.
2. Search and filter. The directory at /opportunities filters by keyword, category, and in-person or remote. Filters live in the URL, so switching to the map keeps them.
3. Explore the map. /map shows a clustered map beside a synced list. Clicking a pin highlights its card, and clicking a card opens its pin.
4. Search nearby. Students can search a city, ZIP code, or address, or tap "Use my location." A radius filter (5, 10, 25, 50 miles) narrows results, and the list sorts by distance.
5. Open details. /opportunities/:id shows the full description, requirements, commitment, and a location map.

For administrators (like presidents of French chapters):

1. Sign in at /admin with a Firebase email and password.
2. The app checks whether the account has a document in the admins collection.
3. Admins create, edit, publish, unpublish, and archive
