function Mark(imsi) {
    $.ajax({
        type: "post",
        data: "imsi=" + imsi,
        url: "/UseDBScan.do",
        dataType: "json",
        success: function (result) {
            console.log(result)
            let jsondata = result;

            var map = new AMap.Map('container', {
                zoom: 15, //级别
                center: [jsondata[0].longitude, jsondata[0].latitude]
            });

            // 右击可以获取鼠标所在的经纬度
            var clickHandler = function(e) {
                alert('您在[ ' + e.lnglat.getLng() + ',' + e.lnglat.getLat() + ' ]的位置点击了地图！');
            };

            // 绑定事件
            map.on('rightclick', clickHandler);

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

            // 在地图上标注点，旁边写获得信号的时间
            for (let key in MarkerTime) {
                let tmp = key.split('-');
                map.add(new AMap.Marker({
                    position: [tmp[0], tmp[1]],
                    content: '<div>\
                                <div class="icon"></div>\
                                <div class = "TimeBlock">' + MarkerTime[key] + '</div>\
                                <div class = "ClusterBlock">' + MarkerLabel[key] + '</div>\
                            </div>'
                }))
            }

            // 按照时间顺序，将各个点连接起来
            let polyline = new AMap.Polyline({
                path: MarkerList,
                showDir: true
            });

            map.add(polyline);
        }
    })
}

$(document).ready(function() {
    Mark('460000095007329090');
    $("#imsi").val('460000095007329090');
    
    $("#imsi").change(function() {
            Mark($("#imsi").val());
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
})