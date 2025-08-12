from flask import Flask, request, jsonify,render_template
import requests
from flask_cors import CORS
import csv
import json
import os
from werkzeug.security import generate_password_hash, check_password_hash
import google.generativeai as palm

app = Flask(__name__)
CORS(app)
def ocr_space_file(filename, language='eng'):
    api_key = 'K84864407788957'
    payload = {'isOverlayRequired': False,
               'apikey': api_key,
               'language': language,
               'OCREngine': 2,
               'IsTable':True
               }
    with open(filename, 'rb') as f:
        r = requests.post('https://api.ocr.space/parse/image',
                          files={filename: f},
                          data=payload,
                          )
    result=r.content.decode()

    result_json = json.loads(result)
    extracted_text = result_json.get("ParsedResults")[0].get("ParsedText")
    return extracted_text
@app.route('/get_questions', methods=['POST'])
def get_questions():
    interview_type = request.json['type']
    palm.configure(api_key='AIzaSyCpta0zYFZSLw7imatVqW-exaviTfMIqu0')
    text="Generate some random"+str(interview_type)+"questions more than 10."
    response = palm.generate_text(prompt=text)
    result=response.result
    questions=result.split("\n")
    print(questions)
    #questions = questions.get(interview_type, [])
    return (questions)
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    print(username,password)
    password_hash = generate_password_hash(password)
    with open('users.csv', 'a', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow([username, password_hash])
    return jsonify({"message": "User registered successfully!"}), 200
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    with open('users.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            if row[0] == username and check_password_hash(row[1], password):
                return jsonify({"message": "Login successful!"}), 200
    return jsonify({"message": "Invalid username or password"}), 401
@app.route('/submit-answers', methods=['POST'])
def submit_answers():
    if request.is_json:
        data = request.get_json() 
        key=list(data.keys())
        val=list(data.values())
        l    =[]
        for i,j in zip(key,val):
            print(i,j)
            k=i+" "+j
            l.append(k)
            k="||".join(l)
        text="evaluate the every answerwith respect to question and generate detailed report on the student performance.the question and answers by user are below:If the answers are empty then make report as fail. \n"+k
        response = palm.generate_text(prompt=text)
        result=response.result
        # Process the data as needed, for example, save to a database
        print(result)
        return result, 200
    else:
        return jsonify({"error": "Request must be JSON"}), 400
@app.route('/extract-text', methods=['POST'])
def handle_extract_text():
    file = request.files['file']
    if file:
        filepath = os.path.join('temp', file.filename)
        file.save(filepath)

        text = ocr_space_file(filepath)
        # Clean up file
        os.remove(filepath)
        return jsonify({'text': text})

    return jsonify({'error': 'No file provided'}), 400

# @app.route('/get_mcq', methods=['POST'])
# def get_mcq():
#     if request.method == 'POST':
#         data = request.json
#         result = MCQ_questions(data)
#         return result
# def MCQ_questions(data):
#     def split_json(ques_list):
#         try:
#             inn=[]
#             out=[]
#             for i in range(len(ques_list[0])):
#                 if ques_list[0][i]=="{":
#                     inn.append(i)
#                 if ques_list[0][i]=="}":
#                     out.append(i)
#             l=[]
#             d=ques_list[0]
#             for i,j in zip(inn,out):
#                 dk=d[i:j+1]
#                 # print(dk)
#                 dd=json.loads(dk)
#                 l.append(dd)
#             return l
#         except:
#             split_json(ques_list)
#     palm.configure(api_key='AIzaSyCpta0zYFZSLw7imatVqW-exaviTfMIqu0')
#     format="""\n
#     {
#       "question": "Sample question?",
#       "category": "Category1",
#       "options": ["Option1", "Option2", "Option3", "Option4"],
#       "correct_answer": "CorrectOption"
#     },
#     {
#       "question": "Another sample question?",
#       "category": "Category2",
#       "options": ["Option1", "Option2", "Option3", "Option4"],
#       "correct_answer": "CorrectOption"
#     }
#     //other questions
# """
#     def generate(text):
#         response = palm.generate_text(prompt=text)
#         return response.result
#     # course=data['course']
#     branch=data.json['category']
#     #stream=data['branch']
#     #time=data['time']
#     # count=int(time)//2
#     # category=stream
#     inputt="""{
#         "branch": [%s]}"""%(branch)
#     text="Generate "+str(count)+" sets of MCQ questions based on user-provided input:\n"+inputt+"\nThe output should be in the following format:\n"+format
#     result1 = generate(text)
#     result1={
#         "questions":split_json([result1])
#     }
#     time=int(time)
#     count=int(count)
#     data={'MCQ_Questions':result1}
#     print(data)
#     try:
#         with open("Questions.json", "w") as json_file:
#             json.dump(data, json_file, indent=1)
#     except:
#         pass
#     return data

if __name__ == '__main__':
    app.run(debug=True)
