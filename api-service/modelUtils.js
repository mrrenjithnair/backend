'use strict'

const crypto = require('crypto');
const isString = require('lodash/isString');
const isEmpty = require('lodash/isEmpty');
const isNil = require('lodash/isNil');
const isNumber = require('lodash/isNumber');
// const coreModelSystemConfig = require('nww-core-models/modelConfig.js').getSystemConfig();
const moment = require('moment-timezone')
const securityConfig = require('./config.js').getSecurityConfig();
const systemConfig = require('./config.js').getSystemConfig();

const modelUtils = new function() {
    this.isEmptyObject = (obj) => {
        if (isNil(obj) || isEmpty(obj))
            return true;

        return !Object.keys(obj).length;
    }

    this.replaceSpecialCharacters = (str) => {
        str = str.replace(/[^\x20-\x7E]/g, '')
        return str.replace(/[@]/g, ' ') //don't allow these special characters.
    }

    this.parseToIntegerArray = (stringArray) => {
        return stringArray.split(',').map(function (item) {
            return parseInt(item, 10);
        });
    }

    this.parseToStringArray = (stringArray) => {
        return stringArray.split(',').map(function (item) {
            return item;
        });
    }

    this.restifyModel = (model) => {
        delete model.entry_by;
        delete model.updated_by;
        delete model.entry_dt;
        delete model.updated_dt;
        delete model.lastupdated_dt;
        delete model.deletedAt;
    }

    this.copyProperties = (source, target) => {
        for (var k in source) target[k] = source[k];
    }

    this.trimAllProperties = (source) => {
        for (var k in source) {
            if (isString(source[k])) {
                source[k] = source[k].trim();
            }
        }
    }

    this.encrypt = (txt, key = coreModelSystemConfig.db.blobEncryptionKey) => {
      	var encryptedStr = null;
        //let key = coreModelSystemConfig.db.blobEncryptionKey;
        var str = (txt && txt!=undefined)? txt.toLowerCase() : null

      	if (str) {
        		var arr = []
            var l = key.toString().length
            for(var i = 0; i < str.length; i++) {
        			   arr.push(str.charCodeAt(i) + key.toString().charCodeAt(i % l))
        		}
        		var newArr = []
        		for(var i = 0; i < arr.length; i++) {
        			   newArr.push(String.fromCharCode(arr[i]))
        		}
        		encryptedStr = newArr.join('')
      	}
      	return encryptedStr
    }

    this.sequalizeEncrypt = (txt, key = coreModelSystemConfig.db.blobEncryptionKey) => {
    	let _algorithm = 'aes-256-cbc';
    	let _iv_length = 16;
    	key = new Buffer(key, 'hex');
    	var str = (txt && txt!=undefined)? txt.toLowerCase() : null
    	var new_iv = crypto.randomBytes(_iv_length);
  		var cipher = crypto.createCipheriv(_algorithm, key, new_iv);

    	cipher.end(JSON.stringify(txt), 'utf-8');
    	return Buffer.concat([new_iv, cipher.read()]);
    }

    this.decryptBlob = (value, key = coreModelSystemConfig.db.blobEncryptionKey) => {
        if (isEmpty(value))
            return null;
        let _algorithm = 'aes-256-cbc';
        let _iv_length = 16;
        //let key = coreModelSystemConfig.db.blobEncryptionKey;
        key = new Buffer(key, 'hex');
        var previous = new Buffer(value, 'binary');
        if (!previous) {
            return {};
        }

        previous = new Buffer(previous);
        var iv = previous.slice(0, _iv_length);
        var content = previous.slice(_iv_length, previous.length);
        var decipher = crypto.createDecipheriv(_algorithm, key, iv);
        var json = decipher.update(content, undefined, 'utf8') + decipher.final('utf8');
        return JSON.parse(json);
    }

    this.uiDecrypt = (str, key = coreModelSystemConfig.db.blobEncryptionKey) => {
    	var decryptedStr = null;

    	if (str && key) {
    		var arr = []
    		var l = key.length
    		for(var i = 0; i < str.length; i++) {
    			arr.push(str.charCodeAt(i) - key.charCodeAt(i % l))
    		}
    		var newArr = []
    		for(var i = 0; i < arr.length; i++) {
    			newArr.push(String.fromCharCode(arr[i]))
    		}
    		decryptedStr = capitalizeFirstLetter(newArr.join(''))
    	}
    	return decryptedStr
    }

    function capitalizeFirstLetter(str) {
    		if (str) {
    			return str.replace(/\b\w/g,
    				function(txt) {
    					return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    				}
    			);
    		}
    		else {
    			return str
    		}
    }

    this.isPaginationInputEmpty = (pageNumber, pageSize) => {
        if (isNumber(pageNumber) && isNumber(pageSize)) {
            return pageNumber <= 0 || pageSize <= 0;
        }
        return true;
    }

    this.getMultiChannelMessage = (message, email = false) => {
        if (Array.isArray(message)) {
            if (email) {
                return parseEmailMessage(message);
            } else {
                return parseNotificationMessage(message);
            }
        } else {
            return message
        }
    }

    function parseEmailMessage(message) {
        let messageHTML = '';
        if (message && message.length > 0) {
            for (let i = 0; i < message.length; i++) {
                let messageText = message[i].message;
                let messageStyle = ''
                if (message[i].style) {
                    messageStyle = message[i].style;
                }
                messageHTML += '<p style="' + messageStyle + '">' + messageText + '</p>';
            }
        }
        return messageHTML
    }

    function parseNotificationMessage(message) {
        let messageText = '';
        if (message && message.length > 0) {
            for (let i = 0; i < message.length; i++) {
                messageText += message[i].message + " \n ";
            }
        }
        return messageText
    }

    this.getUTCTime = (date = false, timezoneOffset = null) => {
        let dateObj = date ? new Date(date) : new Date()
        return dateObj.valueOf() - (timezoneOffset != null? timezoneOffset : dateObj.getTimezoneOffset()) * 60000
    }

    this.getTimezoneOffset = (timezone = false) => {
        let time = this.getUTCTime()
        return moment.tz.zone(timezone).utcOffset(time)
    }

    this.getUTCStartDate = (value) => {
        var date = new Date(value).getUTCDate()
        var month = new Date(value).getUTCMonth()+1
        var year = new Date(value).getUTCFullYear()
        var dateFormat = month + "/" + date + "/" + year
        return dateFormat
    }

    this.getEmailTemplate = (logo = false) => {
      let logoURL = 'http://assets-digivalet.s3.amazonaws.com/logo.png'
      if (logo == 'yesDoctor') {
          logoURL = 'https://assets-digivalet.s3.amazonaws.com/logo.png'
      }
      let emailTemplate = `<html>
           <body>
             <table>
               <tbody style="width:750px;">
                 <tr><th style='width:750px;padding:30'> <img src="${logoURL}" alt="logo" width="200" ></th></tr>
                 <tr>
                   <td style="padding: 30px; text-align: left;">{emailMessage}</td>
                 </tr>
                 <tr><td style="padding: 30px; font-weight: 500; text-align: left;"></td></tr>
               </tbody>
             </table>
           </body>
           </html>`
      return emailTemplate;
    }

    this.minsToTime = (mins) => {
        var hours = (mins / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        return (rhours ? rhours + " hour(s)" : '') + (rhours && rminutes ? " " :'') + (rminutes ? rminutes + " minute(s)" : '');
    }

    this.minsToHours = (mins) => {
        var hours = (mins / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);


        rminutes = rminutes<10? '0' + rminutes : rminutes

        return rhours + ":"+ rminutes
    }

    this.convertToTimeString = (dt, withSecs = false) => {
      if (!dt || dt == "") {
        return null;
      }
      let utc = true
      let withMins = true
      let noSlash = false

      var localDate = new Date(dt)
      var month = ((utc) ? localDate.getUTCMonth() : localDate.getMonth()) + 1
      var day = (utc) ? localDate.getUTCDate() : localDate.getDate()
      var localDateString = (month < 10? '0'+month : month) +
        (noSlash? '' : '/') + (day < 10? '0'+day : day) +
        (noSlash? '' : '/') + ((utc) ? localDate.getUTCFullYear() : localDate.getFullYear())
      var hh = (utc) ? localDate.getUTCHours() : localDate.getHours()
      var mm = (utc) ? localDate.getUTCMinutes() : localDate.getMinutes()
      var ss = (utc) ? localDate.getUTCSeconds() : localDate.getSeconds()
      mm = mm<10? '0' + mm : mm
      ss = ss<10? '0' + ss : ss

      if (withMins) {
        return (hh==0?
          (withSecs ?
            '12:' + mm + ':' + ss + ' AM'
          :
            '12:' + mm + ' AM'
          )
        :
          (hh==12?
            (withSecs ?
              hh + ':' + mm + ':' + ss + ' PM'
            :
              hh + ':' + mm + ' PM'
            )
          :
            (hh>12?
              (withSecs ?
                (hh-12)+':' + mm + ':' + ss + ' PM'
              :
                (hh-12)+':' + mm + ' PM'
              )
            :
              (withSecs ?
                hh + ':' + mm + ':' + ss + ' AM'
              :
                hh + ':' + mm + ' AM'
              )
            )
          )
        );
      }
    }

    this.convertToLocalTimeString = (dt, withTime = false, withMins = false, noSlash = false, utc = false, withSecs = false)  => {
        if (!dt || dt == "") {
            return null;
        }

        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localDate = new Date(dt) //calculates local time
      var month = ((utc) ? localDate.getUTCMonth() : localDate.getMonth()) + 1
      var day = (utc) ? localDate.getUTCDate() : localDate.getDate()
        var localDateString = (month < 10? '0'+month : month) +
            (noSlash? '' : '/') + (day < 10? '0'+day : day) +
            (noSlash? '' : '/') + ((utc) ? localDate.getUTCFullYear() : localDate.getFullYear())
        var hh = (utc) ? localDate.getUTCHours() : localDate.getHours()
      var mm = (utc) ? localDate.getUTCMinutes() : localDate.getMinutes()
      var ss = (utc) ? localDate.getUTCSeconds() : localDate.getSeconds()
      mm = mm<10? '0' + mm : mm
      ss = ss<10? '0' + ss : ss

        if (withMins) {
            return localDateString + ' ' +
        (hh==0?
          (withSecs ?
            '12:' + mm + ':' + ss + ' AM'
          :
            '12:' + mm + ' AM'
          )
            :
          (hh==12?
            (withSecs ?
              hh + ':' + mm + ':' + ss + ' PM'
            :
              hh + ':' + mm + ' PM'
            )
                :
            (hh>12?
              (withSecs ?
                (hh-12)+':' + mm + ':' + ss + ' PM'
              :
                (hh-12)+':' + mm + ' PM'
              )
            :
              (withSecs ?
                hh + ':' + mm + ':' + ss + ' AM'
              :
                hh + ':' + mm + ' AM'
              )
                    )
                )
            );
        }
        else if (withTime) {
            return localDateString + ' ' +
            (hh==0?
                '12 AM'
            :
                (hh==12?
                    '12 PM'
                :
                    (hh>12?
                        (hh-12)+' PM'
                    :
                        hh + ' AM'
                    )
                )
            );
        }
        else {
            return localDateString;
        }
    }

    /**
     * @param integer n: length of decimal
     * @param integer x: length of whole part
     * @param mixed   s: sections delimiter
     * @param mixed   c: decimal delimiter
     */
    this.formatCurrency = (amount, n=2, x=3, s=',', c='.')  =>  {
    if (amount === 0) return '$0.00'
        if (amount==null || amount==undefined || amount=='') return ''

        var negative = false
        var amt = amount
        if (amt < 0) {
            negative = true
            amt *= -1
        }
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')'
    var num = amt.toFixed(Math.max(0, ~~n));

    var res = '$' + (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));

        if (negative) {
            return '-' + res
        }
        else {
            return res
        }
    }

    this.getValueByKey = function(obj, key) {
        let value = this.getValueArrayByKey(obj, key)
        if (value && value.length > 0) {
            value = value[0]
        }
        return value
    }

    this.getValueArrayByKey = function(obj, key) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object' && !Array.isArray(obj[i])) {
                objects = objects.concat(this.getValueArrayByKey(obj[i], key));
            } else if (i == key) {
                objects.push(obj[i]);
            }
        }
        return objects;
    }

};

module.exports = modelUtils;
