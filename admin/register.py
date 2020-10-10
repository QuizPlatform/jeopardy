import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import pandas as pd

responses = pd.read_csv('responses.csv')
cred = credentials.Certificate("creds.json")
firebase_admin.initialize_app(cred)


db = firestore.client()

codes = {}
for ind in responses.index:
    teamCode = responses['Secret Team Code'][ind]
    print(ind, teamCode)
    data = {
        'teamName': responses['Team Name'][ind],
        'members': [responses['Team Leader'][ind], responses['Team Member 2'][ind]],
        'answers': {'1': ''},
    }
    db.collection('test').document(teamCode).set(data, merge=True)
    db.collection('scorecardTest').document(teamCode).set({'1': 0}, merge=True)
    codes[str(ind)] = teamCode
db.collection('teamCodeTest').document('codes').set(codes, merge=True)
