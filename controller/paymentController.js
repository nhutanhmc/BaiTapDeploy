const Payment = require("../model/paymentModel");
const axios = require('axios');
const crypto = require('crypto');
const vnpayConfig = require('../config/vnpayConfig');
const querystring = require('querystring');

class paymentController {
 async getPaymentList_Api(req, res, next) {
    try {
      // console.log("kiet")
      return new Promise((resolve, reject) => {
        Payment.find({}).then((payment) => {
          if (Payment.length > 0) {
            return resolve(res.status(200).json(payment));
          } else {
            return resolve(res.status(200).json("Không có Payment nào!"));   
          }
        });
      }).catch((err) => {
        return res
          .status(err.status || 500)
          .json(err.message || "Lỗi chưa xác định!");
      });
    } catch (err) {
      return res
        .status(err.status || 500)
        .json(err.message || "Lỗi chưa xác định!");
    }
  }
    async getPaymentById_Api(req, res, next) {
    try {
      Payment.findById({ _id: req.params.id })
        .then((payment) => {
          if (payment) {
            return res.status(200).json(payment);
          } else {
            return res.json("Payment không tồn tại!");
          }
        })
        .catch((err) => {
          return res
            .status(err.status || 500)
            .json(err.message || "Lỗi chưa xác định!");
        });
    } catch (err) {
      return res
        .status(err.status || 500)
        .json(err.message || "Lỗi chưa xác định!");
    }
  }
  async createPaymentById_Api(req, res) {
    try{
        let ipAddr = req.header['x-forwarded-for'] ||
                     req.connection.remoteAddress ||
                     req.socket.remoteAddress ||
                     (req.connection.socket ? req.connection.socket.remoteAddress : null);
        let tmCode = vnpayConfig.vnp_TmCode;
        let secretKey = vnpayConfig.vnp_HashSecret;
        let vnpUrl = vnpayConfig.vnp_Url;
        let returnUrl = vnpayConfig.vnp_ReturnUrl;

        let orderInfo = req.body.orderInfo || 'Thanh toan don hang';
        let orderType = req.body.orderType || 'other';
        let amount = req.body.amount;
        let locale = req.body.language || 'vn';
        let currCode = 'VND';
        let vnp_Params = {
            'vnp_Version': '2.1.0',
            'vnp_Command': 'pay',
            'vnp_TmnCode': tmnCode,
            'vnp_Locale': locale,
            'vnp_CurrCode': currCode,
            'vnp_TxnRef': orderId,
            'vnp_OrderInfo': orderInfo,
            'vnp_OrderType': orderType,
            'vnp_Amount': amount * 100, // Amount in VND
            'vnp_ReturnUrl': returnUrl,
            'vnp_IpAddr': ipAddr,
            'vnp_CreateDate': createDate,
            'vnp_BankCode': req.body.bankCode
      };
    
    vnp_Params = sortObject(vnp_Params);
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    res.status(200).json({ vnpUrl: vnpUrl });
        
    }catch (err) {
        res.status(500).json({ message: err.message || 'Internal Server Error' });
    } 
  }

  async queryPaymentResult_Api(req, res) {
    try {
      let vnp_Params = {
        'vnp_Version': '2.1.0',
        'vnp_Command': 'querydr',
        'vnp_TmnCode': vnpayConfig.vnp_TmnCode,
        'vnp_TxnRef': req.body.orderId,
        'vnp_OrderInfo': req.body.orderInfo,
        'vnp_TransactionDate': req.body.transactionDate,
        'vnp_IpAddr': req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        'vnp_CreateDate': new Date().toISOString().slice(0, 19).replace(/-/g, '').replace(/:/g, '').replace('T', '')
      };

      vnp_Params = sortObject(vnp_Params);
      let signData = querystring.stringify(vnp_Params, { encode: false });
      let hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
      let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
      vnp_Params['vnp_SecureHash'] = signed;

      let queryUrl = vnpayConfig.vnp_Url + '?' + querystring.stringify(vnp_Params, { encode: false });

      const response = await axios.get(queryUrl);
      let vnp_ResponseCode = response.data.vnp_ResponseCode;

      if (vnp_ResponseCode === '00') {
        // Payment successful
        return res.status(200).json({ message: 'Payment success', data: response.data });
      } else {
        // Payment failed or not found
        return res.status(400).json({ message: 'Payment failed', data: response.data });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message || 'Internal Server Error' });
    }
  }
}

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
  }
  


module.exports = new paymentController();
