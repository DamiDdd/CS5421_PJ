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
                                    id INT PRIMARY KEY AUTO_INCREMENT,
                                    name CHAR(25) NOT NULL,
                                    description VARCHAR(255),
                                    start_time INT,
                                    end_time INT,
                                    answer_json CHAR(1000),
                                    type INT
                                ); """
#what is submission_ts?
sql_create_Submission_table = """ CREATE TABLE IF NOT EXISTS Submission (
                                    id INT PRIMARY KEY AUTO_INCREMENT,
                                    participant_id INT NOT NULL,
                                    submission_ts INT,
                                    query VARCHAR(1000),
                                    pass INT,
                                    time_spent INT,
                                    score REAL
                                ); """

sql_create_Participant_table = """ CREATE TABLE IF NOT EXISTS Participant (
                                    id INT PRIMARY KEY AUTO_INCREMENT,
                                    submission_count INT
                                ); """

def create_tables():
    c = conn.cursor()
    c.execute("SELECT name FROM sqlite_master WHERE type='table';")
    print(c .fetchall())
    if not c .fetchall():#no table create
        c.execute(sql_create_Competition_table)
        c.execute(sql_create_Submission_table)
        c.execute(sql_create_Participant_table)
    conn.commit()
    conn.close()
create_tables()


@app.route("/")
def home():
    return "Hello, Flask!"

@app.route('/get_competition', methods=['POST'])
def get_competition_by_id(competition_id):

    return None

@app.route('/list_competitions', methods=['POST'])
def list_competitions():
    return None

@app.route('/add_competition', methods=['POST'])
def add_competition():
    return None

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
