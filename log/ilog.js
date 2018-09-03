let JL;


(function (jl) {

    function ILog() {
    }

    ILog.DEBUG = 0;
    ILog.INFO = 1;
    ILog.WARN = 2;
    ILog.ERROR = 3;
    //...

    let proto = ILog.prototype;

    proto._DoLog = function (level, msg) {

        // todo step1. 写到console上
        // todo step2. 如果是服务器，可以写到文件中去
        // todo step3. 如果是前端，可以通过http POST 到后台去，注意要选择性的投递（比如只投递error的信息，或者后台可以控制POST的信息）
        // todo step4. 服务器也可以选择用http POST 到后台去，因为有时候我们无法访问到服务器的主机，只能访问后台页面
        switch (level) {
            case ILog.DEBUG:
                break;
            case ILog.INFO:
                break;
            case ILog.WARN:
                break;
            case ILog.ERROR:
                break;
            default:
                console.log("unknow level: " + level);
                break;
        }
    };
    proto.Debug = function (msg) {
        this._DoLog(ILog.DEBUG, msg);
    };
    proto.Error = function (msg) {
        this._DoLog(ILog.ERROR, msg);
    };
    proto.Info = function (msg) {
        this._DoLog(ILog.INFO, msg);
    };
    proto.Warn = function (msg) {
        this._DoLog(ILog.WARN, msg);
    };

    JL.ILog = ILog;

    // 写一个LOG继承自该接口。

    //var MyLog = jl.ILog.extend({
    // implement all methods
    //});

})(JL || (JL = {}));
module.exports = JL;