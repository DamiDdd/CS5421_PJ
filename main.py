from audioop import minmax
import enum
import json
from operator import truediv
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
import threading
import time
import sql_analyse.linkDataset

from flask_cors import CORS, cross_origin

# Added for CORS

# TODO uncomment this line and change it to correct stuff
db_conn = sql_analyse.linkDataset.setup(database="test1", password="")

DATABASE = "database.db"  # sql

app = Flask(__name__)
# Added for CORS
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"
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
                                    participant_id varchar(20) NOT NULL,
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


class competition_type(enum.Enum):
    FASTEST = 1
    SLOWEST = 2


class submission_status(enum.Enum):
    PASSED = 1
    FAILED = 2
    EVALUATING = 3


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
    c.execute("DROP table Competition")
    c.execute("DROP table Submission")
    c.execute("DROP table Participant")
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
    c.execute(
        f"SELECT * FROM Competition WHERE start_time <{to_ts} AND end_time >{from_ts};"
    )
    for i in c.fetchall():
        id, name, des, start, end, _, _ = i
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
        return jsonify({"success": False})


# add_competition(00,00,00,00,00,0)


@app.route("/add_submission", methods=["POST"])
def add_submission():
    # participant_id, competition_id, query, submission_ts
    record = json.loads(request.data)
    participant_id = record.get("participant_id")
    competition_id = record.get("competition_id")
    query = record.get("query")
    submission_ts = record.get("submission_ts")

    c = conn.cursor()
    sql = f""" INSERT INTO submission(participant_id,competition_id, query, submission_ts, submission_status)
              VALUES("{participant_id}",{competition_id},"{query}",{submission_ts},{int(submission_status.EVALUATING.value)}) """
    print(sql)
    try:
        res = c.execute(sql)
        submission_id = res.lastrowid
        print(res.lastrowid)
        c.close()
        conn.commit()
        x = threading.Thread(
            target=check_submission,
            args=(
                submission_id,
                competition_id,
                query,
            ),
        )
        x.start()
        return jsonify({"success": True, "submission_id": submission_id})
    except Exception as e:
        print(e)
        return jsonify({"success": False})


def check_submission(submission_id, competition_id, query):
    get_answer_sql = f"""
        SELECT answer FROM competition where id = {competition_id};
    """

    c = conn.cursor()
    c.execute(get_answer_sql)
    res = c.fetchall()

    if not res:
        update_sql = f"""UPDATE submission SET submission_status = {submission_status.FAILED.value} where id = {submission_id} """
        c.execute(update_sql)
        c.close()
        conn.commit()

    answer = res[0][0]

    res1 = sql_analyse.linkDataset.exe_sql_with_res(db_conn, answer)
    res2 = sql_analyse.linkDataset.exe_sql_with_res(db_conn, query)
    passed = sql_analyse.linkDataset.compare_ans(res1, res2, True)
    if passed:
        time_spent = sql_analyse.linkDataset.analyse_sql(db_conn, query, 100)
        update_sql = f"""UPDATE submission SET submission_status = {submission_status.PASSED.value}, time_spent={time_spent} where id = {submission_id} """
        c.execute(update_sql)
        c.close()
        conn.commit()
        # update submission with pass
    else:
        update_sql = f"""UPDATE submission SET submission_status = {submission_status.FAILED.value} where id = {submission_id} """
        c.execute(update_sql)
        c.close()
        conn.commit()

        # update submission with failed
    # get competition answer
    # sql_analyse.linkDataset.exe_sql_with_res()
    # exe_sql_with_res
    # analyse
    # update submission


@app.route("/test_submission", methods=["GET"])
def test_submission():
    x = threading.Thread(target=timeout)
    x.start()
    return jsonify({"ok": True})


def timeout():
    for i in range(5):
        time.sleep(1)
        print(i)


@app.route("/list_submissions_by_competition", methods=["POST"])
def list_submissions_by_competition():
    # competition_id, passed
    record = json.loads(request.data)
    competition_id = record.get("competition_id")
    c = conn.cursor()

    sql = f"""SELECT type from Competition 
                WHERE competition_id={str(competition_id)}
            """
    c.execute(sql)
    res = c.fetchall()
    comp_type = res[0]

    c.close()
    conn.commit()

    minOrMax = "MIN"
    order = "ASC"
    if comp_type == 2:
        minOrMax = "MAX"
        order = "DESC"
    
    c = conn.cursor()
    sql = f"""SELECT participant_id, submission_status,{minOrMax}(time_spent) as result FROM submission
              WHERE competition_id={str(competition_id)}
              AND submission_status = 2
              GROUP BY participant_id, submission_status
              ORDER BY result {order}
               """
    print(sql)
    c.execute(sql)
    res = c.fetchall()
    all_submissions = []
    for r in res:
        (
            participant_id,
            submission_status,
            time_spend,
        ) = r
        all_submissions.append(
            {
                "participant_id": participant_id,
                "submission_status": submission_status,
                "time_spend": time_spend,
            }
        )
    c.close()
    conn.commit()
    return jsonify(all_submissions)


@app.route("/list_submissions_by_participant", methods=["POST"])
def list_submissions_by_participant():
    # participant_id
    record = json.loads(request.data)
    participant_id = record.get("participant_id")
    c = conn.cursor()
    sql = f"""SELECT * FROM submission
              WHERE participant_id="{str(participant_id)}"
               """
    c.execute(sql)
    res = c.fetchall()
    all_submissions = []
    for r in res:
        (
            id,
            participant_id,
            competition_id,
            submission_ts,
            query,
            submission_status,
            time_spend,
        ) = r
        all_submissions.append(
            {
                "id": id,
                "participant_id": participant_id,
                "competition_id": competition_id,
                "submission_ts": submission_ts,
                "query": query,
                "submission_status": submission_status,
                "time_spend": time_spend,
            }
        )
    c.close()
    conn.commit()
    return jsonify(all_submissions)


@app.route("/list_participants_by_competition", methods=["POST"])
def list_participants_by_competition():
    # participant_id
    record = json.loads(request.data)
    competition_id = record.get("competition_id")
    c = conn.cursor()
    sql = f"""SELECT distinct participant_id FROM submission
              WHERE competition_id={str(competition_id)}
               """
    c.execute(sql)
    res = c.fetchall()
    all_submissions = []
    for r in res:
        (participant_id) = r
        all_submissions.append(
            {
                "participant_id": participant_id,
            }
        )
    c.close()
    conn.commit()
    return jsonify(all_submissions)


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
