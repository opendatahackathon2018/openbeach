# -*- coding: utf-8 -*-
"""
Created on Sat Sep 15 14:05:50 2018

@author: artem
"""

from math import sin, cos, sqrt, atan2, radians,degrees
import pandas as pd
import csv 
meteo_stations=pd.read_csv("metorological_station_location.csv") 
air_quality_station = pd.read_csv("air_quality_stations.csv")

# approximate radius of earth in km
R = 6373.0


def closest_station(lat1, lon1, df=meteo_stations, lat_rec='1', lon_rec='2', station_rec='0'):
    min_distance = 19999
    min_lat = -1
    min_lon = -1
    lat1 = radians(lat1)
    lon1 = radians(lon1)
    for index, row in df.iterrows():
       
        
        lat2 = radians(row[lat_rec])
        lon2= radians(row[lon_rec])
        
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        
        a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))
        
        distance = R * c
        if distance < min_distance:
            min_distance = distance
            min_lat = lat2
            min_lon = lon2
            station_code = row[station_rec]
            
        
        
        #print("Result:", distance, station_code)
    return station_code,degrees(min_lat),degrees(min_lon)


limassol_beaches=pd.read_csv("limassol_beaches.csv")
#limassol_beaches=pd.read_csv("beaches_all.csv")



data = []
for index_b, row_b in limassol_beaches.iterrows():
    meteo_nearest = closest_station(row_b['latitude'],row_b['longitude'])[0]
    air_nearest = closest_station(row_b['latitude'],row_b['longitude'],df=air_quality_station,lat_rec='8',lon_rec='9',station_rec='0')[0]
    #print(closest_station(row_b['latitude'],row_b['longitude'])[0],row_b[0],row_b['Area_Name_Eng'])
    #print(row_b[0],row_b['Area_Name_Eng'],meteo_nearest, air_nearest)
    data.append([row_b[0],meteo_nearest, air_nearest])
    
    
   #print(closest_station(row_b['latitude'],row_b['longitude'],df=air_quality_station,lat_rec='8',lon_rec='9',station_rec='0')[0],row_b[0],row_b['Area_Name_Eng'])
    df_data = pd.DataFrame(data)
    df_data.to_csv("algorithm_output.csv")

