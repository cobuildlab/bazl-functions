const admin = require('firebase-admin');
const cors = require('cors')({
    origin: true,
  })
const moment = require('moment')
const db = admin.firestore()

const pushNotification = (req, res) => {
    res.header('Content-Type','application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    return cors(req, res, () => {
      const typeNotification = req.body.typeNoti
      const idPost = req.body.idpost
      const comment = req.body.comment
      const idUserEntry =  req.body.iduserentry
      const username = req.body.username
      const emailUser = req.body.email
      let msj = ''
      let dataNoti = {}
      if ( typeNotification === 'noti_like' ) {
        dataNoti = {
          username,
          idPost,
          idUserEntry,
          type: typeNotification,
          createdAt: moment().valueOf(),
          createDate: new Date()
        }
        msj = `${username} liked your photo`
      }
      if ( typeNotification === 'noti_sales' ) {
        dataNoti = {
          username,
          idUserEntry,
          type: typeNotification,
          createdAt: moment().valueOf(),
          createDate: new Date()
        }
        msj = `${username} has purchased an product`
      }
      if ( typeNotification === 'noti_follow' ) {
        dataNoti = {
          username,
          idUserEntry,
          type: typeNotification,
          createdAt: moment().valueOf(),
          createDate: new Date()
        }
        msj = `The user ${username} has followed you `
      }
      if ( typeNotification === 'noti_comment' ) {
        dataNoti = {
          username,
          comment,
          idUserEntry,
          type: typeNotification,
          createdAt: moment().valueOf(),
          createDate: new Date()
        }
        msj = `The user ${username} commented on your photo`
      }
  
      let payload = {
        notification: {
        title: 'Bazl Mobile',
        body: msj,
      }
      }
  
      db
      .collection('notifications')
      .doc(emailUser)
      .collection("message")
      .doc()
      .set(dataNoti)
      .then( (res)=>{
        console.log('NOTIFICACION GUARDADA')
        res.send({
          success: true,
          message: 'notificacion guardada exitosamiente'
        })
        return res
      })
      .catch(error => {
        console.log('Error writing document: ', error);
      });
      
    return db
        .collection('users')
        .doc(emailUser)
        .get()
        .then(doc => {
          // console.log('doccc' , doc)
          let pushToken = doc.data().FCMToken;
          // console.log('TOKEN TRAIDO ', pushToken)
          // enviar push
          return admin.messaging().sendToDevice(pushToken, payload)
          .then((response) => {
            // console.log('Push notification success', response );
            res.send({
              success: true,
              message: 'push enviado exitosamiente'
            })
            return response
          }).catch((err) => {
            console.log('Errorrr al enviar push ', err);
            res.send({
              success: false,
              message: 'error al enviar push'
            })
          })
        });
    
  })
  }

module.exports = {pushNotification};