# Staff Wellbeing Survey & Dashboard Plan

**Goal:** Develop a web application to host the staff wellbeing survey (Gallup Q12 + 2 custom questions) and display results on a dashboard.

**1. Proposed Technology Stack:**

*   **Frontend:** Standard HTML, CSS, and JavaScript. Use Chart.js for dashboard visuals.
*   **Backend:** Python with the Flask framework.
*   **Database:** SQLite (file-based, included with Python).

**2. Core Features:**

*   **Survey Page:**
    *   Displays 12 standard Gallup questions (1-5 Likert scale).
    *   Displays 2 custom open-ended questions:
        *   "What is one thing our team or company does really well?"
        *   "What is one thing our team or company could improve?"
    *   Anonymous submission button.
*   **Backend Logic:**
    *   Receives survey submissions securely.
    *   Stores responses anonymously in the SQLite database.
    *   Calculates aggregate results for the dashboard.
*   **Dashboard Page (Password Protected/Admin Access):**
    *   Displays the average score for each of the 12 Likert-scale questions (e.g., using bar charts).
    *   Displays an overall "Engagement Score" (average of the 12 standard questions).
    *   Lists the anonymized text responses to the two custom questions.

**3. High-Level Development Plan:**

1.  **Setup:** Create project directory structure (backend, frontend, templates, database). Set up Python virtual environment.
2.  **Database:** Define schema for `responses` table in SQLite.
3.  **Backend (Flask):**
    *   Create main Flask app file.
    *   Implement database interaction functions (save, retrieve aggregates).
    *   Create web routes: `/`, `/submit`, `/dashboard`, `/dashboard/data` (API).
4.  **Frontend (HTML/CSS/JS):**
    *   `survey.html`: Build form, basic CSS, JS for submission.
    *   `dashboard.html`: Build layout, basic CSS, JS to fetch data and display using Chart.js. Implement simple login.
5.  **Testing:** Test submission and dashboard accuracy.
6.  **Deployment:** Start with local execution, discuss cloud options later if needed.

**4. Simplified Architecture Diagram:**

```mermaid
graph LR
    A[User Browser] -- HTTP Request --> B(Web Server / Flask App);
    B -- Serves HTML/CSS/JS --> A;
    A -- Submits Survey Data --> B;
    B -- Reads/Writes --> C(SQLite Database);
    D[Admin Browser] -- HTTP Request --> B;
    B -- Serves Dashboard HTML/CSS/JS --> D;
    D -- Requests Data --> B;
    B -- Reads Aggregated Data --> C;
    B -- Sends Data (JSON) --> D;
