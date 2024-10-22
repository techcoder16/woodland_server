//########################## Helper functions #######################
/**
 * @description Abstract function to get active calls data from API
 * @param {string} reportBy: get data by min,hour,day
 * @param {string} scope: Reseller , Super User, Domain
 * @param {string} type: on net , of net , cluster , nodes
 * @param {string} object : cdr2 , call
 */
 let argsCache = null;
 function redrawChart(){
   $('.chart-container .chartControls').remove();
   $('.chart-container svg').remove();
   clearTimeout(resizeTimer);
   resizeTimer = setTimeout(function() {
       if (argsCache!= null)
         drawActiveCallsForUser(argsCache);
   }, 250);
 }
 
 var resizeTimer;
 window.addEventListener('resize', redrawChart, false);
 
 function drawActiveCallsForUser(arg) {
     argsCache = arg;
     var scope = arg.scope;
     var type = arg.type;
     var object = arg.object;
     var reportBy = arg.reportBy;
     var duration = arg.duration;
     var lang = $('html')[0].lang;
     google.charts.load('current', {
         'packages': ['annotationchart']
     });
     google.charts.setOnLoadCallback(drawChart);
 
     function drawChart() {
         var site = sub_site || null;
         var post = queryBuilder(reportBy, scope, type, object, site);
         var chart = new google.visualization.AnnotationChart(document.getElementById('chart_div'));
         //google.visualization.events.addListener(chart, 'ready', chartFadeIn);
         google.visualization.events.addListener(chart, 'rangechange', rangechange_handler);
 
         function rangechange_handler(e) {
             // start date can  be cached console.log(e[start]);
             $('#chart_div_AnnotationChart_chartContainer > div > div:nth-child(1) > div > svg > g:nth-child(3) > g:nth-child(2) > g:nth-child(1) [fill = "#ebebeb"]').remove();
         }
 
         //set default zoom ar
         var zset = new Date();
         var back;
         if (scope == "Super User") {
             back = new Date(zset.getFullYear(), zset.getMonth(), zset.getDate() - 4);
         } else {
             back = scope == "Reseller" ? new Date(zset.getFullYear(), zset.getMonth(), zset.getDate() - 7) : new Date(zset.getFullYear(), zset.getMonth(), zset.getDate() - 14);
         }
         if (reportBy == "day") back = new Date(zset.getFullYear(), zset.getMonth() - 1);
 
         var convertKeys = {
             Day: {
                 Do: 'dd',
                 DD: 'dd',
                 D: 'd',
             },
             Year: {
                 YYYY: 'yyyy',
                 YY: 'yy'
             },
             Abbrev: {
                 A: 'a',
             },
             Hour: {
                 hh: "KK",
                 h: "k"
             }
         };
 
         dateFormat = reportBy == 'day' ? convertDateFormat(portalDateFormat, convertKeys) : convertDateFormat(portalDateFormat + " " + portalTimeFormat, convertKeys);
         var options = {
             displayAnnotations: true,
             scaleType: "allfixed",
             thickness: 2,
             colors: colorArray,
             displayZoomButtons: true,
             zoomEndTime: zset,
             zoomStartTime: back,
             min: 1,
             dateFormat: dateFormat,
         };
         netsapiens.api.post(post).then(getActiveCalls);
 
         function getActiveCalls(res) {
             var gdata = addCol(res);
             var data = addRow(res, gdata);
             chartDraw(data, options);
         }
 
         function addCol(res) {
             var data = new google.visualization.DataTable();
 
             reportBy !== 'day' ? data.addColumn('datetime', 'dd MMMM, yyyy') : data.addColumn('date', 'Date');
             if (scope == "Super User" && type == "nodes") {
                 if (typeof res == "String")
                   t = JSON.parse(res, ',');
                 else
                   t = res;
                 //get all hostnames and add column
                 for (var col in t) {
                     $.each(t[col], function(key, val) {
                         var hosts = findMax(val).col;
                         hosts = hosts.substring(0, hosts.indexOf("."));
                         data.addColumn('number', hosts);
                     });
                     break;
                 }
 
             }
             if (scope == "Super User" && type == "cluster") {
                 data.addColumn('number', _("Nodes"));
             }
 
             if (scope == "Reseller") {
                 data.addColumn('number', _("Nodes"));
             }
             if (omp_level == "navigation_omp" && sub_scope == "Site Manager") {
                 data.addColumn('number', sub_site);
             }
             else if (omp_level == "navigation_omp") {
                 data.addColumn('number', _("My Organization"));
             }
             return data;
         }
 
         function addRow(res, data) {
 
             if (typeof res == "String")
               t = JSON.parse(res, ',');
             else
               t = res;
             //if user super user use different data rows
             if (scope == "Super User") {
                 var allHosts = [];
                 for (var col in t) {
                     $.each(t[col], function(key, val) {
                         allHosts.push(findMax(val).col);
                     });
                     break;
                 }
                 if (type == "cluster") {
                     addRowsByCluster(t);
                 } else if (type == "nodes") {
                     addRowsByHosts(t);
                 } else {
                     addRowsForDomain(t);
                 }
 
                 function addRowsByHosts(t) {
                     for (var i in t) {
                         rows = [
                             [new Date(i * 1000)]
                         ];
                         for (var j = 0; j < allHosts.length; j++) {
                             if (t[i][j][allHosts[j]].max !== undefined) {
                                 rows[0].push(Number(t[i][j][allHosts[j]].max));
                             } else if (t[i][j][allHosts[j]].totalCalls !== undefined) {
                                 var r = duration !== 'duration' ? Math.ceil(Number(t[i][j][allHosts[j]].totalDuration) / 60) : Number(t[i][j][allHosts[j]].totalCalls);
                                 rows[0].push(r);
                             }
                         }
                         data.addRows(rows);
                     }
                 }
 
                 function addRowsByCluster(t) {
                     for (var i in t) {
                         var rows = [];
                         for (var j = 0; j < allHosts.length; j++) {
                             if (t[i][j][allHosts[j]].max !== undefined) {
                                 rows.push(Number(t[i][j][allHosts[j]].max));
                             } else if (t[i][j][allHosts[j]].totalCalls !== undefined) {
                                 var r = duration !== 'duration' ? Math.ceil(Number(t[i][j][allHosts[j]].totalDuration) / 60) : Number(t[i][j][allHosts[j]].totalCalls);
                                 rows.push(r);
                             }
                         }
                         var sum = rows.reduce(function(pv, cv) {
                             return pv + cv;
                         }, 0);
                         data.addRows([
                             [new Date(i * 1000), sum]
                         ]);
                     }
 
                 }
 
                 function addRowsForDomain(t) {
                     $.each(t, function(key, val) {
                         var rval = (type !== "offnet") ? findMax(val).maxAll : findMax(val).maxOffnet;
                         data.addRows([
                             [new Date(key * 1000), rval]
                         ]);
                     });
 
                 }
 
             } else {
                 $.each(t, function(key, val) {
                     var rval = (type !== "offnet") ? findMax(val).maxAll : findMax(val).maxOffnet;
                     data.addRows([
                         [new Date(key * 1000), rval]
                     ]);
                 });
             }
             return data;
         }
 
 
         function chartDraw(data, options) {
             chart.draw(data, options);
 
             function redrawChart() {
               
               chart.draw(data, options);
             }
 
 
 
 
             var t = chart.getVisibleChartRange();
  
             $('.active-calls-graph-buttons').show();
             $('#chart_div_AnnotationChart_chartContainer > div > div:nth-child(1) > div > svg > g:nth-child(3) > g:nth-child(2) > g:nth-child(1) [fill="#ebebeb"]').remove();
             $(".google-visualization-atl").find(".border").css({
                 border: "none"
             });
             //remove extra zoom btns
             if(reportBy == 'day') {
 
               $('#chart_div_AnnotationChart_zoomControlContainer_1-day').remove();
               $('#chart_div_AnnotationChart_zoomControlContainer_1-hour').remove();
 
             }
 
             if(reportBy == 'hour')
             {
               $('#chart_div_AnnotationChart_zoomControlContainer_6-months').remove();
               $('#chart_div_AnnotationChart_zoomControlContainer_1-month').remove()
             }
 
             if(reportBy == 'min'){
               $('#chart_div_AnnotationChart_zoomControlContainer_1-day').remove();
               $('#chart_div_AnnotationChart_zoomControlContainer_1-week').remove();
               $('#chart_div_AnnotationChart_zoomControlContainer_1-month').remove()
               $('#chart_div_AnnotationChart_zoomControlContainer_6-months').remove();
             }
 
             $('#chart_div_AnnotationChart_zoomControlContainer_max').remove();
             $('#chart_div_AnnotationChart_zoomControlContainer_1-year').remove();
             $('#chart_div_AnnotationChart_zoomControlContainer_3-months').remove();
             $('#chart_div_AnnotationChart_zoomControlContainer_5-days').remove();
             $('#chart_div_AnnotationChart_zoomControlContainer_1-hour').attr('class', 'btn btn-mini').css('padding', '3px 7px');
             $('#chart_div_AnnotationChart_zoomControlContainer_1-day').attr('class', 'btn btn-mini').css('padding', '3px 7px');
             $('#chart_div_AnnotationChart_zoomControlContainer_1-week').attr('class', 'btn btn-mini').css('padding', '3px 7px');
             $('#chart_div_AnnotationChart_zoomControlContainer_1-month').attr('class', 'btn btn-mini').css('padding', '3px 7px');
             $('#chart_div_AnnotationChart_zoomControlContainer_6-months').attr('class', 'btn btn-mini').css('padding', '3px 7px');
         }
 
         function findMax(val) {
             var max = {};
             $.each(val, function(k, v) {
                 if (v.max !== undefined) {
                     max.maxAll = Number(v.max);
                     max.maxOffnet = Number(v.max);
                 } else if (v.totalDurationOffnet !== undefined) {
                     max.maxOffnet = (duration == 'duration') ? Number(Number(v.totalDurationOffnet) / 60) : Number(v.offnetCalls);
                     max.maxAll = (duration == 'duration') ? Number(Number(v.totalDurationOnnet) / 60 + Number(v.totalDurationOffnet) / 60) : Number(v.onnetCalls) + Number(v.offnetCalls);
                 }
                 max.col = k;
             });
             return max;
         }
 
         // post request
         function queryBuilder(report_by, scope, type, object, site) {
             postReq = {
                 format: 'json',
                 action: 'report'
             };
             postReq.object = object;
             if (type !== false) postReq.type = type;
             now = new Date();
             postReq.end_date = format(now, 'yyyy-MM-dd hh:mm:ss');
             //set default time_start to 6 month before current time
             switch (report_by) {
                 case "min":
                     back = scope == "Super User" && object == "call" ? new Date(now.setHours(now.getHours() - 5)) : new Date(now.setHours(now.getHours() - 3));
                     break;
                 case "hour":
                     back = object == 'call' ? new Date(now.setDate(now.getDate() - 13)) : back = new Date(now.setMonth(now.getMonth() - 1));
                     break;
                 case "day":
                     back = new Date(now.setMonth(now.getMonth() - 6));
             }
             postReq.start_date = format(back, 'yyyy-MM-dd hh:mm:ss');
             postReq.report_by = report_by;
             switch (scope) {
                 case "Reseller":
                     postReq.reseller = sub_reseller;
                     break;
                 case "Super User":
                     postReq.group_by = "hostname";
                     break;
                 case "site":
                     postReq.site = sub_site;
                     postReq.domain = current_domain;
                     // postReq.group_by = "site";
                     break;
                 default:
                     postReq.domain = current_domain;
                     break;
             }
             return postReq;
         }
     }
 }
 var format = function(x, y) {
     if (typeof x == "undefined")
     {
 
       return "";
     }
 
     var z = {
         M: x.getUTCMonth() + 1,
         d: x.getUTCDate(),
         h: x.getUTCHours(),
         m: x.getUTCMinutes(),
         s: x.getUTCSeconds()
     };
     y = y.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
         return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2);
     });
     return y.replace(/(y+)/g, function(v) {
         return x.getUTCFullYear().toString().slice(-v.length);
     });
 };
 
 /*
  * Will set high water marks on windows variable.
  */
 
 var getHiqhwaterMarks = function(scope, type,domain) {
     var d = new Date();
     var end_date = format(d, 'yyyy-MM-dd hh:mm:ss');
     var start_date = format(new Date(d.getFullYear(), d.getMonth() - 1, 1), 'yyyy-MM-dd 00:00:00')
 
     arg = {
         format: 'json',
         action: 'report',
         object: 'call',
         end_date: end_date,
         start_date: start_date,
         report_by: 'day',
     }
     scope !== "Reseller" ? arg.domain = current_domain : arg.reseller = sub_reseller;
     if (scope =="site")
       arg.site = sub_site;
     arg.type = type.charAt(1) == 'f' ? 'offnet' : 'all';
     netsapiens.api.post(arg).then(function(res) {
         var maxsLast = [];
         maxsLast.push(0);
         var maxsPrev = [];
         maxsPrev.push(0);
         var prevMonth = Math.floor(new Date(d.getFullYear(), d.getMonth() - 1, 1) / 1000);
         var currentMonth = Math.floor(new Date(d.getFullYear(), d.getMonth(), 1) / 1000);
 
         function findMax(val) {
             var max = {};
             $.each(val, function(k, v) {
                 if (v.max !== undefined) {
                     max.max = Number(v.max);
                 }
             });
             return max;
         }
         if (typeof res == "String")
             j = JSON.parse(res, ',');
         else
             j = res;
 
         $.each(j, function(key, val) {
             if (Number(key) < prevMonth || Number(key) > currentMonth) return true;
             maxsPrev.push(findMax(val).max);
         });
 
         $.each(j, function(key, val) {
             if (Number(key) < currentMonth) return true;
             maxsLast.push(findMax(val).max);
         });
         window.highWatercurrentMonth = Math.max.apply(Math, maxsLast);
         window.highWaterPrevMonth = Math.max.apply(Math, maxsPrev);
     })
 }
 
 //Print given chart area;
 //requires printFrame function in scripts.js
 printActiveCallsGraph = function() {
     var css = '<link id="print-styles" rel="stylesheet" type="text/css" href="/portal/css/myprintstyle.css">';
 
     var titleText =
         $('#active-calls-graph-title')
             .clone()    //clone the element
             .find('.dropdown-menu') //select all the dropdown menus
             .remove()   //remove all the ul
             .end()  //again go back to selected element
             .text();
 
     var title = '<h2>'+ titleText +'</h2>';
     var chart =
         $('#chart_div')
             .clone()
             .find('.zoomControls')
             .remove() //remove zoomcontrols
             .end()
             .html();
     var printContents = title + chart;
 
     printFrame(css, printContents);
 };
 
 function usageGraph(scope, peakCalls, type, sms) {
     if (scope !== "Reseller" ) {
         netsapiens.api.post({
             object: 'domain',
             action: 'read',
             format: 'json',
             domain: current_domain,
             billing: 'yes',
             site: sub_scope =="Site Manager"?sub_site: null
         }).then(function(data) {
             if (sms === 'show') {
                 //sms stats
                 appendStatistic({
                     data: data[0].sms_inbound_today,
                     id: 'sms_inbound_today',
                     desc: _('SMS Inbound'),
                     helpText: _('Total number of SMS messages received by all users on the domain today.')
                 }, '.usage-stats-table');
 
                 appendStatistic({
                     data: data[0].sms_outbound_today,
                     id: 'sms_outbound_today',
                     desc: _('SMS Outbound'),
                     helpText: _('Total number of SMS messages sent by all users on the domain today.')
                 }, '.usage-stats-table');
 
                 appendStatistic({
                     data: data[0].sms_inbound_current,
                     id: 'sms_inbound_current',
                     desc: _('SMS Inbound'),
                     helpText: _('Total number of SMS messages received by all users on the domain from the first day of the month to current.')
                 }, '.usage-stats-this-month');
 
                 appendStatistic({
                     data: data[0].sms_outbound_current,
                     id: 'sms_outbound_current',
                     desc: _('SMS Outbound'),
                     helpText: _('Total number of SMS messages sent by all users on the domain from the first day of the month to current.')
                 }, '.usage-stats-this-month');
 
                 appendStatistic({
                     data: data[0].sms_inbound_last,
                     id: 'sms_inbound_last',
                     desc: _('SMS Inbound'),
                     helpText: _('Total number of SMS messages received by all users on the domain from the first day of the previous month to the last day of the previous month.')
                 }, '.usage-stats-last-month');
 
                 appendStatistic({
                     data: data[0].sms_outbound_last,
                     id: 'sms_outbound_last',
                     desc: _('SMS Outbound'),
                     helpText: _('Total number of SMS messages sent by all users on the domain from the first day of the month to current.')
                 }, '.usage-stats-last-month');
                 bindPopovers();
             }
 
             if (data[0] && data[0].PORTAL_VIDEO && data[0].PORTAL_VIDEO.toLowerCase() === "yes") {
                 appendStatistic({
                     data: data[0].day_meetings || 0,
                     id: 'meetings_today',
                     desc: _('Video Meetings Today'),
                     helpText: _('Total number of video meetings happening today using') +" "+ PORTAL_VIDEO_NAME
                 }, '.usage-stats-table');
 
                 appendStatistic({
                     data: data[0].month_meetings || 0,
                     id: 'meetings_thismonth',
                     desc: _('Video Meetings'),
                     helpText: _('Total number of video meetings that have happened this month using') +" "+ PORTAL_VIDEO_NAME
                 }, '.usage-stats-this-month');
 
                 appendStatistic({
                     data: data[0].lastmonth_meetings || 0,
                     id: 'meetings_lastmonday',
                     desc: _('Video Meetings'),
                     helpText: _('Total number of video meetings that have happened last month using ') + PORTAL_VIDEO_NAME
                 }, '.usage-stats-last-month');
 
                 bindPopovers();
             }
         })
     }
 
 
     var d = scope === "Reseller" ? sub_reseller : current_domain;
     if (sub_scope === "Site Manager") {
       netsapiens.api.post({
           object: 'call',
           action: 'count',
           format: 'json',
           domain: current_domain,
           site: sub_site
       }).then(function(data) {
           appendStatistic({
               data: data,
               id: 'current-active-calls',
               desc: _('Current Active Calls'),
               helpText: _('Number of calls currently being processed at in this site.')
           }, '.usage-stats-table');
       });
     }
     else
       $.get('/portal/stats/calls/' + d, function(data) {
           // active calls stats
           appendStatistic({
               data: data,
               id: 'current-active-calls',
               desc: _('Current Active Calls'),
               helpText: _('Number of calls currently being processed on the domain.')
           }, '.usage-stats-table');
 
           bindPopovers();
       });
 
       var date = new Date();
 
     var start_date = moment.tz(moment(), sub_time_zone).format('YYYY-MM-DD 00:00:00');
     var end_date = moment.tz(moment(), sub_time_zone).format('YYYY-MM-DD 23:59:59');
 
     function argBuilder(scope) {
         arg = {
             object: 'cdr2',
             action: 'count',
             format: 'json',
             start_date: start_date,
             end_date: end_date,
             range_interval,range_interval,
             type : 'Off-net'
         };
         scope !== "Reseller" ? arg.domain = current_domain : arg.territory = sub_reseller;
 
         if (scope === "site")
           arg.site = sub_site;
         return arg;
     };
 
     var arg = argBuilder(scope);
     netsapiens.api.post(arg).then(function(data) {
         //calls-today & avg-talkd-time
         if (typeof data == "String")
             data = JSON.parse(data, ',');
         if (typeof data == "undefined" ||  data == null )
         {
             data = {'minutes':0,'total':0};
         }
 
         var avg = Math.round(Number(data['minutes']) / Number(data['total']));
         avg = isNaN(avg) ? 0 : avg;
 
         let calls_today_label = _('Number of calls processed on the domain today. Excludes any active calls.');
         let total_minutes_today_label = _('Number of minutes all users on the domain were on calls today. Excludes any active calls.');
         let avg_talkd_time_label = _('Average number of minutes all users on the domain were on calls today. Excludes any active calls.');
 
         if (scope === "site")
         {
             calls_today_label = _('Number of calls processed on the site today. Excludes any active calls.');
             total_minutes_today_label = _('Number of minutes all users on the site were on calls today. Excludes any active calls.');
             avg_talkd_time_label = _('Average number of minutes all users on the site were on calls today. Excludes any active calls.');
         }
 
         appendStatistic({
             data: data['total'],
             id: 'calls-today',
             desc: _('Calls Today'),
             helpText: calls_today_label
         }, '.usage-stats-table');
 
         appendStatistic({
             data: data['minutes'],
             id: 'total-minutes-today',
             desc: _('Total Minutes Today'),
             helpText: total_minutes_today_label
         }, '.usage-stats-table');
 
         appendStatistic({
             data: avg,
             id: 'avg-talkd-time',
             desc: _('Avg.Talk Time'),
             helpText: avg_talkd_time_label
         }, '.usage-stats-table');
 
         bindPopovers();
     });
 
     let total_min_last_label = _('Number of minutes all users in the domain were on calls from the first day of the previous month to the last day of the previous month.');
     let total_min_current_label = _('Number of minutes all users in the domain were on calls from the first day of the month to current. Excludes any active calls.');
     if (arg.site)
     {
       total_min_last_label = _('Number of minutes all users in the site were on calls from the first day of the previous month to the last day of the previous month.');
       total_min_current_label = _('Number of minutes all users in the site were on calls from the first day of the month to current. Excludes any active calls.');
 
     }
 
     var start_date = new Date(date.getFullYear(), date.getMonth() - 1, 1);
     var end_date = new Date(date.getFullYear(), date.getMonth(), 1);
     start_date = format(start_date, 'yyyy-MM-dd 00:00:00');
     end_date = format(end_date, 'yyyy-MM-dd 00:00:00');
     var arg = argBuilder(scope);
     arg.type = 'Off-net';
     netsapiens.api.post(arg).then(function(data) {
         //Total minutes
         var date = new Date();
         start_date = new Date(date.getFullYear(), date.getMonth() - 1, 1);
         if (typeof data == "String")
             data = JSON.parse(data, ',');
         if (data== null)
             data={"minutes":0};
         appendStatistic({
             data: data['minutes'],
             id: 'total-min-last',
             desc: _('Total Minutes'),
             helpText: total_min_last_label
         }, '.usage-stats-last-month');
 
         bindPopovers();
     });
     start_date = end_date;
     end_date = format(date, 'yyyy-MM-dd hh:mm:ss');
     arg = argBuilder(scope);
     arg.type = 'Off-net';
     netsapiens.api.post(arg).then(function(data) {
         var date = new Date();
         start_date = new Date(date.getFullYear(), date.getMonth(), 1);
         if (typeof data == "String")
             data = JSON.parse(data, ',');
         if (data== null)
             data={"minutes":0};
         appendStatistic({
             data: data['minutes'],
             id: 'total-min-current',
             desc: _('Total Minutes'),
             helpText: total_min_current_label
         }, '.usage-stats-this-month');
 
         bindPopovers();
     });
 
     function highWaterMark() {
         var date = new Date();
         var currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
         var prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
         if (typeof highWatercurrentMonth !== 'undefined' && highWaterPrevMonth !== 'undefined') {
             //Peak stats
             appendStatistic({
                 data: highWatercurrentMonth,
                 id: 'peak-active-current',
                 desc: _('Peak Active Calls'),
                 helpText: _('The highest number of simultaneous calls from samples taken every 60 seconds from the first day of the month to current.')
             }, '.usage-stats-this-month');
 
             appendStatistic({
                 data: highWaterPrevMonth,
                 id: 'peak-active-prev',
                 desc: _('Peak Active Calls'),
                 helpText: _('The highest number of simultaneous calls from samples taken every 60 seconds from the first day of the previous month to the last day of the previous month.')
             }, '.usage-stats-last-month');
 
             bindPopovers();
         } else {
             setTimeout(function() {
                 highWaterMark();
             }, 500);
         }
     }
     //will order stats by id
     var resOrDom = scope == "Reseller" ? '#reseller-usage-body' : '#omp-usage-stats';
 
 
     var t = setInterval(function() {
         var rowCount = $('.usage-stats-table tr').length;
         var rowCount2 = $('.usage-stats-this-month tr').length;
         var rowCount3 = $('.usage-stats-last-month tr').length;
         var order2 = ['total-min-current', 'peak-active-current', 'sms_inbound_current', 'sms_outbound_current'];
         var order = ['current-active-calls', 'calls-today', 'total-minutes-today', 'avg-talkd-time', 'sms_inbound_today', 'sms_outbound_today'];
         var order3 = ['total-min-last', 'peak-active-prev', 'sms_outbound_last', 'sms_inbound_last'];
         var $table = $('.usage-stats-table');
         var $tableTm = $('.usage-stats-this-month');
         var $tableLm = $('.usage-stats-last-month');
 
         ready = 1;
         usgtotal = 6;
         if (sms != "show") usgtotal = usgtotal - 2;
 
         if (scope == "Reseller") {
             if (peakCalls == "show") ready = ready + 1;
             rowCount = rowCount + 2;
         } else {
             if (peakCalls == "show") ready  = ready + 1;
             if (sms == "show") ready = ready + 2;
         }
 
         //will wait until all data loaded from ajax request and show by order..
         if (rowCount >= usgtotal & rowCount2 >= ready & rowCount3 >= ready) {
 
             for (var i = order.length; --i >= 0;) {
                 $table.prepend($table.find('#' + order[i]));
             }
             for (var i = order2.length; --i >= 0;) {
                 $tableTm.prepend($tableTm.find('#' + order2[i]));
             }
             for (var i = order3.length; --i >= 0;) {
                 $tableLm.prepend($tableLm.find('#' + order3[i]));
             }
             $(resOrDom).find('.loading-container').hide();
             $(resOrDom).find('.stats-tables').animate({
                 "opacity": "toggle",
                 "height": "toggle"
             }, 800);
             clearInterval(t);
         }
     }, 200);
 
     if ('show' == peakCalls) {
         getHiqhwaterMarks(scope, type);
         highWaterMark();
     }
 }
 
 function appendStatistic( statObj, table ) {
     $(table).append('<tr id="' + statObj.id + '"><td>' +
             '<span class="helpsy">' + statObj.data + '</span>' +
         '</td><td>' +
             '<span class="label-popover" data-content="' + statObj.helpText + '"> ' +
                 statObj.desc + ' <i class="icon-info-sign"></i></span>' +
         '</td></tr>');
 }
 
 function bindPopovers() {
     setTimeout( function() {
         $('.label-popover').popover({
             trigger: 'hover',
             placement: 'left',
             template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>',
             container: 'body',
             html: true,
             delay: { show: 200, hide: 0 }
         });
     }, 1);
 }
 