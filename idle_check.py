

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

import time
from pymongo import MongoClient
import schedule
import threading
from datetime import datetime

# MongoDB connection
client = MongoClient("mongodb://localhost:27017")
db = client["hunters"]
active_calls_data = db['active_calls']
settings = db['settings']
teamEmail = db['TeamEmail']

datasettings = settings.find({})
listsettings = list(datasettings)

teamSettings = teamEmail.find({},{'_id':0,'user':1,'time':1,'email':1})
teamlistsettings = list(teamSettings)

print(teamlistsettings,listsettings);



timedata = listsettings[0]['time']
email = listsettings[0]['email']

# Dictionary to store timers and accumulated idle time
timers = {}

# Function to set timer for each UID
def set_timer(uid, idle_time):
    def timer_action(uid):
        print(f'{datetime.now()} - {email}: User {uid} has been idle for too long.')
        # Optional: Perform actions like sending an email, logging, etc.
        smtp_server = 'smtp.ionos.co.uk'
        smtp_port = 587
        sender_email = 'noreply@atomip.uk'
        receiver_email = 'abbasi.work22@gmail.com'

        #receiver_email = 'atexace959@gmail.com'
        #info@infusiontech.co.uk,
        password = 'c%klzr@4V92uK*3%'
        bcc_email  = 'abbasi.work22@gmail.com'


        message = MIMEMultipart()

        message['From'] = sender_email
        message['To'] = receiver_email
        message['Subject'] = 'IDLE AGENTS'
        message['Bcc'] = bcc_email
        email_body=""
        email_body += f' User {uid} has been idle for {timedata} minutes.'
        message.attach(MIMEText(email_body, 'plain'))

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, password)    
            server.send_message(message)
        print("Email sent successfully!")

    # Setting a new timer
    print(f'Setting timer for user {uid} with idle time {idle_time} minutes')
    timer = threading.Timer(idle_time * 60, timer_action, [uid])
    timer.start()
    timers[uid] = {
        'timer': timer,
        'start_time': time.time(),
        'idle_time': idle_time * 60,  # Convert minutes to seconds
        'accumulated_idle_time': 0  # Initialize accumulated idle time
    }

# Function to check the idle status of users
def check_idle_status():
    data_calls = active_calls_data.find({})
    data_calls_list = list(data_calls)

    datasettings = settings.find({})
    listsettings = list(datasettings)

    timedata = listsettings[0]['time']
    email = listsettings[0]['email']

    print(f'{datetime.now()} - Checking idle status')

    for item in data_calls_list:
        uid = item['uid']

        if item['presence'] == 'open':
            if uid not in timers:
                
                set_timer(uid, timedata)
            else:
                # Update accumulated idle time if user is still idle
                if timers[uid]['timer'].is_alive():
                    current_time = time.time()
                    elapsed_time = current_time - timers[uid]['start_time']
                    timers[uid]['accumulated_idle_time'] += elapsed_time
                    timers[uid]['start_time'] = current_time
        else:
            if uid in timers:
                print(f'Clearing timer for user {uid}')
                timers[uid]['timer'].cancel()

                current_time = time.time()
                elapsed_time = current_time - timers[uid]['start_time']
                timers[uid]['accumulated_idle_time'] += elapsed_time
                del timers[uid]

schedule.every(3).seconds.do(check_idle_status)

def update_current_time():
    while True:
        current_time = datetime.now()
        print(f'Current time: {current_time}')

        for uid, data in list(timers.items()):
            elapsed_time = time.time() - data['start_time']
            remaining_time = data['idle_time'] - elapsed_time
            accumulated_idle_time = data['accumulated_idle_time']

            if remaining_time <= 0:
                print(f'User {uid} has been idle for too long.')
                
                smtp_server = 'smtp.ionos.co.uk'
                smtp_port = 587
                sender_email = 'noreply@atomip.uk'
                receiver_email = 'abbasi.work22@gmail.com'

                #receiver_email = 'atexace959@gmail.com'
                #info@infusiontech.co.uk,
                password = 'c%klzr@4V92uK*3%'
                bcc_email  = 'abbasi.work22@gmail.com'


                message = MIMEMultipart()

                message['From'] = sender_email
                message['To'] = receiver_email
                message['Subject'] = 'IDLE AGENTS'
                message['Bcc'] = bcc_email
                email_body=""
                email_body += f' User {uid} has been idle for {timedata} minutes.'
                message.attach(MIMEText(email_body, 'plain'))

                with smtplib.SMTP(smtp_server, smtp_port) as server:
                    server.starttls()
                    server.login(sender_email, password)    
                    server.send_message(message)
                print("Email sent successfully!")

                del timers[uid]
            else:
                print(f'User {uid} remaining time: {remaining_time:.2f} seconds')
                print(f'User {uid} accumulated idle time: {accumulated_idle_time:.2f} seconds')

        time.sleep(1)

# Starting a separate thread to update current time and timers
current_time_thread = threading.Thread(target=update_current_time)
current_time_thread.daemon = True
current_time_thread.start()

# Main loop to run scheduled tasks
while True:
    schedule.run_pending()
    time.sleep(1)
