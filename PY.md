# Python类使用笔记
## numpy
### 给矩阵添加一列
``np.c_[a,b]``添加列


``np.r_[a,b]``添加行


``np.insert(arr,obj,values,axis)``
第一个参数arr是一个数组，可以是一维的也可以是多维的，在arr的基础上插入元素
第二个参数obj是元素插入的位置
第三个参数values是需要插入的数值
第四个参数axis是指示在哪一个轴上对应的插入位置进行插入

``np.column_stack``两个矩阵按列合并

``np.row_stack``两个矩阵按行合并

## dataframe
### 添加列
``data[3]=[4,5,6]``直接指明列名，然后赋值就可以了

``Dataframe.insert(loc, column, value, allow_duplicates=False)``
loc:  int型，表示第几列；若在第一列插入数据，则 loc=0
column: 给插入的列取名，如 column='新的一列'
value：数字，array，series等都可（可自己尝试）
allow_duplicates: 是否允许列名重复，选择Ture表示允许新的列名与已存在的列名重复。

### 遍历
``for x in np.nditer(a, order='F')``:Fortran order，即是列序优先；
``for x in np.nditer(a, order='C')``:C order，即是行序优先；
``for x in np.nditer(a, op_flags=['readwrite']): ``修改数组的值
使用外部循环
nditer类的构造器拥有flags参数
|参数|描述|
|----|----|
|c_index|可以跟踪 C 顺序的索引|
|f_index|可以跟踪 Fortran 顺序的索引|
|multi-index|每次迭代可以跟踪一种索引类型|
|external_loop|给出的值是具有多个值的一维数组，而不是零维数组|

## MySQLdb
cursor.execute(SQL_insert,args)中的args是一个元组，只有一个元素时，记得加上,才可以。
```
sql = "SELECT * FROM sites WHERE name = %s"
na = ("RUNOOB", )
mycursor.execute(sql, na)
```

## json
``stu = stu.__dict__``      对象 转 dict
``j = json.dumps(dict)``    dict 转 json

``dict = json.loads(j)``    json 转 dict
``stu.__dict__ = dict``     dict 转 对象

```
with open('1.json', 'w') as f:
    json.dump(dictObj, f)  # 会在目录下生成一个1.json的文件，文件内容是dict数据转成的json数据
```
将dict数据转化成json数据后写入json文件

```
with open('1.json', 'r') as f:
    dictObj = json.load(f)
```
读取json文件数据，转成dict数据

## 经纬度距离换算
1. 在纬度相等的情况下：
- 经度每隔0.00001度，距离相差约1米；
- 每隔0.0001度，距离相差约10米；
- 每隔0.001度，距离相差约100米；
- 每隔0.01度，距离相差约1000米；
- 每隔0.1度，距离相差约10000米。
2. 在经度相等的情况下：
- 纬度每隔0.00001度，距离相差约1.1米；
- 每隔0.0001度，距离相差约11米；
- 每隔0.001度，距离相差约111米；
- 每隔0.01度，距离相差约1113米；
- 每隔0.1度，距离相差约11132米。

# 聚类学习
常见聚类算法对比
|算法|类别|可伸缩性|对噪声数据的敏感性|数据顺序敏感性|高维性|参数依赖性|处理任意形状簇的能力|可解释性|算法效率|
|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
|K-means|划分|好|敏感|敏感|一般|较高|任意|一般|一般|
|BIRCH|层次|较差|一般|不太敏感|好|较高|凸形或球形|一般|高|
|CURE|层次|较差|不敏感|敏感|好|高|任意|一般|较高|
|DBSCAN|密度|较好|不敏感|敏感|一般|一般|任意|较好|一般|
|OPTICS|密度|较好|不敏感|敏感|一般|一般|任意|较好|一般|
|STING|网格|好|不敏感|不敏感|好|高|任意|好|高|
|CLIQUE|网格和密度|好|不敏感|不敏感|好|高|任意|好|高|


# python使用中遇到的问题
1. 使用虚拟环境，然后从一个文件夹转移到另一个文件夹后，需要重新使用``py -3 -m venv venv``创建虚拟环境，原来的pip包可能会因为路径原因不能使用，遇到如下错误``Fatal error in launcher: Unable to create process using``。
解决方法：进入``Lib\site-packages``，删除``pip-20.2.4.dist-info``，然后使用``python -m pip install --upgrade pip``重新安装即可。

2. 使用freeze给所有模块搬家
```
# 导出安装模块的文档
pip freeze > my_freeze.txt

# 或者指定地址
pip freeze > e:\my_freeze.txt

# 在另一个环境下，安装该文档里的模块
pip install -r my_freeze.txt
```