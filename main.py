import json
from flask import Flask, request, jsonify
from flask import Flask, render_template, url_for, request, g, flash, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import current_user, LoginManager, login_user, logout_user, UserMixin
from flask_admin import Admin, AdminIndexView
from flask_admin.contrib.sqla import ModelView
from flask_admin.model import BaseModelView

from flask import g
import sqlite3

DATABASE = "database.db"  # sql

app = Flask(__name__)
app.config["SECRET_KEY"] = "any secret key"
conn = sqlite3.connect(DATABASE, check_same_thread=False)
sql_create_Competition_table = """ CREATE TABLE IF NOT EXISTS Competition (
                                    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    name CHAR(25) NOT NULL,
                                    description VARCHAR(255),
                                    start_time INT,
                                    end_time INT,
                                    answer CHAR(1000),
                                    type INT
                                ); """
# what is submission_ts?
sql_create_Submission_table = """ CREATE TABLE IF NOT EXISTS Submission (
                                    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    participant_id INT NOT NULL,
                                    competition_id INT NOT NULL,
                                    submission_ts INT,
                                    query VARCHAR(1000),
                                    submission_status INT,
                                    time_spent INT
                                ); """

sql_create_Participant_table = """ CREATE TABLE IF NOT EXISTS Participant (
                                    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    submission_count INT
                                ); """


def insert_competition():
    sql = """ INSERT INTO competition(name,description,start_time,end_time,answer,type)
              VALUES(123,123,132,123,123,123) """
    c = conn.cursor()
    c.execute(sql)
    conn.commit()
    c.close()


# use it when u need examples


def create_tables():
    c = conn.cursor()
    # c.execute("DROP table Competition")
    # c.execute("DROP table Submission")
    # c.execute("DROP table Participant")
    c.execute("SELECT name FROM sqlite_master WHERE type='table';")
    # tabs =c.fetchall()
    # print(tabs)
    # if not tabs:  # no table create
    print("inside")
    c.execute(sql_create_Competition_table)
    c.execute(sql_create_Submission_table)
    c.execute(sql_create_Participant_table)

    c.close()
    conn.commit()
    # conn.close()


create_tables()
# insert_competition()


@app.route("/")
def home():
    return "Hello, Flask!"


@app.route("/get_competition", methods=["POST"])
def get_competition_by_id():
    record = json.loads(request.data)
    competition_id = record.get("competition_id")
    c = conn.cursor()
    c.execute(f"SELECT * FROM Competition WHERE id={str(competition_id)};")
    res = c.fetchall()
    c.close()
    conn.commit()
    if not res:
        print("Not exists in database")
        return None
    id, name, description, start, end, _, _ = res[0]
    return jsonify(
        {"id": id, "name": name, "description": description, "start": start, "end": end}
    )


# get_competition_by_id(3) #test case


@app.route("/list_competitions", methods=["POST"])
def list_competitions():
    record = json.loads(request.data)
    from_ts = record.get("from", 0)
    to_ts = record.get("to", 10000)
    c = conn.cursor()
    all_comp = []
    for i in range(from_ts, to_ts + 1):
        c.execute(f"SELECT * FROM Competition WHERE id={str(i)};")
        res = c.fetchall()
        if res:
            id, name, des, start, end, _, _ = res[0]
            # all_comp.append((id,name,des,start,end))
            all_comp.append(
                {"id": id, "name": name, "description": des, "start": start, "end": end}
            )
    c.close()
    conn.commit()
    print(all_comp)
    return jsonify(all_comp)


# list_competitions(0,10) #test case


@app.route("/add_competition", methods=["POST"])
def add_competition():
    # name,description,start_time,end_time,answer,type
    record = json.loads(request.data)
    name = record.get("name")
    description = record.get("description")
    start_time = record.get("start_time")
    end_time = record.get("end_time")
    answer = record.get("answer")
    competition_type = record.get("type")
    c = conn.cursor()
    sql = f""" INSERT INTO competition(name,description,start_time,end_time,answer,type)
              VALUES("{str(name)}","{str(description)}",{int(start_time)},{int(end_time)},"{str(answer)}",{int(competition_type)}) """
    print(sql)
    try:
        c.execute(sql)
        c.close()
        conn.commit()
        return jsonify({"success": True})
    except Exception as e:
        print(e)
        return jsonify(
            {
                "success": False,
            }
        )


# add_competition(00,00,00,00,00,0)


@app.route("/add_submission", methods=["POST"])
def add_submission(participant_id, competition_id, query, submission_ts):
    # participant_id, competition_id, query, submission_ts
    record = json.loads(request.data)
    participant_id = record.get("participant_id")
    competition_id = record.get("competition_id")
    query = record.get("query")
    submission_ts = record.get("submission_ts")

    c = conn.cursor()
    sql = f""" INSERT INTO submission(participant_id,description,start_time,end_time,answer,type)
              VALUES("{str(name)}","{str(description)}",{int(start_time)},{int(end_time)},"{str(answer)}",{int(competition_type)}) """
    # print(sql)
    try:
        c.execute(sql)
        c.close()
        conn.commit()
        return jsonify({"success": True})
    except Exception as e:
        print(e)
        return jsonify(
            {
                "success": False,
            }
        )

    # add submission
    # start a thread to evaluate
    return None


@app.route("/list_submissions_by_competition", methods=["POST"])
def list_submissions_by_competition():
    # competition_id, passed
    record = json.loads(request.data)
    competition_id = record.get("competition_id")
    passed = record.get("passed", None)
    c = conn.cursor()
    sql = f"""SELECT * FROM competition
              WHERE competition_id={str(competition_id)}, 
               """
    sql = sql + ";" if not passed else sql + f" AND status = 2;"
    print(sql)
    c.execute(sql)
    res = c.fetchall()
    all_submissions = []
    for r in res:
        id, participant_id, submission_ts, query, submission_status, time_spend = r
        all_submissions.append(
            (id, participant_id, submission_ts, query, submission_status, time_spend)
        )
    c.close()
    conn.commit()
    return all_submissions


@app.route("/list_submissions_by_participant", methods=["POST"])
def list_submissions_by_participant():
    # participant_id
    record = json.loads(request.data)
    participant_id = record.get("participant_id")
    c = conn.cursor()
    sql = f"""SELECT * FROM competition
              WHERE participant_id={str(participant_id)}
               """
    c.execute(sql)
    res = c.fetchall()
    all_submissions = []
    for r in res:
        id, participant_id, submission_ts, query, submission_status, time_spend = r
        all_submissions.append(
            (id, participant_id, submission_ts, query, submission_status, time_spend)
        )
    c.close()
    conn.commit()
    return all_submissions


# @app.route('/update_competition', methods=['POST'])
# def update_competition():
#     return None

# @app.route('/delete_competition', methods=['POST'])
# def delete_competition():
#     return None


# def get_competition_by_id()
if __name__ == "__main__":
    app.debug = True
    app.run(host="0.0.0.0", port=8080)
