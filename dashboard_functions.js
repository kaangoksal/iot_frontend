function create_device_card(devices_panel_root, device) {

    var device_name = device["device_name"];

    var device_last_ping = device["last_ping"];

    var device_type = device["type"];

    var device_id = device["device_id"];

    var new_device_panel = document.createElement("div");
    new_device_panel.className = "panel panel-default";
    new_device_panel.id = device_id;

    // With this function we can know which device is selected!
    new_device_panel.onclick = function() {device_select(device_id);};

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

    device_image.className = "img-circle";
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

function device_select(device_id)
{
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
 if (device == "device1"){

     console.log("blocked");
     x.style.display = "block";
 } else if (device == "device2") {

     console.log("allowed");
     x.style.display = "none";
 }

}