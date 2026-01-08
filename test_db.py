# from easy_sql import EasySQL
#
#
# db = EasySQL()
# print(db.getTableValues("AcciTrack", "AcciTrack_ReportList"))

import sqlite3
import os

try:
    conn = sqlite3.connect('AcciTrack.db')
    cursor = conn.cursor()
    cursor.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    tables = cursor.fetchall()
    schema = "\\n".join([t[0] for t in tables if t[0]])
    conn.close()
    print(schema)
except Exception as e:
    f"ERROR: {str(e)}"