let ERROR_CODE = {
    SUCCESS:0,//成功
    CMD_ERROR:-1,//命令不存在
    PLAYER_DOES_NOT_EXIST:-2,//玩家不存在
    PASSWORD_TOO_LONG:-3,//密码太长，不应超过12个字符
    TOKEN_ERROR:-4,//token错误
    USERNAME_OR_PASSWORD_INCORRECT:-5,//用户名或密码错误


};
module.exports = ERROR_CODE;