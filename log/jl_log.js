const  JL = require("./ilog");
const colors = require("colors");
let JLOG;

(function (JLOG) {

    function MYLOG() {
    }

    let proto = MYLOG.prototype;

    proto._DoLog = function (level, msg) {

        // todo step1. 写到console上
        // todo step2. 如果是服务器，可以写到文件中去
        // todo step3. 如果是前端，可以通过http POST 到后台去，注意要选择性的投递（比如只投递error的信息，或者后台可以控制POST的信息）
        // todo step4. 服务器也可以选择用http POST 到后台去，因为有时候我们无法访问到服务器的主机，只能访问后台页面
        switch (level) {
            case JL.ILog.DEBUG:
                this._debug(msg);
                break;
            case JL.ILog.INFO:
                this._info(msg);
                break;
            case JL.ILog.WARN:
                this._warn(msg);
                break;
            case JL.ILog.ERROR:
                this._error(msg);
                break;
            default:
                this.info(msg);
                console.log("unknown level: " + level);
                break;
        }
    };

    proto.Debug = function (msg) {
        this._DoLog(JL.ILog.DEBUG, msg);
    };
    proto.Error = function (msg) {
        this._DoLog(JL.ILog.ERROR, msg);
    };
    proto.Info = function (msg) {
        this._DoLog(JL.ILog.INFO, msg);
    };
    proto.Warn = function (msg) {
        this._DoLog(JL.ILog.WARN, msg);
    };

    proto._debug = function(msg) {
        console.log(msg["magenta"]);
    };
    proto._info = function(msg) {
        console.log(msg["yellow"]);
    };
    proto._error  = function(msg) {
        console.log(msg["red"]);
    };
    proto._warn = function(msg) {
        console.log(msg["magenta"]);

    };

    JLOG.LOG  = new MYLOG();
})(JLOG || (JLOG = {}));

module.exports = JLOG.LOG;