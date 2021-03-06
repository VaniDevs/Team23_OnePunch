const applyList = require('../../models/relationship/apply_list');
const Program = require('../../models/entities/program');
const emailHelper = require('../../utility/emailHelper');
const mongoose = require('mongoose');

module.exports.registerProgram = {
  method: 'post',
  middlewares: [
    (req, res, next) => {
      if (!req.$injection.user) {
        next(new Error('User not logined'));
        return;
      }
      // if (req.$injection.user.type === 2) {
      //   next(new Error('Permission Deny'));
      //   return;
      // }
      next();
    },
    (req, res, next) => {
      const {programId} = req.body;
      applyList.findOne({
        programRef: mongoose.Types.ObjectId(programId),
        userRef: req.$injection.user._id,
      }, function (err, a) {
        if (a) {
          next(new Error('Already apply'));
        } else {
          next();
        }
      });
    },
    (req, res, next) => {
      const {programId} = req.body;
      const a = new applyList({
        programRef:mongoose.Types.ObjectId(programId),
        userRef: req.$injection.user._id,
        result: 0,
        type: req.$injection.user.type
      });
      a.save((err) => {
        if (err) {
          next(err);
        } else {
          res.$locals.writeData({
            apply_list: a
          });
          next();
        }
      })


      Program.findOne({
        _id:a.programRef
      }).populate('orgRef').exec((err, p) =>{
        if ((!err) && p) {
          if (p.orgRef){
            const o = p.orgRef;
            emailHelper.sendOrganizationNotification([{
              mails: o.email,
              name: o.name || o.username,
              programName: `<a href=http://localhost:3000/#/program/detail/${p._id}>${p.name}</a>`
            }]);
          }
        }
      });
    },
  ]
}

module.exports.checkRelation = {
  method: 'post',
  middlewares: [
    (req, res, next) => {
      if (!req.$injection.user) {
        next(new Error('User not logined'));
        return;
      }
      next();
    },
    (req, res, next) => {
      const {programId, userId} = req.body;
      applyList.findOne({
        programRef: mongoose.Types.ObjectId(programId),
        userRef: userId ? mongoose.Types.ObjectId(userId) : req.$injection.user._id,
      }, function (err, a) {
        if (err) {
          next(err);
        } else {
          res.$locals.writeData({
            apply_list: a
          });
          next();
        }
      });
    },
  ]
};

module.exports.updateResult = {
  method: 'post',
  middlewares: [
    (req, res, next) => {
      if (!req.$injection.user) {
        next(new Error('User not logined'));
        return;
      }
      // TODO verify organization
      next();
    },
    (req, res, next) => {
      const {applyListId} = req.body;
      applyList.findOne({
        _id: mongoose.Types.ObjectId(applyListId),
      }).exec(function (err, a) {
        if (err) {
          next(err);
        } else if (!a) {
          next(new Error('not found'));
        } else {
          req.$injection.a = a;
          next();
        }
      });
    },
    (req, res, next) => {
      const {a} = req.$injection;
      const {result} = req.body;
      a.result = result;
      a.save(function (err) {
        if (err) {
          next(err);
        } else {
          res.$locals.writeData({
            apply_list: a
          });
          next();
        }
      });

    }
  ]
};

module.exports.queryUserList = {
  method: 'post',
  middlewares: [
    (req, res, next) => {
      if (!req.$injection.user) {
        next(new Error('User not logined'));
        return;
      }
      // TODO verify organization
      next();
    },
    (req, res, next) => {
      const {programId, userId} = req.body;
      const query = {};
      if (programId) {
        query.programRef =mongoose.Types.ObjectId(programId);
      }
      if (userId){
        query.userRef =mongoose.Types.ObjectId(userId);
      }
      applyList.find(query).populate('userRef').populate('programRef').exec((err, lists) => {
        if (err) {
          next(err);
        } else {
          res.$locals.writeData({
            apply_lists: lists
          });
          next();
        }
      })
    }
  ]
};