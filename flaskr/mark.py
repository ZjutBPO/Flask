from flask import (Blueprint,flash,g,redirect,render_template,request,url_for)
from werkzeug.exceptions import abort

from flaskr.MysqlDB import get_db
from flask.json import jsonify
from sklearn.cluster import DBSCAN
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

@bp.route('/UseDBScan.do',methods=('GET','Post'))
def UseDBScan():
    db = get_db()
    cursor = db.cursor()
    sql = "Select starttime,longitude,latitude from userdata Where imsi = %s order by starttime"
    cursor.execute(sql,(request.form['imsi'],))
    results = cursor.fetchall()

    data = np.array(results)
    data[:,1] = data[:,1] * 100000
    data[:,2] = data[:,2] * 111320

    db = DBSCAN(eps = 500,min_samples=5).fit(data[:,1:3])

    results = np.c_[np.array(results),db.labels_].tolist()

    array = {}
    index = 0
    for item in results:
        tmp = {}
        tmp['time'] = item[0]
        tmp['longitude'] = item[1]
        tmp['latitude'] = item[2]
        tmp['label'] = item[3]
        array[index] = tmp
        index += 1

    return jsonify(array)