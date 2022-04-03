from flask import Flask
from flask import Flask,render_template,url_for,request,g, flash, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import current_user, LoginManager, login_user, logout_user, UserMixin
from flask_admin import Admin, AdminIndexView
from flask_admin.contrib.sqla import ModelView
from flask_admin.model import BaseModelView

from flask import g
import sqlite3

DATABASE = 'database.db' #sql

app = Flask(__name__)
app.config['SECRET_KEY'] = 'any secret key'
conn = sqlite3.connect(DATABASE)
sql_create_Competition_table = """ CREATE TABLE IF NOT EXISTS Competition (
                                    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    name CHAR(25) NOT NULL,
                                    description VARCHAR(255),
                                    start_time INT,
                                    end_time INT,
                                    answer_json CHAR(1000),
                                    type INT
                                ); """
#what is submission_ts?
sql_create_Submission_table = """ CREATE TABLE IF NOT EXISTS Submission (
                                    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    participant_id INT NOT NULL,
                                    submission_ts INT,
                                    query VARCHAR(1000),
                                    pass INT,
                                    time_spent INT,
                                    score REAL
                                ); """

sql_create_Participant_table = """ CREATE TABLE IF NOT EXISTS Participant (
                                    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    submission_count INT
                                ); """
def insert_competition():
    sql = ''' INSERT INTO competition(name,description,start_time,end_time,answer_json,type)
              VALUES(123,123,132,123,123,123) '''
    c = conn.cursor()
    c.execute(sql)
    conn.commit()
    c.close()
#use it when u need examples

def create_tables():
    c = conn.cursor()
    c.execute("SELECT name FROM sqlite_master WHERE type='table';")
    #print(c.fetchall())
    if not c.fetchall():#no table create
        print('inside')
        c.execute(sql_create_Competition_table)
        c.execute(sql_create_Submission_table)
        c.execute(sql_create_Participant_table)
    c.close()
    conn.commit()
    #conn.close()
create_tables()
#insert_competition()


@app.route("/")
def home():
    return "Hello, Flask!"

@app.route('/get_competition', methods=['POST'])
def get_competition_by_id(competition_id):
    c = conn.cursor()
    c.execute(f"SELECT * FROM Competition WHERE id={str(competition_id)};")
    res = c.fetchall()
    c.close()
    conn.commit()
    if not res:
        print('Not exists in database')
        return None
    id,name,des,start,end,_,_ = res[0]
    return id,name,des,start,end
get_competition_by_id(3) #test case


@app.route('/list_competitions', methods=['POST'])
def list_competitions(froma,to):
    c = conn.cursor()
    all_comp = []
    for i in range(froma,to+1):
        c.execute(f"SELECT * FROM Competition WHERE id={str(i)};")
        res = c.fetchall()
        if res:
            id,name,des,start,end,_,_ = res[0]
            all_comp.append((id,name,des,start,end))
    c.close()
    conn.commit()
    print(all_comp)
    return all_comp

list_competitions(0,10) #test case

@app.route('/add_competition', methods=['POST'])
def add_competition(name,description,start_time,end_time,answer_json,type):
    c = conn.cursor()
    sql = f''' INSERT INTO competition(name,description,start_time,end_time,answer_json,type)
              VALUES({name},{description},{start_time},{end_time},{answer_json},{type}) '''

    try:
        c.execute(sql)
        c.close()
        conn.commit()
        return True
    except:
        return False


#add_competition(00,00,00,00,00,0)


@app.route('/add_submission', methods=['POST'])
def add_submission():
    return None

@app.route('/list_submissions_by_competition', methods=['POST'])
def list_submissions_by_competition():
    return None

@app.route('/update_competition', methods=['POST'])
def update_competition():
    return None

@app.route('/delete_competition', methods=['POST'])
def delete_competition():
    return None


#def get_competition_by_id()
if __name__ == '__main__':
    app.debug = True
    app.run(host = '0.0.0.0',port=8080)
