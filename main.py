from flask import Flask, render_template, request
from easy_sql import EasySQL
import os

app = Flask(__name__)
db = EasySQL()
task_columns = [
    {"task_title": "text"},
    {"task_description": "text"},
    {"task_priority": "text"}
]
report_columns = [
    {"report_caseNum": "text"},
    {"report_officer": "text"},
    {"report_datetime": "text"},
    {"report_location": "text"},
    {"report_type": "text"},
    {"report_status": "text"},
    {"report_video": "text"}
]
notification_columns = [
    {"notification_caseNum": "text"},
    {"notification_submitting_officer": "text"},
    {"notification_submitting_datetime": "text"},
    {"notification_location": "text"},
    {"notification_type": "text"},
    {"notification_status": "text"},
    {"notification_video": "text"},
    {"notification_reviewing_officer": "text"},
    {"notification_reviewing_datetime": "text"},
    {"notification_reviewing_reason": "text"}
]


@app.route('/')
def home():
    return render_template(
        "index.html"
    )


@app.route('/add-task', methods=["POST"])
def add_task():
    try:
        title = request.args.get("title")
        description = request.args.get("description")
        priority = request.args.get("priority")
        values = [
            {"task_title": title},
            {"task_description": description},
            {"task_priority": priority}
        ]
        db.insertToTable("AcciTrack", "AcciTrack_TaskList", values)
        return "Success"
    except:
        return "Fail"


@app.route('/get-tasks', methods=["POST"])
def get_tasks():
    return str(db.getTableValues("AcciTrack", "AcciTrack_TaskList"))


@app.route('/add-report', methods=["POST"])
def add_report():
    try:
        case_num = request.args.get("caseNum")
        officer = request.args.get("officer")
        datetime = request.args.get("datetime")
        location = request.args.get("location")
        accident_type = request.args.get("type")
        status = request.args.get("status")
        video = request.args.get("video")
        values = [
            {"report_caseNum": case_num},
            {"report_officer": officer},
            {"report_datetime": datetime},
            {"report_location": location},
            {"report_type": accident_type},
            {"report_status": status},
            {"report_video": video}
        ]
        db.insertToTable("AcciTrack", "AcciTrack_ReportList", values)
        return "Success"
    except:
        return "Fail"


@app.route('/get-reports', methods=["POST"])
def get_reports():
    return str(db.getTableValues("AcciTrack", "AcciTrack_ReportList"))


@app.route('/add-notification', methods=["POST"])
def add_notification():
    try:
        case_num = request.args.get("caseNum")
        submitting_officer = request.args.get("submitting_officer")
        submitting_datetime = request.args.get("submitting_datetime")
        location = request.args.get("location")
        accident_type = request.args.get("type")
        status = request.args.get("status")
        video = request.args.get("video")
        reviewing_officer = request.args.get("reviewing_officer")
        reviewing_datetime = request.args.get("reviewing_datetime")
        reviewing_reason = request.args.get("reason")
        values = [
            {"notification_caseNum": case_num},
            {"notification_submitting_officer": submitting_officer},
            {"notification_submitting_datetime": submitting_datetime},
            {"notification_location": location},
            {"notification_type": accident_type},
            {"notification_status": status},
            {"notification_video": video},
            {"notification_reviewing_officer": reviewing_officer},
            {"notification_reviewing_datetime": reviewing_datetime},
            {"notification_reviewing_reason": reviewing_reason}
        ]
        db.insertToTable("AcciTrack", "AcciTrack_NotificationList", values)
        return "Success"
    except:
        return "Fail"


@app.route('/get-notifications', methods=["POST"])
def get_notifications():
    return str(db.getTableValues("AcciTrack", "AcciTrack_NotificationList"))


if "__main__" == __name__:
    if not os.path.exists("AcciTrack.db"):
        db.createTable("AcciTrack", "AcciTrack_TaskList", task_columns)
        db.createTable("AcciTrack", "AcciTrack_ReportList", report_columns)
        db.createTable("AcciTrack", "AcciTrack_NotificationList", notification_columns)
    app.run(debug=True)