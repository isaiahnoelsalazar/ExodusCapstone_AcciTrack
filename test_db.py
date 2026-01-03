from easy_sql import EasySQL


db = EasySQL()
print(db.getTableValues("AcciTrack", "AcciTrack_ReportList"))