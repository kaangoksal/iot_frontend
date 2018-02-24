server = "http://kaangoksal.com:5001";

//server = "http://192.168.122.113:5001";

devices = {};


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

fill_devices_list();

if (Object.keys(devices).length > 0) { // it means we actually kinda have a device to choose!
    console.log("We have elements to choose from");
    var first_key = Object.keys(devices)[0];
    device_select(first_key);
} else {
    //hide all the widgeetss
}



function fill_devices_list() {
    //var authorization = "Basic" + " " + btoa("user-8252ce9c-5960-48a2-aecc-c17212240ffd" + ":" + "pass-kaan");
    var data = JSON.stringify(false);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(" Response : " + xhttp.responseText);
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

        }
    };
    xhttp.open("POST", server + "/api/get_user_devices", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    //xhttp.setRequestHeader("Authorization", authorization);
    xhttp.send(data);
    console.log("Sent get_user_devices Request");

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
        console.log(device_type);
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
    var row_battery = document.createElement("div");
    row_battery.className = "row";

    info_col.appendChild(row_battery);

    // battery status

    var p_battery = document.createElement("p");
    p_battery.align = "left";

    row_battery.appendChild(p_battery);

    var glyphicon_battery = document.createElement("span");
    glyphicon_battery.className = "glyphicon glyphicon-flash glyphicon-device-status";
    p_battery.appendChild(glyphicon_battery);

    p_battery.textContent = "8 hours of battery available";

    //=============row in info col===============
    var row_status = document.createElement("div");
    row_status.className = "row";

    info_col.appendChild(row_status);

    // system status

    var p_status = document.createElement("p");
    p_status.align = "left";

    row_status.appendChild(p_status);

    var glyphicon_status = document.createElement("span");
    glyphicon_status.className = "glyphicon glyphicon-ok-sign glyphicon-device-status";
    p_status.appendChild(glyphicon_status);

    p_status.textContent = "Last ping: " + device_last_ping;


}

function device_select(device_id) {
    //this method is called by the cards, there is an embedded javascript function in every card that calls this
    //function with their device id.
    console.log("Device selected ", device_id);
    change_color_of_device_card(device_id);
    display_device_details(device_id);

    //current selected device vs previously selected device!

}

function change_color_of_device_card(device_id) {

    if (typeof current_selected_device === 'undefined') {
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

function display_device_details(device) {
    console.log(current_selected_device);
    var location_well = document.getElementById('device_location_well');
    var device_battery_well = document.getElementById('device_battery_well');
    var plug_state_well = document.getElementById('plug_state_well');

    var device_type = devices[current_selected_device]["type"];
    console.log("Currently selected device type ", device_type);


    if (device_type == "plug") {

        location_well.style.display = "none";
        device_battery_well.style.display = "none";
        plug_state_well.style.display = "block";

    } else if (device_type == "gps tracker") {

        location_well.style.display = "block";
        device_battery_well.style.display = "block";
        plug_state_well.style.display = "none";
    }

}




function initMap() {
    console.log("Google Maps Initialized");
    var uluru = {lat: -25.363, lng: 131.044};
    map = new google.maps.Map(document.getElementById('map'), {zoom: 4, center: uluru});
    //var marker = new google.maps.Marker({position: uluru, map: map});

}

function change_map(lat, long) {
    //var myLatlng = new google.maps.LatLng(41.057537, 28.696123);
    var myLatlng = new google.maps.LatLng(lat, long);
    var mapOptions = {
        zoom: 4,
        center: myLatlng
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var marker = new google.maps.Marker({
        position: myLatlng,
        title: "Hello World!"
    });

    // To add the marker to the map, call setMap();
    marker.setMap(map);


    // console.log("I also got called, will change the map");
    // initMap();
    // var uluru = {lat: 41.057537, lng: 28.696123};
    // var marker = new google.maps.Marker({position: uluru, map: map});
    // // initMap();

}

function add_path(waypoints) {
    // var flightPlanCoordinates = [
    //     {lat: 37.772, lng: -122.214},
    //     {lat: 21.291, lng: -157.821},
    //     {lat: -18.142, lng: 178.431},
    //     {lat: -27.467, lng: 153.027}
    // ];
    var path = new google.maps.Polyline({
        path: waypoints,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    path.setMap(map);

}

function map_get_button() {
    update_location_trail(current_selected_device);
}


function update_location_trail(device_id) {

    var trail_start_date_picker = document.getElementById("trail-start-date");
    var trail_end_date_picker = document.getElementById("trail-end-date");

    var start_date = trail_start_date_picker.value;
    var end_date = trail_end_date_picker.value;


    var data = JSON.stringify(
        {
            "start_date": start_date,
            "end_date": end_date,
            "device_id": device_id
        });

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(" Response : " + xhttp.responseText);
            var json_response = JSON.parse(xhttp.responseText);
            var trail = json_response["positions"];

            add_path(trail);
            var lat_sum = 0;
            var lng_sum = 0;
            for (var i =0; i<trail.length;i++){
                lng_sum += trail[i]["lng"];
                lat_sum += trail[i]["lat"];
            }

            var lat_av = lat_sum/trail.length;
            var lng_av = lng_sum/trail.length;

            change_map(lat_av,lng_av);
        }
    };
    xhttp.open("POST", server + "/api/get_gps_trail", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(data);
    console.log("Sent get_gps_trail Request");

}