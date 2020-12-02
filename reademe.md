python版本3.6.4
使用venv虚拟环境，具体搭建指导见[flask中文文档](https://dormousehole.readthedocs.io/en/latest/)

|所需包|版本|
|--|--|
|Flask|1.1.2|
|numpy|1.19.4|
|matplotlib|3.2.1|
|pandas|1.0.4|
|sklearn|0.0|
|st-dbscan|0.1.4|
|mysqlclient|2.0.1|
|st_optics|0.0.1|

使用freeze给所有模块搬家
```
# 导出安装模块的文档
pip freeze > my_freeze.txt

# 或者指定地址
pip freeze > e:\my_freeze.txt

# 在另一个环境下，安装该文档里的模块
pip install -r my_freeze.txt
```
安装使用豆瓣源
pip install (要安装的文件名) -i http://pypi.douban.com/simple --trusted-host pypi.douban.com