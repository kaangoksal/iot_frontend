// server = "http://kaangoksal.com:5001";
server = "http://192.168.122.113:5001";

function sendloginReq() {
    console.log("will send soon");
    var base64encoded = "Basic" + " " + btoa(document.getElementsByName('email')[0].value + ":" + document.getElementsByName('password')[0].value);
    // var base64encoded = "Basic" + " " + btoa("kaangoksal@gmail.com" + ":" + "pass-kaan");
    var data = JSON.stringify(false);
    var xhttp = new XMLHttpRequest();
    // xhttp.withCredentials = true;
    // xhttp.cookieEnabled = true;
    // xhttp.crossOrigin = true;

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(" Response : " + xhttp.responseText);
            var jsonfile = JSON.parse(xhttp.responseText);
            if (jsonfile["code"] == 31) {
                alert("Login Failed " + jsonfile["message"]);
            }
            else {
                localStorage.setItem("email", document.getElementsByName('email')[0].value);
                localStorage.setItem("username", jsonfile['username']);
                localStorage.setItem("account_type", jsonfile['account_type']);
                if (localStorage.getItem("account_type") == "admin") {
                    window.location.replace("dashboard.html");
                } else if (localStorage.getItem("account_type") == "user") {
                    window.location.replace("dashboard.html");
                } else {
                    window.location.replace("dashboard.html");
                }
            }
        }
    };
    xhttp.open("POST", server + "/login", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", base64encoded);



    xhttp.send(data);
    console.log("Sent Request");
}