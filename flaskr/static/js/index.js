var UserMarker = [],map,BaseStation = [],ShowBaseStation = 0,polyline;

function MarkUser(imsi) {
    $.ajax({
        type: "post",
        data: "imsi=" + imsi,
        url: "/UseDBScan.do",
        dataType: "json",
        success: function (result) {
            // console.log(result);
            
            let jsondata = result;

            map.setZoom(15);
            map.setCenter([jsondata[0].longitude,jsondata[0].latitude]);

            let MarkerTime = {},MarkerLabel = {};
            // MarkerList为按照时间排序的点。
            let MarkerList = [];

            for (let index in jsondata) {
                MarkerList[index] = [jsondata[index].longitude, jsondata[index].latitude];
                if (typeof(MarkerTime[String(jsondata[index].longitude) + "-" + String(jsondata[index].latitude)]) == "undefined")
                {
                    MarkerTime[String(jsondata[index].longitude) + "-" + String(jsondata[index].latitude)] = "";
                    MarkerLabel[String(jsondata[index].longitude) + "-" + String(jsondata[index].latitude)] = "";
                }
                MarkerTime[String(jsondata[index].longitude) + "-" + String(jsondata[index].latitude)] += jsondata[index].time.substring(17, 25) + '  ';
                MarkerLabel[String(jsondata[index].longitude) + "-" + String(jsondata[index].latitude)] += jsondata[index].label + '  ';
            }

            if (typeof(polyline) != "undefined")
            {
                map.remove(UserMarker);
                map.remove(polyline);
                UserMarker = [];
            }

            // console.log(UserMarker);

            // 在地图上标注点，旁边写获得信号的时间
            let index = 0;
            for (let key in MarkerTime) {
                let tmp = key.split('-');
                UserMarker[index++] = new AMap.Marker({
                    position: [tmp[0], tmp[1]],
                    content: '<div>' +
                                '<div class="icon"></div>'+
                                '<div class = "TimeBlock">' + MarkerTime[key] + '</div>'+
                                '<div class = "ClusterBlock">' + MarkerLabel[key] + '</div>'+
                            '</div>'
                });
            }

            // 按照时间顺序，将各个点连接起来
            polyline = new AMap.Polyline({
                path: MarkerList,
                showDir: true
            });

            map.add(UserMarker);
            map.add(polyline);
        }
    })
}

function MarkBaseStation(){
    $.ajax({
        type:"post",
        url:"/MarkBaseStation.do",
        dataType:"json",
        success:function (result) {
            for (let key in result) {
                BaseStation[key] = new AMap.Marker({
                    position: [result[key].longitude, result[key].latitude],
                    content: '<div class="BaseStationIcon"></div>'
                });
            }
        }
    })
}

$(document).ready(function() {
    map = new AMap.Map('container', {
        zoom: 12, //级别
        center: [ 123.458225,41.844066 ]
    });
    
    // 右击可以获取鼠标所在的经纬度
    var clickHandler = function(e) {
        alert('您在[ ' + e.lnglat.getLng() + ',' + e.lnglat.getLat() + ' ]的位置点击了地图！');
    };
    
    // 绑定事件
    map.on('rightclick', clickHandler);

    MarkBaseStation();
    MarkUser('460000095007329090');
    $("#imsi").val('460000095007329090');
    
    $("#imsi").change(function() {
        MarkUser($("#imsi").val());
    });

    $("#imsi").focus(function() {
        $("#imsi").val("");
    })

    $("#ControlTimeBlock").click(function() {
        if ($(".TimeBlock").css("display") == "none") $(".TimeBlock").css("display", "block");
        else $(".TimeBlock").css("display", "none");
    })

    $("#ControlClusterBlock").click(function () {
        if ($(".ClusterBlock").css("display") == "none") $(".ClusterBlock").css("display", "block");
        else $(".ClusterBlock").css("display", "none");
    })

    $("#ControlBaseStationIcon").click(function () {
        if (ShowBaseStation == 0){
            map.add(BaseStation);
            ShowBaseStation = 1;
        }
        else{
            ShowBaseStation = 0;
            map.remove(BaseStation);
        }
    })
})