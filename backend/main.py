from typing import Union
from fastapi import FastAPI
from pydantic import BaseModel
from uuid import uuid4
import json
import os

directory = 'weeks'
weeks = []
 
for dirname in os.listdir(directory):
    week_counter = 0
    d = os.path.join(directory, dirname)
    if os.path.isdir(d):
        counter = 0
        weeks[week_counter]["questions"] = []
        for filename in os.listdir(d):
            f = os.path.join(d, filename)
            with open(f, 'r') as file:
                if "input" in filename:
                    weeks[week_counter]["input"] = f.read()
                elif "expected" in filename: 
                    weeks[week_counter]["expected"] = f.read()
                else:
                    weeks[week_counter]["questions"].append(f.read())
            if "ic" in filename:
                weeks[week_counter]["type"] = "class"
            else:
                weeks[week_counter]["type"] = "individual"
            counter += 1
        weeks[week_counter]["questionTotal"] = counter 

class User(BaseModel):
    username: str
    password: str

class ValidationInfo(BaseModel):
    username: str
    token: str

app = FastAPI()

with open('users.json') as f:
    users = json.load(f)

@app.post("/login/")
def login(user: User):
    password = users[user.username]["password"]
    if password is not None and password == user.password:
        token = uuid4()
        users[user.username]["token"] = token
        return token
    return false

@app.post("/weeks/")
def getWeeks(validation: ValidationInfo):
    user = users[validation.username]
    if user["token"] == validation.token:
        res = []
        for i in range(len(user.solved)):
            res.append({"completed": len(user.solved[i]), "nofQuestions": weeks[i].questionTotal})
        return res
    return false

@app.post("/weeks/{week_number}")
def getWeek(week_number, validation: ValidationInfo):
    user = users[validation.username]
    if user["token"] == validation.token and len(weeks) > week_number:
        res = []
        for i in range(len(weeks[week_number]["questions"])):
            res.append({"html": weeks[week_number]["questions"][i], "input": weeks[week_number]["input"][i],
             "type": weeks[week_number]["type"], "solved": (i + 1) in user.solved[i], "expected": weeks[week_number]["expected"][i] })
        return res
    return false