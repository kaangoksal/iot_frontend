server = "http://diyprototypes.com";


devices = {};
current_selected_device = "";
refresh = false;
refresh_loop = "";

// fill_devices_list(select_the_first_device);
initialize_default_values_of_location_tab();
test_connection();
fill_devices_list(select_the_first_device);

function map_get_button(){
    console.log("Button!");
}

function toggle_refresh(){
    console.log("BUtton");
    var refbutton = document.getElementById("refresh_button");

    if (refresh == false) {
        refresh_loop = setInterval(display_device_details, 5000);
        refresh = true;

        refbutton.textContent = "Syncing";

        console.log("Started Refresh Execution");
    } else {
        window.clearInterval(refresh_loop);
        console.log("Stopped Refresh Execution");

        refbutton.textContent = "Start Sync";

        refresh = false;
    }
}

function initMap() {
    console.log("Google Maps Initialized");
    var uluru = {lat: -25.363, lng: 131.044};
    google_map = new google.maps.Map(document.getElementById('map'), {zoom: 4, center: uluru});

}


function select_the_first_device() {
    if (Object.keys(devices).length > 0) { // it means we actually kinda have a device to choose!
        //console.log("We have elements to choose from");
        for (var i = 0; i < devices.length; i++) {
            var current_device = devices[Object.keys(devices)[i]];
            if (current_device["type"] == "gps tracker") {
                device_select(Object.keys(devices)[i]);
            }
        }
        // var first_key = Object.keys(devices)[0];
        // device_select(first_key);
    } else {
        //console.log("No devices available to select");
    }
}

function fill_devices_list(call_back_function) {

    var data = JSON.stringify(false);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //console.log(" Response : " + xhttp.responseText);
            var json_response = JSON.parse(xhttp.responseText);
            var devices_array = json_response["devices"];
            var devices_panel_root = document.getElementById("devices_panel");


            //console.log(devices_array);


            for (var i = 0; i < devices_array.length; i++) {
                // maybe declare these guys outside
                if (devices_array[i]["type"] == "gps tracker") {
                    create_device_card(devices_panel_root, devices_array[i]);
                }
                //create_device_card(devices_panel_root, devices_array[i]);
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

    var moment_ping_date = moment(UTC_to_local_time(device_last_ping));
    p_status.textContent = "Last ping: " + moment_ping_date.fromNow();

    var row_username = document.createElement("div");
    row_username.className = "row";

    info_col.appendChild(row_username);
    var p_device_username = document.createElement("p");
    row_username.appendChild(p_device_username);

    p_device_username.textContent = "Device ID: " + device_id;
    p_device_username.align = "right";


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

function test_connection() {

    var data = JSON.stringify(false);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //console.log(" Response : " + xhttp.responseText);
            var json_response = JSON.parse(xhttp.responseText);
            console.log(json_response);
        }

    };
    xhttp.open("POST", server + "/api/test_req", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(data);
    //console.log("Sent get_user_devices Request");

}

function display_device_details() {

    //console.log(current_selected_device);

    var device_object = devices[current_selected_device];
    var device_type = device_object["type"];

    // var location_well = document.getElementById('location_tab_box');
    // var device_battery_well = document.getElementById('battery_tab_box');
    // var plug_state_well = document.getElementById('plug_state_tab_box');
    //
    // var device_username_element = document.getElementById('device_username_text');
    // device_username_element.textContent = device_object["device_id"];
    //
    //
    // var device_name_element = document.getElementById('device_name_text');
    // device_name_element.textContent = device_object["device_name"];
    //
    // var device_latest_ping = document.getElementById('latest_ping_text');
    // device_latest_ping.textContent = device_object["last_ping"];
    //


    //console.log("Currently selected device type ", device_type);


    if (device_type == "plug") {

        location_well.style.display = "none";
        device_battery_well.style.display = "none";
        plug_state_well.style.display = "block";

        update_plug_state_widget();
        get_raw_data();

    } else if (device_type == "gps tracker") {


        update_location_trail(current_selected_device);
    }

}


function update_location_trail(device_id) {
    var trail_start_date_picker = document.getElementById("trail-start-date");
    var trail_end_date_picker = document.getElementById("trail-end-date");

    var start_time_picker = document.getElementById("trail-start-time");
    var end_time_picker = document.getElementById("trail-end-time");


    var start_date = combine_date_string_time_string(trail_start_date_picker.value, start_time_picker.value);
    var end_date = combine_date_string_time_string(trail_end_date_picker.value, end_time_picker.value);
    console.log("End date picker date ", trail_end_date_picker.value, " time ", end_time_picker.value);
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

            if (trail.length == 0) {
                console.log("Trail is empty! Trying older times");
                get_latest_day_path(device_id);

            } else {

                var bounds = new google.maps.LatLngBounds();

                for (var i = 0; i < trail.length; i++) {
                    var gglshit = new google.maps.LatLng(trail[i]["lat"], trail[i]["lng"]);
                    bounds.extend(gglshit);
                }


                google_map.fitBounds(bounds);
                add_path(trail);
            }


            // change_map(lat_av,lng_av);
        }
    };
    xhttp.open("POST", server + "/api/get_gps_trail", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(data);
    //console.log("Sent get_gps_trail request");
    //send the next query for the location widget
    //update_location_widget();
}

function get_latest_day_path(device_id) {


    var data = JSON.stringify(
        {
            "device_id": device_id
        });

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //console.log(" Response : " + xhttp.responseText);
            var json_response = JSON.parse(xhttp.responseText);
            var trail = json_response["positions"];


            if (trail.length == 0) {
                console.log("Trail is empty! This device has no data!");

            } else {
                var start_date = json_response["start_date"];
                var end_date = json_response["end_date"];

                console.log("Start date " + start_date);
                var arr_start = start_date.split(" ");
                start_date = combine_date_string_time_string(arr_start[0], arr_start[1]);

                console.log("End date " + end_date);
                var arr_end = end_date.split(" ");
                end_date = combine_date_string_time_string(arr_end[0], arr_start[1]);

                var trail_start_date_picker = document.getElementById("trail-start-date");
                var trail_end_date_picker = document.getElementById("trail-end-date");

                var tst = document.getElementById("trail-start-time");
                var tet = document.getElementById("trail-end-time");
                //console.log("Time Zone offset I'm using ", time_zone_offset);

                //var timenow = UTC_to_local_time(new Date());

                var timenow_string = start_date.toTimeString(); //This stupid function converts to Local Timezone
                var time_end_string = end_date.toTimeString();

                tst.value = timenow_string.substring(0, timenow_string.indexOf(" "));
                tet.value = time_end_string.substring(0, timenow_string.indexOf(" "));


                var start_date_string = start_date.toISOString();
                start_date_string = start_date_string.slice(0, start_date_string.indexOf("T"));
                trail_start_date_picker.value = start_date_string;

                var end_date_string = end_date.toISOString();
                end_date_string = end_date_string.slice(0, end_date_string.indexOf("T"));
                trail_end_date_picker.value = end_date_string; //fucking format is wrong, it has to be year-month-day


                var bounds = new google.maps.LatLngBounds();

                for (var i = 0; i < trail.length; i++) {
                    var gglshit = new google.maps.LatLng(trail[i]["lat"], trail[i]["lng"]);
                    bounds.extend(gglshit);
                }


                google_map.fitBounds(bounds);
                add_path(trail);
            }


            // change_map(lat_av,lng_av);
        }
    };
    xhttp.open("POST", server + "/api/get_recent_gps_trail", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(data);
    //console.log("Sent get_gps_trail request");
    //send the next query for the location widget
    //update_location_widget();

}

function get_path_color(speed) {
    var fastest = "#49ff00";

    var fast = "#297a01";
    var medium = "#ffff00";
    var slow = "#ff8000";
    var slowest = "#ff0000";
    var unknown = "#585858";

    if (speed > 80) {
        return fastest;
    } else if (speed > 65) {
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
    if (w1["speed"] > 0 && w2["speed"] > 0) {
        return (w1["speed"] + w2["speed"]) / 2
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

    for (var j = 0; j + 1 < waypoints.length; j++) {
        var first = waypoints[j];
        var other_one = waypoints[j + 1];

        var path = new google.maps.Polyline({
            path: [first, other_one],
            icons: [{
                icon: lineSymbol,
                offset: '100%',
                repeat: '80px'
            }],
            geodesic: true,
            strokeColor: get_path_color(calculate_average_speed(first, other_one)),
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