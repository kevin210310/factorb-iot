var parser = require('ua-parser-js');

module.exports = {
    device(req, res, next) {
        var ua = parser(req.headers['user-agent']);
        var devices = ["Android", "iOS", "Linux"];

        for(var device = 0;device < devices.length; device++){
            if(ua.os.name == devices[device]){
                return res.render('error_device', {page: "dispositivo no permitido", device: ua});
            }
        }
        return next();
    }
};