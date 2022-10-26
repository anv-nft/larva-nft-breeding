function secondToTime(seconds) {
    let hour = parseInt(seconds/3600);
    let min = parseInt((seconds%3600)/60);
    let sec = seconds%60;
    if (hour.toString().length==1) hour = "0" + hour;
    if (min.toString().length==1) min = "0" + min;
    if (sec.toString().length==1) sec = "0" + sec;
    return hour + ":" + min + ":" + sec;
}

module.exports = {
    secondToTime
}
