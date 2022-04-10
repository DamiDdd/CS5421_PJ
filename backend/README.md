# CS5421_PJ - Backend

## Environment setup

1. Install backend dependencies.
```
python3 -m venv venv

. venv/bin/activate

# Install flask dependencies
pip install flask_sqlalchemy flask_migrate flask_login flask_admin

# Install postgresql dependencies
pip install psycopg2
```
2. Create a new database instance in local postgresql (with pgAdmin4).
3. Change "database" and "password" argument of the following line to the name and password of the database you have just created.
```
# line 31 in main.py
db_conn = sql_analyse.linkDataset.setup(database="test1", password="")
```
4. Execute the following to start up the backend server.
```
export FLASK_APP=main
flask run
```
