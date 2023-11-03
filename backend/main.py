from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from uuid import uuid4
import json
import os

weeks_dir = 'weeks'
weeks = []

week_counter = 0
for week_name in sorted(os.listdir(weeks_dir)):
    week_dir = os.path.join(weeks_dir, week_name)
    weeks.append({})
    question_counter = 0
    for question_name in sorted(os.listdir(week_dir)):
        weeks[week_counter][question_counter] = {}
        question_dir = os.path.join(week_dir, question_name)
        question_html = os.path.join(question_dir, "q.html")
        with open(question_html, 'r') as file:
            weeks[week_counter][question_counter]["question"] = file.read()
        with open(os.path.join(question_dir, "input.txt"), 'r') as file:
            weeks[week_counter][question_counter]["input"] = file.read()
        with open(os.path.join(question_dir, "expected.txt"), 'r') as file:
            weeks[week_counter][question_counter]["expected"] = file.read()
        if "ic" in question_html:
            weeks[week_counter][question_counter]["type"] = "class"
        else:
            weeks[week_counter][question_counter]["type"] = "individual"   
        question_counter += 1
    weeks[week_counter]["questionTotal"] = question_counter 
    week_counter += 1

app = FastAPI()

class User(BaseModel):
    username: str
    password: str

class ValidationInfo(BaseModel):
    username: str
    token: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open('users.json') as f:
    users = json.load(f)

@app.post("/login/")
def login(user: User):
    password = users[user.username]["password"]
    if password is not None and password == user.password:
        token = str(uuid4())
        users[user.username]["token"] = token
        return token
    return false

@app.post("/weeks/")
def getWeeks(validation: ValidationInfo):
    user = users[validation.username]
    if user is not None and user["token"] == validation.token:
        res = []
        for i in range(len(user["solved"])):
            res.append({"completed": len(user["solved"][i]), "nofQuestions": weeks[i]["questionTotal"]})
        return res
    return ""

@app.post("/weeks/{week_number}")
def getWeek(week_number, validation: ValidationInfo):
    user = users[validation.username]
    week_number_int = int(week_number) - 1
    if user is not None and user["token"] == validation.token and len(weeks) > week_number_int and week_number_int >= 0:
        res = []
        for i in range(len(weeks[week_number_int]) - 1):
            res.append({"html": weeks[week_number_int][i]["question"], "input": weeks[week_number_int][i]["input"],
             "type": weeks[week_number_int][i]["type"], "solved": (i + 1) in user["solved"][week_number_int], 
             "expected": weeks[week_number_int][i]["expected"] })
        return res
    return ""