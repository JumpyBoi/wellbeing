# Dashboard Update Plan

This plan outlines the steps to replace the current Flask-based dashboard with one mirroring the structure, calculations, and presentation of the React dashboard found in the `Reference/` directory.

**Phase 1: Backend Data Processing (`app.py`)**

1.  **Define Target Data Structures:**
    *   Maintain Python representations mirroring `YearlyData` and `GallupQuestion` interfaces from the reference project.
    *   Maintain category definitions ('basic-needs', 'individual', 'teamwork', 'growth') and map questions Q1-Q12 to these categories.
2.  **Modify `/dashboard/data` Endpoint:**
    *   **Fetch Raw Data:** Read all relevant rows from the Google Sheet.
    *   **Parse Timestamps & Group by Year:** Extract the year from the timestamp column (Column A) for each row. Group the raw survey responses by year.
    *   **Implement Aggregation Logic (Per Year):** For *each year's* grouped data:
        *   **Engagement Index (Current Method):** Categorize *every individual score* (Q1-Q12) across all respondents for that year using the existing thresholds (>=4 Engaged, 3 Not Engaged, <3 Actively Disengaged). Calculate the overall percentage for each category based on the total number of valid scores within that year. Adjust final percentages to sum to 100 if needed due to rounding.
        *   **Per Question Averages:** Calculate the average score for each individual question (Q1-Q12) across all valid responses *within that year*.
        *   **Grand Mean:** Calculate the overall average score across *all* valid Q1-Q12 responses from all users *within that year*.
        *   **Category Scores:** Calculate the average score for each of the four categories ('basic-needs', 'individual', 'teamwork', 'growth') by averaging the scores of the questions belonging to that category across all valid responses *within that year*.
        *   **Respondent Counts:** Track the number of valid responses for each question and overall *within that year*.
        *   **Custom Questions:** Collect all non-empty custom question responses (`First + question`, `Second + question`) for that year.
    *   **Structure JSON Response:** Format the output JSON as a list, where each item in the list represents a year and contains the calculated metrics structured similarly to the `YearlyData` interface (e.g., `[{year: 2023, grandMean: 4.1, engagementIndex: {...}, questions: [...], categoryScores: {...}, customQ1: [...], customQ2: [...]}, {year: 2024, ...}]`).

**Phase 2: Frontend Template (`app/templates/dashboard.html`), JavaScript & CSS**

1.  **Add Year Selector:**
    *   Add an HTML dropdown (`<select id="yearSelector">`) to the header or sidebar area.
2.  **Update HTML Structure:**
    *   Adapt the layout to include distinct sections for: Header, Year Selector, Engagement Index, Overall Score (Grand Mean), Question List (Table), Category Pyramid, and Custom Questions (at the bottom).
3.  **Update JavaScript (`<script>` block):**
    *   **Fetch Data:** Fetch the list of yearly data objects from `/dashboard/data`.
    *   **Populate Year Selector:** Dynamically add `<option>` elements to the `#yearSelector` dropdown for each year present in the fetched data. Default to the most recent year.
    *   **Handle Year Selection:** Add an event listener to `#yearSelector`. When the year changes:
        *   Retrieve the data object for the selected year from the fetched list.
        *   Call functions to update each section of the dashboard (Engagement Index bar, Grand Mean display, Question List table, Category Pyramid visualization, Custom Question lists) using the data for the *selected year*.
    *   **Initial Load:** Trigger the update functions using the data for the most recent year when the page first loads.
    *   **Category Pyramid Implementation:**
        *   Define the necessary HTML structure (e.g., nested `<div>` elements) for the pyramid sections within `dashboard.html`.
        *   Write JavaScript functions to take the `categoryScores` for the selected year and populate the corresponding HTML elements.
        *   Write CSS rules in `app/static/style.css` to style these HTML elements to visually resemble the pyramid structure (this will be an approximation).
    *   **Update Other Components:** Ensure the JavaScript correctly updates the Engagement Index bar, Grand Mean value, Question List table, and the two Custom Question lists based on the data object for the currently selected year.
4.  **Update CSS (`app/static/style.css`):**
    *   Add CSS rules specifically for the Category Pyramid structure and appearance.
    *   Add/modify styles for the Year Selector dropdown.
    *   Adjust overall layout and component styles as needed to match the reference dashboard's look and feel more closely.

**Mermaid Diagram:**

```mermaid
graph TD
    A[Google Sheet (Raw Data)] --> B(Flask: /dashboard/data Endpoint);
    B -- Reads Raw Data --> B;
    B -- Groups by Year --> B;
    B -- Calculates Aggregates per Year --> C{List of YearlyData Objects (Python)};
    C -- JSON Response --> D(JavaScript in dashboard.html);

    subgraph "Flask Backend (app.py)"
        B
        C
        style B fill:#f9f,stroke:#333,stroke-width:2px
        style C fill:#ccf,stroke:#333,stroke-width:1px
    end

    subgraph "Frontend (Browser)"
        D -- Populates --> YS[Year Selector];
        YS -- User Selects Year --> D;
        D -- Populates based on Selected Year --> E[HTML Elements (Updated Layout)];
        E -- Styled By --> F(app/static/style.css);

        style D fill:#f9d,stroke:#333,stroke-width:2px
        style YS fill:#ffc,stroke:#333,stroke-width:1px
        style E fill:#cfc,stroke:#333,stroke-width:2px
        style F fill:#9cf,stroke:#333,stroke-width:1px
    end

    subgraph "Key Calculations per Year in /dashboard/data"
        B1[Avg Score per Q]
        B2[Grand Mean (Overall Avg)]
        B3[Engagement Index % (Current Method - based on individual scores)]
        B4[Avg Score per Category]
        B5[Custom Q Responses]
        B --> B1 & B2 & B3 & B4 & B5;
        B1 & B2 & B3 & B4 & B5 --> C;
    end

    subgraph "Updated HTML Template (dashboard.html)"
        E1[Overall Score Display]
        E2[Engagement Index Bar]
        E3[Question List Table]
        E4[Category Pyramid Display (HTML/CSS Structure)]
        E5[Custom Questions Display (Bottom)]
        E6[Year Selector Dropdown]
        D --> E1 & E2 & E3 & E4 & E5 & E6;
    end
