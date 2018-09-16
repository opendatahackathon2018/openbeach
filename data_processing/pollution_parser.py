import requests
import xml.etree.ElementTree as ET
from pymongo import MongoClient
from datetime import datetime, date


today = str(date.today())
now = datetime.now()

mongo = MongoClient()
pollution = mongo.open_beach.pollution_info

def get_pollution_data():
    r = requests.get("http://178.62.245.17/air/airquality.php")

    xmparsed = ET.fromstring(r.text)

    data = []
    for i in xmparsed[1]:
        row = []
        for j in i[:3]:
            row.append(j.text)
        data.append(row)

    map_dict = {2: {'name': 'NO2', 'thresholds': [100, 150, 200]},
                4: {'name': 'SO2', 'thresholds': [150, 250, 350]},
                5: {'name': 'O3', 'thresholds': [100, 140, 180]},
                6: {'name': 'CO', 'thresholds': [7000, 15000, 20000]},
                25: {'name': 'PM10', 'thresholds': [50, 100, 200]},
                26: {'name': 'PM2.5', 'thresholds': [25, 50, 100]},
                45: {'name': 'C6H6', 'thresholds': [5, 10, 15]}}

    def get_level(pol_id, value, mapings):
        thresh = mapings[pol_id]["thresholds"]

        lvl = 0

        for i in thresh:
            if value > i:
                lvl += 1

        return (lvl + 1)

    pollution_data = {}

    for count, row in enumerate(data):
        if row[0] not in pollution_data:
            pollution_data[row[0]] = {}

        if int(row[1]) in map_dict:
            #         print(row)
            #         row = row.append(get_level(int(row[1]), float(row[2]), map_dict))
            pollution_data[row[0]][row[1]] = get_level(int(row[1]), float(row[2]), map_dict)

    pollution_indicator = {}

    for key, mappings in pollution_data.items():

        cumul = 0
        maximum = 0
        count = 0

        for d, value in mappings.items():
            #         print(maximum)
            count += 1
            cumul += int(value)
            #         print(value)
            maximum = max(maximum, value)

        indicator = maximum

        ar_mean = cumul / count

        indicator_2 = 0
        if ar_mean > float(3):
            indicator_2 = 4

        pollution_indicator[key] = max(indicator, indicator_2)

    return pollution_indicator


pollution.insert_one(dict(day=today, time=now, Parsed=get_pollution_data()))
