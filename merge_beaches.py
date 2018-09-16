from pymongo import MongoClient
from datetime import datetime, date
import json
import random

today = str(date.today())

mongo = MongoClient()
weather = mongo.open_beach.weather
links = mongo.open_beach.linking_info
beaches = mongo.open_beach.beaches_info
pollution = mongo.open_beach.pollution_info

full_beaches_list = beaches.find_one()["beaches_limassol"]  # !!!!!!!!!!!!!!!!!!  НАДО ПОМЕНЯТЬ НА beaches_limassol  !!!!!!!!!

beaches_list = [{key: d[key] for key in ['beach_id', 'Beach_Name', 'latitude', 'longitude']} for d in full_beaches_list]

for d in beaches_list:
    d['location'] = [d.get('latitude'), d['longitude']]
    d.__delitem__('latitude')
    d.__delitem__('longitude')

weather_st_list = weather.find_one({"day": today})['Parsed']

weather_st_dict = {}
for d in weather_st_list:
    weather_st_dict[d['station_id']] = {key: d.get(key) for key in
                                        ['Wind Direction', 'Humidity', 'Wind Speed', 'Temperature']}

links_list = links.find_one()['links']

for i in links_list:
    if i['Weather_Station_ID'] == "PARENTHESIS":
        i['Weather_Station_ID'] = 'PAREKLISIA'

pollution_dict = pollution.find_one({'day': today})['Parsed']

for d in beaches_list:
    d['photos'] = ['https://picsum.photos/150/100?image={}'.format(random.randrange(950)),
                   'https://picsum.photos/150/100?image={}'.format(random.randrange(950)),
                   'https://picsum.photos/150/100?image={}'.format(random.randrange(950))]

    for s in links_list:
        if d['beach_id'] == s['Beach_ID']:
            d['air'] = weather_st_dict[s['Weather_Station_ID']]
            d['air']['pollution'] = pollution_dict[str(int(s['Pollution_ID']))]
            d['water'] = {'temperature': float(d['air']['Temperature']) - 7, 
                          'pollution': d['air']['pollution']}


def direction(d):
    if 45<=d<155:
        return "E"
    elif 155<=d<245:
        return "S"
    elif 245<=d<335:
        return "W"
    else:
        return "N"

for d in beaches_list:
    a = d['air']
    d['id'] = d.get('beach_id')
    d['name'] = d.get('Beach_Name')
    d['air']['temperature'] = d['air'].get('Temperature')
    d['air']['humidity'] = d['air'].get('Humidity')
    d['air']['windDirection'] = d['air'].get('Wind Direction')
    d['air']['windSpeed'] = d['air'].get('Wind Speed')
    a['windDirection'] = direction(int(d['air']['Wind Direction']))

with open('/home/zunix/sites/openbeach.me/beta/beaches.json', 'w') as outfile:
    json.dump(beaches_list, outfile)

