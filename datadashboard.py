import csv
from pymongo import MongoClient

import requests
from requests.auth import _basic_auth_str
import json
from datetime import date

from datetime import datetime,timedelta
import xmltodict
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import smtplib
import re





import sys

today = datetime.now()
now = datetime.now()
 

url = "https://voip.atomip.co.uk/ns-api/oauth2/token/"


client = MongoClient("mongodb://localhost:27017")

db = client["hunters"]
collection_summary = db['summary']
collection_detailed_calls = db['detailed_calls']



collection_summary.drop()
collection_detailed_calls.drop()

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


def seconds_to_hms_string(seconds):
    
    hours = seconds // 3600
    seconds %= 3600
    minutes = seconds // 60
    seconds %= 60
    return "{:02d}:{:02d}:{:02d}".format(int(hours), int(minutes), int(seconds))


domain = "Consortio"


response_ok = requests.get(url, data=json.dumps(payload), headers=headers)


if response_ok.status_code == 200:
    data = response_ok.json()
    
    access_token = data['access_token']

    refresh_token = data['refresh_token']
    domain = "Consortio"

    
else:
    pass





payload ={
    "domain": domain,
    "limit":1000000,
    
}
url = "https://voip.atomip.co.uk/ns-api/?object=call&action=read"




api_headers = {
  
        "Authorization": f"Bearer {access_token}"
        }





url_user = "https://voip.atomip.co.uk/ns-api/?format=json&object=subscriber&action=read"



response_user = requests.post(url_user, data=payload, headers=api_headers)

total_time = {}
total_calls = {}
total_timing_of_calls = {}
total_outbound_calls = {}
total_outbound_time = {}

inbound_missed = {}
outbound_missed = {}

total_inbound_calls = {}
total_inbound_time = {}

avg_inbound_time = {}
avg_outbound_time = {}
max_inbound_time = {}
max_outbound_time = {}
name_agent = {}

avg_outbound_talk_time = {}

avg_inbound_talk_time = {}
time_inbound_ring = {}
incoming_avg_ring = {}
user_ids = {}

data_calls = []

users = []
data = response_user.json()

for d in data:
    user = d['user']

    if d['scope'] == 'Call Center Supervisor' or d['scope'] =='Call Center Agent':
        users.append(user)
        total_time[user] = 0
        total_calls[user] = 0
        total_timing_of_calls [user]  = 0
        total_outbound_calls  [user]  = 0
        total_inbound_calls  [user]  = 0
        total_outbound_time [user]  = 0
        total_inbound_time [user]  = 0
        inbound_missed [user] = 0
        outbound_missed [user] = 0
        avg_outbound_time [user] = 0
        max_inbound_time [user] = 0
        avg_inbound_time [user] = 0
        max_outbound_time [user] = 0
        avg_outbound_talk_time [user] = 0

        avg_inbound_talk_time  [user] = 0
        incoming_avg_ring [user] = 0
        time_inbound_ring [user] = 0


        name_agent[user]  = d['first_name'] + ' ' + d['last_name'] + ' <' + user + '> '  
            
        user_ids[user] = user




user = 'Total'

name_agent[user] = 'Total'
user_ids[user] = '--'
total_time[user] = 0
total_calls[user] = 0
total_timing_of_calls [user]  = 0
total_outbound_calls  [user]  = 0
total_inbound_calls  [user]  = 0
total_outbound_time [user]  = 0
total_inbound_time [user]  = 0
inbound_missed [user] = 0
outbound_missed [user] = 0
avg_outbound_time [user] = 0
max_inbound_time [user] = 0
avg_inbound_time [user] = 0
max_outbound_time [user] = 0
avg_outbound_talk_time [user] = 0

avg_inbound_talk_time  [user] = 0
incoming_avg_ring [user] = 0
time_inbound_ring [user] = 0





        


current_time = datetime.now()

# Subtract one hour
one_hour_before = current_time - timedelta(weeks=1)

# start_of_last_week = current_time - timedelta(weeks=1)

start_of_yesterday = current_time - timedelta(weeks=1)

start_date = start_of_yesterday
today = current_time.strftime('%Y-%m-%d %H:%M:%S')
end_date = today



start_datetime = start_date
end_datetime = datetime.strptime(end_date, '%Y-%m-%d %H:%M:%S')


start_date_only = start_datetime.strftime('%Y-%m-%d')
end_date_only = end_datetime.strftime('%Y-%m-%d')

print(start_date,end_date)

url_cdr_domain = "https://voip.atomip.co.uk/ns-api/?format=json&object=cdr2&action=read"

if len(sys.argv) < 3:
        print("Usage: python script.py <start_date> <end_date>")
        sys.exit(1)  # Exit with a non-zero status to indicate an error


start_date = sys.argv[1]
end_date = sys.argv[2]



payload_cdr_domain  = {"start_date": start_date,"end_date":end_date,"limit":1000000,"domain":domain}
count = 0




response_cdr_domain  = requests.post(url_cdr_domain ,data=payload_cdr_domain ,headers=api_headers)

data_cdr = response_cdr_domain.json()



count = 0
countleft = 0
countright = 0
c = 0
c1 = 0

c2 = 0
c3 = 0
c4 = 0
c5 = 0

for cdr in data_cdr:

    count = count + 1
    
 
    
    time_difference_seconds_outbound = 0
    if cdr['orig_sub'] is not None and cdr['orig_sub'] in total_time :
        if cdr['time_answer'] is not None:
                
            
            time_answer = datetime.fromtimestamp(int(cdr['time_answer']))
            time_release = datetime.fromtimestamp(int(cdr['time_release']))

            time_difference_outbound = time_release - time_answer
            time_difference_seconds_outbound = time_difference_outbound.total_seconds()
            
            
    

        
        

   
        if cdr['type'] == str(0):
            try:
                    
          
                
                number_from = re.search(r'\d+', cdr['orig_from_uri']).group()

        
                
                data_inbound = {'user':cdr['orig_sub'] ,  'time':cdr['time_start'],'source':number_from,'destination':cdr['orig_to_user'],'duration':seconds_to_hms_string(float(cdr['duration'])),'Direction':'Outgoing'     }

                data_calls.append(data_inbound)

            except:
                pass

            

            total_time[cdr['orig_sub']] += int(cdr['time_talking'])
            
            total_timing_of_calls[cdr['orig_sub']]  += int(cdr['time_talking'])
            total_calls[cdr['orig_sub']]  += 1

 
            total_outbound_calls[cdr['orig_sub']] +=1
            total_outbound_time [cdr['orig_sub']]+= int(cdr['time_talking'])
            

            if max_outbound_time[cdr['orig_sub']] < time_difference_seconds_outbound:    
                max_outbound_time[cdr['orig_sub']] = time_difference_seconds_outbound

  
            


        elif cdr['type'] == str(3):
            total_time[cdr['orig_sub']] += int(cdr['time_talking'])
            total_timing_of_calls[cdr['orig_sub']] += int(cdr['time_talking'])
            total_calls[cdr['orig_sub']]  += 1
            # 
            total_outbound_calls[cdr['orig_sub']] +=1
            total_outbound_time [cdr['orig_sub']]+= int(cdr['time_talking'])
            
            



        
      
        time_answer =cdr['time_answer']
        if time_answer is None:

            outbound_missed[cdr['orig_sub']] +=1
            
            
        countright += 1
        




    elif cdr['orig_sub'] is None:
        if cdr['term_sub'] is not None and cdr['term_sub'] in total_time :
            if cdr['time_answer'] is not None:
            
                time_answer = datetime.fromtimestamp(int(cdr['time_answer']))
                time_release = datetime.fromtimestamp(int(cdr['time_release']))

                time_difference = time_release - time_answer
                time_difference_seconds = time_difference.total_seconds()

                
                time_start = datetime.fromtimestamp(int(cdr['time_start']))
                time_difference_ring = time_answer - time_start
                time_difference_seconds_ring = time_difference_ring.total_seconds()




            if cdr['type'] == str(3):
                total_time[cdr['term_sub']] += int(cdr['time_talking'])
                time_inbound_ring[cdr['term_sub']] += time_difference_seconds_ring

                #total_timing_of_calls[cdr['term_sub']] += int(cdr['time_talking'])
                total_calls[cdr['term_sub']]  += 1
                
                total_inbound_calls[cdr['term_sub']] +=1
           


                c2 = c2 + 1
                

            if cdr['type'] == str(1):
                try:
                        
                    number_from = re.search(r'\d+', cdr['orig_from_uri']).group()
                    data_outbound = {'user': cdr['term_sub'] , 'time':cdr['time_start'],'source':number_from,'destination':cdr['orig_to_user'],'duration':seconds_to_hms_string(float(cdr['duration'])),'Direction':'Incoming' }
                    data_calls.append(data_outbound)
                except:
                    pass



                total_time[cdr['term_sub']] += int(cdr['time_talking'])
                total_timing_of_calls[cdr['term_sub']] += int(cdr['time_talking'])
                time_inbound_ring[cdr['term_sub']] += time_difference_seconds_ring

                

            
                total_calls[cdr['term_sub']]  += 1
             
                c3 = c3 + 1


                

                if max_inbound_time[cdr['term_sub']] < time_difference_seconds:
                    max_inbound_time[cdr['term_sub']] = time_difference_seconds

                total_inbound_calls[cdr['term_sub']] +=1
                
                total_inbound_time [cdr['term_sub']]+=  int(cdr['time_talking'])

            elif cdr['type'] == str(2):
                inbound_missed[cdr['term_sub']] +=1
                
                

            
      
            countleft += 1
            
        else:

            c+=1
            # print("")
            # print("outbound: ",cdr['orig_sub'], " inbound:" ,cdr['term_sub'],"type: ",cdr['type'], cdr['cdr_id'])


    else:
        # print("outbound: ",cdr['orig_sub'], " inbound:" ,cdr['term_sub'],"type: ",cdr['type'], cdr['cdr_id'])

    
        c1 +=1
    # print("outbound: ",cdr['orig_sub'], " inbound:" ,cdr['term_sub'],"type: ",cdr['type'], cdr['cdr_id'])


for key, value in total_timing_of_calls.items():
    if total_inbound_calls[key] !=0 and total_outbound_calls[key] !=0:
            
        avg_inbound_talk_time[key] = total_inbound_time[key] / total_inbound_calls[key]
        avg_outbound_talk_time[key] = total_outbound_time[key] / total_outbound_calls[key]



for key, value in total_inbound_time.items():
    total_inbound_time['Total'] = float(total_inbound_time[key])




     



for key, value in total_inbound_time.items():    
    total_inbound_time[key] = seconds_to_hms_string(value)


    






for key, value in total_outbound_time.items():
    total_outbound_time[key] = seconds_to_hms_string(value)

        




for key, value in time_inbound_ring.items():
    if total_inbound_calls[key] !=0:
        incoming_avg_ring [key] = time_inbound_ring[key] / total_inbound_calls[key]




for key, value in incoming_avg_ring.items():
    incoming_avg_ring [key] = seconds_to_hms_string(value)
    

    







for key, value in avg_inbound_talk_time.items():
    avg_inbound_talk_time[key] = seconds_to_hms_string(value)
        







for key, value in avg_outbound_talk_time.items():
    avg_outbound_talk_time[key] = seconds_to_hms_string(value)
        

    


        




total_time_of_talking = {}

for key, value in total_timing_of_calls.items():
    
    total_timing_of_calls[key] = seconds_to_hms_string(value)
   
    total_time_of_talking[key]  = value
        









for key, value in max_outbound_time.items():
    max_outbound_time[key] = seconds_to_hms_string(value)
        





for key, value in max_inbound_time.items():
    max_inbound_time[key] = seconds_to_hms_string(value)
        



for key, value in total_inbound_calls.items():
    if total_calls[key] !=0:
        
        avg_inbound_time[key] =  round(total_inbound_calls[key] / total_calls[key], 1)

        
for key, value in total_outbound_calls.items():
    if total_calls[key] !=0:
        avg_outbound_time[key] = round(total_outbound_calls[key] / total_calls[key], 1)
        






for key,value in total_inbound_time.items():
    hours, minutes, seconds = value.split(':')
    accumulate_hours = float(hours) + (float(minutes)/60) + float(seconds)/3600


    if accumulate_hours > 0:
        avg_inbound_time[key] = round(total_inbound_calls[key] /  float(accumulate_hours),2) 
        






for key,value in total_outbound_time.items():
    hours, minutes, seconds = value.split(':')
    accumulate_hours = float(hours) + (float(minutes)/60) + float(seconds)/3600
    if accumulate_hours > 0:
        avg_outbound_time[key] = round(total_outbound_calls[key] /  float(accumulate_hours) ,2)



total = sum(value for key, value in avg_inbound_time.items() if key != 'Total')
avg_inbound_time['Total'] = total


total = sum(value for key, value in avg_outbound_time.items() if key != 'Total')
avg_outbound_time['Total'] = total

total = sum(value for key, value in total_inbound_calls.items() if key != 'Total')
total_inbound_calls['Total'] = total


total = sum(value for key, value in total_outbound_calls.items() if key != 'Total')
total_outbound_calls['Total'] = total

total = sum(value for key, value in total_calls.items() if key != 'Total')
total_calls['Total'] = total


total = sum(value for key, value in inbound_missed.items() if key != 'Total')
inbound_missed['Total'] = total

total = sum(value for key, value in outbound_missed.items() if key != 'Total')
outbound_missed['Total'] = total



total_time_inbound = timedelta()
for time_str in total_inbound_time.values():
    if time_str != '00:00:00':
        hours, minutes, seconds = map(int, time_str.split(':'))
        total_time_inbound += timedelta(hours=hours, minutes=minutes, seconds=seconds)
total_time_str = str(total_time_inbound)
total_inbound_time['Total'] = total_time_str



total_time_inbound_ring = timedelta()
for time_str in incoming_avg_ring.values():
    if time_str != '00:00:00':
        hours, minutes, seconds = map(int, time_str.split(':'))
        total_time_inbound_ring += timedelta(hours=hours, minutes=minutes, seconds=seconds)
total_time_str = str(total_time_inbound_ring)
incoming_avg_ring['Total'] = total_time_str




total_time_inbound_max = timedelta()
for time_str in max_inbound_time.values():
    if time_str != '00:00:00':
        hours, minutes, seconds = map(int, time_str.split(':'))
        total_time_inbound_max += timedelta(hours=hours, minutes=minutes, seconds=seconds)
total_time_str = str(total_time_inbound_max)
max_inbound_time['Total'] = total_time_str


total_time_outbound_max = timedelta()
for time_str in max_outbound_time.values():
    if time_str != '00:00:00':
        hours, minutes, seconds = map(int, time_str.split(':'))
        total_time_outbound_max += timedelta(hours=hours, minutes=minutes, seconds=seconds)
total_time_str = str(total_time_outbound_max)
max_outbound_time['Total'] = total_time_str





total_time_inbound_avg = timedelta()
for time_str in avg_inbound_talk_time.values():
    if time_str != '00:00:00':
        hours, minutes, seconds = map(int, time_str.split(':'))
        total_time_inbound_avg += timedelta(hours=hours, minutes=minutes, seconds=seconds)
total_time_str = str(total_time_inbound_avg)
avg_inbound_talk_time['Total'] = total_time_str



total_time_outbound_avg = timedelta()
for time_str in avg_outbound_talk_time.values():
    if time_str != '00:00:00':
        hours, minutes, seconds = map(int, time_str.split(':'))
        total_time_outbound_avg += timedelta(hours=hours, minutes=minutes, seconds=seconds)
total_time_str = str(total_time_outbound_avg)
avg_outbound_talk_time['Total'] = total_time_str







total_time_outbound = timedelta()
for time_str in total_outbound_time.values():
    if time_str != '00:00:00':
        hours, minutes, seconds = map(int, time_str.split(':'))
        total_time_outbound += timedelta(hours=hours, minutes=minutes, seconds=seconds)
total_time_str = str(total_time_outbound)
total_outbound_time['Total'] = total_time_str




total_time_talk = timedelta()
for time_str in total_timing_of_calls.values():
    if time_str != '00:00:00':
        hours, minutes, seconds = map(int, time_str.split(':'))
        total_time_talk += timedelta(hours=hours, minutes=minutes, seconds=seconds)
     
total_time_str = str(total_time_talk)
total_timing_of_calls['Total'] = total_time_str







# Extract and remove the 'Total' key-value pair
total_value = total_calls.pop('Total')


# Sort the remaining dictionary based on values in ascending order
sorted_data = dict(sorted(total_time_of_talking.items(), key=lambda item: item[1], reverse=True))

# Add the 'Total' key-value pair back
sorted_data['Total'] = total_value

# Print the sorted dictionary

total_calls['Total'] = total_value

new_users = []
for key in sorted_data:
  
    new_users.append(key)


with open(start_date_only + '.csv', 'w', newline='') as csvfile:
    fieldnames = ['User ID','Agent Name',  'Total Calls', 'Total Talk Time', 
                  'Incoming Total', 'Incoming Missed', 'Incoming Avg Per Hour', 
                  'Incoming  Talk Time', 'Incoming  Average Talk Time', 'Incoming Max Talk Time', 
                  'Incoming Average Ring Time', 'Outgoing Total', 'Outgoing Avg Per Hour', 'Outgoing Unanswered','Outgoing Answered',
                  'Outgoing Total Talk Time','Outgoing Avg Talk Time','Outgoing Max Talk Time',
                  ]

    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()

    for user in new_users:
        print(user_ids[user])
        writer.writerow({
            'User ID':user_ids[user],

            'Agent Name': name_agent[user],
            'Total Calls': total_calls[user],
            'Total Talk Time': total_timing_of_calls[user],
            'Incoming Total': total_inbound_calls[user],
            'Incoming Missed': inbound_missed[user],
            
            'Incoming Avg Per Hour': avg_inbound_time[user],

            'Incoming  Talk Time': total_inbound_time[user],
            'Incoming  Average Talk Time': avg_inbound_talk_time[user],
            
            'Incoming Max Talk Time': max_inbound_time[user],
        
            'Incoming Average Ring Time': incoming_avg_ring[user],
            

            'Outgoing Total': total_outbound_calls[user],
            'Outgoing Avg Per Hour': avg_outbound_time[user],
            

            
            'Outgoing Unanswered': outbound_missed[user],
            'Outgoing Answered' :str( int(total_outbound_calls [user]) - int( outbound_missed[user])),
            'Outgoing Total Talk Time': total_outbound_time[user],
            
            
            'Outgoing Avg Talk Time': avg_outbound_talk_time[user],
            
            
            
            'Outgoing Max Talk Time': max_outbound_time[user],
           
        })
        collection_summary.insert_one({
            'User ID':user_ids[user],
            'Agent Name': name_agent[user],
            'Total Calls': total_calls[user],
            'Total Talk Time': total_timing_of_calls[user],
            'Incoming Total': total_inbound_calls[user],
            'Incoming Missed': inbound_missed[user],
            
            'Incoming Avg Per Hour': avg_inbound_time[user],

            'Incoming  Talk Time': total_inbound_time[user],
            'Incoming  Average Talk Time': avg_inbound_talk_time[user],
            
            'Incoming Max Talk Time': max_inbound_time[user],
        
            'Incoming Average Ring Time': incoming_avg_ring[user],
            

            'Outgoing Total': total_outbound_calls[user],
            'Outgoing Avg Per Hour': avg_outbound_time[user],
            

            
            'Outgoing Unanswered': outbound_missed[user],
            'Outgoing Answered' :str( int(total_outbound_calls [user]) - int( outbound_missed[user])),
            'Outgoing Total Talk Time': total_outbound_time[user],
            
            
            'Outgoing Avg Talk Time': avg_outbound_talk_time[user],
            
            
            
            'Outgoing Max Talk Time': max_outbound_time[user],
           
        })







with open(start_date_only + '.csv', 'a', newline='') as csvfile:

    fieldnames1 = ['User','Date and Time',  'Source', 'Destination','Duration','Direction']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames1)
    writer.writerow({'User': '', 'Date and Time': '', 'Source': '', 'Destination': '', 'Duration': '', 'Direction': ''})

    writer.writerow({'User': '', 'Date and Time': '', 'Source': '', 'Destination': '', 'Duration': '', 'Direction': ''})


    writer.writeheader()
    for user in new_users:
            
        fieldnames2 = ['User ID','Agent Name',  'Total Calls', 'Total Talk Time', 
                'Incoming Total', 'Incoming Missed', 'Incoming Avg Per Hour', 
                'Incoming  Talk Time', 'Incoming  Average Talk Time', 'Incoming Max Talk Time', 
                'Incoming Average Ring Time', 'Outgoing Total', 'Outgoing Avg Per Hour', 'Outgoing Unanswered','Outgoing Answered',
                'Outgoing Total Talk Time','Outgoing Avg Talk Time','Outgoing Max Talk Time',
                ]
        writer.writerow({'User': '', 'Date and Time': '', 'Source': '', 'Destination': '', 'Duration': '', 'Direction': ''})



        writer2 = csv.DictWriter(csvfile, fieldnames=fieldnames2)
        writer2.writerow({'Agent Name':'Summary' + name_agent[user]})    
        writer2.writeheader()

        writer2.writerow({
            'User ID':user_ids[user],
            'Agent Name': name_agent[user],
            'Total Calls': total_calls[user],
            'Total Talk Time': total_timing_of_calls[user],
            'Incoming Total': total_inbound_calls[user],
            'Incoming Missed': inbound_missed[user],
            
            'Incoming Avg Per Hour': avg_inbound_time[user],

            'Incoming  Talk Time': total_inbound_time[user],
            'Incoming  Average Talk Time': avg_inbound_talk_time[user],
            
            'Incoming Max Talk Time': max_inbound_time[user],
        
            'Incoming Average Ring Time': incoming_avg_ring[user],
            

            'Outgoing Total': total_outbound_calls[user],
            'Outgoing Avg Per Hour': avg_outbound_time[user],
            

            
            'Outgoing Unanswered': outbound_missed[user],
            'Outgoing Answered' :str( int(total_outbound_calls [user]) - int( outbound_missed[user])),
            'Outgoing Total Talk Time': total_outbound_time[user],
            
            
            'Outgoing Avg Talk Time': avg_outbound_talk_time[user],
            
            
            
            'Outgoing Max Talk Time': max_outbound_time[user],
           
        })
    


        writer.writerow({'User': '', 'Date and Time': '', 'Source': '', 'Destination': '', 'Duration': '', 'Direction': ''})

        writer.writeheader()


        for data in data_calls:

            if data['user'] == user:
                
                writer.writerow({
                    'User':data['user'],
                    'Date and Time':datetime.fromtimestamp(int(data['time'])),
                    'Source': data['source'],
                    'Destination': data['destination'],
                    'Duration': data['duration'],
                    'Direction': data['Direction'],
                })
                collection_detailed_calls.insert_one({
                    'User':data['user'],
                    'Date and Time':datetime.fromtimestamp(int(data['time'])),
                    'Source': data['source'],
                    'Destination': data['destination'],
                    'Duration': data['duration'],
                    'Direction': data['Direction'],
                })





