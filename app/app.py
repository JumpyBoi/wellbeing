# import sqlite3 # No longer needed
import os
from flask import Flask, render_template, request, redirect, url_for, jsonify, flash, session # Removed g
import datetime
import uuid # Import uuid module
from collections import defaultdict # Need this again
import statistics # For mean calculation
# from flask_sqlalchemy import SQLAlchemy # Removed
# from sqlalchemy.sql import func # Removed
from dotenv import load_dotenv
import logging # For better logging

# --- Add Google API Imports ---
from google.oauth2 import service_account
from googleapiclient.discovery import build
import json # If loading creds from env var

# Load environment variables from .env file for local development
load_dotenv()

# --- Configuration ---
SECRET_KEY = os.environ.get('SECRET_KEY', os.urandom(24)) # Use env var for secret key

app = Flask(__name__)
app.config['SECRET_KEY'] = SECRET_KEY # Set secret key for session

# --- Google Sheets Configuration ---
GOOGLE_SHEET_ID = os.environ.get('GOOGLE_SHEET_ID', '1IG32jiibAN4fkQy-NZXkfYdiMf7Wm5l9KtxLpm1WEOk') # Your Sheet ID
# Using file path for local dev, Vercel needs env var method (see comments below)
GOOGLE_CREDS_PATH = os.environ.get('GOOGLE_CREDS_PATH', 'c:/Users/Daniel/Downloads/gen-lang-client-0485926854-208026995971.json')
# For Vercel Deployment: Store the *entire content* of the JSON key file in an environment variable named GOOGLE_CREDS_JSON
GOOGLE_CREDS_JSON_STR = os.environ.get('GOOGLE_CREDS_JSON')
SHEET_NAME = os.environ.get('SHEET_NAME', 'Sheet1') # Assumes data goes to 'Sheet1'
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

# --- Google Sheets Helper ---
def get_sheets_service():
    """Authenticates and returns the Google Sheets service object."""
    creds = None
    # Method 1: From environment variable (Preferred for Vercel)
    if GOOGLE_CREDS_JSON_STR:
        try:
            creds_info = json.loads(GOOGLE_CREDS_JSON_STR)
            creds = service_account.Credentials.from_service_account_info(
                creds_info, scopes=SCOPES)
            print("Authenticated using service account JSON from environment variable.")
        except Exception as e:
            print(f"Error loading credentials from environment variable: {e}")
            logging.exception("Cred env var loading error")
            return None
    # Method 2: From file path (primarily for local dev)
    elif GOOGLE_CREDS_PATH and os.path.exists(GOOGLE_CREDS_PATH):
        try:
            creds = service_account.Credentials.from_service_account_file(
                GOOGLE_CREDS_PATH, scopes=SCOPES)
            print("Authenticated using service account file.")
        except Exception as e:
            print(f"Error loading credentials from file {GOOGLE_CREDS_PATH}: {e}")
            logging.exception("Cred file loading error")
            return None
    else:
        # If neither path nor env var is found/valid
        print("Google credentials not found (checked GOOGLE_CREDS_PATH and GOOGLE_CREDS_JSON env var). Cannot authenticate.")
        return None

    if not creds:
         return None

    try:
        service = build('sheets', 'v4', credentials=creds)
        return service
    except Exception as e:
        print(f"Error building Google Sheets service: {e}")
        logging.exception("Sheets service build error")
        return None

# --- Removed Database Models and Config ---

# --- (SQLite code removed) ---

# --- Routes ---

@app.route('/')
def survey_form():
    """Displays the survey form."""
    return render_template('survey.html')

@app.route('/submit', methods=['POST'])
def submit_survey():
    """Handles survey submission."""
    try:
        # Removed DB access
        # --- Extract data from form ---
        # Likert scale questions (ensure they are integers 1-5)
        q_scores = {}
        for i in range(1, 13):
            q_key = f'q{i}'
            try:
                score = int(request.form.get(q_key, 0)) # Default to 0 if missing
                if not 1 <= score <= 5:
                     # Handle invalid input if necessary, maybe default or raise error
                     score = 0 # Or flash an error message
                q_scores[q_key] = score
            except (ValueError, TypeError):
                 q_scores[q_key] = 0 # Handle non-integer input

        # Custom questions
        custom_q1 = request.form.get('custom_q1', '').strip()
        custom_q2 = request.form.get('custom_q2', '').strip()

        # --- Append data to Google Sheet ---
        service = get_sheets_service()
        if not service:
            raise Exception("Could not authenticate with Google Sheets API.")

        # Prepare the row data in the correct order for your sheet columns
        # IMPORTANT: Ensure this order matches your Google Sheet header row exactly!
        # Example Order: Timestamp, UUID, Q1-12, CustomQ1, CustomQ2
        timestamp = datetime.datetime.now().isoformat()
        response_uuid = str(uuid.uuid4()) # Generate UUID here
        row_data = [timestamp, response_uuid] + [q_scores.get(f'q{i}', None) for i in range(1, 13)] + [custom_q1, custom_q2]

        body = {
            'values': [row_data]
        }
        # Append the row to the sheet
        result = service.spreadsheets().values().append(
            spreadsheetId=GOOGLE_SHEET_ID,
            range=f"{SHEET_NAME}!A1", # Append after the last row in the sheet
            valueInputOption='USER_ENTERED', # Interpret input as if user typed it
            insertDataOption='INSERT_ROWS', # Insert new rows for the data
            body=body
        ).execute()
        print(f"Appended data to sheet: {result.get('updates').get('updatedRange')}")

        # Store the UUID in the session to link to the thank you page
        session['last_response_uuid'] = response_uuid # Store UUID again for my-results link
        flash('Thank you for completing the survey!', 'success')
        return redirect(url_for('thank_you')) # Redirect to a thank you page

    except Exception as e:
        print(f"Error processing submission or writing to sheet: {e}") # Log the error
        logging.exception("Submission/Sheet write error") # Log full traceback
        flash('An error occurred while submitting your survey. Please try again.', 'error')
        return redirect(url_for('survey_form')) # Redirect back to survey on error

@app.route('/thank-you')
def thank_you():
    """Displays the styled thank you page."""
    # Get the last response UUID from the session, if it exists
    # last_response_uuid = session.get('last_response_uuid') # No longer needed
    # session.pop('last_response_uuid', None) # No longer needed
    # Pass UUID to thank you page again so the link works
    last_response_uuid = session.get('last_response_uuid')
    session.pop('last_response_uuid', None) # Clear after retrieving
    return render_template('thank_you.html', response_uuid=last_response_uuid)

# --- Dashboard and Results Routes (Using Google Sheets) ---

@app.route('/dashboard')
def dashboard():
    """Displays the dashboard page (data fetched via JS)."""
    # Add authentication/authorization check here later
    return render_template('dashboard.html')

# Define Gallup Q12 Categories and map questions
GALLUP_CATEGORIES = {
    'basic-needs': {'name': 'Basic Needs', 'questions': [1, 2]},
    'individual': {'name': 'Individual Contribution', 'questions': [3, 4, 5, 6]},
    'teamwork': {'name': 'Teamwork', 'questions': [7, 8, 9, 10]},
    'growth': {'name': 'Growth', 'questions': [11, 12]}
}

# Map question ID (int) to category key
QUESTION_TO_CATEGORY = {}
for category, details in GALLUP_CATEGORIES.items():
    for q_id in details['questions']:
        QUESTION_TO_CATEGORY[q_id] = category

# Update QUESTION_TEXTS to include category
QUESTION_TEXTS = {
    "Q1": {"short": "Know What's Expected", "full": "I know what is expected of me at work.", "category": "basic-needs"},
    "Q2": {"short": "Materials and Equipment", "full": "I have the materials and equipment I need to do my work right.", "category": "basic-needs"},
    "Q3": {"short": "Opportunity to Do Best", "full": "At work, I have the opportunity to do what I do best every day.", "category": "individual"},
    "Q4": {"short": "Recognition", "full": "In the last seven days, I have received recognition or praise for doing good work.", "category": "individual"},
    "Q5": {"short": "Cares About Me", "full": "My supervisor, or someone at work, seems to care about me as a person.", "category": "individual"},
    "Q6": {"short": "Development", "full": "There is someone at work who encourages my development.", "category": "individual"},
    "Q7": {"short": "Opinions Count", "full": "At work, my opinions seem to count.", "category": "teamwork"},
    "Q8": {"short": "Mission/Purpose", "full": "The mission or purpose of my company makes me feel my job is important.", "category": "teamwork"},
    "Q9": {"short": "Committed to Quality", "full": "My associates or fellow employees are committed to doing quality work.", "category": "teamwork"},
    "Q10": {"short": "Best Friend", "full": "I have a best friend at work.", "category": "teamwork"},
    "Q11": {"short": "Progress", "full": "In the last six months, someone at work has talked to me about my progress.", "category": "growth"},
    "Q12": {"short": "Learn and Grow", "full": "In the last year, I have had opportunities at work to learn and grow.", "category": "growth"},
}

# Helper function to calculate distribution (remains mostly the same)
def calculate_distribution(scores):
    """Calculates the distribution counts for a list of scores."""
    counts = {'engaged': 0, 'not_engaged': 0, 'actively_disengaged': 0}
    valid_scores = [s for s in scores if s is not None and 1 <= s <= 5]
    if not valid_scores:
        return counts, 0 # Return zero counts and total valid count

    for score in valid_scores:
        if score >= 4:
            counts['engaged'] += 1
        elif score == 3:
            counts['not_engaged'] += 1
        else: # score 1 or 2
            counts['actively_disengaged'] += 1
    return counts, len(valid_scores)

# Function to safely parse year from timestamp string
def get_year_from_timestamp(ts_str):
    if not ts_str:
        return None
    try:
        # Attempt parsing common ISO format and others if needed
        dt_obj = datetime.datetime.fromisoformat(ts_str.split(' ')[0]) # Handle potential time part
        return dt_obj.year
    except ValueError:
        try:
             # Try another common format like YYYY-MM-DD
             dt_obj = datetime.datetime.strptime(ts_str.split(' ')[0], '%Y-%m-%d')
             return dt_obj.year
        except ValueError:
             logging.warning(f"Could not parse year from timestamp: {ts_str}")
             return None # Or raise an error, or return a default year?

@app.route('/dashboard/data')
def dashboard_data():
    """Provides data aggregated by year for the dashboard."""
    # Add authentication/authorization check here later
    try:
        service = get_sheets_service()
        if not service:
            raise Exception("Could not authenticate with Google Sheets API.")

        read_range = f"{SHEET_NAME}!A2:P" # Read Timestamp to CustomQ2, starting row 2
        result = service.spreadsheets().values().get(
            spreadsheetId=GOOGLE_SHEET_ID,
            range=read_range
        ).execute()
        values = result.get('values', [])

        if not values:
            return jsonify([]) # Return empty list if no data

        # --- Group data by year ---
        data_by_year = defaultdict(list)
        for row in values:
            if not row: continue # Skip empty rows
            year = get_year_from_timestamp(row[0]) # Assuming timestamp is in column 0
            if year:
                data_by_year[year].append(row)
            else:
                 logging.warning(f"Skipping row due to unparseable timestamp: {row[0]}")


        # --- Process data for each year ---
        yearly_results = []
        # Define column indices based on assumed sheet structure
        # Timestamp=0, UUID=1, Q1=2, Q2=3, ..., Q12=13, CustomQ1=14, CustomQ2=15
        q_start_index = 2
        custom_q1_index = 14
        custom_q2_index = 15

        # Sort years for consistent output order (most recent first)
        sorted_years = sorted(data_by_year.keys(), reverse=True)

        for year in sorted_years:
            year_rows = data_by_year[year]
            num_responses_year = len(year_rows)

            # Aggregators for the current year
            all_scores_year = [] # For overall engagement index
            scores_by_q_year = defaultdict(list)
            scores_by_category_year = defaultdict(list)
            custom_q1_responses_year = []
            custom_q2_responses_year = []

            for row in year_rows:
                # Extract scores for this row
                row_scores = {}
                for i in range(1, 13):
                    q_key = f"q{i}"
                    col_index = q_start_index + i - 1
                    score = None
                    try:
                        if col_index < len(row) and row[col_index]:
                             val = int(row[col_index])
                             if 1 <= val <= 5:
                                 score = val
                    except (ValueError, TypeError, IndexError):
                        pass # Keep score as None if invalid or missing

                    if score is not None:
                        scores_by_q_year[q_key].append(score)
                        all_scores_year.append(score) # Add to overall list for engagement index
                        # Add to category scores
                        category = QUESTION_TEXTS[q_key.upper()].get("category")
                        if category:
                             scores_by_category_year[category].append(score)
                    else:
                         # Decide how to handle missing scores for averages if needed
                         # Currently they are just ignored by statistics.mean
                         pass


                # Extract custom responses for this row
                try:
                    if custom_q1_index < len(row) and row[custom_q1_index]:
                        custom_q1_responses_year.append(row[custom_q1_index])
                    if custom_q2_index < len(row) and row[custom_q2_index]:
                        custom_q2_responses_year.append(row[custom_q2_index])
                except IndexError:
                     pass

            # --- Calculate aggregates for the year ---
            questions_data_year = []
            grand_total_score_year = 0
            grand_valid_count_year = 0

            for i in range(1, 13):
                q_key = f"q{i}"
                q_key_upper = q_key.upper()
                scores_for_q = scores_by_q_year[q_key] # Already filtered for valid scores
                num_respondents_for_q = len(scores_for_q)

                average_for_q = round(statistics.mean(scores_for_q), 2) if num_respondents_for_q > 0 else 0

                grand_total_score_year += sum(scores_for_q)
                grand_valid_count_year += num_respondents_for_q

                questions_data_year.append({
                    "id": i, # Use integer ID
                    "question": QUESTION_TEXTS[q_key_upper]["short"], # Short text
                    "description": QUESTION_TEXTS[q_key_upper]["full"], # Full text
                    "score": average_for_q,
                    "respondents": num_respondents_for_q,
                    "category": QUESTION_TEXTS[q_key_upper]["category"]
                })

            # Calculate Grand Mean for the year
            grand_mean_year = round(grand_total_score_year / grand_valid_count_year, 2) if grand_valid_count_year > 0 else 0

            # Calculate Overall Engagement Distribution % for the year (using current method)
            dist_counts_year, total_overall_scores_counted_year = calculate_distribution(all_scores_year)
            engagement_distribution_percent_year = {
                "engaged": round((dist_counts_year['engaged'] / total_overall_scores_counted_year) * 100) if total_overall_scores_counted_year > 0 else 0,
                "notEngaged": round((dist_counts_year['not_engaged'] / total_overall_scores_counted_year) * 100) if total_overall_scores_counted_year > 0 else 0,
                "activelyDisengaged": round((dist_counts_year['actively_disengaged'] / total_overall_scores_counted_year) * 100) if total_overall_scores_counted_year > 0 else 0,
            }
            # Adjust rounding to ensure sum is 100%
            current_total_percent = sum(engagement_distribution_percent_year.values())
            if total_overall_scores_counted_year > 0 and current_total_percent != 100:
                 diff = 100 - current_total_percent
                 # Add difference to the largest category to minimize visual impact
                 max_cat_key = max(engagement_distribution_percent_year, key=engagement_distribution_percent_year.get)
                 engagement_distribution_percent_year[max_cat_key] += diff


            # Calculate Category Scores for the year
            category_scores_year = {}
            for category_key, details in GALLUP_CATEGORIES.items():
                 scores_for_cat = scores_by_category_year[category_key]
                 avg_score = round(statistics.mean(scores_for_cat), 2) if scores_for_cat else 0
                 category_scores_year[category_key] = avg_score


            # Assemble data for this year
            yearly_data = {
                "year": year,
                "grandMean": grand_mean_year,
                "totalResponses": num_responses_year,
                "engagementIndex": engagement_distribution_percent_year, # Renamed field
                "questions": questions_data_year,
                "categoryScores": category_scores_year,
                "customQ1Responses": custom_q1_responses_year,
                "customQ2Responses": custom_q2_responses_year
            }
            yearly_results.append(yearly_data)

        return jsonify(yearly_results) # Return the list of yearly data

    except Exception as e:
        print(f"Error fetching/processing dashboard data from sheet: {e}")
        logging.exception("Dashboard data error")
        # Return empty list on error, or specific error structure
        return jsonify({"error": f"Could not retrieve or process dashboard data: {e}"}), 500


@app.route('/my-results/<string:response_uuid>')
def my_results(response_uuid):
    """Displays the responses for a specific submission by reading from Google Sheets."""
    try:
        service = get_sheets_service()
        if not service:
            raise Exception("Could not authenticate with Google Sheets API.")

        # Read data - assuming UUID is in the second column (index 1)
        read_range = f"{SHEET_NAME}!A2:P" # Read Timestamp to CustomQ2
        result = service.spreadsheets().values().get(
            spreadsheetId=GOOGLE_SHEET_ID,
            range=read_range
        ).execute()
        values = result.get('values', [])

        response_data = None
        if values:
            # Find the row matching the UUID
            for row in values:
                 # Check if row is long enough and UUID matches
                if len(row) > 1 and row[1] == response_uuid:
                    # Convert row list to a dictionary-like object for the template
                    # Assuming order: Timestamp, UUID, Q1-12, CustomQ1, CustomQ2
                    # Use .get(index, None) for safety if rows might be short/ragged
                    response_data = {
                        'timestamp': row[0] if len(row) > 0 else None,
                        'response_uuid': row[1],
                        'q1': int(row[2]) if len(row) > 2 and row[2] else None,
                        'q2': int(row[3]) if len(row) > 3 and row[3] else None,
                        'q3': int(row[4]) if len(row) > 4 and row[4] else None,
                        'q4': int(row[5]) if len(row) > 5 and row[5] else None,
                        'q5': int(row[6]) if len(row) > 6 and row[6] else None,
                        'q6': int(row[7]) if len(row) > 7 and row[7] else None,
                        'q7': int(row[8]) if len(row) > 8 and row[8] else None,
                        'q8': int(row[9]) if len(row) > 9 and row[9] else None,
                        'q9': int(row[10]) if len(row) > 10 and row[10] else None,
                        'q10': int(row[11]) if len(row) > 11 and row[11] else None,
                        'q11': int(row[12]) if len(row) > 12 and row[12] else None,
                        'q12': int(row[13]) if len(row) > 13 and row[13] else None,
                        'custom_q1': row[14] if len(row) > 14 else None,
                        'custom_q2': row[15] if len(row) > 15 else None,
                    }
                    break # Stop searching once found

        if response_data:
            # Need to pass the dictionary here, not the SQLAlchemy object
            return render_template('my_results.html', response=response_data)
        else:
            flash('Could not find the specified survey response.', 'error')
            return redirect(url_for('survey_form'))

    except Exception as e:
        print(f"Error fetching specific response {response_uuid} from sheet: {e}")
        logging.exception("My results error")
        flash('An error occurred while retrieving your responses.', 'error')
        return redirect(url_for('survey_form'))

# --- (Main execution block removed) ---
