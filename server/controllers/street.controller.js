const Street = require('../models/street.model');
const config = require('../config/config');

module.exports = {

  findStreetsLike: function(req, res){
    let search = req.query.search;
    let regex = '/^' + search + '/';

    console.log(search);

    // Street.find({name: regex})
    Street.find({name: {'$regex': search, $options: 'i'}})
          .limit(config.nStreetsSearch)
          .exec(function(err, streets){
             if(err){
               res.send({success: false, streets: []});
             }
             if(!streets){
               res.send({success: true, streets: []});
             }
             else if(streets){
               res.send({success: true, streets: streets});
             }
          })
  },


}
