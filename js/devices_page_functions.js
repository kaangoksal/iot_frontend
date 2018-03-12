

//server = "http://kaangoksal.com:5001";

//server = "http://192.168.122.113:5001";


server = "http://diyprototypes.com";



devices = {};
current_selected_device = "";
time_zone_offset = new Date().getTimezoneOffset() * -1;


fill_devices_list(select_the_first_device);
initialize_default_values_of_location_tab();
initialize_battery_graph();
create_time_line();

function select_the_first_device() {
    if (Object.keys(devices).length > 0) { // it means we actually kinda have a device to choose!
        //console.log("We have elements to choose from");
        var first_key = Object.keys(devices)[0];
        device_select(first_key);
    } else {
        //console.log("No devices available to select");
    }
}

function create_time_line() {
  google.charts.load("current", {packages:["timeline"]});
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {

    var container = document.getElementById('timeline1');
    var chart = new google.visualization.Timeline(container);
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'string', id: 'Position' });
    dataTable.addColumn({ type: 'string', id: 'Name' });
    dataTable.addColumn({ type: 'date', id: 'Start' });
    dataTable.addColumn({ type: 'date', id: 'End' });
    dataTable.addRows([

    [ 'Monday', 'Active', new Date(1789, 2, 4,10,0,1,0), new Date(1789, 2, 4,11,0,1,1) ],
      [ 'Monday', 'Inactive', new Date(1789, 2, 4,11,0,1,1), new Date(1789, 2, 4,14,10,1,1) ],
      [ 'Monday', 'Active', new Date(1789, 2, 4,14,10,1,1), new Date(1789, 2, 4,17,0,0,1) ],
      [ 'Monday', 'Inactive', new Date(1789, 2, 4,17,0,1,1), new Date(1789, 2, 4,18,10,1,1) ],


    [ 'Tuesday', 'Active', new Date(1789, 2, 4,10,0,1,0), new Date(1789, 2, 4,12,0,1,1) ],
      [ 'Tuesday', 'Inactive', new Date(1789, 2, 4,12,0,1,1), new Date(1789, 2, 4,14,10,1,1) ],
      [ 'Tuesday', 'Active', new Date(1789, 2, 4,14,10,1,1), new Date(1789, 2, 4,17,10,10,1) ],
      [ 'Tuesday', 'Shock', new Date(1789, 2, 4,14,10,1,1), new Date(1789, 2, 4,14,20,10,1) ],

    	[ 'Wednesday', 'Active', new Date(1789, 2, 4,10,0,1,0), new Date(1789, 2, 4,12,0,1,1) ],
      [ 'Wednesday', 'Inactive', new Date(1789, 2, 4,12,0,1,1), new Date(1789, 2, 4,16,10,1,1) ],
      [ 'Wednesday', 'Active', new Date(1789, 2, 4,16,10,1,1), new Date(1789, 2, 4,17,10,10,1) ],
      [ 'Wednesday', 'Shock', new Date(1789, 2, 4,14,10,1,1), new Date(1789, 2, 4,14,20,10,1) ],


      [ 'Thursday', 'Active', new Date(1789, 2, 4,10,0,1,0), new Date(1789, 2, 4,11,0,1,1) ],
      [ 'Thursday', 'Inactive', new Date(1789, 2, 4,12,0,1,1), new Date(1789, 2, 4,14,10,1,1) ],
      [ 'Thursday', 'Active', new Date(1789, 2, 4,14,10,1,1), new Date(1789, 2, 4,17,10,10,1) ],
      [ 'Thursday', 'Shock', new Date(1789, 2, 4,14,10,1,1), new Date(1789, 2, 4,14,20,10,1) ],

      [ 'Friday', 'Inactive', new Date(1789, 2, 4,10,0,1,0), new Date(1789, 2, 4,11,0,1,1) ],
      [ 'Friday', 'Inactive', new Date(1789, 2, 4,12,0,1,1), new Date(1789, 2, 4,14,10,1,1) ],
      [ 'Friday', 'Shock', new Date(1789, 2, 4,14,10,1,1), new Date(1789, 2, 4,14,20,10,1) ],

      [ 'Saturday', 'Active', new Date(1789, 2, 4,10,0,1,0), new Date(1789, 2, 4,12,0,1,1) ],
      [ 'Saturday', 'Inactive', new Date(1789, 2, 4,12,0,1,1), new Date(1789, 2, 4,14,10,1,1) ],

/*       [ 'Vice President', 'John Adams', new Date(1789, 3, 21), new Date(1797, 2, 4)],
      [ 'Vice President', 'Thomas Jefferson', new Date(1797, 2, 4), new Date(1801, 2, 4)],
      [ 'Vice President', 'Aaron Burr', new Date(1801, 2, 4), new Date(1805, 2, 4)],
      [ 'Vice President', 'George Clinton', new Date(1805, 2, 4), new Date(1812, 3, 20)], */

    ]);
    options = {
  title: 'My Daily Activities'
  ,chartArea:{left:0,top:0,width:"100%",height:"100%"}
  ,height: 500
  ,width: 500
};

    chart.draw(dataTable);
  }
  }

function fill_devices_list(call_back_function) {
    //var authorization = "Basic" + " " + btoa("user-8252ce9c-5960-48a2-aecc-c17212240ffd" + ":" + "pass-kaan");
    var data = JSON.stringify(false);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //console.log(" Response : " + xhttp.responseText);
            var json_response = JSON.parse(xhttp.responseText);
            var devices_array = json_response["devices"];
            var devices_panel_root = document.getElementById("devices_panel");

            for (var i = 0; i < devices_array.length; i++) {
                // maybe declare these guys outside


                create_device_card(devices_panel_root, devices_array[i]);
                // add the device to our memory
                var device_id = devices_array[i]["device_id"];
                devices[device_id] = devices_array[i];

            }

            if (typeof call_back_function == "function") {
                // it means that we can execute it, hooray!
                call_back_function();
            }

        }


    };
    xhttp.open("POST", server + "/api/get_user_devices", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    //xhttp.setRequestHeader("Authorization", authorization);
    xhttp.send(data);
    //console.log("Sent get_user_devices Request");

}

function create_device_card(devices_panel_root, device) {

    var device_name = device["device_name"];

    var device_last_ping = device["last_ping"];

    var device_type = device["type"];

    var device_id = device["device_id"];

    var new_device_panel = document.createElement("div");
    new_device_panel.className = "panel panel-default";
    new_device_panel.id = device_id;

    // With this function we can know which device is selected!
    new_device_panel.onclick = function () {
        device_select(device_id);
    };

    devices_panel_root.appendChild(new_device_panel);
    //=======================Header==================================
    var device_panel_header_div = document.createElement("div");
    device_panel_header_div.className = "panel-heading";

    new_device_panel.appendChild(device_panel_header_div);

    var device_name_header = document.createElement("h4");
    device_name_header.textContent = device_name;

    device_panel_header_div.appendChild(device_name_header);
    //======================BODY=======================================
    var panel_body_div = document.createElement("div");
    panel_body_div.className = "panel-body";

    new_device_panel.appendChild(panel_body_div);
    //=====================Image col==========================
    var image_col = document.createElement("div");
    image_col.className = "col-sm-3";

    panel_body_div.appendChild(image_col);

    var device_image = document.createElement("img");

    if (device_type == "gps tracker") {
        device_image.src = "images/gpstracker.png";
    } else if (device_type == "plug") {
        device_image.src = "images/plug.png";
    } else if (device_type == "wifi_stalker") {
        device_image.src = "images/wifistalker.png";
    } else {
        //console.log(device_type);
        device_image.src = "images/unknown_device.png";
    }

    device_image.className = "img";
    device_image.height = "55";
    device_image.width = "55";
    device_image.alt = "Avatar";

    image_col.appendChild(device_image);
    //==================info col==============================
    var info_col = document.createElement("div");
    info_col.className = "col-sm-9";

    panel_body_div.appendChild(info_col);

    //=============row in info col===============
    // var row_battery = document.createElement("div");
    // row_battery.className = "row";
    //
    // info_col.appendChild(row_battery);
    //
    // // battery status
    //
    // var p_battery = document.createElement("p");
    // p_battery.align = "left";
    //
    // row_battery.appendChild(p_battery);
    //
    // var glyphicon_battery = document.createElement("span");
    // glyphicon_battery.className = "glyphicon glyphicon-flash glyphicon-device-status";
    // p_battery.appendChild(glyphicon_battery);
    //
    // p_battery.textContent = "8 hours of battery available";

    //=============row in info col===============
    var row_status = document.createElement("div");
    row_status.className = "row";

    info_col.appendChild(row_status);

    // system status

    var p_status = document.createElement("p");
    p_status.align = "right";

    row_status.appendChild(p_status);

    var glyphicon_status = document.createElement("span");
    glyphicon_status.className = "glyphicon glyphicon-ok-sign glyphicon-device-status";
    p_status.appendChild(glyphicon_status);

    p_status.textContent = "Last ping: " + device_last_ping;


}

function device_select(device_id) {
    //this method is called by the cards, there is an embedded javascript function in every card that calls this
    //function with their device id.
    change_color_of_device_card(device_id);
    display_device_details(device_id);

}

function change_color_of_device_card(device_id) {

    if (current_selected_device === "") {
        var device_root = document.getElementById(device_id);
        var heading = device_root.children[0];
        heading.className = device_root.className + " panel-heading-custom";
        current_selected_device = device_id;
    } else {
        // it means that we have a previously selected element!
        var device_root = document.getElementById(current_selected_device);
        var heading = device_root.children[0];
        heading.className = "panel-heading"; //resets the header back to original

        device_root = document.getElementById(device_id);
        heading = device_root.children[0];
        heading.className = heading.className + " panel-heading-custom";
        current_selected_device = device_id;

    }
}

function display_device_details() {

    //console.log(current_selected_device);

    var device_object = devices[current_selected_device];
    var location_well = document.getElementById('location_tab_box');
    var device_battery_well = document.getElementById('battery_tab_box');
    var plug_state_well = document.getElementById('plug_state_tab_box');

    var device_username_element = document.getElementById('device_username_text');
    device_username_element.textContent = device_object["device_id"];


    var device_name_element = document.getElementById('device_name_text');
    device_name_element.textContent = device_object["device_name"];

    var device_latest_ping = document.getElementById('latest_ping_text');
    device_latest_ping.textContent = device_object["last_ping"];

    var device_type = device_object["type"];
    //console.log("Currently selected device type ", device_type);


    if (device_type == "plug") {

        location_well.style.display = "none";
        device_battery_well.style.display = "none";
        plug_state_well.style.display = "block";

        update_plug_state_widget();
        get_raw_data();

    } else if (device_type == "gps tracker") {

        location_well.style.display = "block";
        device_battery_well.style.display = "block";
        plug_state_well.style.display = "none";


        get_raw_data();
        update_location_trail(current_selected_device);
    }

}

function initMap() {
    console.log("Google Maps Initialized");
    var uluru = {lat: -25.363, lng: 131.044};
    google_map = new google.maps.Map(document.getElementById('map'), {zoom: 4, center: uluru});

}

function get_path_color(speed){
    var fastest = "#49ff00";

    var fast = "#297a01";
    var medium = "#ffff00";
    var slow = "#ff8000";
    var slowest = "#ff0000";
    var unknown = "#585858";

    if (speed > 80) {
        return fastest;
    } else if (speed > 65){
        return fast;
    } else if (speed > 50) {
        return medium;
    } else if (speed > 30) {
        return slow;
    } else if (speed > 0) {
        return slowest;
    } else {
        return unknown;
    }

}

function calculate_average_speed(w1, w2) {
    //TODO normally this should be relative to roads, it should be relative to max min speeds of the roads.
    if (w1["speed"] > 0 && w2["speed"] > 0){
        return (w1["speed"] + w2["speed"])/2
    } else if (w1["speed"] > 0) {
        return w1["speed"];
    } else if (w2["speed"] > 0) {
        return w2["speed"];
    } else {
        return 0;
    }
}

function add_path(waypoints) {
    var lineSymbol = {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
        };

    for (var j = 0; j+1<waypoints.length; j++){
        var first = waypoints[j];
        var other_one = waypoints[j+1];

        var path = new google.maps.Polyline({
        path: [first, other_one],
        icons: [{
            icon: lineSymbol,
            offset: '100%',
            repeat: '80px'
          }],
        geodesic: true,
        strokeColor: get_path_color(calculate_average_speed(first,other_one)),
        strokeOpacity: 1.0,
        strokeWeight: 2

    });
        path.setMap(google_map);



    }
    // var path = new google.maps.Polyline({
    //     path: waypoints,
    //     icons: [{
    //         icon: lineSymbol,
    //         offset: '100%',
    //         repeat: '80px'
    //       }],
    //     geodesic: true,
    //     strokeColor: '#FF0000',
    //     strokeOpacity: 1.0,
    //     strokeWeight: 2
    // });
    //
    // path.setMap(google_map);

    for (var i = 0; i < waypoints.length; i++) {
        var current_data = waypoints[i];
        var data_id = current_data["id"];
        var data_date = current_data["date"];
        var lat = current_data["lat"];
        var lng = current_data["lng"];
        var speed = current_data["speed"];

        var contentString = "data_id: " + data_id + " date(UTC): "
            + data_date + " Lat: " + lat + " Lng: " + lng + " speed: " + speed;

        //console.log("Circle added ", waypoints[i]["lat"], " long ", waypoints[i]["lng"]);
        var data_point_circle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#DA2',
            fillOpacity: 0.35,
            map: google_map,
            center: {"lat": lat, "lng": lng},
            radius: 5
        });


        google.maps.event.addListener(data_point_circle, 'click', function (contentString, lat, lng) {
            return function () {
                var infowindow = new google.maps.InfoWindow({content: contentString});
                infowindow.setPosition({"lat": lat, "lng": lng});
                infowindow.open(google_map);
            }
        }(contentString, lat, lng));


    }

}

function map_get_button() {
    update_location_trail(current_selected_device);
}

function update_location_trail(device_id) {
    var trail_start_date_picker = document.getElementById("trail-start-date");
    var trail_end_date_picker = document.getElementById("trail-end-date");

    var start_time_picker = document.getElementById("trail-start-time");
    var end_time_picker = document.getElementById("trail-end-time");


    var start_date = combine_date_string_time_string(trail_start_date_picker.value, start_time_picker.value);
    var end_date = combine_date_string_time_string(trail_end_date_picker.value, end_time_picker.value);
    console.log("End date picker date ",trail_end_date_picker.value, " time ",end_time_picker.value );
    console.log("End date local ", end_date);
    console.log("Start date local ", start_date);


    start_date = local_time_to_UTC(start_date);
    end_date = local_time_to_UTC(end_date);
    start_date = start_date.toISOString().replace("T", " ").replace("Z", "");
    end_date = end_date.toISOString().replace("T", " ").replace("Z", "");

    console.log("Start Date ", start_date);
    console.log("End Date ", end_date);


    var data = JSON.stringify(
        {
            "start_date": start_date,
            "end_date": end_date,
            "device_id": device_id
        });

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //console.log(" Response : " + xhttp.responseText);
            var json_response = JSON.parse(xhttp.responseText);
            var trail = json_response["positions"];

            var bounds = new google.maps.LatLngBounds();

            for (var i = 0; i < trail.length; i++) {
                var gglshit = new google.maps.LatLng(trail[i]["lat"], trail[i]["lng"]);
                bounds.extend(gglshit);
            }


            google_map.fitBounds(bounds);
            add_path(trail);


            // change_map(lat_av,lng_av);
        }
    };
    xhttp.open("POST", server + "/api/get_gps_trail", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(data);
    //console.log("Sent get_gps_trail request");
    //send the next query for the location widget
    update_location_widget();
}

function update_location_widget() {

    var data = JSON.stringify(
        {
            "device_id": current_selected_device
        });

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //console.log(" Response : " + xhttp.responseText);
            var json_response = JSON.parse(xhttp.responseText);
            var position = json_response["position"];

            var cct_element = document.getElementById("current_coordinates_text");
            cct_element.textContent = "Latitude: " + position["lat"] + " Longitude: " + position["lng"];

            var clt_element = document.getElementById("current_location_text");

            var lut_element = document.getElementById("latest_update_text");
            lut_element.textContent = json_response["date"]

        }
    };
    xhttp.open("POST", server + "/api/get_latest_location", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(data);
    //console.log("Sent update_location_widget request");

}

function update_plug_state_widget() {
    var data = JSON.stringify(
        {
            "device_id": current_selected_device
        });

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var json_response = JSON.parse(xhttp.responseText);
            var current_state = json_response["current_state"];

            var cste = document.getElementById("plug_current_state_text");
            cste.textContent = current_state.toString();

            var ponb = document.getElementById("plug_on_button");
            var poffb = document.getElementById("plug_off_button");

            if (current_state) {
                poffb.style.display = "block";
                ponb.style.display = "none";

            } else {
                poffb.style.display = "none";
                ponb.style.display = "block";
            }


        }

    };
    xhttp.open("POST", server + "/api/get_state_user", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(data);
    //console.log("Sent get plug state request");

}

function get_raw_data() {
    var raw_data_start_date_picker = document.getElementById("raw_data-start-date");
    var raw_data_end_date_picker = document.getElementById("raw_data-end-date");

    var start_date = raw_data_start_date_picker.value;
    var end_date = raw_data_end_date_picker.value;

    var data = JSON.stringify(
        {
            "start_date": start_date,
            "end_date": end_date,
            "device_id": current_selected_device,
            "page": 0,
            "count": 50
        });

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //console.log(" Response : " + xhttp.responseText);
            var json_response = JSON.parse(xhttp.responseText);
            var raw_data_array = json_response["data"];

            populate_raw_data_list(raw_data_array);

            // change_map(lat_av,lng_av);
        }
    };
    xhttp.open("POST", server + "/api/get_raw_data", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(data);
    //console.log("Sent get_raw_data request");

}

function populate_raw_data_list(raw_data_array) {

    var raw_data_panel_root = document.getElementById("raw_data_list");

    for (var i = 0; i < raw_data_array.length; i++) {
        // maybe declare these guys outside
        raw_data_panel_root.appendChild(create_raw_data_card(raw_data_array[i]));


    }


}

function create_raw_data_card(raw_data) {

    var new_a = document.createElement("a");
    new_a.setAttribute("data-toggle", "collapse");
    new_a.href = "#collapse" + raw_data["id"];
    new_a.className = "list-group-item";

    var new_p = document.createElement("p");
    new_p.className = "list-group-item-text";
    new_p.textContent = "Packet Id: " + raw_data["id"] + "  Server Received: " + raw_data["server_time"];
    new_a.appendChild(new_p);

    var new_div_collapse = document.createElement("div");
    new_div_collapse.className = "panel-collapse panel-body collapse";
    new_div_collapse.id = "collapse" + raw_data["id"];
    new_div_collapse.textContent = raw_data["data"];
    new_a.appendChild(new_div_collapse);

    return new_a;


}

function toggle_plug(state) {

    var data = JSON.stringify(
        {
            "state": state,
            "device_id": current_selected_device
        });

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //console.log(" Response : " + xhttp.responseText);
            // var json_response = JSON.parse(xhttp.responseText);
            // var raw_data_array = json_response["data"];
            //
            // populate_raw_data_list(raw_data_array);

            // change_map(lat_av,lng_av);
            update_plug_state_widget();
        }
    };
    xhttp.open("POST", server + "/api/set_state", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(data);
    //console.log("Sent get_raw_data request");

}

// function get_offset_date(current_date, offset) {
//     console.log("Current date without offset: ", current_date, " Offset: ", offset );
//     var offset_date = moment(current_date).add(offset, 'minutes');
//     offset_date = offset_date["_d"];
//     console.log("Date after offset: ", offset_date);
//     return offset_date
// }

function initialize_battery_graph() {
//line
    var ctxL = document.getElementById("lineChart_percentage").getContext('2d');
    var myLineChart = new Chart(ctxL, {
        type: 'line',
        data: {
            labels: ["0", "1", "2", "3", "4", "5", "6"],
            datasets: [
                {
                    label: "Battery",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [100, 95, 80, 81, 56, 55]
                }
            ]
        },
        options: {
            responsive: true
        }
    });
}

function initialize_default_values_of_location_tab() {

    //console.log("Initializing date for... ");
    var current = new Date();

    var trail_start_date_picker = document.getElementById("trail-start-date");
    var trail_end_date_picker = document.getElementById("trail-end-date");

    var tst = document.getElementById("trail-start-time");
    var tet = document.getElementById("trail-end-time");
    //console.log("Time Zone offset I'm using ", time_zone_offset);

    var timenow = UTC_to_local_time(new Date());

    var timenow_string = new Date().toTimeString(); //This stupid function converts to Local Timezone

    tst.value = "00:00:00";
    tet.value = timenow_string.substring(0, timenow_string.indexOf(" "));


    var before_string = timenow.toISOString();
    before_string = before_string.slice(0, before_string.indexOf("T"));
    trail_start_date_picker.value = before_string;

    var following_day_string = timenow.toISOString();
    following_day_string = following_day_string.slice(0, following_day_string.indexOf("T"));

    trail_end_date_picker.value = following_day_string; //fucking format is wrong, it has to be year-month-day
}