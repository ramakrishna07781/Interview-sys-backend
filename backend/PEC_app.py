import os
import csv
import json
import pdfplumber
import google.generativeai as palm
from flask_cors import CORS
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import random

# Serve React static files using Flask's static_folder/static_url_path
REACT_BUILD_DIR = os.path.join(os.path.dirname(__file__), 'interview-app', 'build')
app = Flask(__name__)
CORS(app)
# @app.route('/')
# def serve_react_app():
#     return app.send_static_file('index.html')

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Initialize CSV files if they don't exist
def init_csv_files():
    if not os.path.exists('users.csv'):
        with open('users.csv', 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['username', 'password_hash', 'resume_text', 'resume_path'])
    if not os.path.exists('job_descriptions.csv'):
        with open('job_descriptions.csv', 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['role', 'title', 'skills', 'eligibility', 'location', 'duration', 'level', 'addons', 'num_questions', 'enable_skill_assessment'])
    if not os.path.exists('interview_results.csv'):
        with open('interview_results.csv', 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['username', 'role', 'total_score', 'avg_score', 'recommendation', 'evaluation', 'questions_count'])
    if not os.path.exists('interview_sessions.csv'):
        with open('interview_sessions.csv', 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['username', 'role', 'session_id', 'questions_asked', 'current_question', 'answers', 'scores', 'status'])
    if not os.path.exists('job_applications.csv'):
        with open('job_applications.csv', 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['username', 'role', 'job_id', 'status'])
    if not os.path.exists('skill_assessments.csv'):
        with open('skill_assessments.csv', 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['username', 'role', 'assessment_id', 'status', 'score'])

init_csv_files()

def generate(text):
    palm.configure(api_key='AIzaSyAFlR4DPeAuidPT5GU14n9-gW_pJEM8Kv8')
    model = palm.GenerativeModel('models/gemini-2.0-flash-lite')
    response = model.generate_content(text)
    return response.text

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    resume_text = data.get('resume_text', '')
    password_hash = generate_password_hash(password)
    with open('users.csv', 'a', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow([username, password_hash, resume_text, ''])
    return jsonify({"message": "User registered successfully!"}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    with open('users.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        for row in reader:
            if len(row) >= 2 and row[0] == username and check_password_hash(row[1], password):
                session_id = str(uuid.uuid4())
                # Log session start in interview_sessions.csv
                with open('interview_sessions.csv', 'a', newline='') as sessionfile:
                    session_writer = csv.writer(sessionfile)
                    session_writer.writerow([username, '', session_id, '', '', '', '', 'started'])
                return jsonify({"message": "Login successful!", "username": username, "resume_text": row[2] if len(row) > 2 else "", "session_id": session_id}), 200
    return jsonify({"message": "Invalid username or password"}), 401

@app.route('/extract-text', methods=['POST'])
def extract_text():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    file.save(os.path.join(UPLOAD_FOLDER, file.filename))
    text = ""
    with pdfplumber.open(os.path.join(UPLOAD_FOLDER, file.filename)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return jsonify({'text': text})

# Update job_descriptions.csv to include 'enable_skill_assessment' field
# Update add_job_desc and get_all_job_desc to handle this field
@app.route('/add-job-desc', methods=['POST'])
def add_job_desc():
    data = request.json
    enable_skill_assessment = data.get('enable_skill_assessment', 'yes')
    with open('job_descriptions.csv', 'a', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow([
            data.get('role', ''),
            data.get('title', ''),
            data.get('skills', ''),
            data.get('eligibility', ''),
            data.get('location', ''),
            data.get('duration', ''),
            data.get('level', ''),
            data.get('addons', ''),
            data.get('num_questions', 5),
            enable_skill_assessment
        ])
    return jsonify({'message': 'Job description added'})

@app.route('/get-all-job-desc', methods=['GET'])
def get_all_job_desc():
    jobs = []
    try:
        with open('job_descriptions.csv', 'r') as csvfile:
            reader = csv.reader(csvfile)
            headers = next(reader)
            for row in reader:
                if len(row) >= 10:
                    jobs.append({
                        'role': row[0],
                        'title': row[1],
                        'skills': row[2],
                        'eligibility': row[3],
                        'location': row[4],
                        'duration': row[5],
                        'level': row[6],
                        'addons': row[7],
                        'num_questions': int(row[8]),
                        'enable_skill_assessment': row[9] if len(row) > 9 else 'yes'
                    })
                elif len(row) >= 9:
                    jobs.append({
                        'role': row[0],
                        'title': row[1],
                        'skills': row[2],
                        'eligibility': row[3],
                        'location': row[4],
                        'duration': row[5],
                        'level': row[6],
                        'addons': row[7],
                        'num_questions': int(row[8]),
                        'enable_skill_assessment': 'yes'
                    })
    except Exception as e:
        print(f"Error reading job descriptions: {e}")
    return jsonify(jobs)

@app.route('/get-job-desc', methods=['GET'])
def get_job_desc():
    role = request.args.get('role')
    job = {}
    try:
        with open('job_descriptions.csv', 'r') as csvfile:
            reader = csv.reader(csvfile)
            next(reader)
            for row in reader:
                if len(row) >= 9 and row[0] == role:
                    job = {
                        'role': row[0],
                        'title': row[1],
                        'skills': row[2],
                        'eligibility': row[3],
                        'location': row[4],
                        'duration': row[5],
                        'level': row[6],
                        'addons': row[7],
                        'num_questions': int(row[8])
                    }
                    break
    except Exception as e:
        print(f"Error reading job description: {e}")
    return jsonify(job)

@app.route('/get_questions', methods=['POST'])
def get_questions():
    data = request.json
    username = data.get('username')
    role = data.get('role')
    # Get resume text from users.csv
    resume_text = ""
    with open('users.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        for row in reader:
            if len(row) >= 3 and row[0] == username:
                resume_text = row[2]
                break
    if not resume_text:
        return {"error": "Resume not found for user."}
    # Get job description from CSV
    job = {}
    with open('job_descriptions.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        for row in reader:
            if len(row) >= 9 and row[0] == role:
                job = {
                    'role': row[0],
                    'title': row[1],
                    'skills': row[2],
                    'eligibility': row[3],
                    'location': row[4],
                    'duration': row[5],
                    'level': row[6],
                    'addons': row[7],
                    'num_questions': int(row[8])
                }
                break
    if not job:
        return {"error": "Job description not found."}
    # Extract details
    domain_skills = job.get('skills', '')
    level = job.get('level', 'Medium')
    num_questions = job.get('num_questions', 5)
    # Extract skills and projects/experience from resume
    skills = extract_skills_from_resume(resume_text)
    projects = []
    experience = []
    for line in resume_text.split('\n'):
        l = line.lower()
        if any(kw in l for kw in ['project', 'developed', 'built', 'created']):
            projects.append(line.strip())
        if any(kw in l for kw in ['experience', 'intern', 'worked', 'role', 'responsible']):
            experience.append(line.strip())
    # Dynamic AI prompt
    prompt = f"""
    You are an expert interviewer. Generate {num_questions} unique, clear, and relevant interview questions for a {level} level job.
    - Focus ONLY on the required skills: {domain_skills}
    - Also consider the candidate's skills: {', '.join(skills) if skills else 'N/A'}
    - Use these projects: {projects if projects else 'N/A'}
    - Use this experience: {experience if experience else 'N/A'}
    - Do NOT use previous answers or questions.
    - Each question should be on a new line, no numbering, no extra text, no explanations, no headers, no blank lines.
    - Only output the questions, one per line.
    """
    data = generate(prompt)
    # Clean and filter questions
    questions = [q.strip() for q in data.split('\n') if q.strip() and not q.lower().startswith(('here are', 'questions for', 'question', 'q:', 'a:'))]
    print("Generated questions:", questions)  # Debug print to terminal
    return {
        "questions": questions,
        "job_details": job,
        "num_questions": num_questions
    }

@app.route('/evaluate-answer', methods=['POST'])
def evaluate_answer():
    data = request.json
    question = data.get('question', '')
    answer = data.get('answer', '')
    role = data.get('role', '')
    job_desc = data.get('job_desc', {})
    prompt = f"""
    Evaluate the following interview answer for the given job role. Give a score from 0 to 10:
    - 10: Perfect, highly relevant, expert-level answer
    - 7-9: Good, mostly correct, relevant, some minor gaps
    - 4-6: Partially correct, some relevance, but missing key points
    - 1-3: Poor, mostly irrelevant, little understanding
    - 0: Not attempted or completely irrelevant
    Role: {role}
    Job Requirements: {job_desc.get('skills', '')}
    Question: {question}
    Candidate Answer: {answer}
    Please provide:
    1. Score (0-10)
    2. Brief feedback on the answer quality
    3. Whether the answer demonstrates relevant skills for the role
    Return the response in this format:
    Score: X
    Feedback: [Your feedback here]
    Skills Demonstrated: [skills mentioned]
    """
    try:
        ai_response = generate(prompt)
        score = 0
        feedback = ai_response
        lines = ai_response.split('\n')
        for line in lines:
            if line.lower().startswith('score:'):
                try:
                    score_val = int(line.split(':')[1].strip())
                    if 0 <= score_val <= 10:
                        score = score_val
                    else:
                        score = 0
                    break
                except:
                    score = 0
        return jsonify({'score': score, 'feedback': feedback, 'ai_evaluation': ai_response})
    except Exception as e:
        return jsonify({'score': 0, 'feedback': 'Unable to evaluate answer due to technical issues.', 'error': str(e)}), 500

@app.route('/submit-interview', methods=['POST'])
def submit_interview():
    data = request.json
    username = data.get('username')
    role = data.get('role')
    questions = data.get('questions', [])
    answers = data.get('answers', [])
    scores = data.get('scores', [])
    feedbacks = data.get('feedbacks', [])  # Expect feedbacks from frontend or generate here
    # Build per-question details
    question_details = []
    for i in range(len(questions)):
        question_details.append({
            'question': questions[i],
            'answer': answers[i] if i < len(answers) else '',
            'score': scores[i] if i < len(scores) else 0,
            'feedback': feedbacks[i] if i < len(feedbacks) else ''
        })
    total_score = sum(scores) if scores else 0
    avg_score = total_score / len(scores) if scores else 0
    prompt = f"""
    Provide a comprehensive evaluation for a candidate who interviewed for the role: {role}
    Average Score: {avg_score}/10
    Total Questions: {len(questions)}
    Questions and Answers:
    {chr(10).join([f"Q: {q} A: {a}" for q, a in zip(questions, answers)])}
    Based on this interview performance, provide:
    1. Overall assessment of candidate's skills
    2. Knowledge areas demonstrated
    3. Recommendation (Highly Recommended/Recommended/Not Recommended)
    4. Specific feedback for improvement
    Format the response professionally.
    """
    try:
        final_evaluation = generate(prompt)
        recommendation = "Not Recommended"
        if avg_score >= 8:
            recommendation = "Highly Recommended"
        elif avg_score >= 6:
            recommendation = "Recommended"
        # Overwrite previous result for this user/role
        rows = []
        found = False
        with open('interview_results.csv', 'r') as csvfile:
            reader = csv.reader(csvfile)
            headers = next(reader)
            for row in reader:
                if row[0] == username and row[1] == role:
                    found = True
                    continue  # skip old result
                rows.append(row)
        with open('interview_results.csv', 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(['username', 'role', 'total_score', 'avg_score', 'recommendation', 'evaluation', 'questions_count', 'question_details'])
            writer.writerows(rows)
            writer.writerow([
                username,
                role,
                total_score,
                avg_score,
                recommendation,
                final_evaluation.replace('\n', ' | '),
                len(questions),
                json.dumps(question_details)
            ])
        return jsonify({
            'total_score': total_score,
            'average_score': avg_score,
            'recommendation': recommendation,
            'evaluation': final_evaluation,
            'questions': question_details,
            'message': 'Interview submitted successfully'
        })
    except Exception as e:
        return jsonify({'error': 'Failed to process interview results', 'details': str(e)}), 500

@app.route('/get-results', methods=['GET'])
def get_results():
    username = request.args.get('username')
    if not username:
        return jsonify({'error': 'Username required'}), 400
    try:
        with open('interview_results.csv', 'r') as csvfile:
            import csv, json
            reader = csv.reader(csvfile)
            headers = next(reader, None)
            results = []
            for row in reader:
                if len(row) >= 8 and row[0] == username:
                    question_details = []
                    try:
                        question_details = json.loads(row[7])
                    except Exception:
                        question_details = []
                    results.append({
                        'username': row[0],
                        'role': row[1],
                        'total_score': float(row[2]),
                        'average_score': float(row[3]),
                        'recommendation': row[4],
                        'evaluation': row[5].replace(' | ', '\n'),
                        'questions_count': int(row[6]),
                        'questions': question_details
                    })
            if results:
                latest_result = results[-1]
                return jsonify(latest_result)
            else:
                return jsonify({'error': 'No results found for user'}), 404
    except FileNotFoundError:
        return jsonify({'error': 'No interview results available'}), 404
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve results: {str(e)}'}), 500

@app.route('/start-session', methods=['POST'])
def start_session():
    data = request.json
    username = data.get('username')
    role = data.get('role')
    session_id = str(uuid.uuid4())
    with open('interview_sessions.csv', 'a', newline='') as sessionfile:
        session_writer = csv.writer(sessionfile)
        session_writer.writerow([username, role, session_id, '', '', '', '', 'started'])
    return jsonify({'session_id': session_id})

@app.route('/log-question', methods=['POST'])
def log_question():
    data = request.json
    session_id = data.get('session_id')
    question = data.get('question')
    answer = data.get('answer', '')
    score = data.get('score', '')
    # Update the session row in interview_sessions.csv
    rows = []
    with open('interview_sessions.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        headers = next(reader)
        for row in reader:
            # Ensure all relevant fields are strings, not None
            row = [col if col is not None else '' for col in row]
            if row[2] == session_id:
                # Append question, answer, score
                row[3] = (row[3] or '') + ('|' if row[3] else '') + (question or '')
                row[4] = question or ''
                row[5] = (row[5] or '') + ('|' if row[5] else '') + (answer or '')
                row[6] = (row[6] or '') + ('|' if row[6] else '') + (str(score) if score is not None else '')
            rows.append(row)
    with open('interview_sessions.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['username','role','session_id','questions_asked','current_question','answers','scores','status'])
        writer.writerows(rows)
    return jsonify({'message': 'Question logged'})

@app.route('/ai-rephrase', methods=['POST'])
def ai_rephrase():
    data = request.json
    field = data.get('field', '')
    value = data.get('value', '')
    # Use AI to rephrase the text and extract skills
    try:
        prompt = f"Rephrase the following {field} for a professional resume. Also, suggest a list of 5-10 relevant skills (comma separated) if possible.\nText: {value}\nReturn JSON: {{'rephrased': ..., 'suggested_skills': [...]}}"
        ai_response = generate(prompt)
        # Try to parse as JSON, fallback to text
        try:
            result = json.loads(ai_response)
        except Exception:
            # Fallback: extract rephrased and skills from text
            lines = ai_response.split('\n')
            rephrased = lines[0] if lines else value
            skills = []
            for line in lines:
                if 'skills' in line.lower():
                    skills = [s.strip() for s in line.split(':')[-1].split(',') if s.strip()]
            result = {'rephrased': rephrased, 'suggested_skills': skills}
        return jsonify(result)
    except Exception as e:
        return jsonify({'rephrased': value, 'suggested_skills': []}), 200

def extract_skills_from_resume(resume_text):
    skill_keywords = ['python', 'java', 'sql', 'communication', 'leadership', 'c++', 'machine learning']
    found_skills = [kw for kw in skill_keywords if kw.lower() in resume_text.lower()]
    return found_skills

@app.route('/get-user-result', methods=['GET'])
def get_user_result():
    username = request.args.get('username')
    if not username:
        return jsonify({"error": "Username required"}), 400
    try:
        with open('interview_results.csv', 'r') as csvfile:
            reader = csv.reader(csvfile)
            headers = next(reader, None)
            results = []
            for row in reader:
                if len(row) >= 7 and row[0] == username:
                    results.append({
                        'username': row[0],
                        'role': row[1],
                        'total_score': float(row[2]),
                        'average_score': float(row[3]),
                        'recommendation': row[4],
                        'evaluation': row[5].replace(' | ', '\n'),
                        'questions_count': int(row[6])
                    })
            if results:
                latest_result = results[-1]
                # For user, only show feedback (evaluation)
                return jsonify({'evaluation': latest_result['evaluation']})
            else:
                return jsonify({"error": "No results found for user"}), 404
    except FileNotFoundError:
        return jsonify({"error": "No interview results available"}), 404
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve results: {str(e)}"}), 500

@app.route('/get-user-full-result', methods=['GET'])
def get_user_full_result():
    username = request.args.get('username')
    if not username:
        return jsonify({"error": "Username required"}), 400
    try:
        with open('interview_results.csv', 'r') as csvfile:
            reader = csv.reader(csvfile)
            headers = next(reader, None)
            results = []
            for row in reader:
                if len(row) >= 7 and row[0] == username:
                    results.append({
                        'username': row[0],
                        'role': row[1],
                        'total_score': float(row[2]),
                        'average_score': float(row[3]),
                        'recommendation': row[4],
                        'evaluation': row[5].replace(' | ', '\n'),
                        'questions_count': int(row[6])
                    })
            if results:
                latest_result = results[-1]
                return jsonify(latest_result)
            else:
                return jsonify({"error": "No results found for user"}), 404
    except FileNotFoundError:
        return jsonify({"error": "No interview results available"}), 404
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve results: {str(e)}"}), 500

@app.route('/get-all-results', methods=['GET'])
def get_all_results():
    results = []
    try:
        with open('interview_results.csv', 'r') as csvfile:
            reader = csv.reader(csvfile)
            headers = next(reader, None)
            for row in reader:
                if len(row) >= 7:
                    results.append({
                        'username': row[0],
                        'role': row[1],
                        'total_score': float(row[2]),
                        'average_score': float(row[3]),
                        'recommendation': row[4],
                        'evaluation': row[5].replace(' | ', '\n'),
                        'questions_count': int(row[6])
                    })
        # Only keep the latest result for each user-role
        latest_results = {}
        for r in results:
            key = (r['username'], r['role'])
            latest_results[key] = r
        return jsonify(list(latest_results.values()))
    except FileNotFoundError:
        return jsonify([])
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve all results: {str(e)}"}), 500

@app.route('/apply-job', methods=['POST'])
def apply_job():
    data = request.json
    username = data.get('username')
    role = data.get('role')
    job_id = data.get('job_id', role)  # Use role as job_id for now
    # Check if already applied
    applied = False
    with open('job_applications.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        for row in reader:
            if row[0] == username and row[1] == role:
                applied = True
                break
    if applied:
        return jsonify({'message': 'Already applied'}), 400
    with open('job_applications.csv', 'a', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow([username, role, job_id, 'applied'])
    return jsonify({'message': 'Job application submitted'})

@app.route('/get-job-applicants', methods=['GET'])
def get_job_applicants():
    role = request.args.get('role')
    applicants = []
    with open('job_applications.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        for row in reader:
            if row[1] == role:
                applicants.append({'username': row[0], 'status': row[3]})
    return jsonify(applicants)

@app.route('/shortlist-applicant', methods=['POST'])
def shortlist_applicant():
    data = request.json
    username = data.get('username')
    role = data.get('role')
    # Update status to 'shortlisted'
    rows = []
    with open('job_applications.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        headers = next(reader)
        for row in reader:
            if row[0] == username and row[1] == role:
                row[3] = 'shortlisted'
            rows.append(row)
    with open('job_applications.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['username','role','job_id','status'])
        writer.writerows(rows)
    return jsonify({'message': 'Applicant shortlisted'})

@app.route('/get-scheduled-interviews', methods=['GET'])
def get_scheduled_interviews():
    username = request.args.get('username')
    scheduled = []
    with open('job_applications.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        for row in reader:
            if row[0] == username and row[3] == 'shortlisted':
                scheduled.append({'role': row[1], 'job_id': row[2]})
    return jsonify(scheduled)

@app.route('/cancel-scheduled-interview', methods=['POST'])
def cancel_scheduled_interview():
    data = request.json
    username = data.get('username')
    role = data.get('role')
    # Update status to 'applied' (remove from scheduled)
    rows = []
    with open('job_applications.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        headers = next(reader)
        for row in reader:
            if row[0] == username and row[1] == role:
                row[3] = 'applied'
            rows.append(row)
    with open('job_applications.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['username','role','job_id','status'])
        writer.writerows(rows)
    return jsonify({'message': 'Interview cancelled'})

@app.route('/get-job-applicants-with-resume', methods=['GET'])
def get_job_applicants_with_resume():
    role = request.args.get('role')
    applicants = []
    with open('job_applications.csv', 'r') as appfile:
        app_reader = csv.reader(appfile)
        next(app_reader)
        for app_row in app_reader:
            if app_row[1] == role:
                username = app_row[0]
                # Get resume for this user
                resume_text = ''
                with open('users.csv', 'r') as userfile:
                    user_reader = csv.reader(userfile)
                    next(user_reader)
                    for user_row in user_reader:
                        if user_row[0] == username:
                            resume_text = user_row[2]
                            break
                applicants.append({'username': username, 'status': app_row[3], 'resume_text': resume_text})
    return jsonify(applicants)

@app.route('/apply-skill-assessment', methods=['POST'])
def apply_skill_assessment():
    data = request.json
    username = data.get('username')
    role = data.get('role')
    assessment_id = str(uuid.uuid4())
    # Check if already applied
    applied = False
    with open('skill_assessments.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        for row in reader:
            if row[0] == username and row[1] == role:
                applied = True
                break
    if applied:
        return jsonify({'message': 'Already applied'}), 400
    with open('skill_assessments.csv', 'a', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow([username, role, assessment_id, 'applied', ''])
    return jsonify({'message': 'Skill assessment application submitted'})

@app.route('/get-scheduled-skill-assessments', methods=['GET'])
def get_scheduled_skill_assessments():
    username = request.args.get('username')
    scheduled = []
    with open('skill_assessments.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        for row in reader:
            if row[0] == username and row[3] == 'shortlisted':
                scheduled.append({'role': row[1], 'assessment_id': row[2]})
    return jsonify(scheduled)

@app.route('/shortlist-skill-assessment', methods=['POST'])
def shortlist_skill_assessment():
    data = request.json
    username = data.get('username')
    role = data.get('role')
    # Update status to 'shortlisted' or create row if not present
    rows = []
    found = False
    with open('skill_assessments.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        headers = next(reader)
        for row in reader:
            if row[0] == username and row[1] == role:
                row[3] = 'shortlisted'
                found = True
            rows.append(row)
    if not found:
        import uuid
        assessment_id = str(uuid.uuid4())
        rows.append([username, role, assessment_id, 'shortlisted', ''])
    with open('skill_assessments.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['username','role','assessment_id','status','score'])
        writer.writerows(rows)
    return jsonify({'message': 'Skill assessment scheduled'})

@app.route('/cancel-skill-assessment', methods=['POST'])
def cancel_skill_assessment():
    data = request.json
    username = data.get('username')
    role = data.get('role')
    # Update status to 'applied'
    rows = []
    with open('skill_assessments.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        headers = next(reader)
        for row in reader:
            if row[0] == username and row[1] == role:
                row[3] = 'applied'
            rows.append(row)
    with open('skill_assessments.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['username','role','assessment_id','status','score'])
        writer.writerows(rows)
    return jsonify({'message': 'Skill assessment cancelled'})

@app.route('/get-skill-assessment-applicants-with-resume', methods=['GET'])
def get_skill_assessment_applicants_with_resume():
    role = request.args.get('role')
    applicants = []
    # Get all users who applied for the job (job_applications.csv)
    job_applicants = set()
    with open('job_applications.csv', 'r') as appfile:
        app_reader = csv.reader(appfile)
        next(app_reader)
        for app_row in app_reader:
            if app_row[1] == role:
                job_applicants.add(app_row[0])
    # Get all users who applied for skill assessment (skill_assessments.csv)
    with open('skill_assessments.csv', 'r') as appfile:
        app_reader = csv.reader(appfile)
        next(app_reader)
        for app_row in app_reader:
            if app_row[1] == role:
                job_applicants.add(app_row[0])
    # For each applicant, get resume and skill assessment status/score
    for username in job_applicants:
        resume_text = ''
        with open('users.csv', 'r') as userfile:
            user_reader = csv.reader(userfile)
            next(user_reader)
            for user_row in user_reader:
                if user_row[0] == username:
                    resume_text = user_row[2]
                    break
        # Find skill assessment status/score
        status = '-'
        score = '-'
        with open('skill_assessments.csv', 'r') as safile:
            sa_reader = csv.reader(safile)
            next(sa_reader)
            for sa_row in sa_reader:
                if sa_row[0] == username and sa_row[1] == role:
                    status = sa_row[3]
                    score = sa_row[4]
                    break
        applicants.append({'username': username, 'status': status, 'resume_text': resume_text, 'score': score})
    return jsonify(applicants)

@app.route('/get-skill-assessment-questions', methods=['POST'])
def get_skill_assessment_questions():
    data = request.json
    username = data.get('username')
    role = data.get('role')
    # Get resume text from users.csv
    resume_text = ""
    with open('users.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        for row in reader:
            if len(row) >= 3 and row[0] == username:
                resume_text = row[2]
                break
    if not resume_text:
        return {"error": "Resume not found for user."}
    # Get job description from CSV
    job = {}
    with open('job_descriptions.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        for row in reader:
            if len(row) >= 9 and row[0] == role:
                job = {
                    'role': row[0],
                    'title': row[1],
                    'skills': row[2],
                    'eligibility': row[3],
                    'location': row[4],
                    'duration': row[5],
                    'level': row[6],
                    'addons': row[7],
                    'num_questions': int(row[8])
                }
                break
    if not job:
        return {"error": "Job description not found."}
    domain_skills = job.get('skills', '')
    level = job.get('level', 'Medium')
    num_questions = 30
    prompt = f"""
    You are an expert assessment creator. Generate {num_questions} unique, clear, and relevant multiple-choice questions (MCQs) for a {level} level job role.
    - Focus ONLY on the required skills: {domain_skills}
    - Each question should have 4 options and 1 correct answer.
    - Format the output as a JSON array of objects, each with: question, options (list of 4), correct_answer.
    - Do NOT include explanations, headers, or extra text.
    - Only output the JSON array.
    """
    try:
        ai_data = generate(prompt)
        import json
        mcq_questions = json.loads(ai_data)
        import random
        for q in mcq_questions:
            opts = q['options']
            random.shuffle(opts)
            q['options'] = opts
        return {"mcq_questions": mcq_questions, "job_details": job, "num_questions": num_questions}
    except Exception as e:
        # fallback: static MCQ if AI fails
        mcq_questions = [
            {
                "question": "What is Python?",
                "options": ["A snake", "A programming language", "A car", "A fruit"],
                "correct_answer": "A programming language"
            },
            {
                "question": "Which of these is a valid variable name in Python?",
                "options": ["1var", "var_1", "var-1", "var 1"],
                "correct_answer": "var_1"
            },
            {
                "question": "What does 'len()' do in Python?",
                "options": ["Returns length", "Returns type", "Returns value", "Returns index"],
                "correct_answer": "Returns length"
            },
            {
                "question": "Which keyword is used to define a function in Python?",
                "options": ["def", "func", "function", "define"],
                "correct_answer": "def"
            },
            {
                "question": "What is the output of print(2 ** 3)?",
                "options": ["6", "8", "9", "5"],
                "correct_answer": "8"
            }
        ]
        return {"mcq_questions": mcq_questions, "job_details": job, "num_questions": num_questions}

@app.route('/submit-skill-assessment', methods=['POST'])
def submit_skill_assessment():
    data = request.json
    username = data.get('username')
    role = data.get('role')
    questions = data.get('questions', [])
    answers = data.get('answers', [])
    scores = data.get('scores', [])
    feedbacks = data.get('feedbacks', [])  # For MCQ, can be empty or auto-generated
    # Build per-question details
    question_details = []
    for i in range(len(questions)):
        question_details.append({
            'question': questions[i],
            'answer': answers[i] if i < len(answers) else '',
            'score': scores[i] if i < len(scores) else 0,
            'feedback': feedbacks[i] if i < len(feedbacks) else ''
        })
    total_score = sum(scores) if scores else 0
    max_score = len(scores) * 10 if scores else 1
    percent = (total_score / max_score) * 100 if max_score else 0
    # Save score and details in skill_assessments.csv
    rows = []
    found = False
    with open('skill_assessments.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        headers = next(reader)
        for row in reader:
            if row[0] == username and row[1] == role:
                row[4] = str(percent)
                # Add/replace question_details column if not present
                if len(row) < 6:
                    row.append(json.dumps(question_details))
                else:
                    row[5] = json.dumps(question_details)
                found = True
            rows.append(row)
    if not found:
        # Add new row if not found
        assessment_id = str(uuid.uuid4())
        rows.append([username, role, assessment_id, 'completed', str(percent), json.dumps(question_details)])
    with open('skill_assessments.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['username','role','assessment_id','status','score','question_details'])
        writer.writerows(rows)
    # Auto-schedule interview if score >= 80
    if percent >= 80:
        # Schedule interview in job_applications.csv
        app_rows = []
        found = False
        with open('job_applications.csv', 'r') as appfile:
            app_reader = csv.reader(appfile)
            headers = next(app_reader)
            for app_row in app_reader:
                if app_row[0] == username and app_row[1] == role:
                    app_row[3] = 'shortlisted'
                    found = True
                app_rows.append(app_row)
        if not found:
            app_rows.append([username, role, role, 'shortlisted'])
        with open('job_applications.csv', 'w', newline='') as appfile:
            writer = csv.writer(appfile)
            writer.writerow(['username','role','job_id','status'])
            writer.writerows(app_rows)
    return jsonify({'score': percent, 'auto_scheduled': percent >= 80, 'questions': question_details})

@app.route('/get-skill-assessment-results', methods=['GET'])
def get_skill_assessment_results():
    role = request.args.get('role')
    results = []
    with open('skill_assessments.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        headers = next(reader)
        for row in reader:
            if row[1] == role:
                question_details = []
                if len(row) >= 6:
                    try:
                        question_details = json.loads(row[5])
                    except Exception:
                        question_details = []
                results.append({'username': row[0], 'score': row[4], 'status': row[3], 'questions': question_details})
    return jsonify(results)

@app.route('/withdraw-job', methods=['POST'])
def withdraw_job():
    data = request.json
    username = data.get('username')
    role = data.get('role')
    rows = []
    with open('job_applications.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        headers = next(reader)
        for row in reader:
            if not (row[0] == username and row[1] == role):
                rows.append(row)
    with open('job_applications.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['username','role','job_id','status'])
        writer.writerows(rows)
    return jsonify({'message': 'Application withdrawn'})

@app.route('/update-job-skill-assessment', methods=['POST'])
def update_job_skill_assessment():
    data = request.json
    role = data.get('role')
    enable_skill_assessment = data.get('enable_skill_assessment', True)
    rows = []
    with open('job_descriptions.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        headers = next(reader)
        for row in reader:
            if row[0] == role:
                if len(row) >= 10:
                    row[9] = 'yes' if enable_skill_assessment else 'no'
                elif len(row) == 9:
                    row.append('yes' if enable_skill_assessment else 'no')
            rows.append(row)
    with open('job_descriptions.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)
        writer.writerows(rows)
    return jsonify({'message': 'Skill assessment setting updated'})

@app.route('/get-user-applications', methods=['GET'])
def get_user_applications():
    username = request.args.get('username')
    applications = []
    with open('job_applications.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        for row in reader:
            if row[0] == username:
                applications.append({'role': row[1], 'status': row[3]})
    return jsonify(applications)

@app.route('/get-user-skill-assessments', methods=['GET'])
def get_user_skill_assessments():
    username = request.args.get('username')
    shortlisted = []
    with open('skill_assessments.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        for row in reader:
            if row[0] == username and row[3] == 'shortlisted':
                shortlisted.append({
                    'role': row[1],
                    'assessment_id': row[2],
                    'status': row[3],
                    'score': row[4]
                })
    print(shortlisted)
    return jsonify(shortlisted)

# # Update the catch-all route for SPA routing
# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def serve_react(path):
#     # If the requested file exists in the React build, serve it (for static assets)
#     file_path = os.path.join(REACT_BUILD_DIR, path)
#     if path != "" and os.path.exists(file_path):
#         return send_from_directory(REACT_BUILD_DIR, path)
#     # Otherwise, serve index.html for React Router
#     return send_from_directory(REACT_BUILD_DIR, 'index.html')

# Serve React static files and index.html for all non-API routes
# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def serve_react(path):
#     if path != "" and os.path.exists(os.path.join(REACT_BUILD_DIR, path)):
#         return send_from_directory(REACT_BUILD_DIR, path)
#     else:
#         return send_from_directory(REACT_BUILD_DIR, 'index.html')

if __name__ == '__main__':
    app.run()
