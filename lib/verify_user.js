module.exports = {

    verify(req, res, next){

        if(req.isAuthenticated()){

            return next();
        }
        res.redirect('/login');
    },

    inverse_verify(req, res, next){
      
        if(!req.isAuthenticated()){
            
            return next();
        }
        res.redirect('/dashboard');
    }
};