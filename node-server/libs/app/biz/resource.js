const Resource = require('../../models/entities/program');

module.exports.search = {
  method: 'get',
  middlewares: [
    (req, res, next) => {
      Resource.find((err, r)=>{
        if (err) {
          next(err);
        } else {
          res.$locals.writeData({
            resources: r
          });
          next();
        }
      })
    },
  ]
};

module.exports.add = {
  method: 'post',
  middlewares: [
    (req, res, next) => {
      const {title, description} = req.body
      //TODO added by
      const resource = new Resource({
        title,
        description,
      });
      req.$injection.resource = resource;
      resource.save(next)
    },
    (req, res, next) => {
      const resource = req.$injection.resource
      res.$locals.writeData({resource})
      next()
    }
  ]
};