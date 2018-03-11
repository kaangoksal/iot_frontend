
function convert_to_UTC(date_in_other_timezone, minute_offset_from_UTC) {
    var offset_date = moment(date_in_other_timezone).subtract(minute_offset_from_UTC, 'minutes');
    offset_date = offset_date["_d"];
    return offset_date
}

function convert_from_UTC(date_in_UTC, minute_offset_from_UTC) {
    var offset_date = moment(date_in_UTC).add(minute_offset_from_UTC, 'minutes');
    offset_date = offset_date["_d"];
    return offset_date
}

function local_time_to_UTC(date_in_not_UTC) {
    var offset_minutes = new Date().getTimezoneOffset() * -1;
    return convert_to_UTC(date_in_not_UTC, offset_minutes)
}

function UTC_to_local_time(date_in_UTC) {
    var offset_minutes = new Date().getTimezoneOffset() * -1;
    return convert_from_UTC(date_in_UTC, offset_minutes)
}

function combine_date_string_time_string(date_string, time_string) {

    var hour = parseInt(time_string.slice(0,2));
    var minute =  parseInt(time_string.slice(3,5));
    var second = parseInt(time_string.slice(6,8));

    var year = parseInt(date_string.slice(0,4));
    var month = parseInt(date_string.slice(5,7));
    var day = parseInt(date_string.slice(8,10));

    return new Date(year,month,day,hour,minute,second,0);



}