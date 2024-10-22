

from pymongo import MongoClient
import xmltodict
client = MongoClient("mongodb://localhost:27017")

import requests
from requests.auth import _basic_auth_str
import json

db = client["hunters"]
active_calls_data = db['active_calls']




active_calls_data.drop()

client_secret = "9e28b63a91cab43b9aba0d33f1261d51"
client_id = "atomip"

grant_type = "password"
username = "201@atom.ip"
password = "Smile2021"
domain = ""

access_token = ""
refresh_token = ""

payload = {
    "client_secret": client_secret,
    "client_id": client_id,
    "grant_type": grant_type,
    "username": username,
    "password": password
}

headers = {
    "Content-Type": "application/json"
}


domain = "Consortio"


url = "https://voip.atomip.co.uk/ns-api/oauth2/token/"


response_ok = requests.get(url, data=json.dumps(payload), headers=headers)


if response_ok.status_code == 200:
    data = response_ok.json()
    
    access_token = data['access_token']

    refresh_token = data['refresh_token']
    domain = "Consortio"

    
else:
    pass


url_call_active = 'https://voip.atomip.co.uk/ns-api/?object=contact&action=read'

# Define the payload for the GET parameters
payload = {
    "domain": domain,
    "user": '201',
    "includeDomain": 'yes'
}

# Define the headers for the request
api_headers = {
    "Authorization": f"Bearer {access_token}"
}



response = requests.get(url_call_active, params=payload, headers=api_headers)

if response.status_code == 200:
    
    
    try:
        response_dict = xmltodict.parse(response.content)
        
        response_json = json.dumps(response_dict, indent=4)
        xml = response_dict.get('xml', {})
        contacts = xml.get('contact',[]);
        for contact in contacts:
            # Check if `user` field exists in the contact dictionary
            if 'user' in contact:
                
                # Process the contact if needed
                result = active_calls_data.insert_one(contact)
                pass
            else:
                pass
                
               


        if contacts:
            pass
            


    except Exception as e:
        print(f"Failed to convert XML to JSON: {e}")
else:
    print(f"Failed to retrieve data. Status code: {response.status_code}")
