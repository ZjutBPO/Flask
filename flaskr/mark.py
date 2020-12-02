from flask import (Blueprint,flash,g,redirect,render_template,request,url_for)
from werkzeug.exceptions import abort

from flaskr.MysqlDB import get_db
from flask.json import jsonify
from math import radians, cos, sin, asin, sqrt
from sklearn.cluster import DBSCAN,OPTICS,cluster_optics_dbscan
from st_dbscan import ST_DBSCAN
import numpy as np

bp = Blueprint('mark',__name__)

@bp.route('/',methods=('GET',"POST"))
def index():
    return render_template('index.html')

@bp.route('/MarkBaseStation.do',methods=('GET','Post'))
def MarkBaseStation():
    db = get_db()
    cursor = db.cursor()
    sql = "Select longitude,latitude from basestation"
    cursor.execute(sql)
    results = cursor.fetchall()
    array = {}
    index = 0
    for item in results:
        tmp = {}
        tmp['longitude'] = item[0]
        tmp['latitude'] = item[1]
        array[index] = tmp
        index += 1
    
    return jsonify(array)

@bp.route('/UseCluster.do',methods=('GET','Post'))
def UseDBScan():
    db = get_db()
    cursor = db.cursor()
    sql = "Select starttime,longitude,latitude from userdata Where imsi = %s order by starttime"
    cursor.execute(sql,(request.form['imsi'],))
    results = cursor.fetchall()

    data = np.array(results)

    #公式计算两点间距离（m）
    def distance(p1,p2):
        #lng1,lat1,lng2,lat2 = (120.12802999999997,30.28708,115.86572000000001,28.7427)
        lng1, lat1, lng2, lat2 = map(radians, [float(p1[0]), float(p1[1]), float(p2[0]), float(p2[1])]) # 经纬度转换成弧度
        dlon=lng2 - lng1
        dlat=lat2 - lat1
        a=sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        distance=2*asin(sqrt(a))*6378.137 * 1000 # 地球平均半径，6371km
        return distance

    dbscan_cluster = DBSCAN(eps = 500,
                    min_samples=5,
                    metric=lambda a,b:distance(a,b)).fit(data[:,1:3])

    optics_cluster = OPTICS(min_samples=5,cluster_method='dbscan',metric=lambda a,b:distance(a,b)).fit(data[:,1:3])

    print(optics_cluster.reachability_)

    optics_label = cluster_optics_dbscan( reachability=optics_cluster.reachability_,
                                    core_distances=optics_cluster.core_distances_,
                                    ordering=optics_cluster.ordering_,
                                    eps=300)

    print(optics_label)

    results = np.c_[np.array(results),dbscan_cluster.labels_,optics_label].tolist()

    array = {}
    index = 0
    for item in results:
        tmp = {}
        tmp['time'] = item[0]
        tmp['longitude'] = item[1]
        tmp['latitude'] = item[2]
        tmp['dbscan'] = item[3]
        tmp['optics'] = item[4]
        array[index] = tmp
        index += 1

    return jsonify(array)