
var obj = { date: new Date(), year: -1, month: -1, priceArr: [] };
var objmonth = new Array("一月" , "二月" , "三月" , "四月" , "五月" , "六月" , "七月" , "八月" , "九月" , "十月" , "十一月" , "十二月");
var htmlObj = { header: "", left: "", right: "",mask: "" };
var elemId = null;
var This = null;
var pickerEvent = {
    Init: function (elethis) {
        if (obj.year == -1) {
            dateUtil.getCurrent();
        }
        for (var item in pickerHtml) {
            pickerHtml[item]();
        }
        //清空日历;
        pickerEvent.remove();
        //设置日历html;
        var html = '<div id="calendar_choose" class="mod-calendar">';
       /* html += htmlObj.close;*/
        html += htmlObj.top;
        html += htmlObj.header;
        html += '<div id="bigCalendar">';
        html += htmlObj.right;
        html += "</div></div>";
        html += htmlObj.mask;
        elemId=elethis;
        //生成日历;
        $(document.body).append(html);
        document.getElementById("picker_last").onclick = pickerEvent.getLast;
        document.getElementById("picker_next").onclick = pickerEvent.getNext;
        document.getElementById("mask").onclick = pickerEvent.getClose;
        var tds = document.getElementById("calendar_tab").getElementsByTagName("td");
        for (var i = 0; i < tds.length; i++) {
            //判断是否有行程;
            if (tds[i].getAttribute("class") != null && tds[i].getAttribute("date") != "") {
                tds[i].addEventListener("touchend" , function(){
                    this.id = "cur";
                   commonUtil.chooseClick(this);
                })
                /*tds[i].onclick = function () {
                    this.id = "cur";
                   commonUtil.chooseClick(this);
                };*/
            }
        }
    },
    getClose: function () {
        pickerEvent.remove();
    },
    getLast: function () {
        dateUtil.getLastDate();
        pickerEvent.Init(elemId);
    },
    getNext: function () {
        dateUtil.getNexDate();
        pickerEvent.Init(elemId);
    },
    setPriceArr: function (arr) {
        obj.priceArr = arr;
    },
    remove: function () {
        var p = document.getElementById("calendar_choose");
        var m = document.getElementById("mask");
        if (p != null) {
            document.body.removeChild(p);
            document.body.removeChild(m);
        }
    }
}
var pickerHtml = {
    getHead: function () {
        var head = '<ul class="calendar-num"><li class="bold">周日</li><li>周一</li><li>周二</li><li>周三</li><li>周四</li><li>周五</li><li class="bold">周六</li></ul>';
        htmlObj.header = head;
    },
    getTop: function () {
        var curMounth = obj.month;
         if (curMounth < 10)
        {
            curMounth = "0"+obj.month;
        }
        var top = '<div class="calendar-top"><p class="date_text">' + obj.year + '年' + curMounth + '月</p><a href="javascript:void(0)" title="上月" id="picker_last" class="picker pkg-circle-top"><<上月</a><a href="javascript:void(0)" title="下月" id="picker_next" class="picker pkg-circle-bottom">下月>></a></div>';
        htmlObj.top = top;
    },
    getRight: function () {
        var days = dateUtil.getLastDay(obj.month);
        var week = dateUtil.getWeek();
        var html = '<table id="calendar_tab" class="calendar-content"><tbody>';
        var index = 0;
        for (var i = 1; i <= 42; i++) {
            if (index == 0) {
                html += "<tr>";
            }
            var c = week > 0 ? week : 0;
            if ((i - 1) >= week && (i - c) <= days) {
                 var classStyle = "";
                 var price = "";
                
                //判断日期月份是个位数
                var monthLen = obj.month;
                if (monthLen < 10) {
                    monthLen = "0" + monthLen;
                }
                //判断日期天数是个位数，在前面加0;
                var day = (i - c);
                if (day < 10) {
                    day = "0"+ day; 
                }
                //获取要显示的日期;
                if (obj.year > new Date().getFullYear() ) {
                     price = commonUtil.getPrice(obj.year,obj.month,(i - c));
                     if (price != -1) {
                        classStyle = "class='on'";
                    }
                }else if (obj.year == new Date().getFullYear() && obj.month == new Date().getMonth()+1 && (i-c) >= new Date().getDate()) {
                    price = commonUtil.getPrice(obj.year,obj.month,(i - c));
                     if (price != -1) {
                        classStyle = "class='on'";
                    }
                }else if (obj.year == new Date().getFullYear() && obj.month > new Date().getMonth()+1) {
                    price = commonUtil.getPrice(obj.year,obj.month,(i - c));
                     if (price != -1) {
                        classStyle = "class='on'";
                    }
                }
                //判断今天
                if(obj.year==new Date().getFullYear()&&obj.month==new Date().getMonth()+1&&i-c==new Date().getDate()){
                    html += '<td  date="' + obj.year + "-" + monthLen + "-" + (i - c) + '"><a><span class="date">今天</span></a></td>';
                }
                else{
                    if(i-c == 1) {
                        html += '<td ' + classStyle + ' date="' + obj.year + "-" + monthLen + "-" + day + '"><a><span>' + objmonth[obj.month - 1] + '</span></a></td>';
                     } else {
                        
                            html += '<td ' + classStyle + ' date="' + obj.year + "-" + monthLen + "-" + day + '"><a><span>' + (i - c) + '</span></a></td>';
                     }

                    
                }
                if (index == 6) {

                    html += '</tr>';
                    index = -1;
                }
            }
            //获取下个月部分日期
            else if ((i - c) > days) {
                var nextMonth = obj.month + 1;
                var nextYear = obj.year;
                var nextDay = (i - days-c);
                //判断下个月月份是大于12还是小于10
                if (nextMonth > 12) {
                    nextYear = obj.year + 1;
                    nextMonth = 1;
                }
                if (nextMonth < 10) {
                    nextMonth = "0" + nextMonth;
                }
                if (nextDay < 10) {
                    nextDay = "0" + nextDay;
                }
                var classStyle = "";
                var price = "";
                //获取要显示的日期;
                if (obj.year > new Date().getFullYear() ) {
                     var  a = obj.month + 1 >12 ? 1 : obj.month + 1;
                     price = commonUtil.getPrice(nextYear,a,(i-c-days));
                     if (price != -1) {
                        classStyle = "class='on'";
                    }
                }else if (obj.year == new Date().getFullYear() && obj.month+1 > new Date().getMonth()+1) {
                    var  a = obj.month + 1 >12 ? 1 : obj.month + 1;
                    price = commonUtil.getPrice(nextYear,a,(i-c-days));
                     if (price != -1) {
                        classStyle = "class='on'";
                    }
                }
                if(i-c-days == 1) {
                         html += '<td ' + classStyle + ' date="' + nextYear + "-" + nextMonth + "-" + nextDay + '"><a><span>' + objmonth[nextMonth - 1] + '</span></a></td>';
                     } else {

                         html += '<td ' + classStyle + ' date="' + nextYear + "-" + nextMonth + "-" + nextDay + '"><a><span>' + (i - c - days) + '</span></a></td>';
                     }
                
                 if (index == 6) {

                    html += '</tr>';
                    index = -1;
                }
            }
            //获取上个月部分日期
            else if((i - 1) < week) {
                var lastYear = obj.year;
                var lastMonth = obj.month - 1;
                var lastDays = dateUtil.getLastDay(lastMonth);
                if (lastMonth <= 0) {
                    lastYear = obj.year-1;
                    lastMonth = 12;
                }
                if (lastMonth < 10) {
                    lastMonth = "0" + lastMonth;
                }
                var classStyle = "";
                var price = "";
                //获取要显示的日期;
                if (obj.year > new Date().getFullYear() ) {
                    var b = obj.month - 1 <=0 ? 12 : obj.month - 1;
                     price = commonUtil.getPrice(lastYear,b,(lastDays + i - c));
                     console.log(price);
                     if (price != -1) {
                        classStyle = "class='on'";
                    }
                }else if (obj.year == new Date().getFullYear() && obj.month == new Date().getMonth()+1 && (i-c) >= new Date().getDate()) {
                    var b = obj.month - 1 <=0 ? 12 : obj.month - 1;
                     price = commonUtil.getPrice(lastYear,b,(lastDays + i - c));
                     console.log(price);
                     if (price != -1) {
                        classStyle = "class='on'";
                    }
                }else if (obj.year == new Date().getFullYear() && obj.month > new Date().getMonth()+1) {
                    var b = obj.month - 1 <=0 ? 12 : obj.month - 1;
                     price = commonUtil.getPrice(lastYear,b,(lastDays + i - c));
                     console.log(price);
                     if (price != -1) {
                        classStyle = "class='on'";
                    }
                }
                html += '<td ' + classStyle + ' date="' + lastYear + "-" + lastMonth + "-" + (lastDays + i - c) + '"><a><span>' + (lastDays + i - c) + '</span></a></td>';
                if (index == 6) {
                    html += "</tr>";
                    index = -1;
                }
            }
            index++;
        }
        html += "</tbody></table>";
        htmlObj.right = html;
    },
    getMask: function() {
        var mask = '<div class="mod-mask" id="mask"></div>';
        htmlObj.mask = mask;
    }
}
var dateUtil = {
    //根据日期得到星期
    getWeek: function () {
        var d = new Date(obj.year, obj.month - 1, 1);
        return d.getDay();
    },
    //得到一个月的天数
    getLastDay: function (mMonth) {
        var new_year = obj.year;//取当前的年份        
        var new_month = mMonth;//取下一个月的第一天，方便计算（最后一不固定）        
        var new_date = new Date(new_year, new_month, 1);                //取当年当月中的第一天     
        return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();//获取当月最后一天日期        
    },
    //获取年月日；
    getCurrent: function () {
        var dt = obj.date;
        obj.year = dt.getFullYear();
        obj.month = dt.getMonth() + 1;
        obj.day = dt.getDate();
    },
    getLastDate: function () {
        if (obj.year == -1) {
            var dt = new Date(obj.date);
            obj.year = dt.getFullYear();
            obj.month = dt.getMonth() + 1;
        }
        else {
            var newMonth = obj.month - 1;
            if (newMonth <= 0) {
                obj.year -= 1;
                obj.month = 12;
            }
            else {
                obj.month -= 1;
            }
        }
    },
    getNexDate: function () {
        if (obj.year == -1) {
            var dt = new Date(obj.date);
            obj.year = dt.getFullYear();
            obj.month = dt.getMonth() + 1;
        }
        else {
            var newMonth = obj.month + 1;
            if (newMonth > 12) {
                obj.year += 1;
                obj.month = 1;
            }
            else {
                obj.month += 1;
            }
        }
    }
}
var commonUtil = {
    getPrice: function (year,month,day) {
        var dt = year + "-";
        if (month < 10)
        {
            dt += "0"+month;
        }
        else
        {
            dt+=month;
        }
        if (day < 10) {
            dt += "-0" + day;
        }
        else {
            dt += "-" + day;
        }
        for (var i = 0; i < obj.priceArr.length; i++) {
            if (obj.priceArr[i].Date == dt) {
                return 1;
            }
        }
        return -1;
    },
    chooseClick: function (sender) {
        var date = sender.getAttribute("date");
        var main = elemId.parentNode.querySelector(".main");
        main.innerHTML = date;
        setTimeout(pickerEvent.remove,500);
    }
}