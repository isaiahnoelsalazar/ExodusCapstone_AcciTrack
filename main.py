from flask import Flask, render_template, request, session
from easy_sql import EasySQL
import os
import signal
import datetime

separator_string = "[sprtr_str]"

app = Flask(__name__)
app.config["SECRET_KEY"] = "ExodusCapstone_AcciTrack"
app.config["SESSION_COOKIE_SECURE"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "None"
db = EasySQL()
officer_columns = [
    {"officer_first_name": "text"},
    {"officer_middle_name": "text"},
    {"officer_last_name": "text"},
    {"officer_preferred_name": "text"},
    {"officer_birthday": "text"},
    {"officer_gender": "text"},
    {"officer_nationality": "text"},
    {"officer_blood_type": "text"},
    {"officer_employee_id": "text"},
    {"officer_badge_number": "text"},
    {"officer_social_security_number": "text"},
    {"officer_primary_email": "text"},
    {"officer_secondary_email": "text"},
    {"officer_work_phone": "text"},
    {"officer_mobile_phone": "text"},
    {"officer_primary_contact_name": "text"},
    {"officer_primary_contact_phone_number": "text"},
    {"officer_primary_contact_relationship": "text"},
    {"officer_secondary_contact_name": "text"},
    {"officer_secondary_contact_phone_number": "text"},
    {"officer_secondary_contact_relationship": "text"},
    {"officer_employment_job_title": "text"},
    {"officer_employment_department": "text"},
    {"officer_employment_type": "text"},
    {"officer_employment_start_date": "text"},
    {"officer_employment_reporting_officer": "text"},
    {"officer_employment_work_location": "text"},
    {"officer_employment_history": "text"},
    {"officer_document_list": "text"},
    {"officer_pin": "text"},
    {"officer_username": "text"},
    {"officer_is_admin": "text"}
]
task_columns = [
    {"task_title": "text"},
    {"task_description": "text"},
    {"task_priority": "text"},
    {"task_officer_badge_number": "text"}
]
report_columns = [
    {"report_caseNum": "text"},
    {"report_submitting_officer": "text"},
    {"report_submitting_datetime": "text"},
    {"report_location": "text"},
    {"report_type": "text"},
    {"report_status": "text"},
    {"report_video": "text"},
    {"report_reviewing_officer": "text"},
    {"report_reviewing_datetime": "text"},
    {"report_reviewing_reason": "text"},
    {"report_is_read": "text"},
    {"report_officer_badge_number": "text"},
    {"report_real_submission_datetime": "text"}
]


@app.before_request
def make_session_permanent():
    session.modified = True
    app.permanent_session_lifetime = datetime.timedelta(days=7)


@app.route("/session", methods=["GET"])
def check_session():
    try:
        if session.get("logged_in", "no") != "no":
            return session.get("logged_in", "no") + separator_string + session.get("badge_number", "-1")
        else:
            return "Not logged in."
    except:
        return "Fail"


@app.route('/')
def home():
    return "Home"


@app.route('/client')
def client():
    if session.get("logged_in", "no") == "no":
        return "<script>window.location.href=\"login\";</script>"
    officer_data = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    for officer in db.getTableValues("AcciTrack", "AcciTrack_OfficerList"):
        if officer[9] == session.get("badge_number", "-1"):
            officer_data = officer
    return render_template(
        "client.html",
        officer_first_name=officer_data[0],
        officer_middle_name=officer_data[1],
        officer_last_name=officer_data[2],
        officer_preferred_name=officer_data[3],
        officer_birthday=officer_data[4],
        officer_gender=officer_data[5],
        officer_nationality=officer_data[6],
        officer_blood_type=officer_data[7],
        officer_employee_id=officer_data[8],
        officer_badge_number=officer_data[9],
        officer_social_security_number=officer_data[10],
        officer_primary_email=officer_data[11],
        officer_secondary_email=officer_data[12],
        officer_work_phone=officer_data[13],
        officer_mobile_phone=officer_data[14],
        officer_primary_contact_name=officer_data[15],
        officer_primary_contact_phone_number=officer_data[16],
        officer_primary_contact_relationship=officer_data[17],
        officer_secondary_contact_name=officer_data[18],
        officer_secondary_contact_phone_number=officer_data[19],
        officer_secondary_contact_relationship=officer_data[20],
        officer_employment_job_title=officer_data[21],
        officer_employment_department=officer_data[22],
        officer_employment_type=officer_data[23],
        officer_employment_start_date=officer_data[24],
        officer_employment_reporting_officer=officer_data[25],
        officer_employment_work_location=officer_data[26],
        officer_employment_history=officer_data[27],
        officer_document_list=officer_data[28]
    )


@app.route('/admin')
def admin():
    if session.get("logged_in", "no") == "no":
        return "<script>window.location.href=\"login\";</script>"
    officer_data = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                    "", "", "", ""]
    for officer in db.getTableValues("AcciTrack", "AcciTrack_OfficerList"):
        if officer[9] == session.get("badge_number", "-1"):
            officer_data = officer
    return render_template(
        "admin.html",
        officer_first_name=officer_data[0],
        officer_middle_name=officer_data[1],
        officer_last_name=officer_data[2],
        officer_preferred_name=officer_data[3],
        officer_birthday=officer_data[4],
        officer_gender=officer_data[5],
        officer_nationality=officer_data[6],
        officer_blood_type=officer_data[7],
        officer_employee_id=officer_data[8],
        officer_badge_number=officer_data[9],
        officer_social_security_number=officer_data[10],
        officer_primary_email=officer_data[11],
        officer_secondary_email=officer_data[12],
        officer_work_phone=officer_data[13],
        officer_mobile_phone=officer_data[14],
        officer_primary_contact_name=officer_data[15],
        officer_primary_contact_phone_number=officer_data[16],
        officer_primary_contact_relationship=officer_data[17],
        officer_secondary_contact_name=officer_data[18],
        officer_secondary_contact_phone_number=officer_data[19],
        officer_secondary_contact_relationship=officer_data[20],
        officer_employment_job_title=officer_data[21],
        officer_employment_department=officer_data[22],
        officer_employment_type=officer_data[23],
        officer_employment_start_date=officer_data[24],
        officer_employment_reporting_officer=officer_data[25],
        officer_employment_work_location=officer_data[26],
        officer_employment_history=officer_data[27],
        officer_document_list=officer_data[28]
    )


@app.route('/login')
def login():
    return render_template("login.html")


@app.route('/log-in')
def log_in():
    try:
        username = request.args.get("username")
        badge_number = request.args.get("badgeNumber")
        officer_pin = request.args.get("officerPin")
        for officer in db.getTableValues("AcciTrack", "AcciTrack_OfficerList"):
            if officer[9] == badge_number or officer[30] == username:
                if officer[9] != badge_number:
                    raise Exception("Incorrect badge number")
                if officer[30] != username:
                    raise Exception("Incorrect username")
                if officer_pin == officer[29]:
                    session["logged_in"] = "yes"
                    session["badge_number"] = officer[9]
                    if officer[31] == "yes":
                        return "<script>window.location.href=\"admin\";</script>"
                    else:
                        return "<script>window.location.href=\"client\";</script>"
                else:
                    raise Exception("Incorrect password")
        return "<script>alert(\"User does not exist.\");window.location.href=\"login\";</script>"
    except:
        return "Fail"


@app.route('/logout')
def logout():
    session["logged_in"] = "no"
    session["badge_number"] = "-1"
    return "<script>window.location.href=\"login\";</script>"


@app.route('/signin')
def signin():
    return "Signin"


# @app.route('/add-officer', methods=["POST"])
def add_officer1():
    try:
        values = [
            {"officer_first_name": "Manhattan"},
            {"officer_middle_name": ""},
            {"officer_last_name": "Cafe"},
            {"officer_preferred_name": "Manhattan"},
            {"officer_birthday": "03/5/1998"},
            {"officer_gender": "Female"},
            {"officer_nationality": "Japan"},
            {"officer_blood_type": "O+"},
            {"officer_employee_id": "ADM-2018-001"},
            {"officer_badge_number": "1"},
            {"officer_social_security_number": "012-34-5678"},
            {"officer_primary_email": "manhattancafe@gmail.com"},
            {"officer_secondary_email": "cafe.manhattan1030n@gmail.com"},
            {"officer_work_phone": "+63 990 195-2394"},
            {"officer_mobile_phone": "+63 901 185-2175"},
            {"officer_primary_contact_name": "Agnes Tachyon"},
            {"officer_primary_contact_phone_number": "+63 917 218-4155"},
            {"officer_primary_contact_relationship": "Friend"},
            {"officer_secondary_contact_name": "Sunday Silence"},
            {"officer_secondary_contact_phone_number": "+63 915 465-1215"},
            {"officer_secondary_contact_relationship": "Sister"},
            {"officer_employment_job_title": "Senior Police Officer"},
            {"officer_employment_department": "Administration"},
            {"officer_employment_type": "Full Time"},
            {"officer_employment_start_date": "09/01/2010"},
            {"officer_employment_reporting_officer": "Chief Police Officer Mejiro"},
            {"officer_employment_work_location": "Main Headquarters (San Pedro Laguna)"},
            {"officer_employment_history": ""},
            {"officer_document_list": ""},
            {"officer_pin": "1234"},
            {"officer_username": "cafe1030"},
            {"officer_is_admin": "no"}
        ]
        db.insertToTable("AcciTrack", "AcciTrack_OfficerList", values)
    except Exception as e:
        print("Fail: " + str(e))


def add_officer2():
    try:
        values = [
            {"officer_first_name": "Ooga Booga"},
            {"officer_middle_name": ""},
            {"officer_last_name": "Awooga"},
            {"officer_preferred_name": "Goo"},
            {"officer_birthday": "03/5/1458"},
            {"officer_gender": "Male"},
            {"officer_nationality": "Philippines"},
            {"officer_blood_type": "O+"},
            {"officer_employee_id": "EID-123"},
            {"officer_badge_number": "2"},
            {"officer_social_security_number": "012-34-5679"},
            {"officer_primary_email": "awooga@gmail.com"},
            {"officer_secondary_email": "oogabooga@gmail.com"},
            {"officer_work_phone": "+63 990 195-2395"},
            {"officer_mobile_phone": "+63 901 185-2176"},
            {"officer_primary_contact_name": "Agnes Tachyon"},
            {"officer_primary_contact_phone_number": "+63 917 218-4155"},
            {"officer_primary_contact_relationship": "Friend"},
            {"officer_secondary_contact_name": "Sunday Silence"},
            {"officer_secondary_contact_phone_number": "+63 915 465-1215"},
            {"officer_secondary_contact_relationship": "Sister"},
            {"officer_employment_job_title": "Senior Police Officer"},
            {"officer_employment_department": "Administration"},
            {"officer_employment_type": "Full Time"},
            {"officer_employment_start_date": "09/01/2015"},
            {"officer_employment_reporting_officer": "Chief Police Officer Mejiro"},
            {"officer_employment_work_location": "Main Headquarters (San Pedro Laguna)"},
            {"officer_employment_history": ""},
            {"officer_document_list": ""},
            {"officer_pin": "4321"},
            {"officer_username": "oogabooga"},
            {"officer_is_admin": "yes"}
        ]
        db.insertToTable("AcciTrack", "AcciTrack_OfficerList", values)
    except Exception as e:
        print("Fail: " + str(e))


@app.route('/add-task', methods=["POST"])
def add_task():
    try:
        title = request.args.get("title")
        description = request.args.get("description")
        priority = request.args.get("priority")
        values = [
            {"task_title": title},
            {"task_description": description},
            {"task_priority": priority},
            {"task_officer_badge_number": session.get("badge_number", "-1")}
        ]
        db.insertToTable("AcciTrack", "AcciTrack_TaskList", values)
        return "Success"
    except:
        return "Fail"


@app.route('/get-tasks', methods=["POST"])
def get_tasks():
    temp = []
    for a in db.getTableValues("AcciTrack", "AcciTrack_TaskList"):
        if a[3] == session.get("badge_number", "-1"):
            temp.append(a)
    return str(temp)


@app.route('/add-report', methods=["POST"])
def add_report():
    try:
        case_num = request.args.get("caseNum")
        officer = request.args.get("officer")
        datetime = request.args.get("datetime")
        realdatetime = request.args.get("realdatetime")
        location = request.args.get("location")
        accident_type = request.args.get("type")
        status = request.args.get("status")
        video = request.args.get("video")
        values = [
            {"report_caseNum": case_num},
            {"report_submitting_officer": officer},
            {"report_submitting_datetime": datetime},
            {"report_location": location},
            {"report_type": accident_type},
            {"report_status": status},
            {"report_video": video},
            {"report_reviewing_officer": "none"},
            {"report_reviewing_datetime": "none"},
            {"report_reviewing_reason": "none"},
            {"report_is_read": "no"},
            {"report_officer_badge_number": session.get("badge_number", "-1")},
            {"report_real_submission_datetime": realdatetime}
        ]
        db.insertToTable("AcciTrack", "AcciTrack_ReportList", values)
        return "Success"
    except:
        return "Fail"


@app.route('/get-reports', methods=["POST"])
def get_reports():
    temp = []
    for a in db.getTableValues("AcciTrack", "AcciTrack_ReportList"):
        if a[11] == session.get("badge_number", "-1"):
            temp.append(a)
    return str(temp)


@app.route('/admin-get-reports', methods=["POST"])
def admin_get_reports():
    return str(db.getTableValues("AcciTrack", "AcciTrack_ReportList"))


@app.route('/exit')
def accitrack_exit():
    os.kill(os.getpid(), signal.SIGINT)
    return "Exit"


if "__main__" == __name__:
    if not os.path.exists("AcciTrack.db"):
        db.createTable("AcciTrack", "AcciTrack_OfficerList", officer_columns)
        db.createTable("AcciTrack", "AcciTrack_TaskList", task_columns)
        db.createTable("AcciTrack", "AcciTrack_ReportList", report_columns)
        add_officer1()
        add_officer2()
    app.run(host="0.0.0.0", port=5000, debug=True)