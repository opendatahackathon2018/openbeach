import requests
import xml.etree.ElementTree as ET
from pymongo import MongoClient
from datetime import datetime, date


r = requests.get("http://weather.cyi.ac.cy/data/met/CyDoM.xml")

mongo = MongoClient()
weather = mongo.open_beach.weather
today = str(date.today())
now = datetime.now()

xmlparsed = ET.fromstring(r.text)

data = []
for k, i in enumerate(xmlparsed.findall("observations")):
    data.append({})

    data[k] = {"station_id": i[0].text}
    data[k]["time"] = i[1].text

    for num, z in enumerate(i):
        if num > 1:
            data[k][i[num][0].text.replace('.', '')] = i[num][1].text.split(" ")[0]

weather.insert_one(dict(day=today, time=now, Parsed=data))
