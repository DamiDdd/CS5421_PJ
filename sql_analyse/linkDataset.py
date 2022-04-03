import psycopg2
import re

syntaxMsg = "Syntax error in "
IOMsg = "IO error: couldn't find "

def exe_sql_with_res(conn, sql):
    pointer = conn.cursor()
    try:
        pointer.execute(sql)
    except psycopg2.Error:
        print(syntaxMsg + sql)
    else:
        res = pointer.fetchall()
        return res


def analyse_sql(conn, sql, exe_time=20):
    sql_test = "SELECT test('" + sql + "', " + str(exe_time) + ")"
    time_list = exe_sql_with_res(conn, sql_test)
    res = 0
    if time_list is not None:
        for time_tuple in time_list:
            time_strs = re.findall(r"\d+\.?\d*", str(time_tuple))
            res += float(time_strs[1])
    return res


def exe_sql(conn, sql):
    pointer = conn.cursor()
    try:
        pointer.execute(sql)
    except psycopg2.Error:
        print(syntaxMsg)


def exe_sql_file(conn, filepath):
    try:
        f = open(filepath, 'r')
    except IOError:
        print(IOMsg + filepath)
    else:
        str = f.readlines()
        str = "".join(str)
        exe_sql(conn, str)


def setup(database, password, user="postgres", host="localhost", port="5432"):
    conn = psycopg2.connect(database=database, user=user, password=password, host=host, port=port)
    # init test function
    print(exe_sql_file(conn, 'sql_analyse/testFunction.sql'))
    return conn


def uninstall(conn):
    conn.commit()
    conn.close()


def compare_ans(ans1, ans2, order=False):
    if len(ans1) != len(ans2):
        return False
    if order:
        return ans1 == ans2
    else:
        sorted_ans1 = sorted(ans1)
        sorted_ans2 = sorted(ans2)
        return sorted_ans1 == sorted_ans2


# connect, input your own config here
# conn = setup("PJ1", "123456")

conn = setup("test1", "")
sql_test1 = "select * from Submission;"
sql_res1 = exe_sql_with_res(conn, sql_test1)
print("test")
print(sql_res1)
uninstall(conn)

# sql_test1 = "SELECT per.empid, per.lname " \
#             "FROM employee per FULL OUTER JOIN payroll pay  " \
#             "ON per.empid = pay.empid AND pay.salary <> 189170 " \
#             "WHERE per.empid = pay.empid " \
#             "ORDER BY per.empid, per.lname;"
# sql_test2 = "SELECT per.empid, per.lname " \
#             "FROM employee per FULL OUTER JOIN payroll pay  " \
#             "ON per.empid = pay.empid AND pay.salary > 40000 " \
#             "WHERE per.empid = pay.empid " \
#             "ORDER BY per.empid, per.lname;"
# sql_res1 = exe_sql_with_res(conn, sql_test1)
# sql_res2 = exe_sql_with_res(conn, sql_test2)
# print(sql_res1)
# time = analyse_sql(conn, sql_test1, 100)
# print(time)
# print(compare_ans(sql_res1,sql_res2, True))

# close the connection
# uninstall(conn)
