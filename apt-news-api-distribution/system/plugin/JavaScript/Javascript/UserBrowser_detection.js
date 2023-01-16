(function(){var charSize=8,b64pad="",hexCase=0,Int_64=function(a,b){this.highOrder=a;this.lowOrder=b},str2binb=function(a){var b=[],mask=(1<<charSize)-1,length=a.length*charSize,i;for(i=0;i<length;i+=charSize){b[i>>5]|=(a.charCodeAt(i/charSize)&mask)<<(32-charSize-(i%32))}return b},hex2binb=function(a){var b=[],length=a.length,i,num;for(i=0;i<length;i+=2){num=parseInt(a.substr(i,2),16);if(!isNaN(num)){b[i>>3]|=num<<(24-(4*(i%8)))}else{return"INVALID HEX STRING"}}return b},binb2hex=function(a){var b=(hexCase)?"0123456789ABCDEF":"0123456789abcdef",str="",length=a.length*4,i,srcByte;for(i=0;i<length;i+=1){srcByte=a[i>>2]>>((3-(i%4))*8);str+=b.charAt((srcByte>>4)&0xF)+b.charAt(srcByte&0xF)}return str},binb2b64=function(a){var b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"+"0123456789+/",str="",length=a.length*4,i,j,triplet;for(i=0;i<length;i+=3){triplet=(((a[i>>2]>>8*(3-i%4))&0xFF)<<16)|(((a[i+1>>2]>>8*(3-(i+1)%4))&0xFF)<<8)|((a[i+2>>2]>>8*(3-(i+2)%4))&0xFF);for(j=0;j<4;j+=1){if(i*8+j*6<=a.length*32){str+=b.charAt((triplet>>6*(3-j))&0x3F)}else{str+=b64pad}}}return str},rotr=function(x,n){if(n<=32){return new Int_64((x.highOrder>>>n)|(x.lowOrder<<(32-n)),(x.lowOrder>>>n)|(x.highOrder<<(32-n)))}else{return new Int_64((x.lowOrder>>>n)|(x.highOrder<<(32-n)),(x.highOrder>>>n)|(x.lowOrder<<(32-n)))}},shr=function(x,n){if(n<=32){return new Int_64(x.highOrder>>>n,x.lowOrder>>>n|(x.highOrder<<(32-n)))}else{return new Int_64(0,x.highOrder<<(32-n))}},ch=function(x,y,z){return new Int_64((x.highOrder&y.highOrder)^(~x.highOrder&z.highOrder),(x.lowOrder&y.lowOrder)^(~x.lowOrder&z.lowOrder))},maj=function(x,y,z){return new Int_64((x.highOrder&y.highOrder)^(x.highOrder&z.highOrder)^(y.highOrder&z.highOrder),(x.lowOrder&y.lowOrder)^(x.lowOrder&z.lowOrder)^(y.lowOrder&z.lowOrder))},sigma0=function(x){var a=rotr(x,28),rotr34=rotr(x,34),rotr39=rotr(x,39);return new Int_64(a.highOrder^rotr34.highOrder^rotr39.highOrder,a.lowOrder^rotr34.lowOrder^rotr39.lowOrder)},sigma1=function(x){var a=rotr(x,14),rotr18=rotr(x,18),rotr41=rotr(x,41);return new Int_64(a.highOrder^rotr18.highOrder^rotr41.highOrder,a.lowOrder^rotr18.lowOrder^rotr41.lowOrder)},gamma0=function(x){var a=rotr(x,1),rotr8=rotr(x,8),shr7=shr(x,7);return new Int_64(a.highOrder^rotr8.highOrder^shr7.highOrder,a.lowOrder^rotr8.lowOrder^shr7.lowOrder)},gamma1=function(x){var a=rotr(x,19),rotr61=rotr(x,61),shr6=shr(x,6);return new Int_64(a.highOrder^rotr61.highOrder^shr6.highOrder,a.lowOrder^rotr61.lowOrder^shr6.lowOrder)},safeAdd_2=function(x,y){var a,msw,lowOrder,highOrder;a=(x.lowOrder&0xFFFF)+(y.lowOrder&0xFFFF);msw=(x.lowOrder>>>16)+(y.lowOrder>>>16)+(a>>>16);lowOrder=((msw&0xFFFF)<<16)|(a&0xFFFF);a=(x.highOrder&0xFFFF)+(y.highOrder&0xFFFF)+(msw>>>16);msw=(x.highOrder>>>16)+(y.highOrder>>>16)+(a>>>16);highOrder=((msw&0xFFFF)<<16)|(a&0xFFFF);return new Int_64(highOrder,lowOrder)},safeAdd_4=function(a,b,c,d){var e,msw,lowOrder,highOrder;e=(a.lowOrder&0xFFFF)+(b.lowOrder&0xFFFF)+(c.lowOrder&0xFFFF)+(d.lowOrder&0xFFFF);msw=(a.lowOrder>>>16)+(b.lowOrder>>>16)+(c.lowOrder>>>16)+(d.lowOrder>>>16)+(e>>>16);lowOrder=((msw&0xFFFF)<<16)|(e&0xFFFF);e=(a.highOrder&0xFFFF)+(b.highOrder&0xFFFF)+(c.highOrder&0xFFFF)+(d.highOrder&0xFFFF)+(msw>>>16);msw=(a.highOrder>>>16)+(b.highOrder>>>16)+(c.highOrder>>>16)+(d.highOrder>>>16)+(e>>>16);highOrder=((msw&0xFFFF)<<16)|(e&0xFFFF);return new Int_64(highOrder,lowOrder)},safeAdd_5=function(a,b,c,d,e){var f,msw,lowOrder,highOrder;f=(a.lowOrder&0xFFFF)+(b.lowOrder&0xFFFF)+(c.lowOrder&0xFFFF)+(d.lowOrder&0xFFFF)+(e.lowOrder&0xFFFF);msw=(a.lowOrder>>>16)+(b.lowOrder>>>16)+(c.lowOrder>>>16)+(d.lowOrder>>>16)+(e.lowOrder>>>16)+(f>>>16);lowOrder=((msw&0xFFFF)<<16)|(f&0xFFFF);f=(a.highOrder&0xFFFF)+(b.highOrder&0xFFFF)+(c.highOrder&0xFFFF)+(d.highOrder&0xFFFF)+(e.highOrder&0xFFFF)+(msw>>>16);msw=(a.highOrder>>>16)+(b.highOrder>>>16)+(c.highOrder>>>16)+(d.highOrder>>>16)+(e.highOrder>>>16)+(f>>>16);highOrder=((msw&0xFFFF)<<16)|(f&0xFFFF);return new Int_64(highOrder,lowOrder)},coreSHA2=function(j,k,l){var a,b,c,d,e,f,g,h,T1,T2,H,lengthPosition,i,t,K,W=[],appendedMessageLength;if(l==="SHA-384"||l==="SHA-512"){lengthPosition=(((k+128)>>10)<<5)+31;K=[new Int_64(0x428a2f98,0xd728ae22),new Int_64(0x71374491,0x23ef65cd),new Int_64(0xb5c0fbcf,0xec4d3b2f),new Int_64(0xe9b5dba5,0x8189dbbc),new Int_64(0x3956c25b,0xf348b538),new Int_64(0x59f111f1,0xb605d019),new Int_64(0x923f82a4,0xaf194f9b),new Int_64(0xab1c5ed5,0xda6d8118),new Int_64(0xd807aa98,0xa3030242),new Int_64(0x12835b01,0x45706fbe),new Int_64(0x243185be,0x4ee4b28c),new Int_64(0x550c7dc3,0xd5ffb4e2),new Int_64(0x72be5d74,0xf27b896f),new Int_64(0x80deb1fe,0x3b1696b1),new Int_64(0x9bdc06a7,0x25c71235),new Int_64(0xc19bf174,0xcf692694),new Int_64(0xe49b69c1,0x9ef14ad2),new Int_64(0xefbe4786,0x384f25e3),new Int_64(0x0fc19dc6,0x8b8cd5b5),new Int_64(0x240ca1cc,0x77ac9c65),new Int_64(0x2de92c6f,0x592b0275),new Int_64(0x4a7484aa,0x6ea6e483),new Int_64(0x5cb0a9dc,0xbd41fbd4),new Int_64(0x76f988da,0x831153b5),new Int_64(0x983e5152,0xee66dfab),new Int_64(0xa831c66d,0x2db43210),new Int_64(0xb00327c8,0x98fb213f),new Int_64(0xbf597fc7,0xbeef0ee4),new Int_64(0xc6e00bf3,0x3da88fc2),new Int_64(0xd5a79147,0x930aa725),new Int_64(0x06ca6351,0xe003826f),new Int_64(0x14292967,0x0a0e6e70),new Int_64(0x27b70a85,0x46d22ffc),new Int_64(0x2e1b2138,0x5c26c926),new Int_64(0x4d2c6dfc,0x5ac42aed),new Int_64(0x53380d13,0x9d95b3df),new Int_64(0x650a7354,0x8baf63de),new Int_64(0x766a0abb,0x3c77b2a8),new Int_64(0x81c2c92e,0x47edaee6),new Int_64(0x92722c85,0x1482353b),new Int_64(0xa2bfe8a1,0x4cf10364),new Int_64(0xa81a664b,0xbc423001),new Int_64(0xc24b8b70,0xd0f89791),new Int_64(0xc76c51a3,0x0654be30),new Int_64(0xd192e819,0xd6ef5218),new Int_64(0xd6990624,0x5565a910),new Int_64(0xf40e3585,0x5771202a),new Int_64(0x106aa070,0x32bbd1b8),new Int_64(0x19a4c116,0xb8d2d0c8),new Int_64(0x1e376c08,0x5141ab53),new Int_64(0x2748774c,0xdf8eeb99),new Int_64(0x34b0bcb5,0xe19b48a8),new Int_64(0x391c0cb3,0xc5c95a63),new Int_64(0x4ed8aa4a,0xe3418acb),new Int_64(0x5b9cca4f,0x7763e373),new Int_64(0x682e6ff3,0xd6b2b8a3),new Int_64(0x748f82ee,0x5defb2fc),new Int_64(0x78a5636f,0x43172f60),new Int_64(0x84c87814,0xa1f0ab72),new Int_64(0x8cc70208,0x1a6439ec),new Int_64(0x90befffa,0x23631e28),new Int_64(0xa4506ceb,0xde82bde9),new Int_64(0xbef9a3f7,0xb2c67915),new Int_64(0xc67178f2,0xe372532b),new Int_64(0xca273ece,0xea26619c),new Int_64(0xd186b8c7,0x21c0c207),new Int_64(0xeada7dd6,0xcde0eb1e),new Int_64(0xf57d4f7f,0xee6ed178),new Int_64(0x06f067aa,0x72176fba),new Int_64(0x0a637dc5,0xa2c898a6),new Int_64(0x113f9804,0xbef90dae),new Int_64(0x1b710b35,0x131c471b),new Int_64(0x28db77f5,0x23047d84),new Int_64(0x32caab7b,0x40c72493),new Int_64(0x3c9ebe0a,0x15c9bebc),new Int_64(0x431d67c4,0x9c100d4c),new Int_64(0x4cc5d4be,0xcb3e42b6),new Int_64(0x597f299c,0xfc657e2a),new Int_64(0x5fcb6fab,0x3ad6faec),new Int_64(0x6c44198c,0x4a475817)];if(l==="SHA-384"){H=[new Int_64(0xcbbb9d5d,0xc1059ed8),new Int_64(0x0629a292a,0x367cd507),new Int_64(0x9159015a,0x3070dd17),new Int_64(0x0152fecd8,0xf70e5939),new Int_64(0x67332667,0xffc00b31),new Int_64(0x98eb44a87,0x68581511),new Int_64(0xdb0c2e0d,0x64f98fa7),new Int_64(0x047b5481d,0xbefa4fa4)]}else{H=[new Int_64(0x6a09e667,0xf3bcc908),new Int_64(0xbb67ae85,0x84caa73b),new Int_64(0x3c6ef372,0xfe94f82b),new Int_64(0xa54ff53a,0x5f1d36f1),new Int_64(0x510e527f,0xade682d1),new Int_64(0x9b05688c,0x2b3e6c1f),new Int_64(0x1f83d9ab,0xfb41bd6b),new Int_64(0x5be0cd19,0x137e2179)]}}j[k>>5]|=0x80<<(24-k%32);j[lengthPosition]=k;appendedMessageLength=j.length;for(i=0;i<appendedMessageLength;i+=32){a=H[0];b=H[1];c=H[2];d=H[3];e=H[4];f=H[5];g=H[6];h=H[7];for(t=0;t<80;t+=1){if(t<16){W[t]=new Int_64(j[t*2+i],j[t*2+i+1])}else{W[t]=safeAdd_4(gamma1(W[t-2]),W[t-7],gamma0(W[t-15]),W[t-16])}T1=safeAdd_5(h,sigma1(e),ch(e,f,g),K[t],W[t]);T2=safeAdd_2(sigma0(a),maj(a,b,c));h=g;g=f;f=e;e=safeAdd_2(d,T1);d=c;c=b;b=a;a=safeAdd_2(T1,T2)}H[0]=safeAdd_2(a,H[0]);H[1]=safeAdd_2(b,H[1]);H[2]=safeAdd_2(c,H[2]);H[3]=safeAdd_2(d,H[3]);H[4]=safeAdd_2(e,H[4]);H[5]=safeAdd_2(f,H[5]);H[6]=safeAdd_2(g,H[6]);H[7]=safeAdd_2(h,H[7])}switch(l){case"SHA-384":return[H[0].highOrder,H[0].lowOrder,H[1].highOrder,H[1].lowOrder,H[2].highOrder,H[2].lowOrder,H[3].highOrder,H[3].lowOrder,H[4].highOrder,H[4].lowOrder,H[5].highOrder,H[5].lowOrder];case"SHA-512":return[H[0].highOrder,H[0].lowOrder,H[1].highOrder,H[1].lowOrder,H[2].highOrder,H[2].lowOrder,H[3].highOrder,H[3].lowOrder,H[4].highOrder,H[4].lowOrder,H[5].highOrder,H[5].lowOrder,H[6].highOrder,H[6].lowOrder,H[7].highOrder,H[7].lowOrder];default:return[]}},jsSHA=function(a,b){this.sha384=null;this.sha512=null;this.strBinLen=null;this.strToHash=null;if("HEX"===b){if(0!==(a.length%2)){return"TEXT MUST BE IN BYTE INCREMENTS"}this.strBinLen=a.length*4;this.strToHash=hex2binb(a)}else if(("ASCII"===b)||('undefined'===typeof(b))){this.strBinLen=a.length*charSize;this.strToHash=str2binb(a)}else{return"UNKNOWN TEXT INPUT TYPE"}};jsSHA.prototype={getHash:function(a,b){var c=null,message=this.strToHash.slice();switch(b){case"HEX":c=binb2hex;break;case"B64":c=binb2b64;break;default:return"FORMAT NOT RECOGNIZED"}switch(a){case"SHA-384":if(null===this.sha384){this.sha384=coreSHA2(message,this.strBinLen,a)}return c(this.sha384);case"SHA-512":if(null===this.sha512){this.sha512=coreSHA2(message,this.strBinLen,a)}return c(this.sha512);default:return"HASH NOT RECOGNIZED"}},getHMAC:function(a,b,c,d){var e,keyToUse,i,retVal,keyBinLen,hashBitSize,keyWithIPad=[],keyWithOPad=[];switch(d){case"HEX":e=binb2hex;break;case"B64":e=binb2b64;break;default:return"FORMAT NOT RECOGNIZED"}switch(c){case"SHA-384":hashBitSize=384;break;case"SHA-512":hashBitSize=512;break;default:return"HASH NOT RECOGNIZED"}if("HEX"===b){if(0!==(a.length%2)){return"KEY MUST BE IN BYTE INCREMENTS"}keyToUse=hex2binb(a);keyBinLen=a.length*4}else if("ASCII"===b){keyToUse=str2binb(a);keyBinLen=a.length*charSize}else{return"UNKNOWN KEY INPUT TYPE"}if(128<(keyBinLen/8)){keyToUse=coreSHA2(keyToUse,keyBinLen,c);keyToUse[31]&=0xFFFFFF00}else if(128>(keyBinLen/8)){keyToUse[31]&=0xFFFFFF00}for(i=0;i<=31;i+=1){keyWithIPad[i]=keyToUse[i]^0x36363636;keyWithOPad[i]=keyToUse[i]^0x5C5C5C5C}retVal=coreSHA2(keyWithIPad.concat(this.strToHash),1024+this.strBinLen,c);retVal=coreSHA2(keyWithOPad.concat(retVal),1024+hashBitSize,c);return(e(retVal))}};window.jsSHA=jsSHA}());

  !function(e){function t(){}function r(e,t){return function(){e.apply(t,arguments)}}function i(e){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],u(e,this)}function n(e,t){for(;3===e._state;)e=e._value;return 0===e._state?void e._deferreds.push(t):(e._handled=!0,void i._immediateFn(function(){var r=1===e._state?t.onFulfilled:t.onRejected;if(null===r)return void(1===e._state?a:o)(t.promise,e._value);var i;try{i=r(e._value)}catch(e){return void o(t.promise,e)}a(t.promise,i)}))}function a(e,t){try{if(t===e)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==typeof t||"function"==typeof t)){var n=t.then;if(t instanceof i)return e._state=3,e._value=t,void s(e);if("function"==typeof n)return void u(r(n,t),e)}e._state=1,e._value=t,s(e)}catch(t){o(e,t)}}function o(e,t){e._state=2,e._value=t,s(e)}function s(e){2===e._state&&0===e._deferreds.length&&i._immediateFn(function(){e._handled||i._unhandledRejectionFn(e._value)});for(var t=0,r=e._deferreds.length;t<r;t++)n(e,e._deferreds[t]);e._deferreds=null}function c(e,t,r){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=r}function u(e,t){var r=!1;try{e(function(e){r||(r=!0,a(t,e))},function(e){r||(r=!0,o(t,e))})}catch(e){if(r)return;r=!0,o(t,e)}}var h=setTimeout;i.prototype.catch=function(e){return this.then(null,e)},i.prototype.then=function(e,r){var i=new this.constructor(t);return n(this,new c(e,r,i)),i},i.all=function(e){var t=Array.prototype.slice.call(e);return new i(function(e,r){function i(a,o){try{if(o&&("object"==typeof o||"function"==typeof o)){var s=o.then;if("function"==typeof s)return void s.call(o,function(e){i(a,e)},r)}t[a]=o,0===--n&&e(t)}catch(e){r(e)}}if(0===t.length)return e([]);for(var n=t.length,a=0;a<t.length;a++)i(a,t[a])})},i.resolve=function(e){return e&&"object"==typeof e&&e.constructor===i?e:new i(function(t){t(e)})},i.reject=function(e){return new i(function(t,r){r(e)})},i.race=function(e){return new i(function(t,r){for(var i=0,n=e.length;i<n;i++)e[i].then(t,r)})},i._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){h(e,0)},i._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)},i._setImmediateFn=function(e){i._immediateFn=e},i._setUnhandledRejectionFn=function(e){i._unhandledRejectionFn=e},"undefined"!=typeof module&&module.exports?module.exports=i:e.Promise||(e.Promise=i)}(this),function(e,t){function r(e,t){return(65535&e)*t+(((e>>>16)*t&65535)<<16)}function i(e,t){return e<<t|e>>>32-t}function n(e){return e=r(e^e>>>16,2246822507),e^=e>>>13,e=r(e,3266489909),e^=e>>>16}function a(e,t){e=[e[0]>>>16,65535&e[0],e[1]>>>16,65535&e[1]],t=[t[0]>>>16,65535&t[0],t[1]>>>16,65535&t[1]];var r=[0,0,0,0];return r[3]+=e[3]+t[3],r[2]+=r[3]>>>16,r[3]&=65535,r[2]+=e[2]+t[2],r[1]+=r[2]>>>16,r[2]&=65535,r[1]+=e[1]+t[1],r[0]+=r[1]>>>16,r[1]&=65535,r[0]+=e[0]+t[0],r[0]&=65535,[r[0]<<16|r[1],r[2]<<16|r[3]]}function o(e,t){e=[e[0]>>>16,65535&e[0],e[1]>>>16,65535&e[1]],t=[t[0]>>>16,65535&t[0],t[1]>>>16,65535&t[1]];var r=[0,0,0,0];return r[3]+=e[3]*t[3],r[2]+=r[3]>>>16,r[3]&=65535,r[2]+=e[2]*t[3],r[1]+=r[2]>>>16,r[2]&=65535,r[2]+=e[3]*t[2],r[1]+=r[2]>>>16,r[2]&=65535,r[1]+=e[1]*t[3],r[0]+=r[1]>>>16,r[1]&=65535,r[1]+=e[2]*t[2],r[0]+=r[1]>>>16,r[1]&=65535,r[1]+=e[3]*t[1],r[0]+=r[1]>>>16,r[1]&=65535,r[0]+=e[0]*t[3]+e[1]*t[2]+e[2]*t[1]+e[3]*t[0],r[0]&=65535,[r[0]<<16|r[1],r[2]<<16|r[3]]}function s(e,t){return t%=64,32===t?[e[1],e[0]]:32>t?[e[0]<<t|e[1]>>>32-t,e[1]<<t|e[0]>>>32-t]:(t-=32,[e[1]<<t|e[0]>>>32-t,e[0]<<t|e[1]>>>32-t])}function c(e,t){return t%=64,0===t?e:32>t?[e[0]<<t|e[1]>>>32-t,e[1]<<t]:[e[1]<<t-32,0]}function u(e,t){return[e[0]^t[0],e[1]^t[1]]}function h(e){return e=u(e,[0,e[0]>>>1]),e=o(e,[4283543511,3981806797]),e=u(e,[0,e[0]>>>1]),e=o(e,[3301882366,444984403]),e=u(e,[0,e[0]>>>1])}var d={version:"2.1.2",x86:{},x64:{}};d.x86.hash32=function(e,t){e=e||"";for(var a=e.length%4,o=e.length-a,s=t||0,c=0,u=0;u<o;u+=4)c=255&e.charCodeAt(u)|(255&e.charCodeAt(u+1))<<8|(255&e.charCodeAt(u+2))<<16|(255&e.charCodeAt(u+3))<<24,c=r(c,3432918353),c=i(c,15),c=r(c,461845907),s^=c,s=i(s,13),s=r(s,5)+3864292196;switch(c=0,a){case 3:c^=(255&e.charCodeAt(u+2))<<16;case 2:c^=(255&e.charCodeAt(u+1))<<8;case 1:c^=255&e.charCodeAt(u),c=r(c,3432918353),c=i(c,15),c=r(c,461845907),s^=c}return s^=e.length,s=n(s),s>>>0},d.x86.hash128=function(e,t){e=e||"",t=t||0;for(var a=e.length%16,o=e.length-a,s=t,c=t,u=t,h=t,d=0,l=0,g=0,m=0,f=0;f<o;f+=16)d=255&e.charCodeAt(f)|(255&e.charCodeAt(f+1))<<8|(255&e.charCodeAt(f+2))<<16|(255&e.charCodeAt(f+3))<<24,l=255&e.charCodeAt(f+4)|(255&e.charCodeAt(f+5))<<8|(255&e.charCodeAt(f+6))<<16|(255&e.charCodeAt(f+7))<<24,g=255&e.charCodeAt(f+8)|(255&e.charCodeAt(f+9))<<8|(255&e.charCodeAt(f+10))<<16|(255&e.charCodeAt(f+11))<<24,m=255&e.charCodeAt(f+12)|(255&e.charCodeAt(f+13))<<8|(255&e.charCodeAt(f+14))<<16|(255&e.charCodeAt(f+15))<<24,d=r(d,597399067),d=i(d,15),d=r(d,2869860233),s^=d,s=i(s,19),s+=c,s=r(s,5)+1444728091,l=r(l,2869860233),l=i(l,16),l=r(l,951274213),c^=l,c=i(c,17),c+=u,c=r(c,5)+197830471,g=r(g,951274213),g=i(g,17),g=r(g,2716044179),u^=g,u=i(u,15),u+=h,u=r(u,5)+2530024501,m=r(m,2716044179),m=i(m,18),m=r(m,597399067),h^=m,h=i(h,13),h+=s,h=r(h,5)+850148119;switch(m=g=l=d=0,a){case 15:m^=e.charCodeAt(f+14)<<16;case 14:m^=e.charCodeAt(f+13)<<8;case 13:m^=e.charCodeAt(f+12),m=r(m,2716044179),m=i(m,18),m=r(m,597399067),h^=m;case 12:g^=e.charCodeAt(f+11)<<24;case 11:g^=e.charCodeAt(f+10)<<16;case 10:g^=e.charCodeAt(f+9)<<8;case 9:g^=e.charCodeAt(f+8),g=r(g,951274213),g=i(g,17),g=r(g,2716044179),u^=g;case 8:l^=e.charCodeAt(f+7)<<24;case 7:l^=e.charCodeAt(f+6)<<16;case 6:l^=e.charCodeAt(f+5)<<8;case 5:l^=e.charCodeAt(f+4),l=r(l,2869860233),l=i(l,16),l=r(l,951274213),c^=l;case 4:d^=e.charCodeAt(f+3)<<24;case 3:d^=e.charCodeAt(f+2)<<16;case 2:d^=e.charCodeAt(f+1)<<8;case 1:d^=e.charCodeAt(f),d=r(d,597399067),d=i(d,15),d=r(d,2869860233),s^=d}return s^=e.length,c^=e.length,u^=e.length,h^=e.length,s=s+c+u,s+=h,c+=s,u+=s,h+=s,s=n(s),c=n(c),u=n(u),h=n(h),s+=c,s+=u,s+=h,c+=s,u+=s,h+=s,("00000000"+(s>>>0).toString(16)).slice(-8)+("00000000"+(c>>>0).toString(16)).slice(-8)+("00000000"+(u>>>0).toString(16)).slice(-8)+("00000000"+(h>>>0).toString(16)).slice(-8)},d.x64.hash128=function(e,t){e=e||"",t=t||0;for(var r=e.length%16,i=e.length-r,n=[0,t],d=[0,t],l=[0,0],g=[0,0],m=[2277735313,289559509],f=[1291169091,658871167],p=0;p<i;p+=16)l=[255&e.charCodeAt(p+4)|(255&e.charCodeAt(p+5))<<8|(255&e.charCodeAt(p+6))<<16|(255&e.charCodeAt(p+7))<<24,255&e.charCodeAt(p)|(255&e.charCodeAt(p+1))<<8|(255&e.charCodeAt(p+2))<<16|(255&e.charCodeAt(p+3))<<24],g=[255&e.charCodeAt(p+12)|(255&e.charCodeAt(p+13))<<8|(255&e.charCodeAt(p+14))<<16|(255&e.charCodeAt(p+15))<<24,255&e.charCodeAt(p+8)|(255&e.charCodeAt(p+9))<<8|(255&e.charCodeAt(p+10))<<16|(255&e.charCodeAt(p+11))<<24],l=o(l,m),l=s(l,31),l=o(l,f),n=u(n,l),n=s(n,27),n=a(n,d),n=a(o(n,[0,5]),[0,1390208809]),g=o(g,f),g=s(g,33),g=o(g,m),d=u(d,g),d=s(d,31),d=a(d,n),d=a(o(d,[0,5]),[0,944331445]);switch(l=[0,0],g=[0,0],r){case 15:g=u(g,c([0,e.charCodeAt(p+14)],48));case 14:g=u(g,c([0,e.charCodeAt(p+13)],40));case 13:g=u(g,c([0,e.charCodeAt(p+12)],32));case 12:g=u(g,c([0,e.charCodeAt(p+11)],24));case 11:g=u(g,c([0,e.charCodeAt(p+10)],16));case 10:g=u(g,c([0,e.charCodeAt(p+9)],8));case 9:g=u(g,[0,e.charCodeAt(p+8)]),g=o(g,f),g=s(g,33),g=o(g,m),d=u(d,g);case 8:l=u(l,c([0,e.charCodeAt(p+7)],56));case 7:l=u(l,c([0,e.charCodeAt(p+6)],48));case 6:l=u(l,c([0,e.charCodeAt(p+5)],40));case 5:l=u(l,c([0,e.charCodeAt(p+4)],32));case 4:l=u(l,c([0,e.charCodeAt(p+3)],24));case 3:l=u(l,c([0,e.charCodeAt(p+2)],16));case 2:l=u(l,c([0,e.charCodeAt(p+1)],8));case 1:l=u(l,[0,e.charCodeAt(p)]),l=o(l,m),l=s(l,31),l=o(l,f),n=u(n,l)}return n=u(n,[0,e.length]),d=u(d,[0,e.length]),n=a(n,d),d=a(d,n),n=h(n),d=h(d),n=a(n,d),d=a(d,n),("00000000"+(n[0]>>>0).toString(16)).slice(-8)+("00000000"+(n[1]>>>0).toString(16)).slice(-8)+("00000000"+(d[0]>>>0).toString(16)).slice(-8)+("00000000"+(d[1]>>>0).toString(16)).slice(-8)},"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=d),exports.murmurHash3=d):"function"==typeof define&&define.amd?define([],function(){return d}):(d._murmurHash3=e.murmurHash3,d.noConflict=function(){return e.murmurHash3=d._murmurHash3,d._murmurHash3=t,d.noConflict=t,d},e.murmurHash3=d)}(this),function(e){"use strict";var t={},r=e.imprint||{test:function(e){return Promise.all(e.map(function(e){if(!t.hasOwnProperty(e))throw"No test registered with the alias "+e;return t[e]()})).then(function(e){return murmurHash3.x86.hash128(e.join("~"))})},registerTest:function(e,r){t[e]=r}};"object"==typeof module&&"undefined"!=typeof exports&&(module.exports=imprint),e.imprint=r}(window),function(e){"use strict";imprint.registerTest("adBlocker",function(){return new Promise(function(e){var t=document.createElement("div");t.innerHTML="&nbsp;",t.className="adsbox",t.style.display="block",t.style.position="absolute",t.style.top="0px",t.style.left="-9999px";try{document.body.appendChild(t),window.setTimeout(function(){var r=0===t.offsetHeight;return document.body.removeChild(t),e(r)},10)}catch(t){return e(!1)}})})}(window),function(e){"use strict";imprint.registerTest("audio",function(){return new Promise(function(e){try{var t=new(window.AudioContext||window.webkitAudioContext),r=(t.createOscillator(),t.createAnalyser(),t.createGain(),t.createScriptProcessor(4096,1,1),t.destination),i=t.sampleRate.toString()+"_"+r.maxChannelCount+"_"+r.numberOfInputs+"_"+r.numberOfOutputs+"_"+r.channelCount+"_"+r.channelCountMode+"_"+r.channelInterpretation;return e(i)}catch(t){return e("")}})})}(window),function(e){"use strict";imprint.registerTest("availableScreenResolution",function(){return new Promise(function(e){var t=screen.availHeight>screen.availWidth?[screen.availHeight,screen.availWidth]:[screen.availWidth,screen.availHeight];return e(t.join("x"))})})}(window),function(e){"use strict";imprint.registerTest("canvas",function(){return new Promise(function(e){var t=[],r=document.createElement("canvas");r.width=2e3,r.height=200,r.style.display="inline";var i=r.getContext("2d");return i.rect(0,0,10,10),i.rect(2,2,6,6),t.push("canvas winding:"+(i.isPointInPath(5,5,"evenodd")===!1?"yes":"no")),i.textBaseline="alphabetic",i.fillStyle="#f60",i.fillRect(125,1,62,20),i.fillStyle="#069",i.font="11pt no-real-font-123",i.fillText("Cwm fjordbank glyphs vext quiz, 😃",2,15),i.fillStyle="rgba(102, 204, 0, 0.2)",i.font="18pt Arial",i.fillText("Cwm fjordbank glyphs vext quiz, 😃",4,45),i.globalCompositeOperation="multiply",i.fillStyle="rgb(255,0,255)",i.beginPath(),i.arc(50,50,50,0,2*Math.PI,!0),i.closePath(),i.fill(),i.fillStyle="rgb(0,255,255)",i.beginPath(),i.arc(100,50,50,0,2*Math.PI,!0),i.closePath(),i.fill(),i.fillStyle="rgb(255,255,0)",i.beginPath(),i.arc(75,100,50,0,2*Math.PI,!0),i.closePath(),i.fill(),i.fillStyle="rgb(255,0,255)",i.arc(75,75,75,0,2*Math.PI,!0),i.arc(75,75,25,0,2*Math.PI,!0),i.fill("evenodd"),t.push("canvas fp:"+r.toDataURL()),e(t.join("~"))})})}(window),function(e){"use strict";imprint.registerTest("colorDepth",function(){return new Promise(function(e){var t=screen.colorDepth;return 32===t&&(t=24),e(t||"")})})}(window),function(e){"use strict";imprint.registerTest("cookies",function(){return new Promise(function(e){return e(navigator.cookieEnabled)})})}(window),function(e){"use strict";imprint.registerTest("cpuClass",function(){return new Promise(function(e){return e(navigator.cpuClass||"")})})}(window),function(e){"use strict";imprint.registerTest("deviceDpi",function(){return new Promise(function(e){return e((screen.deviceXDPI||0)+"x"+(screen.deviceYDPI||0))})})}(window),function(e){"use strict";imprint.registerTest("doNotTrack",function(){return new Promise(function(e){return e(navigator.doNotTrack||navigator.msDoNotTrack||window.doNotTrack||"")})})}(window),function(e){"use strict";imprint.registerTest("indexedDb",function(){return new Promise(function(e){try{return e(!!window.indexedDB)}catch(t){return e(!0)}})})}(window);var FontDetector=function(){function e(e){var r=!0;for(var i in t){a.style.fontFamily=e+","+t[i],n.appendChild(a);var c=a.offsetWidth!=o[t[i]]||a.offsetHeight!=s[t[i]];n.removeChild(a),r=r&&c}return r}var t=["monospace","sans-serif","serif"],r="mmmmmmmmmmlli",i="201px",n=document.getElementsByTagName("body")[0],a=document.createElement("span");a.style.fontSize=i,a.innerHTML=r;var o={},s={};for(var c in t)a.style.fontFamily=t[c],n.appendChild(a),o[t[c]]=a.offsetWidth,s[t[c]]=a.offsetHeight,n.removeChild(a);this.detect=e};!function(e){"use strict";imprint.registerTest("installedFonts",function(){return new Promise(function(e){for(var t=new FontDetector,r=["ADOBE CASLON PRO","ADOBE GARAMOND PRO","AVENIR","Adobe Fangsong Std","Adobe Ming Std","Agency FB","Aharoni","Amazone BT","AngsanaUPC","Antique Olive","Apple Chancery","Apple Color Emoji","Apple SD Gothic Neo","Arab","Arial Baltic","Arial CE","Arial CYR","Arial Greek","Arial MT","Arial Unicode MS","Arrus BT","AvantGarde Bk BT","AvantGarde Md BT","Ayuthaya","Baskerville Old Face","Bell MT","Benguiat Bk BT","Berlin Sans FB","BernhardFashion BT","BernhardMod BT","Big Caslon","Bitstream Vera Sans Mono","Bitstream Vera Serif","BlairMdITC TT","Bodoni 72 Smallcaps","Bodoni MT Poster Compressed","Boulder","Bradley Hand","Broadway","Browallia New","BrowalliaUPC","Calisto MT","Cambria Math","Centaur","Chalkboard","Chalkboard SE","Chalkduster","Charter BT","ChelthmITC Bk BT","Chiller","Comic Sans MS","Constantia","Copperplate","Corbel","Cordia New","CordiaUPC","Coronet","Courier New Baltic","Courier New CE","Courier New CYR","Courier New TUR","Cuckoo","DFKai-SB","DaunPenh","Dauphin","David","DejaVu LGC Sans Mono","Denmark","Desdemona","DokChampa","Dotum","Ebrima","Edwardian Script ITC","Eras Bold ITC","EucrosiaUPC","Euphemia","Eurostile","FRUTIGER","FangSong","Felix Titling","Forte","Fransiscan","FreesiaUPC","French Script MT","FrnkGothITC Bk BT","Fruitger","Futura Bk BT","Futura Md BT","Futura ZBlk BT","FuturaBlack BT","Galliard BT","Garamond","Gautami","Geeza Pro","Geneva","GeoSlab 703 Lt BT","Geometr231 BT","Geometr231 Hv BT","Gigi","Gill Sans","GoudyOLSt BT","GulimChe","GungSeo","Gurmukhi MN","Harlow Solid Italic","Heather","HeiT","High Tower Text","Hiragino Kaku Gothic ProN","Hiragino Mincho ProN","Hiragino Sans GB","Hoefler Text","Humanst521 BT","Humanst521 Lt BT","Impact","Imprint MT Shadow","Incised901 BT","Incised901 Lt BT","Informal Roman","Informal011 BT","IrisUPC","Kabel Bk BT","KacstOne","KaiTi","Khmer UI","Kokila","LUCIDA GRANDE","Latha","Leelawadee","Lohit Gujarati","Long Island","Lucida Calligraphy","Lucida Console","Lucida Sans","Lucida Sans Typewriter","Lydian BT","MS Gothic","MS Mincho","MS PGothic","MS Reference Sans Serif","MS Reference Specialty","MS Serif","MUSEO","MYRIAD","Malgun Gothic","Mangal","Marigold","Market","Marlett","Meiryo","Meiryo UI","Menlo","Microsoft PhagsPa","Microsoft Uighur","MingLiU","MingLiU_HKSCS","Minion","Miriam Fixed","Mona Lisa Solid ITC TT","Monaco","Monotype Corsiva","NEVIS","News Gothic","News GothicMT","NewsGoth BT","Nyala","Old Century","Old English Text MT","Onyx","Oriya Sangam MN","PMingLiU","Palatino","Parchment","Pegasus","Perpetua","Perpetua Titling MT","Pickwick","Poster","Pristina","Raavi","Rage Italic","Rockwell","Roman","Sakkal Majalla","Savoye LET","Sawasdee","Segoe UI Symbol","Serifa BT","Serifa Th BT","Showcard Gothic","Shruti","Signboard","SimHei","SimSun","SimSun-ExtB","Simplified Arabic","Simplified Arabic Fixed","Sinhala Sangam MN","Sketch Rockwell","Socket","Stencil","Styllo","Swis721 BlkEx BT","Swiss911 XCm BT","Symbol","Synchro LET","System","TRAJAN PRO","Technical","Teletype","Tempus Sans ITC","Thonburi","Times","Times New Roman Baltic","Times New Roman CYR","Times New Roman PS","Trebuchet MS","Tubular","Tunga","Tw Cen MT","TypoUpright BT","Ubuntu","Unicorn","Utopia","Viner Hand ITC","Vivaldi","Vrinda","Westminster","Wide Latin","Zurich BlkEx BT"],i=[],n=0;n<r.length;n++)t.detect(r[n])&&i.push(r[n]);return e(i.join("~"))})})}(window),function(e){"use strict";var t,r;r=function(e){try{return JSON.parse(e)}catch(e){return!1}},t=function(){function e(){this.names=r('[ "Latin", "Chinese", "Arabic", "Devanagari", "Cyrillic", "Bengali/Assamese", "Kana", "Gurmukhi", "Javanese", "Hangul", "Telugu", "Tamil", "Malayalam", "Burmese", "Thai", "Sundanese", "Kannada", "Gujarati", "Lao", "Odia", "Ge-ez", "Sinhala", "Armenian", "Khmer", "Greek", "Lontara", "Hebrew", "Tibetan", "Georgian", "Modern Yi", "Mongolian", "Tifinagh", "Syriac", "Thaana", "Inuktitut", "Cherokee" ]'),this.codes=r("[[76,97,116,105,110], [27721,23383], [1575,1604,1593,1585,1576,1610,1577], [2342,2375,2357,2344,2366,2327,2352,2368], [1050,1080,1088,1080,1083,1080,1094,1072], [2476,2494,2434,2482,2494,32,47,32,2437,2488,2478,2496,2479,2492,2494], [20206,21517], [2583,2625,2608,2606,2625,2582,2624], [43415,43438], [54620,44544], [3108,3142,3122,3137,3095,3137], [2980,2990,3007,2996,3021], [3374,3378,3375,3390,3379,3330], [4121,4156,4116,4154,4121,4140], [3652,3607,3618], [7070,7077,7060,7082,7059], [3221,3240,3277,3240,3233], [2711,2753,2716,2736,2750,2724,2752], [3749,3762,3751], [2825,2852,2893,2837,2867], [4877,4821,4829], [3523,3538,3458,3524,3517], [1344,1377,1397,1400,1409], [6017,6098,6040,6082,6042], [917,955,955,951,957,953,954,972], [6674,6682,6664,6673], [1488,1500,1508,1489,1497,1514], [3926,3964,3921,3851], [4325,4304,4320,4311,4323,4314,4312], [41352,41760], [6190,6179,6185,6189,6179,6191], [11612,11593,11580,11593,11599,11568,11606], [1808,1834,1825,1821,1808], [1931,1960,1928,1964,1920,1960], [5123,5316,5251,5198,5200,5222], [5091,5043,5033], [55295, 7077]]"),this.fontSize=401,this.fontFace="Verdana",this.extraHeigth=15,this.res=[]}return e.prototype.begin=function(){var e,t,r,i,n,a,o,s,c,u,h,d,l,g,m,f,p,w,T,A,S,E,v,_,M,C,P,R;for(M=0,this.widths=[],this.heights=[],this.support=[],this.test_div=document.createElement("div"),document.body.appendChild(this.test_div),this.test_div.id="WritingTest",S=this.codes,n=0,c=S.length;n<c;n++){for(t=S[n],this.height=[],this.width=[],this.div=document.createElement("div"),this.test_div.appendChild(this.div),M+=1,this.div.id=M,this.div.style.display="inline-block",a=0,u=t.length;a<u;a++)e=t[a],this.div.innerHTML="<span style = 'font-family:"+this.fontFace+"; font-size:"+this.fontSize+"px;'>&#"+e+"</span>",this.height.push(document.getElementById(M).clientHeight),this.width.push(document.getElementById(M).clientWidth);for(this.div.innerHTML="",o=0,h=t.length;o<h;o++)e=t[o],this.div.innerHTML+="<span style = 'font-family:"+this.fontFace+"; font-size:"+this.fontSize+"px;'>&#"+e+"</span>";this.test_div.innerHTML+=this.height+";"+this.width+"<br>",this.heights.push(this.height),this.widths.push(this.width)}for(this.tw=this.widths.pop(),this.sw1=this.tw[0],this.sw2=this.tw[1],this.sh=this.heights.pop()[0],E=this.heights,s=0,d=E.length;s<d;s++){for(i=E[s],this.passed=0,p=0,l=i.length;p<l;p++)if(r=i[p],r!==this.sh){this.support.push(!0),this.passed=1;break}0===this.passed&&this.support.push(!1)}for(this.writing_scripts_index=0,v=this.widths,w=0,g=v.length;w<g;w++){for(R=v[w],T=0,m=R.length;T<m;T++)P=R[T],this.support[this.writing_scripts_index]===!1&&P!==this.sw1&&P!==this.sw2&&(this.support[this.writing_scripts_index]=!0);this.writing_scripts_index+=1}for(this.res=[],this.writing_scripts_index=0,_=this.support,A=0,f=_.length;A<f;A++)C=_[A],this.test_div.innerHTML+=this.names[this.writing_scripts_index]+": "+C+" <br>",C===!0&&this.res.push(this.names[this.writing_scripts_index]),this.writing_scripts_index+=1;return this.test_div.remove(),this.res},e}(),imprint.registerTest("installedLanguages",function(){return new Promise(function(e){try{var r=new t;return e(r.begin().join("~"))}catch(t){return e("")}})})}(window),function(e){"use strict";imprint.registerTest("language",function(){return new Promise(function(e){return e(navigator.language||navigator.userLanguage||navigator.browserLanguage||navigator.systemLanguage||"")})})}(window),function(e){"use strict";imprint.registerTest("localIp",function(){return new Promise(function(e){try{var t=window.RTCPeerConnection||window.mozRTCPeerConnection||window.webkitRTCPeerConnection,r=new t({iceServers:[]}),i=function(){};r.createDataChannel(""),r.createOffer(r.setLocalDescription.bind(r),i),r.onicecandidate=function(t){if(r.onicecandidate=i,!t||!t.candidate||!t.candidate.candidate)return e("");var n=/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(t.candidate.candidate)[1];return e(n)}}catch(t){return e("")}})})}(window),function(e){"use strict";imprint.registerTest("localStorage",function(){return new Promise(function(e){try{return e(!!window.localStorage)}catch(t){return e(!0)}})})}(window),function(e){"use strict";imprint.registerTest("mediaDevices",function(){return new Promise(function(e){return navigator.mediaDevices&&navigator.mediaDevices.enumerateDevices?void navigator.mediaDevices.enumerateDevices().then(function(t){var r=t.map(function(e){return e.kind+":"+e.label+" id = "+e.deviceId});return e(r.join(","))}).catch(function(t){return e("")}):e(cd||"")})})}(window),function(e){"use strict";imprint.registerTest("pixelRatio",function(){return new Promise(function(e){return e(window.devicePixelRatio||"")})})}(window),function(e){"use strict";imprint.registerTest("platform",function(){return new Promise(function(e){return e(navigator.platform||"")})})}(window),function(e){"use strict";imprint.registerTest("plugins",function(){return new Promise(function(e){var t=[];if(Object.getOwnPropertyDescriptor&&Object.getOwnPropertyDescriptor(window,"ActiveXObject")||"ActiveXObject"in window){var r=["AcroPDF.PDF","Adodb.Stream","AgControl.AgControl","DevalVRXCtrl.DevalVRXCtrl.1","MacromediaFlashPaper.MacromediaFlashPaper","Msxml2.DOMDocument","Msxml2.XMLHTTP","PDF.PdfCtrl","QuickTime.QuickTime","QuickTimeCheckObject.QuickTimeCheck.1","RealPlayer","RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)","RealVideo.RealVideo(tm) ActiveX Control (32-bit)","Scripting.Dictionary","SWCtl.SWCtl","Shell.UIHelper","ShockwaveFlash.ShockwaveFlash","Skype.Detection","TDCCtl.TDCCtl","WMPlayer.OCX","rmocx.RealPlayer G2 Control","rmocx.RealPlayer G2 Control.1"];t=r.map(function(e){try{return new ActiveXObject(e),e}catch(e){return null}})}if(navigator.plugins){for(var i=[],n=0,a=navigator.plugins.length;n<a;n++)i.push(navigator.plugins[n]);navigator.userAgent.match(/palemoon/i)&&(i=i.sort(function(e,t){return e.name>t.name?1:e.name<t.name?-1:0}));i.map(function(e){for(var r=[],i=0;i<e.length;i++){var n=e[i];r.push([n.type,n.suffixes].join("~"))}t.push([e.name,e.description,r.join(",")].join("::"))})}return e(t.join("~"))})})}(window),function(e){"use strict";imprint.registerTest("processorCores",function(){return new Promise(function(e){return e(navigator.hardwareConcurrency)})})}(window),function(e){"use strict";imprint.registerTest("publicIp",function(){return new Promise(function(e){var t=new XMLHttpRequest;t.onreadystatechange=function(){4==t.readyState&&200==t.status&&e(t.responseText)},t.open("GET","https://api.ipify.org",!0),t.send(null)})})}(window),function(e){"use strict";imprint.registerTest("screenResolution",function(){return new Promise(function(e){var t=screen.height>screen.width?[screen.height,screen.width]:[screen.width,screen.height];return e(t.join("x"))})})}(window),function(e){"use strict";imprint.registerTest("sessionStorage",function(){return new Promise(function(e){try{return e(!!window.sessionStorage)}catch(t){return e(!0)}})})}(window),function(e){"use strict";imprint.registerTest("timezoneOffset",function(){return new Promise(function(e){return e((new Date).getTimezoneOffset())})})}(window),function(e){"use strict";imprint.registerTest("touchSupport",function(){return new Promise(function(e){var t=0,r=!1;"undefined"!=typeof navigator.maxTouchPoints?t=navigator.maxTouchPoints:"undefined"!=typeof navigator.msMaxTouchPoints&&(t=navigator.msMaxTouchPoints);try{document.createEvent("TouchEvent"),r=!0}catch(e){}var i="ontouchstart"in window;return e([t,r,i].join("~"))})})}(window),function(e){"use strict";imprint.registerTest("userAgent",function(){return new Promise(function(e){return e(navigator.userAgent)})})}(window),function(e){"use strict";imprint.registerTest("webGl",function(){return new Promise(function(e){try{var t=function(e){return n.clearColor(0,0,0,1),n.enable(n.DEPTH_TEST),n.depthFunc(n.LEQUAL),n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT),"["+e[0]+", "+e[1]+"]"},r=function(e){var t,r=e.getExtension("EXT_texture_filter_anisotropic")||e.getExtension("WEBKIT_EXT_texture_filter_anisotropic")||e.getExtension("MOZ_EXT_texture_filter_anisotropic");return r?(t=e.getParameter(r.MAX_TEXTURE_MAX_ANISOTROPY_EXT),0===t&&(t=2),t):null},i=document.createElement("canvas"),n=null;try{n=i.getContext("webgl")||i.getContext("experimental-webgl")}catch(e){}if(!n)return e("");var a=[],o="attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}",s="precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}",c=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,c);var u=new Float32Array([-.2,-.9,0,.4,-.26,0,0,.732134444,0]);n.bufferData(n.ARRAY_BUFFER,u,n.STATIC_DRAW),c.itemSize=3,c.numItems=3;var h=n.createProgram(),d=n.createShader(n.VERTEX_SHADER);n.shaderSource(d,o),n.compileShader(d);var l=n.createShader(n.FRAGMENT_SHADER);n.shaderSource(l,s),n.compileShader(l),n.attachShader(h,d),n.attachShader(h,l),n.linkProgram(h),n.useProgram(h),h.vertexPosAttrib=n.getAttribLocation(h,"attrVertex"),h.offsetUniform=n.getUniformLocation(h,"uniformOffset"),n.enableVertexAttribArray(h.vertexPosArray),n.vertexAttribPointer(h.vertexPosAttrib,c.itemSize,n.FLOAT,!1,0,0),n.uniform2f(h.offsetUniform,1,1),n.drawArrays(n.TRIANGLE_STRIP,0,c.numItems),null!=n.canvas&&a.push(n.canvas.toDataURL()),a.push("extensions:"+n.getSupportedExtensions().join(";")),a.push("webgl aliased line width range:"+t(n.getParameter(n.ALIASED_LINE_WIDTH_RANGE))),a.push("webgl aliased point size range:"+t(n.getParameter(n.ALIASED_POINT_SIZE_RANGE))),a.push("webgl alpha bits:"+n.getParameter(n.ALPHA_BITS)),a.push("webgl antialiasing:"+(n.getContextAttributes().antialias?"yes":"no")),a.push("webgl blue bits:"+n.getParameter(n.BLUE_BITS)),a.push("webgl depth bits:"+n.getParameter(n.DEPTH_BITS)),a.push("webgl green bits:"+n.getParameter(n.GREEN_BITS)),a.push("webgl max anisotropy:"+r(n)),a.push("webgl max combined texture image units:"+n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS)),a.push("webgl max cube map texture size:"+n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE)),a.push("webgl max fragment uniform vectors:"+n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS)),a.push("webgl max render buffer size:"+n.getParameter(n.MAX_RENDERBUFFER_SIZE)),a.push("webgl max texture image units:"+n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS)),a.push("webgl max texture size:"+n.getParameter(n.MAX_TEXTURE_SIZE)),a.push("webgl max varying vectors:"+n.getParameter(n.MAX_VARYING_VECTORS)),a.push("webgl max vertex attribs:"+n.getParameter(n.MAX_VERTEX_ATTRIBS)),a.push("webgl max vertex texture image units:"+n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS)),a.push("webgl max vertex uniform vectors:"+n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS)),a.push("webgl max viewport dims:"+t(n.getParameter(n.MAX_VIEWPORT_DIMS))),a.push("webgl red bits:"+n.getParameter(n.RED_BITS)),a.push("webgl renderer:"+n.getParameter(n.RENDERER)),a.push("webgl shading language version:"+n.getParameter(n.SHADING_LANGUAGE_VERSION)),a.push("webgl stencil bits:"+n.getParameter(n.STENCIL_BITS)),a.push("webgl vendor:"+n.getParameter(n.VENDOR)),a.push("webgl version:"+n.getParameter(n.VERSION));try{var g=n.getExtension("WEBGL_debug_renderer_info");g&&(a.push("webgl unmasked vendor:"+n.getParameter(g.UNMASKED_VENDOR_WEBGL)),a.push("webgl unmasked renderer:"+n.getParameter(g.UNMASKED_RENDERER_WEBGL)))}catch(e){}return n.getShaderPrecisionFormat?(a.push("webgl vertex shader high float precision:"+n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision),a.push("webgl vertex shader high float precision rangeMin:"+n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).rangeMin),a.push("webgl vertex shader high float precision rangeMax:"+n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).rangeMax),a.push("webgl vertex shader medium float precision:"+n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision),a.push("webgl vertex shader medium float precision rangeMin:"+n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).rangeMin),a.push("webgl vertex shader medium float precision rangeMax:"+n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).rangeMax),a.push("webgl vertex shader low float precision:"+n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.LOW_FLOAT).precision),a.push("webgl vertex shader low float precision rangeMin:"+n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.LOW_FLOAT).rangeMin),a.push("webgl vertex shader low float precision rangeMax:"+n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.LOW_FLOAT).rangeMax),a.push("webgl fragment shader high float precision:"+n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision),a.push("webgl fragment shader high float precision rangeMin:"+n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).rangeMin),a.push("webgl fragment shader high float precision rangeMax:"+n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).rangeMax),a.push("webgl fragment shader medium float precision:"+n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision),a.push("webgl fragment shader medium float precision rangeMin:"+n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).rangeMin),a.push("webgl fragment shader medium float precision rangeMax:"+n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).rangeMax),a.push("webgl fragment shader low float precision:"+n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.LOW_FLOAT).precision),a.push("webgl fragment shader low float precision rangeMin:"+n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.LOW_FLOAT).rangeMin),a.push("webgl fragment shader low float precision rangeMax:"+n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.LOW_FLOAT).rangeMax),a.push("webgl vertex shader high int precision:"+n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_INT).precision),a.push("webgl vertex shader high int precision rangeMin:"+n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_INT).rangeMin),a.push("webgl vertex shader high int precision rangeMax:"+n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_INT).rangeMax),a.push("webgl vertex shader medium int precision:"+n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_INT).precision),a.push("webgl vertex shader medium int precision rangeMin:"+n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_INT).rangeMin),a.push("webgl vertex shader medium int precision rangeMax:"+n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_INT).rangeMax),a.push("webgl vertex shader low int precision:"+n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.LOW_INT).precision),a.push("webgl vertex shader low int precision rangeMin:"+n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.LOW_INT).rangeMin),a.push("webgl vertex shader low int precision rangeMax:"+n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.LOW_INT).rangeMax),a.push("webgl fragment shader high int precision:"+n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_INT).precision),a.push("webgl fragment shader high int precision rangeMin:"+n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_INT).rangeMin),a.push("webgl fragment shader high int precision rangeMax:"+n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_INT).rangeMax),
a.push("webgl fragment shader medium int precision:"+n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_INT).precision),a.push("webgl fragment shader medium int precision rangeMin:"+n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_INT).rangeMin),a.push("webgl fragment shader medium int precision rangeMax:"+n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_INT).rangeMax),a.push("webgl fragment shader low int precision:"+n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.LOW_INT).precision),a.push("webgl fragment shader low int precision rangeMin:"+n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.LOW_INT).rangeMin),a.push("webgl fragment shader low int precision rangeMax:"+n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.LOW_INT).rangeMax),e(a.join("~"))):e(a.join("~"))}catch(t){return e("")}})})}(window);
	var browserTests = ["audio","availableScreenResolution","canvas","colorDepth","cpuClass","deviceDpi","pixelRatio","platform","processorCores","screenResolution","touchSupport","userAgent","webGl"];


	;(function (name, context, definition) {
  		if (typeof module !== 'undefined' && module.exports) { module.exports = definition(); }
  		else if (typeof define === 'function' && define.amd) { define(definition); }
  		else { context[name] = definition(); }
	})('Fingerprint', this, function () {
  	'use strict';

  	var Fingerprint = function (options) {
    var nativeForEach, nativeMap;
    nativeForEach = Array.prototype.forEach;
    nativeMap = Array.prototype.map;

    this.each = function (obj, iterator, context) {
      if (obj === null) {
        return;
      }
      if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
      } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
          if (iterator.call(context, obj[i], i, obj) === {}) return;
        }
      } else {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (iterator.call(context, obj[key], key, obj) === {}) return;
          }
        }
      }
    };

    this.map = function(obj, iterator, context) {
      var results = [];
      // Not using strict equality so that this acts as a
      // shortcut to checking for `null` and `undefined`.
      if (obj == null) return results;
      if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
      this.each(obj, function(value, index, list) {
        results[results.length] = iterator.call(context, value, index, list);
      });
      return results;
    };

    if (typeof options == 'object'){
      this.hasher = options.hasher;
      this.screen_resolution = options.screen_resolution;
      this.screen_orientation = options.screen_orientation;
      this.canvas = options.canvas;
      this.ie_activex = options.ie_activex;
    } else if(typeof options == 'function'){
      this.hasher = options;
    }
  };

  Fingerprint.prototype = {
    get: function(){
      var keys = [];
      keys.push(navigator.userAgent);
      keys.push(navigator.language);
      keys.push(screen.colorDepth);
      if (this.screen_resolution) {
        var resolution = this.getScreenResolution();
        if (typeof resolution !== 'undefined'){ // headless browsers, such as phantomjs
          keys.push(resolution.join('x'));
        }
      }
      keys.push(new Date().getTimezoneOffset());
      keys.push(this.hasSessionStorage());
      keys.push(this.hasLocalStorage());
      keys.push(this.hasIndexDb());
      //body might not be defined at this point or removed programmatically
      if(document.body){
        keys.push(typeof(document.body.addBehavior));
      } else {
        keys.push(typeof undefined);
      }
      keys.push(typeof(window.openDatabase));
      keys.push(navigator.cpuClass);
      keys.push(navigator.platform);
      keys.push(navigator.doNotTrack);
      keys.push(this.getPluginsString());
      if(this.canvas && this.isCanvasSupported()){
        keys.push(this.getCanvasFingerprint());
      }
      if(this.hasher){
        return this.hasher(keys.join('###'), 31);
      } else {
        return this.murmurhash3_32_gc(keys.join('###'), 31);
      }
    },

    murmurhash3_32_gc: function(key, seed) {
      var remainder, bytes, h1, h1b, c1, c2, k1, i;

      remainder = key.length & 3; // key.length % 4
      bytes = key.length - remainder;
      h1 = seed;
      c1 = 0xcc9e2d51;
      c2 = 0x1b873593;
      i = 0;

      while (i < bytes) {
          k1 =
            ((key.charCodeAt(i) & 0xff)) |
            ((key.charCodeAt(++i) & 0xff) << 8) |
            ((key.charCodeAt(++i) & 0xff) << 16) |
            ((key.charCodeAt(++i) & 0xff) << 24);
        ++i;

        k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
        k1 = (k1 << 15) | (k1 >>> 17);
        k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

        h1 ^= k1;
            h1 = (h1 << 13) | (h1 >>> 19);
        h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
        h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
      }

      k1 = 0;

      switch (remainder) {
        case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
        case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
        case 1: k1 ^= (key.charCodeAt(i) & 0xff);

        k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
        k1 = (k1 << 15) | (k1 >>> 17);
        k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
        h1 ^= k1;
      }

      h1 ^= key.length;

      h1 ^= h1 >>> 16;
      h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
      h1 ^= h1 >>> 13;
      h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
      h1 ^= h1 >>> 16;

      return h1 >>> 0;
    },

    // https://bugzilla.mozilla.org/show_bug.cgi?id=781447
    hasLocalStorage: function () {
      try{
        return !!window.localStorage;
      } catch(e) {
        return true; // SecurityError when referencing it means it exists
      }
    },

    hasSessionStorage: function () {
      try{
        return !!window.sessionStorage;
      } catch(e) {
        return true; // SecurityError when referencing it means it exists
      }
    },

    hasIndexDb: function () {
      try{
        return !!window.indexedDB;
      } catch(e) {
        return true; // SecurityError when referencing it means it exists
      }
    },

    isCanvasSupported: function () {
      var elem = document.createElement('canvas');
      return !!(elem.getContext && elem.getContext('2d'));
    },

    isIE: function () {
      if(navigator.appName === 'Microsoft Internet Explorer') {
        return true;
      } else if(navigator.appName === 'Netscape' && /Trident/.test(navigator.userAgent)){// IE 11
        return true;
      }
      return false;
    },

    getPluginsString: function () {
      if(this.isIE() && this.ie_activex){
        return this.getIEPluginsString();
      } else {
        return this.getRegularPluginsString();
      }
    },

    getRegularPluginsString: function () {
      return this.map(navigator.plugins, function (p) {
        var mimeTypes = this.map(p, function(mt){
          return [mt.type, mt.suffixes].join('~');
        }).join(',');
        return [p.name, p.description, mimeTypes].join('::');
      }, this).join(';');
    },

    getIEPluginsString: function () {
      if(window.ActiveXObject){
        var names = ['ShockwaveFlash.ShockwaveFlash',//flash plugin
          'AcroPDF.PDF', // Adobe PDF reader 7+
          'PDF.PdfCtrl', // Adobe PDF reader 6 and earlier, brrr
          'QuickTime.QuickTime', // QuickTime
          // 5 versions of real players
          'rmocx.RealPlayer G2 Control',
          'rmocx.RealPlayer G2 Control.1',
          'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)',
          'RealVideo.RealVideo(tm) ActiveX Control (32-bit)',
          'RealPlayer',
          'SWCtl.SWCtl', // ShockWave player
          'WMPlayer.OCX', // Windows media player
          'AgControl.AgControl', // Silverlight
          'Skype.Detection'];

        // starting to detect plugins in IE
        return this.map(names, function(name){
          try{
            new ActiveXObject(name);
            return name;
          } catch(e){
            return null;
          }
        }).join(';');
      } else {
        return ""; // behavior prior version 0.5.0, not breaking backwards compat.
      }
    },

    getScreenResolution: function () {
      var resolution;
       if(this.screen_orientation){
         resolution = (screen.height > screen.width) ? [screen.height, screen.width] : [screen.width, screen.height];
       }else{
         resolution = [screen.height, screen.width];
       }
       return resolution;
    },

    getCanvasFingerprint: function () {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      // https://www.browserleaks.com/canvas#how-does-it-work
      var txt = 'http://valve.github.io';
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial'";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125,1,62,20);
      ctx.fillStyle = "#069";
      ctx.fillText(txt, 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText(txt, 4, 17);
      return canvas.toDataURL();
    }
  };


  return Fingerprint;

});


var audioFingerprint = (function () {
	
	var context = null;
	var currentTime = null;
	var oscillator = null;
	var compressor = null;
	var fingerprint = null;
	var callback = null
	
	function run(cb, debug = false) {
		
		callback = cb;
		
		try {
			
			setup();
		
			oscillator.connect(compressor);
			compressor.connect(context.destination);
		
			oscillator.start(0);
			context.startRendering();
			
			context.oncomplete = onComplete;
		  
		} catch (e) {
			
			if (debug) {
				throw e;
			}
			
		}
	}
	
	function setup()
	{
		setContext();
		currentTime = context.currentTime;
		setOscillator();
		setCompressor();
	}

	function setContext()
	{
		var audioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
		context = new audioContext(1, 44100, 44100);
	}

	function setOscillator()
	{
		oscillator = context.createOscillator();
		oscillator.type = "triangle";
		oscillator.frequency.setValueAtTime(10000, currentTime);
	}

	function setCompressor()
	{
		compressor = context.createDynamicsCompressor();
		
		setCompressorValueIfDefined('threshold', -50);
		setCompressorValueIfDefined('knee', 40);
		setCompressorValueIfDefined('ratio', 12);
		setCompressorValueIfDefined('reduction', -20);
		setCompressorValueIfDefined('attack', 0);
		setCompressorValueIfDefined('release', .25);
	}

	function setCompressorValueIfDefined(item, value)
	{
		if (compressor[item] !== undefined && typeof compressor[item].setValueAtTime === 'function') {
			compressor[item].setValueAtTime(value, context.currentTime);
		}
	}
	
	function onComplete(event)
	{
		generateFingerprints(event);
	    compressor.disconnect();
	}
	
	function generateFingerprints(event)
	{
		var output = null;
		for (var i = 4500; 5e3 > i; i++) {
			
			var channelData = event.renderedBuffer.getChannelData(0)[i];
			output += Math.abs(channelData);
			
		}
		
		fingerprint = output.toString();
		
		if (typeof callback === 'function') {
			return callback(fingerprint);
		}
	}
	
	return {
		run:run
	};
	
})();




var fingerprint_3 = (function(window, screen, navigator) {

    // https://github.com/darkskyapp/string-hash
    function checksum(str) {
        var hash = 5381,
            i = str.length;
    
        while (i--) hash = (hash * 33) ^ str.charCodeAt(i);
    
        return hash >>> 0;
    }

    // http://stackoverflow.com/a/4167870/1250044
    function map(arr, fn){
        var i = 0, len = arr.length, ret = [];
        while(i < len){
            ret[i] = fn(arr[i++]);
        }
        return ret;
    }

    return checksum([
        navigator.userAgent,
        [screen.height, screen.width, screen.colorDepth].join('x'),
        new Date().getTimezoneOffset(),
        !!window.sessionStorage,
        !!window.localStorage,
        map(navigator.plugins, function (plugin) {
            return [
                plugin.name,
                plugin.description,
                map(plugin, function (mime) {
                    return [mime.type, mime.suffixes].join('~');
                }).join(',')
            ].join("::");
        }).join(';')
    ].join('###'));

}(this, screen, navigator));


;(function(name,context,definition) { if (typeof module !== 'undefined' && module.exports) { module.exports = definition(); } else if (typeof define === 'function' && define.amd) { define(definition); } else { context[name] = definition(); } } ) ('Fingerprint', this, function() { 'use strict'; var Fingerprint = function(options) { var nativeForEach, nativeMap; nativeForEach = Array.prototype.forEach; nativeMap = Array.prototype.map; this.each = function(obj, iterator, context) { if (obj === null) { return; } if (nativeForEach && obj.forEach === nativeForEach) { obj.forEach(iterator, context); } else if (obj.length === +obj.length) { for (var i = 0, l = obj.length; i < l; i++) { if (iterator.call(context, obj[i], i, obj) === {}) return; } } else { for (var key in obj) { if (obj.hasOwnProperty(key)) { if (iterator.call(context, obj[key], key, obj) === {}) return; } } } }; this.map = function(obj, iterator, context) { var results = []; if (obj == null) return results; if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context); this.each(obj, function(value, index, list) { results[results.length] = iterator.call(context, value, index, list); }); return results; }; if (typeof options == 'object') { this.hasher = options.hasher; this.screen_resolution = options.screen_resolution; this.screen_orientation = options.screen_orientation; this.canvas = options.canvas; this.ie_activex = options.ie_activex; } else if (typeof options == 'function') { this.hasher = options; } }; Fingerprint.prototype = { get: function() { var keys = []; keys.push(navigator.userAgent); keys.push(navigator.language); keys.push(screen.colorDepth); if (this.screen_resolution) { var resolution = this.getScreenResolution(); if (typeof resolution !== 'undefined') { keys.push(this.getScreenResolution().join('x')); } } keys.push(new Date().getTimezoneOffset()); keys.push(this.hasSessionStorage()); keys.push(this.hasLocalStorage()); keys.push(!!window.indexedDB); if (document.body) { keys.push(typeof(document.body.addBehavior)); } else { keys.push(typeof undefined); } keys.push(typeof(window.openDatabase)); keys.push(navigator.cpuClass); keys.push(navigator.platform); keys.push(navigator.doNotTrack); keys.push(this.getPluginsString()); if (this.canvas && this.isCanvasSupported()) { keys.push(this.getCanvasFingerprint()); } if (this.hasher) { return this.hasher(keys.join('###'), 31); } else { return this.murmurhash3_32_gc(keys.join('###'), 31); } }, murmurhash3_32_gc: function(key, seed) { var remainder, bytes, h1, h1b, c1, c2, k1, i; remainder = key.length & 3; bytes = key.length - remainder; h1 = seed; c1 = 0xcc9e2d51; c2 = 0x1b873593; i = 0; while (i < bytes) { k1 = ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(++i) & 0xff) << 8) | ((key.charCodeAt(++i) & 0xff) << 16) | ((key.charCodeAt(++i) & 0xff) << 24); ++i; k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff; k1 = (k1 << 15) | (k1 >>> 17); k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff; h1 ^= k1; h1 = (h1 << 13) | (h1 >>> 19); h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff; h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16)); } k1 = 0; switch (remainder) { case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16; case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8; case 1: k1 ^= (key.charCodeAt(i) & 0xff); k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff; k1 = (k1 << 15) | (k1 >>> 17); k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff; h1 ^= k1; } h1 ^= key.length; h1 ^= h1 >>> 16; h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff; h1 ^= h1 >>> 13; h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff; h1 ^= h1 >>> 16; return h1 >>> 0; }, hasLocalStorage: function() { try { return !!window.localStorage; } catch (e) { return true; } }, hasSessionStorage: function() { try { return !!window.sessionStorage; } catch (e) { return true; } }, isCanvasSupported: function() { var elem = document.createElement('canvas'); return !!(elem.getContext && elem.getContext('2d')); }, isIE: function() { if (navigator.appName === 'Microsoft Internet Explorer') { return true; } else if (navigator.appName === 'Netscape' && /Trident/.test(navigator.userAgent)) { return true; } return false; }, getPluginsString: function() { if (this.isIE() && this.ie_activex) { return this.getIEPluginsString(); } else { return this.getRegularPluginsString(); } }, getRegularPluginsString: function() { return this.map(navigator.plugins, function(p) { var mimeTypes = this.map(p, function(mt) { return [mt.type, mt.suffixes].join('~'); }).join(','); return [p.name, p.description, mimeTypes].join('::'); }, this).join(';'); }, getIEPluginsString: function() { if (window.ActiveXObject) { var names = ['ShockwaveFlash.ShockwaveFlash', 'AcroPDF.PDF', 'PDF.PdfCtrl', 'QuickTime.QuickTime', 'rmocx.RealPlayer G2 Control', 'rmocx.RealPlayer G2 Control.1', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)', 'RealVideo.RealVideo(tm) ActiveX Control (32-bit)', 'RealPlayer', 'SWCtl.SWCtl', 'WMPlayer.OCX', 'AgControl.AgControl', 'Skype.Detection' ]; return this.map(names, function(name) { try { new ActiveXObject(name); return name; } catch (e) { return null; } }).join(';'); } else { return ""; } }, getScreenResolution: function() { var resolution; if (this.screen_orientation) { resolution = (screen.height > screen.width) ? [screen.height, screen.width] : [screen.width, screen.height]; } else { resolution = [screen.height, screen.width]; } return resolution; }, getCanvasFingerprint: function() { var canvas = document.createElement('canvas'); var ctx = canvas.getContext('2d'); var txt = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-={}|[]\:"<>?;,.'; ctx.textBaseline = "top"; ctx.font = "14px 'Arial'"; ctx.textBaseline = "alphabetic"; ctx.fillStyle = "#f60"; ctx.fillRect(125, 1, 62, 20); ctx.fillStyle = "#069"; ctx.fillText(txt, 2, 15); ctx.fillStyle = "rgba(102, 204, 0, 0.7)"; ctx.fillText(txt, 4, 17); return canvas.toDataURL(); } }; return Fingerprint;});


function fingerprint_browser() {
    "use strict";
    var strOnError, strUserAgent, numVersion, strBrowser, strOut;

    strOnError = "Error";
    strUserAgent = null;
    numVersion = null;
    strBrowser  = null;
    strOut = null;

    try {
        strUserAgent = navigator.userAgent.toLowerCase();
        if (/msie (\d+\.\d+);/.test(strUserAgent)) { //test for MSIE x.x;
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            if (strUserAgent.indexOf("trident/6") > -1) {
                numVersion = 10;
            }
            if (strUserAgent.indexOf("trident/5") > -1) {
                numVersion = 9;
            }
            if (strUserAgent.indexOf("trident/4") > -1) {
                numVersion = 8;
            }
            strBrowser = "Internet Explorer " + numVersion;
        } else if (strUserAgent.indexOf("trident/7") > -1) { //IE 11+ gets rid of the legacy 'MSIE' in the user-agent string;
            numVersion = 11;
            strBrowser = "Internet Explorer " + numVersion;
        }  else if (/firefox[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Firefox " + numVersion;
        } else if (/opera[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Opera/x.x or Opera x.x (ignoring remaining decimal places);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Opera " + numVersion;
        } else if (/chrome[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Chrome/x.x or Chrome x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Chrome " + numVersion;
        } else if (/version[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Version/x.x or Version x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Safari " + numVersion;
        } else if (/rv[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for rv/x.x or rv x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Mozilla " + numVersion;
        } else if (/mozilla[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Mozilla/x.x or Mozilla x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Mozilla " + numVersion;
        } else if (/binget[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for BinGet/x.x or BinGet x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library (BinGet) " + numVersion;
        } else if (/curl[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Curl/x.x or Curl x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library (cURL) " + numVersion;
        } else if (/java[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Java/x.x or Java x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library (Java) " + numVersion;
        } else if (/libwww-perl[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for libwww-perl/x.x or libwww-perl x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library (libwww-perl) " + numVersion;
        } else if (/microsoft url control -[\s](\d+\.\d+)/.test(strUserAgent)) { //test for Microsoft URL Control - x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library (Microsoft URL Control) " + numVersion;
        } else if (/peach[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Peach/x.x or Peach x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library (Peach) " + numVersion;
        } else if (/php[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for PHP/x.x or PHP x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library (PHP) " + numVersion;
        } else if (/pxyscand[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for pxyscand/x.x or pxyscand x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library (pxyscand) " + numVersion;
        } else if (/pycurl[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for pycurl/x.x or pycurl x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library (PycURL) " + numVersion;
        } else if (/python-urllib[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for python-urllib/x.x or python-urllib x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library (Python URLlib) " + numVersion;
        } else if (/appengine-google/.test(strUserAgent)) { //test for AppEngine-Google;
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Cloud (Google AppEngine) " + numVersion;
        } else {
            strBrowser = "Unknown";
        }
        strOut = strBrowser;
        return strOut;
    } catch (err) {
        return strOnError;
    }
}

function fingerprint_canvas() {
    "use strict";
    var strOnError, canvas, strCText, strText, strOut;

    strOnError = "Error";
    canvas = null;
    strCText = null;
    strText = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~1!2@3#4$5%6^7&8*9(0)-_=+[{]}|;:',<.>/?";
    strOut = null;

    try {
        canvas = document.createElement('canvas');
        strCText = canvas.getContext('2d');
        strCText.textBaseline = "top";
        strCText.font = "14px 'Arial'";
        strCText.textBaseline = "alphabetic";
        strCText.fillStyle = "#f60";
        strCText.fillRect(125, 1, 62, 20);
        strCText.fillStyle = "#069";
        strCText.fillText(strText, 2, 15);
        strCText.fillStyle = "rgba(102, 204, 0, 0.7)";
        strCText.fillText(strText, 4, 17);
        strOut = canvas.toDataURL();
        return strOut;
    } catch (err) {
        return strOnError;
    }
}

function fingerprint_display() {
    "use strict";
    var strSep, strPair, strOnError, strScreen, strDisplay, strOut;

    strSep = "|";
    strPair = "=";
    strOnError = "Error";
    strScreen = null;
    strDisplay = null;
    strOut = null;

    try {
        strScreen = window.screen;
        if (strScreen) {
            strDisplay = strScreen.colorDepth + strSep + strScreen.width + strSep + strScreen.height + strSep + strScreen.availWidth + strSep + strScreen.availHeight;
        }
        strOut = strDisplay;
        return strOut;
    } catch (err) {
        return strOnError;
    }
}


function fingerprint_os() {
    "use strict";
    var strSep, strOnError, strUserAgent, strPlatform, strOS, strOSBits, strOut;

    strSep = "|";
    strOnError = "Error";
    strUserAgent = null;
    strPlatform = null;
    strOS = null;
    strOSBits = null;
    strOut = null;

    try {
        // navigator.userAgent is supported by all major browsers
        strUserAgent = navigator.userAgent.toLowerCase();
        // navigator.platform is supported by all major browsers
        strPlatform = navigator.platform.toLowerCase();
        if (strUserAgent.indexOf("windows nt 6.3") !== -1) {
            strOS = "Windows 8.1";
        } else if (strUserAgent.indexOf("windows nt 6.2") !== -1) {
            strOS = "Windows 8";
        } else if (strUserAgent.indexOf("windows nt 6.1") !== -1) {
            strOS = "Windows 7";
        } else if (strUserAgent.indexOf("windows nt 6.0") !== -1) {
            strOS = "Windows Vista/Windows Server 2008";
        } else if (strUserAgent.indexOf("windows nt 5.2") !== -1) {
            strOS = "Windows XP x64/Windows Server 2003";
        } else if (strUserAgent.indexOf("windows nt 5.1") !== -1) {
            strOS = "Windows XP";
        } else if (strUserAgent.indexOf("windows nt 5.01") !== -1) {
            strOS = "Windows 2000, Service Pack 1 (SP1)";
        } else if (strUserAgent.indexOf("windows xp") !== -1) {
            strOS = "Windows XP";
        } else if (strUserAgent.indexOf("windows 2000") !== -1) {
            strOS = "Windows 2000";
        } else if (strUserAgent.indexOf("windows nt 5.0") !== -1) {
            strOS = "Windows 2000";
        } else if (strUserAgent.indexOf("windows nt 4.0") !== -1) {
            strOS = "Windows NT 4.0";
        } else if (strUserAgent.indexOf("windows nt") !== -1) {
            strOS = "Windows NT 4.0";
        } else if (strUserAgent.indexOf("winnt4.0") !== -1) {
            strOS = "Windows NT 4.0";
        } else if (strUserAgent.indexOf("winnt") !== -1) {
            strOS = "Windows NT 4.0";
        } else if (strUserAgent.indexOf("windows me") !== -1) {
            strOS = "Windows ME";
        } else if (strUserAgent.indexOf("win 9x 4.90") !== -1) {
            strOS = "Windows ME";
        } else if (strUserAgent.indexOf("windows 98") !== -1) {
            strOS = "Windows 98";
        } else if (strUserAgent.indexOf("win98") !== -1) {
            strOS = "Windows 98";
        } else if (strUserAgent.indexOf("windows 95") !== -1) {
            strOS = "Windows 95";
        } else if (strUserAgent.indexOf("windows_95") !== -1) {
            strOS = "Windows 95";
        } else if (strUserAgent.indexOf("win95") !== -1) {
            strOS = "Windows 95";
        } else if (strUserAgent.indexOf("ce") !== -1) {
            strOS = "Windows CE";
        } else if (strUserAgent.indexOf("win16") !== -1) {
            strOS = "Windows 3.11";
        } else if (strUserAgent.indexOf("iemobile") !== -1) {
            strOS = "Windows Mobile";
        } else if (strUserAgent.indexOf("wm5 pie") !== -1) {
            strOS = "Windows Mobile";
        } else if (strUserAgent.indexOf("windows") !== -1) {
            strOS = "Windows (Unknown Version)";
        } else if (strUserAgent.indexOf("openbsd") !== -1) {
            strOS = "Open BSD";
        } else if (strUserAgent.indexOf("sunos") !== -1) {
            strOS = "Sun OS";
        } else if (strUserAgent.indexOf("ubuntu") !== -1) {
            strOS = "Ubuntu";
        } else if (strUserAgent.indexOf("ipad") !== -1) {
            strOS = "iOS (iPad)";
        } else if (strUserAgent.indexOf("ipod") !== -1) {
            strOS = "iOS (iTouch)";
        } else if (strUserAgent.indexOf("iphone") !== -1) {
            strOS = "iOS (iPhone)";
        } else if (strUserAgent.indexOf("mac os x beta") !== -1) {
            strOS = "Mac OSX Beta (Kodiak)";
        } else if (strUserAgent.indexOf("mac os x 10.0") !== -1) {
            strOS = "Mac OSX Cheetah";
        } else if (strUserAgent.indexOf("mac os x 10.1") !== -1) {
            strOS = "Mac OSX Puma";
        } else if (strUserAgent.indexOf("mac os x 10.2") !== -1) {
            strOS = "Mac OSX Jaguar";
        } else if (strUserAgent.indexOf("mac os x 10.3") !== -1) {
            strOS = "Mac OSX Panther";
        } else if (strUserAgent.indexOf("mac os x 10.4") !== -1) {
            strOS = "Mac OSX Tiger";
        } else if (strUserAgent.indexOf("mac os x 10.5") !== -1) {
            strOS = "Mac OSX Leopard";
        } else if (strUserAgent.indexOf("mac os x 10.6") !== -1) {
            strOS = "Mac OSX Snow Leopard";
        } else if (strUserAgent.indexOf("mac os x 10.7") !== -1) {
            strOS = "Mac OSX Lion";
        } else if (strUserAgent.indexOf("mac os x") !== -1) {
            strOS = "Mac OSX (Version Unknown)";
        } else if (strUserAgent.indexOf("mac_68000") !== -1) {
            strOS = "Mac OS Classic (68000)";
        } else if (strUserAgent.indexOf("68K") !== -1) {
            strOS = "Mac OS Classic (68000)";
        } else if (strUserAgent.indexOf("mac_powerpc") !== -1) {
            strOS = "Mac OS Classic (PowerPC)";
        } else if (strUserAgent.indexOf("ppc mac") !== -1) {
            strOS = "Mac OS Classic (PowerPC)";
        } else if (strUserAgent.indexOf("macintosh") !== -1) {
            strOS = "Mac OS Classic";
        } else if (strUserAgent.indexOf("googletv") !== -1) {
            strOS = "Android (GoogleTV)";
        } else if (strUserAgent.indexOf("xoom") !== -1) {
            strOS = "Android (Xoom)";
        } else if (strUserAgent.indexOf("htc_flyer") !== -1) {
            strOS = "Android (HTC Flyer)";
        } else if (strUserAgent.indexOf("android") !== -1) {
            strOS = "Android";
        } else if (strUserAgent.indexOf("symbian") !== -1) {
            strOS = "Symbian";
        } else if (strUserAgent.indexOf("series60") !== -1) {
            strOS = "Symbian (Series 60)";
        } else if (strUserAgent.indexOf("series70") !== -1) {
            strOS = "Symbian (Series 70)";
        } else if (strUserAgent.indexOf("series80") !== -1) {
            strOS = "Symbian (Series 80)";
        } else if (strUserAgent.indexOf("series90") !== -1) {
            strOS = "Symbian (Series 90)";
        } else if (strUserAgent.indexOf("x11") !== -1) {
            strOS = "UNIX";
        } else if (strUserAgent.indexOf("nix") !== -1) {
            strOS = "UNIX";
        } else if (strUserAgent.indexOf("linux") !== -1) {
            strOS = "Linux";
        } else if (strUserAgent.indexOf("qnx") !== -1) {
            strOS = "QNX";
        } else if (strUserAgent.indexOf("os/2") !== -1) {
            strOS = "IBM OS/2";
        } else if (strUserAgent.indexOf("beos") !== -1) {
            strOS = "BeOS";
        } else if (strUserAgent.indexOf("blackberry95") !== -1) {
            strOS = "Blackberry (Storm 1/2)";
        } else if (strUserAgent.indexOf("blackberry97") !== -1) {
            strOS = "Blackberry (Bold)";
        } else if (strUserAgent.indexOf("blackberry96") !== -1) {
            strOS = "Blackberry (Tour)";
        } else if (strUserAgent.indexOf("blackberry89") !== -1) {
            strOS = "Blackberry (Curve 2)";
        } else if (strUserAgent.indexOf("blackberry98") !== -1) {
            strOS = "Blackberry (Torch)";
        } else if (strUserAgent.indexOf("playbook") !== -1) {
            strOS = "Blackberry (Playbook)";
        } else if (strUserAgent.indexOf("wnd.rim") !== -1) {
            strOS = "Blackberry (IE/FF Emulator)";
        } else if (strUserAgent.indexOf("blackberry") !== -1) {
            strOS = "Blackberry";
        } else if (strUserAgent.indexOf("palm") !== -1) {
            strOS = "Palm OS";
        } else if (strUserAgent.indexOf("webos") !== -1) {
            strOS = "WebOS";
        } else if (strUserAgent.indexOf("hpwos") !== -1) {
            strOS = "WebOS (HP)";
        } else if (strUserAgent.indexOf("blazer") !== -1) {
            strOS = "Palm OS (Blazer)";
        } else if (strUserAgent.indexOf("xiino") !== -1) {
            strOS = "Palm OS (Xiino)";
        } else if (strUserAgent.indexOf("kindle") !== -1) {
            strOS = "Kindle";
        } else if (strUserAgent.indexOf("wii") !== -1) {
            strOS = "Nintendo (Wii)";
        } else if (strUserAgent.indexOf("nintendo ds") !== -1) {
            strOS = "Nintendo (DS)";
        } else if (strUserAgent.indexOf("playstation 3") !== -1) {
            strOS = "Sony (Playstation Console)";
        } else if (strUserAgent.indexOf("playstation portable") !== -1) {
            strOS = "Sony (Playstation Portable)";
        } else if (strUserAgent.indexOf("webtv") !== -1) {
            strOS = "MSN TV (WebTV)";
        } else if (strUserAgent.indexOf("inferno") !== -1) {
            strOS = "Inferno";
        } else {
            strOS = "Unknown";
        }
        if (strPlatform.indexOf("x64") !== -1) {
            strOSBits = "64 bits";
        } else if (strPlatform.indexOf("wow64") !== -1) {
            strOSBits = "64 bits";
        } else if (strPlatform.indexOf("win64") !== -1) {
            strOSBits = "64 bits";
        } else if (strPlatform.indexOf("win32") !== -1) {
            strOSBits = "32 bits";
        } else if (strPlatform.indexOf("x64") !== -1) {
            strOSBits = "64 bits";
        } else if (strPlatform.indexOf("x32") !== -1) {
            strOSBits = "32 bits";
        } else if (strPlatform.indexOf("x86") !== -1) {
            strOSBits = "32 bits*";
        } else if (strPlatform.indexOf("ppc") !== -1) {
            strOSBits = "64 bits";
        } else if (strPlatform.indexOf("alpha") !== -1) {
            strOSBits = "64 bits";
        } else if (strPlatform.indexOf("68k") !== -1) {
            strOSBits = "64 bits";
        } else if (strPlatform.indexOf("iphone") !== -1) {
            strOSBits = "32 bits";
        } else if (strPlatform.indexOf("android") !== -1) {
            strOSBits = "32 bits";
        } else {
            strOSBits = "Unknown";
        }
        strOut = strOS + strSep + strOSBits;
        return strOut;
    } catch (err) {
        return strOnError;
    }
}


function fingerprint_touch() {
    "use strict";
    var bolTouchEnabled, bolOut;

    bolTouchEnabled = false;
    bolOut = null;

    try {
        if (document.createEvent("TouchEvent")) {
            bolTouchEnabled = true;
        }
        bolOut = bolTouchEnabled;
        return bolOut;
    } catch (ignore) {
		bolOut = bolTouchEnabled
        return bolOut;
    }
}

var fp = new Fingerprint({
  canvas: true,
  ie_activex: true,
  screen_resolution: true
});

var uid = fp.get();



(function(f){var d,e,p=function(){d=(new (window.UAParser||exports.UAParser)).getResult();e=new Detector;return this};p.prototype={getSoftwareVersion:function(){return"0.1.11"},getBrowserData:function(){return d},getFingerprint:function(){var b=d.ua,c=this.getScreenPrint(),a=this.getPlugins(),g=this.getFonts(),n=this.isLocalStorage(),f=this.isSessionStorage(),h=this.getTimeZone(),u=this.getLanguage(),m=this.getSystemLanguage(),e=this.isCookie(),C=this.getCanvasPrint();return murmurhash3_32_gc(b+"|"+
c+"|"+a+"|"+g+"|"+n+"|"+f+"|"+h+"|"+u+"|"+m+"|"+e+"|"+C,256)},getCustomFingerprint:function(){for(var b="",c=0;c<arguments.length;c++)b+=arguments[c]+"|";return murmurhash3_32_gc(b,256)},getUserAgent:function(){return d.ua},getUserAgentLowerCase:function(){return d.ua.toLowerCase()},getBrowser:function(){return d.browser.name},getBrowserVersion:function(){return d.browser.version},getBrowserMajorVersion:function(){return d.browser.major},isIE:function(){return/IE/i.test(d.browser.name)},isChrome:function(){return/Chrome/i.test(d.browser.name)},
isFirefox:function(){return/Firefox/i.test(d.browser.name)},isSafari:function(){return/Safari/i.test(d.browser.name)},isMobileSafari:function(){return/Mobile\sSafari/i.test(d.browser.name)},isOpera:function(){return/Opera/i.test(d.browser.name)},getEngine:function(){return d.engine.name},getEngineVersion:function(){return d.engine.version},getOS:function(){return d.os.name},getOSVersion:function(){return d.os.version},isWindows:function(){return/Windows/i.test(d.os.name)},isMac:function(){return/Mac/i.test(d.os.name)},
isLinux:function(){return/Linux/i.test(d.os.name)},isUbuntu:function(){return/Ubuntu/i.test(d.os.name)},isSolaris:function(){return/Solaris/i.test(d.os.name)},getDevice:function(){return d.device.model},getDeviceType:function(){return d.device.type},getDeviceVendor:function(){return d.device.vendor},getCPU:function(){return d.cpu.architecture},isMobile:function(){var b=d.ua||navigator.vendor||window.opera;return/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(b)||
/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(b.substr(0,
4))},isMobileMajor:function(){return this.isMobileAndroid()||this.isMobileBlackBerry()||this.isMobileIOS()||this.isMobileOpera()||this.isMobileWindows()},isMobileAndroid:function(){return d.ua.match(/Android/i)?!0:!1},isMobileOpera:function(){return d.ua.match(/Opera Mini/i)?!0:!1},isMobileWindows:function(){return d.ua.match(/IEMobile/i)?!0:!1},isMobileBlackBerry:function(){return d.ua.match(/BlackBerry/i)?!0:!1},isMobileIOS:function(){return d.ua.match(/iPhone|iPad|iPod/i)?!0:!1},isIphone:function(){return d.ua.match(/iPhone/i)?
!0:!1},isIpad:function(){return d.ua.match(/iPad/i)?!0:!1},isIpod:function(){return d.ua.match(/iPod/i)?!0:!1},getScreenPrint:function(){return"Current Resolution: "+this.getCurrentResolution()+", Available Resolution: "+this.getAvailableResolution()+", Color Depth: "+this.getColorDepth()+", Device XDPI: "+this.getDeviceXDPI()+", Device YDPI: "+this.getDeviceYDPI()},getColorDepth:function(){return screen.colorDepth},getCurrentResolution:function(){return screen.width+"x"+screen.height},getAvailableResolution:function(){return screen.availWidth+
"x"+screen.availHeight},getDeviceXDPI:function(){return screen.deviceXDPI},getDeviceYDPI:function(){return screen.deviceYDPI},getPlugins:function(){for(var b="",c=0;c<navigator.plugins.length;c++)b=c==navigator.plugins.length-1?b+navigator.plugins[c].name:b+(navigator.plugins[c].name+", ");return b},isJava:function(){return navigator.javaEnabled()},getJavaVersion:function(){return deployJava.getJREs().toString()},isFlash:function(){return navigator.plugins["Shockwave Flash"]?!0:!1},getFlashVersion:function(){return this.isFlash()?
(objPlayerVersion=swfobject.getFlashPlayerVersion(),objPlayerVersion.major+"."+objPlayerVersion.minor+"."+objPlayerVersion.release):""},isSilverlight:function(){return navigator.plugins["Silverlight Plug-In"]?!0:!1},getSilverlightVersion:function(){return this.isSilverlight()?navigator.plugins["Silverlight Plug-In"].description:""},isMimeTypes:function(){return navigator.mimeTypes.length?!0:!1},getMimeTypes:function(){for(var b="",c=0;c<navigator.mimeTypes.length;c++)b=c==navigator.mimeTypes.length-
1?b+navigator.mimeTypes[c].description:b+(navigator.mimeTypes[c].description+", ");return b},isFont:function(b){return e.detect(b)},getFonts:function(){for(var b="Abadi MT Condensed Light;Adobe Fangsong Std;Adobe Hebrew;Adobe Ming Std;Agency FB;Aharoni;Andalus;Angsana New;AngsanaUPC;Aparajita;Arab;Arabic Transparent;Arabic Typesetting;Arial Baltic;Arial Black;Arial CE;Arial CYR;Arial Greek;Arial TUR;Arial;Batang;BatangChe;Bauhaus 93;Bell MT;Bitstream Vera Serif;Bodoni MT;Bookman Old Style;Braggadocio;Broadway;Browallia New;BrowalliaUPC;Calibri Light;Calibri;Californian FB;Cambria Math;Cambria;Candara;Castellar;Casual;Centaur;Century Gothic;Chalkduster;Colonna MT;Comic Sans MS;Consolas;Constantia;Copperplate Gothic Light;Corbel;Cordia New;CordiaUPC;Courier New Baltic;Courier New CE;Courier New CYR;Courier New Greek;Courier New TUR;Courier New;DFKai-SB;DaunPenh;David;DejaVu LGC Sans Mono;Desdemona;DilleniaUPC;DokChampa;Dotum;DotumChe;Ebrima;Engravers MT;Eras Bold ITC;Estrangelo Edessa;EucrosiaUPC;Euphemia;Eurostile;FangSong;Forte;FrankRuehl;Franklin Gothic Heavy;Franklin Gothic Medium;FreesiaUPC;French Script MT;Gabriola;Gautami;Georgia;Gigi;Gisha;Goudy Old Style;Gulim;GulimChe;GungSeo;Gungsuh;GungsuhChe;Haettenschweiler;Harrington;Hei S;HeiT;Heisei Kaku Gothic;Hiragino Sans GB;Impact;Informal Roman;IrisUPC;Iskoola Pota;JasmineUPC;KacstOne;KaiTi;Kalinga;Kartika;Khmer UI;Kino MT;KodchiangUPC;Kokila;Kozuka Gothic Pr6N;Lao UI;Latha;Leelawadee;Levenim MT;LilyUPC;Lohit Gujarati;Loma;Lucida Bright;Lucida Console;Lucida Fax;Lucida Sans Unicode;MS Gothic;MS Mincho;MS PGothic;MS PMincho;MS Reference Sans Serif;MS UI Gothic;MV Boli;Magneto;Malgun Gothic;Mangal;Marlett;Matura MT Script Capitals;Meiryo UI;Meiryo;Menlo;Microsoft Himalaya;Microsoft JhengHei;Microsoft New Tai Lue;Microsoft PhagsPa;Microsoft Sans Serif;Microsoft Tai Le;Microsoft Uighur;Microsoft YaHei;Microsoft Yi Baiti;MingLiU;MingLiU-ExtB;MingLiU_HKSCS;MingLiU_HKSCS-ExtB;Miriam Fixed;Miriam;Mongolian Baiti;MoolBoran;NSimSun;Narkisim;News Gothic MT;Niagara Solid;Nyala;PMingLiU;PMingLiU-ExtB;Palace Script MT;Palatino Linotype;Papyrus;Perpetua;Plantagenet Cherokee;Playbill;Prelude Bold;Prelude Condensed Bold;Prelude Condensed Medium;Prelude Medium;PreludeCompressedWGL Black;PreludeCompressedWGL Bold;PreludeCompressedWGL Light;PreludeCompressedWGL Medium;PreludeCondensedWGL Black;PreludeCondensedWGL Bold;PreludeCondensedWGL Light;PreludeCondensedWGL Medium;PreludeWGL Black;PreludeWGL Bold;PreludeWGL Light;PreludeWGL Medium;Raavi;Rachana;Rockwell;Rod;Sakkal Majalla;Sawasdee;Script MT Bold;Segoe Print;Segoe Script;Segoe UI Light;Segoe UI Semibold;Segoe UI Symbol;Segoe UI;Shonar Bangla;Showcard Gothic;Shruti;SimHei;SimSun;SimSun-ExtB;Simplified Arabic Fixed;Simplified Arabic;Snap ITC;Sylfaen;Symbol;Tahoma;Times New Roman Baltic;Times New Roman CE;Times New Roman CYR;Times New Roman Greek;Times New Roman TUR;Times New Roman;TlwgMono;Traditional Arabic;Trebuchet MS;Tunga;Tw Cen MT Condensed Extra Bold;Ubuntu;Umpush;Univers;Utopia;Utsaah;Vani;Verdana;Vijaya;Vladimir Script;Vrinda;Webdings;Wide Latin;Wingdings".split(";"),
c="",a=0;a<b.length;a++)e.detect(b[a])&&(c=a==b.length-1?c+b[a]:c+(b[a]+", "));return c},isLocalStorage:function(){try{return!!f.localStorage}catch(b){return!0}},isSessionStorage:function(){try{return!!f.sessionStorage}catch(b){return!0}},isCookie:function(){return navigator.cookieEnabled},getTimeZone:function(){return String(String(new Date).split("(")[1]).split(")")[0]},getLanguage:function(){return navigator.language},getSystemLanguage:function(){return navigator.systemLanguage},isCanvas:function(){var b=
document.createElement("canvas");try{return!(!b.getContext||!b.getContext("2d"))}catch(c){return!1}},getCanvasPrint:function(){var b=document.createElement("canvas"),c;try{c=b.getContext("2d")}catch(a){return""}c.textBaseline="top";c.font="14px 'Arial'";c.textBaseline="alphabetic";c.fillStyle="#f60";c.fillRect(125,1,62,20);c.fillStyle="#069";c.fillText("ClientJS,org <canvas> 1.0",2,15);c.fillStyle="rgba(102, 204, 0, 0.7)";c.fillText("ClientJS,org <canvas> 1.0",4,17);return b.toDataURL()}};"object"===
typeof module&&"undefined"!==typeof exports&&(module.exports=p);f.ClientJS=p})(window);var deployJava=function(){function f(a){c.debug&&(console.log?console.log(a):alert(a))}function d(a){if(null==a||0==a.length)return"http://java.com/dt-redirect";"&"==a.charAt(0)&&(a=a.substring(1,a.length));return"http://java.com/dt-redirect?"+a}var e=["id","class","title","style"];"classid codebase codetype data type archive declare standby height width usemap name tabindex align border hspace vspace".split(" ").concat(e,["lang","dir"],"onclick ondblclick onmousedown onmouseup onmouseover onmousemove onmouseout onkeypress onkeydown onkeyup".split(" "));
var p="codebase code name archive object width height alt align hspace vspace".split(" ").concat(e),b;try{b=-1!=document.location.protocol.indexOf("http")?"//java.com/js/webstart.png":"http://java.com/js/webstart.png"}catch(a){b="http://java.com/js/webstart.png"}var c={debug:null,version:"20120801",firefoxJavaVersion:null,myInterval:null,preInstallJREList:null,returnPage:null,brand:null,locale:null,installType:null,EAInstallEnabled:!1,EarlyAccessURL:null,oldMimeType:"application/npruntime-scriptable-plugin;DeploymentToolkit",
mimeType:"application/java-deployment-toolkit",launchButtonPNG:b,browserName:null,browserName2:null,getJREs:function(){var a=[];if(this.isPluginInstalled())for(var g=this.getPlugin().jvms,b=0;b<g.getLength();b++)a[b]=g.get(b).version;else g=this.getBrowser(),"MSIE"==g?this.testUsingActiveX("1.7.0")?a[0]="1.7.0":this.testUsingActiveX("1.6.0")?a[0]="1.6.0":this.testUsingActiveX("1.5.0")?a[0]="1.5.0":this.testUsingActiveX("1.4.2")?a[0]="1.4.2":this.testForMSVM()&&(a[0]="1.1"):"Netscape Family"==g&&(this.getJPIVersionUsingMimeType(),
null!=this.firefoxJavaVersion?a[0]=this.firefoxJavaVersion:this.testUsingMimeTypes("1.7")?a[0]="1.7.0":this.testUsingMimeTypes("1.6")?a[0]="1.6.0":this.testUsingMimeTypes("1.5")?a[0]="1.5.0":this.testUsingMimeTypes("1.4.2")?a[0]="1.4.2":"Safari"==this.browserName2&&(this.testUsingPluginsArray("1.7.0")?a[0]="1.7.0":this.testUsingPluginsArray("1.6")?a[0]="1.6.0":this.testUsingPluginsArray("1.5")?a[0]="1.5.0":this.testUsingPluginsArray("1.4.2")&&(a[0]="1.4.2")));if(this.debug)for(b=0;b<a.length;++b)f("[getJREs()] We claim to have detected Java SE "+
a[b]);return a},installJRE:function(a,g){if(this.isPluginInstalled()&&this.isAutoInstallEnabled(a)){var b=!1;if(b=this.isCallbackSupported()?this.getPlugin().installJRE(a,g):this.getPlugin().installJRE(a))this.refresh(),null!=this.returnPage&&(document.location=this.returnPage);return b}return this.installLatestJRE()},isAutoInstallEnabled:function(a){if(!this.isPluginInstalled())return!1;"undefined"==typeof a&&(a=null);if("MSIE"!=deployJava.browserName||deployJava.compareVersionToPattern(deployJava.getPlugin().version,
["10","0","0"],!1,!0))a=!0;else if(null==a)a=!1;else{var g="1.6.0_33+";if(null==g||0==g.length)a=!0;else{var b=g.charAt(g.length-1);"+"!=b&&"*"!=b&&-1!=g.indexOf("_")&&"_"!=b&&(g+="*",b="*");g=g.substring(0,g.length-1);if(0<g.length){var c=g.charAt(g.length-1);if("."==c||"_"==c)g=g.substring(0,g.length-1)}a="*"==b?0==a.indexOf(g):"+"==b?g<=a:!1}a=!a}return a},isCallbackSupported:function(){return this.isPluginInstalled()&&this.compareVersionToPattern(this.getPlugin().version,["10","2","0"],!1,!0)},
installLatestJRE:function(a){if(this.isPluginInstalled()&&this.isAutoInstallEnabled()){var g=!1;if(g=this.isCallbackSupported()?this.getPlugin().installLatestJRE(a):this.getPlugin().installLatestJRE())this.refresh(),null!=this.returnPage&&(document.location=this.returnPage);return g}a=this.getBrowser();g=navigator.platform.toLowerCase();if("true"==this.EAInstallEnabled&&-1!=g.indexOf("win")&&null!=this.EarlyAccessURL)this.preInstallJREList=this.getJREs(),null!=this.returnPage&&(this.myInterval=setInterval("deployJava.poll()",
3E3)),location.href=this.EarlyAccessURL;else{if("MSIE"==a)return this.IEInstall();if("Netscape Family"==a&&-1!=g.indexOf("win32"))return this.FFInstall();location.href=d((null!=this.returnPage?"&returnPage="+this.returnPage:"")+(null!=this.locale?"&locale="+this.locale:"")+(null!=this.brand?"&brand="+this.brand:""))}return!1},runApplet:function(a,g,b){if("undefined"==b||null==b)b="1.1";var c=b.match("^(\\d+)(?:\\.(\\d+)(?:\\.(\\d+)(?:_(\\d+))?)?)?$");null==this.returnPage&&(this.returnPage=document.location);
null!=c?"?"!=this.getBrowser()?this.versionCheck(b+"+")?this.writeAppletTag(a,g):this.installJRE(b+"+")&&(this.refresh(),location.href=document.location,this.writeAppletTag(a,g)):this.writeAppletTag(a,g):f("[runApplet()] Invalid minimumVersion argument to runApplet():"+b)},writeAppletTag:function(a,g){var b="<applet ",c="",h=!0;if(null==g||"object"!=typeof g)g={};for(var d in a){var m;a:{m=d.toLowerCase();for(var f=p.length,e=0;e<f;e++)if(p[e]===m){m=!0;break a}m=!1}m?(b+=" "+d+'="'+a[d]+'"',"code"==
d&&(h=!1)):g[d]=a[d]}d=!1;for(var q in g){"codebase_lookup"==q&&(d=!0);if("object"==q||"java_object"==q||"java_code"==q)h=!1;c+='<param name="'+q+'" value="'+g[q]+'"/>'}d||(c+='<param name="codebase_lookup" value="false"/>');h&&(b+=' code="dummy"');document.write(b+">\n"+c+"\n</applet>")},versionCheck:function(a){var g=0,b=a.match("^(\\d+)(?:\\.(\\d+)(?:\\.(\\d+)(?:_(\\d+))?)?)?(\\*|\\+)?$");if(null!=b){for(var c=a=!1,h=[],d=1;d<b.length;++d)"string"==typeof b[d]&&""!=b[d]&&(h[g]=b[d],g++);"+"==h[h.length-
1]?(c=!0,a=!1,h.length--):"*"==h[h.length-1]?(c=!1,a=!0,h.length--):4>h.length&&(c=!1,a=!0);g=this.getJREs();for(d=0;d<g.length;++d)if(this.compareVersionToPattern(g[d],h,a,c))return!0}else g="Invalid versionPattern passed to versionCheck: "+a,f("[versionCheck()] "+g),alert(g);return!1},isWebStartInstalled:function(a){if("?"==this.getBrowser())return!0;if("undefined"==a||null==a)a="1.4.2";var b=!1;null!=a.match("^(\\d+)(?:\\.(\\d+)(?:\\.(\\d+)(?:_(\\d+))?)?)?$")?b=this.versionCheck(a+"+"):(f("[isWebStartInstaller()] Invalid minimumVersion argument to isWebStartInstalled(): "+
a),b=this.versionCheck("1.4.2+"));return b},getJPIVersionUsingMimeType:function(){for(var a=0;a<navigator.mimeTypes.length;++a){var b=navigator.mimeTypes[a].type.match(/^application\/x-java-applet;jpi-version=(.*)$/);if(null!=b&&(this.firefoxJavaVersion=b[1],"Opera"!=this.browserName2))break}},launchWebStartApplication:function(a){navigator.userAgent.toLowerCase();this.getJPIVersionUsingMimeType();if(0==this.isWebStartInstalled("1.7.0")&&(0==this.installJRE("1.7.0+")||0==this.isWebStartInstalled("1.7.0")))return!1;
var b=null;document.documentURI&&(b=document.documentURI);null==b&&(b=document.URL);var c=this.getBrowser(),d;"MSIE"==c?d='<object classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93" width="0" height="0"><PARAM name="launchjnlp" value="'+a+'"><PARAM name="docbase" value="'+b+'"></object>':"Netscape Family"==c&&(d='<embed type="application/x-java-applet;jpi-version='+this.firefoxJavaVersion+'" width="0" height="0" launchjnlp="'+a+'"docbase="'+b+'" />');"undefined"==document.body||null==document.body?
(document.write(d),document.location=b):(a=document.createElement("div"),a.id="div1",a.style.position="relative",a.style.left="-10000px",a.style.margin="0px auto",a.className="dynamicDiv",a.innerHTML=d,document.body.appendChild(a))},createWebStartLaunchButtonEx:function(a,b){null==this.returnPage&&(this.returnPage=a);document.write('<a href="'+("javascript:deployJava.launchWebStartApplication('"+a+"');")+'" onMouseOver="window.status=\'\'; return true;"><img src="'+this.launchButtonPNG+'" border="0" /></a>')},
createWebStartLaunchButton:function(a,b){null==this.returnPage&&(this.returnPage=a);document.write('<a href="'+("javascript:if (!deployJava.isWebStartInstalled(&quot;"+b+"&quot;)) {if (deployJava.installLatestJRE()) {if (deployJava.launch(&quot;"+a+"&quot;)) {}}} else {if (deployJava.launch(&quot;"+a+"&quot;)) {}}")+'" onMouseOver="window.status=\'\'; return true;"><img src="'+this.launchButtonPNG+'" border="0" /></a>')},launch:function(a){document.location=a;return!0},isPluginInstalled:function(){var a=
this.getPlugin();return a&&a.jvms?!0:!1},isAutoUpdateEnabled:function(){return this.isPluginInstalled()?this.getPlugin().isAutoUpdateEnabled():!1},setAutoUpdateEnabled:function(){return this.isPluginInstalled()?this.getPlugin().setAutoUpdateEnabled():!1},setInstallerType:function(a){this.installType=a;return this.isPluginInstalled()?this.getPlugin().setInstallerType(a):!1},setAdditionalPackages:function(a){return this.isPluginInstalled()?this.getPlugin().setAdditionalPackages(a):!1},setEarlyAccess:function(a){this.EAInstallEnabled=
a},isPlugin2:function(){if(this.isPluginInstalled()&&this.versionCheck("1.6.0_10+"))try{return this.getPlugin().isPlugin2()}catch(a){}return!1},allowPlugin:function(){this.getBrowser();return"Safari"!=this.browserName2&&"Opera"!=this.browserName2},getPlugin:function(){this.refresh();var a=null;this.allowPlugin()&&(a=document.getElementById("deployJavaPlugin"));return a},compareVersionToPattern:function(a,b,c,d){if(void 0==a||void 0==b)return!1;var h=a.match("^(\\d+)(?:\\.(\\d+)(?:\\.(\\d+)(?:_(\\d+))?)?)?$");
if(null!=h){var f=0;a=[];for(var m=1;m<h.length;++m)"string"==typeof h[m]&&""!=h[m]&&(a[f]=h[m],f++);h=Math.min(a.length,b.length);if(d){for(m=0;m<h;++m){if(a[m]<b[m])return!1;if(a[m]>b[m])break}return!0}for(m=0;m<h;++m)if(a[m]!=b[m])return!1;return c?!0:a.length==b.length}return!1},getBrowser:function(){if(null==this.browserName){var a=navigator.userAgent.toLowerCase();f("[getBrowser()] navigator.userAgent.toLowerCase() -> "+a);-1!=a.indexOf("msie")&&-1==a.indexOf("opera")?this.browserName2=this.browserName=
"MSIE":-1!=a.indexOf("iphone")?(this.browserName="Netscape Family",this.browserName2="iPhone"):-1!=a.indexOf("firefox")&&-1==a.indexOf("opera")?(this.browserName="Netscape Family",this.browserName2="Firefox"):-1!=a.indexOf("chrome")?(this.browserName="Netscape Family",this.browserName2="Chrome"):-1!=a.indexOf("safari")?(this.browserName="Netscape Family",this.browserName2="Safari"):-1!=a.indexOf("mozilla")&&-1==a.indexOf("opera")?(this.browserName="Netscape Family",this.browserName2="Other"):-1!=
a.indexOf("opera")?(this.browserName="Netscape Family",this.browserName2="Opera"):(this.browserName="?",this.browserName2="unknown");f("[getBrowser()] Detected browser name:"+this.browserName+", "+this.browserName2)}return this.browserName},testUsingActiveX:function(a){a="JavaWebStart.isInstalled."+a+".0";if("undefined"==typeof ActiveXObject||!ActiveXObject)return f("[testUsingActiveX()] Browser claims to be IE, but no ActiveXObject object?"),!1;try{return null!=new ActiveXObject(a)}catch(b){return!1}},
testForMSVM:function(){if("undefined"!=typeof oClientCaps){var a=oClientCaps.getComponentVersion("{08B0E5C0-4FCB-11CF-AAA5-00401C608500}","ComponentID");return""==a||"5,0,5000,0"==a?!1:!0}return!1},testUsingMimeTypes:function(a){if(!navigator.mimeTypes)return f("[testUsingMimeTypes()] Browser claims to be Netscape family, but no mimeTypes[] array?"),!1;for(var b=0;b<navigator.mimeTypes.length;++b){s=navigator.mimeTypes[b].type;var c=s.match(/^application\/x-java-applet\x3Bversion=(1\.8|1\.7|1\.6|1\.5|1\.4\.2)$/);
if(null!=c&&this.compareVersions(c[1],a))return!0}return!1},testUsingPluginsArray:function(a){if(!navigator.plugins||!navigator.plugins.length)return!1;for(var b=navigator.platform.toLowerCase(),c=0;c<navigator.plugins.length;++c)if(s=navigator.plugins[c].description,-1!=s.search(/^Java Switchable Plug-in (Cocoa)/)){if(this.compareVersions("1.5.0",a))return!0}else if(-1!=s.search(/^Java/)&&-1!=b.indexOf("win")&&(this.compareVersions("1.5.0",a)||this.compareVersions("1.6.0",a)))return!0;return this.compareVersions("1.5.0",
a)?!0:!1},IEInstall:function(){location.href=d((null!=this.returnPage?"&returnPage="+this.returnPage:"")+(null!=this.locale?"&locale="+this.locale:"")+(null!=this.brand?"&brand="+this.brand:""));return!1},done:function(a,b){},FFInstall:function(){location.href=d((null!=this.returnPage?"&returnPage="+this.returnPage:"")+(null!=this.locale?"&locale="+this.locale:"")+(null!=this.brand?"&brand="+this.brand:"")+(null!=this.installType?"&type="+this.installType:""));return!1},compareVersions:function(a,
b){for(var c=a.split("."),d=b.split("."),h=0;h<c.length;++h)c[h]=Number(c[h]);for(h=0;h<d.length;++h)d[h]=Number(d[h]);2==c.length&&(c[2]=0);return c[0]>d[0]?!0:c[0]<d[0]?!1:c[1]>d[1]?!0:c[1]<d[1]?!1:c[2]>d[2]?!0:c[2]<d[2]?!1:!0},enableAlerts:function(){this.browserName=null;this.debug=!0},poll:function(){this.refresh();var a=this.getJREs();0==this.preInstallJREList.length&&0!=a.length&&(clearInterval(this.myInterval),null!=this.returnPage&&(location.href=this.returnPage));0!=this.preInstallJREList.length&&
0!=a.length&&this.preInstallJREList[0]!=a[0]&&(clearInterval(this.myInterval),null!=this.returnPage&&(location.href=this.returnPage))},writePluginTag:function(){var a=this.getBrowser();"MSIE"==a?document.write('<object classid="clsid:CAFEEFAC-DEC7-0000-0001-ABCDEFFEDCBA" id="deployJavaPlugin" width="0" height="0"></object>'):"Netscape Family"==a&&this.allowPlugin()&&this.writeEmbedTag()},refresh:function(){navigator.plugins.refresh(!1);"Netscape Family"==this.getBrowser()&&this.allowPlugin()&&null==
document.getElementById("deployJavaPlugin")&&this.writeEmbedTag()},writeEmbedTag:function(){var a=!1;if(null!=navigator.mimeTypes){for(var b=0;b<navigator.mimeTypes.length;b++)navigator.mimeTypes[b].type==this.mimeType&&navigator.mimeTypes[b].enabledPlugin&&(document.write('<embed id="deployJavaPlugin" type="'+this.mimeType+'" hidden="true" />'),a=!0);if(!a)for(b=0;b<navigator.mimeTypes.length;b++)navigator.mimeTypes[b].type==this.oldMimeType&&navigator.mimeTypes[b].enabledPlugin&&document.write('<embed id="deployJavaPlugin" type="'+
this.oldMimeType+'" hidden="true" />')}}};c.writePluginTag();if(null==c.locale){e=null;if(null==e)try{e=navigator.userLanguage}catch(a){}if(null==e)try{e=navigator.systemLanguage}catch(a){}if(null==e)try{e=navigator.language}catch(a){}null!=e&&(e.replace("-","_"),c.locale=e)}return c}();var Detector=function(){var f=["monospace","sans-serif","serif"],d=document.getElementsByTagName("body")[0],e=document.createElement("span");e.style.fontSize="72px";e.innerHTML="mmmmmmmmmmlli";var p={},b={},c;for(c in f)e.style.fontFamily=f[c],d.appendChild(e),p[f[c]]=e.offsetWidth,b[f[c]]=e.offsetHeight,d.removeChild(e);this.detect=function(a){var c=!1,n;for(n in f){e.style.fontFamily=a+","+f[n];d.appendChild(e);var v=e.offsetWidth!=p[f[n]]||e.offsetHeight!=b[f[n]];d.removeChild(e);c=c||v}return c}};function murmurhash3_32_gc(f,d){var e,p,b,c,a;e=f.length&3;p=f.length-e;b=d;for(a=0;a<p;)c=f.charCodeAt(a)&255|(f.charCodeAt(++a)&255)<<8|(f.charCodeAt(++a)&255)<<16|(f.charCodeAt(++a)&255)<<24,++a,c=3432918353*(c&65535)+((3432918353*(c>>>16)&65535)<<16)&4294967295,c=c<<15|c>>>17,c=461845907*(c&65535)+((461845907*(c>>>16)&65535)<<16)&4294967295,b^=c,b=b<<13|b>>>19,b=5*(b&65535)+((5*(b>>>16)&65535)<<16)&4294967295,b=(b&65535)+27492+(((b>>>16)+58964&65535)<<16);c=0;switch(e){case 3:c^=(f.charCodeAt(a+
2)&255)<<16;case 2:c^=(f.charCodeAt(a+1)&255)<<8;case 1:c^=f.charCodeAt(a)&255,c=3432918353*(c&65535)+((3432918353*(c>>>16)&65535)<<16)&4294967295,c=c<<15|c>>>17,b^=461845907*(c&65535)+((461845907*(c>>>16)&65535)<<16)&4294967295}b^=f.length;b^=b>>>16;b=2246822507*(b&65535)+((2246822507*(b>>>16)&65535)<<16)&4294967295;b^=b>>>13;b=3266489909*(b&65535)+((3266489909*(b>>>16)&65535)<<16)&4294967295;return(b^b>>>16)>>>0};var swfobject=function(){function f(){if(!y){try{var a=l.getElementsByTagName("body")[0].appendChild(l.createElement("span"));a.parentNode.removeChild(a)}catch(b){return}y=!0;for(var a=F.length,c=0;c<a;c++)F[c]()}}function d(a){y?a():F[F.length]=a}function e(a){if("undefined"!=typeof r.addEventListener)r.addEventListener("load",a,!1);else if("undefined"!=typeof l.addEventListener)l.addEventListener("load",a,!1);else if("undefined"!=typeof r.attachEvent)B(r,"onload",a);else if("function"==typeof r.onload){var b=
r.onload;r.onload=function(){b();a()}}else r.onload=a}function p(){var a=l.getElementsByTagName("body")[0],c=l.createElement("object");c.setAttribute("type","application/x-shockwave-flash");var d=a.appendChild(c);if(d){var g=0;(function(){if("undefined"!=typeof d.GetVariable){var h=d.GetVariable("$version");h&&(h=h.split(" ")[1].split(","),k.pv=[parseInt(h[0],10),parseInt(h[1],10),parseInt(h[2],10)])}else if(10>g){g++;setTimeout(arguments.callee,10);return}a.removeChild(c);d=null;b()})()}else b()}
function b(){var b=x.length;if(0<b)for(var z=0;z<b;z++){var d=x[z].id,h=x[z].callbackFn,f={success:!1,id:d};if(0<k.pv[0]){var e=m(d);if(e)if(!C(x[z].swfVersion)||k.wk&&312>k.wk)if(x[z].expressInstall&&a()){f={};f.data=x[z].expressInstall;f.width=e.getAttribute("width")||"0";f.height=e.getAttribute("height")||"0";e.getAttribute("class")&&(f.styleclass=e.getAttribute("class"));e.getAttribute("align")&&(f.align=e.getAttribute("align"));for(var l={},e=e.getElementsByTagName("param"),q=e.length,u=0;u<
q;u++)"movie"!=e[u].getAttribute("name").toLowerCase()&&(l[e[u].getAttribute("name")]=e[u].getAttribute("value"));g(f,l,d,h)}else n(e),h&&h(f);else A(d,!0),h&&(f.success=!0,f.ref=c(d),h(f))}else A(d,!0),h&&((d=c(d))&&"undefined"!=typeof d.SetVariable&&(f.success=!0,f.ref=d),h(f))}}function c(a){var b=null;(a=m(a))&&"OBJECT"==a.nodeName&&("undefined"!=typeof a.SetVariable?b=a:(a=a.getElementsByTagName("object")[0])&&(b=a));return b}function a(){return!G&&C("6.0.65")&&(k.win||k.mac)&&!(k.wk&&312>k.wk)}
function g(a,b,c,d){G=!0;J=d||null;L={success:!1,id:c};var g=m(c);if(g){"OBJECT"==g.nodeName?(E=v(g),H=null):(E=g,H=c);a.id="SWFObjectExprInst";if("undefined"==typeof a.width||!/%$/.test(a.width)&&310>parseInt(a.width,10))a.width="310";if("undefined"==typeof a.height||!/%$/.test(a.height)&&137>parseInt(a.height,10))a.height="137";l.title=l.title.slice(0,47)+" - Flash Player Installation";d=k.ie&&k.win?"ActiveX":"PlugIn";d="MMredirectURL="+r.location.toString().replace(/&/g,"%26")+"&MMplayerType="+
d+"&MMdoctitle="+l.title;b.flashvars="undefined"!=typeof b.flashvars?b.flashvars+("&"+d):d;k.ie&&k.win&&4!=g.readyState&&(d=l.createElement("div"),c+="SWFObjectNew",d.setAttribute("id",c),g.parentNode.insertBefore(d,g),g.style.display="none",function(){4==g.readyState?g.parentNode.removeChild(g):setTimeout(arguments.callee,10)}());h(a,b,c)}}function n(a){if(k.ie&&k.win&&4!=a.readyState){var b=l.createElement("div");a.parentNode.insertBefore(b,a);b.parentNode.replaceChild(v(a),b);a.style.display="none";
(function(){4==a.readyState?a.parentNode.removeChild(a):setTimeout(arguments.callee,10)})()}else a.parentNode.replaceChild(v(a),a)}function v(a){var b=l.createElement("div");if(k.win&&k.ie)b.innerHTML=a.innerHTML;else if(a=a.getElementsByTagName("object")[0])if(a=a.childNodes)for(var c=a.length,d=0;d<c;d++)1==a[d].nodeType&&"PARAM"==a[d].nodeName||8==a[d].nodeType||b.appendChild(a[d].cloneNode(!0));return b}function h(a,b,c){var d,g=m(c);if(k.wk&&312>k.wk)return d;if(g)if("undefined"==typeof a.id&&
(a.id=c),k.ie&&k.win){var h="",f;for(f in a)a[f]!=Object.prototype[f]&&("data"==f.toLowerCase()?b.movie=a[f]:"styleclass"==f.toLowerCase()?h+=' class="'+a[f]+'"':"classid"!=f.toLowerCase()&&(h+=" "+f+'="'+a[f]+'"'));f="";for(var e in b)b[e]!=Object.prototype[e]&&(f+='<param name="'+e+'" value="'+b[e]+'" />');g.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+h+">"+f+"</object>";I[I.length]=a.id;d=m(a.id)}else{e=l.createElement("object");e.setAttribute("type","application/x-shockwave-flash");
for(var q in a)a[q]!=Object.prototype[q]&&("styleclass"==q.toLowerCase()?e.setAttribute("class",a[q]):"classid"!=q.toLowerCase()&&e.setAttribute(q,a[q]));for(h in b)b[h]!=Object.prototype[h]&&"movie"!=h.toLowerCase()&&(a=e,f=h,q=b[h],c=l.createElement("param"),c.setAttribute("name",f),c.setAttribute("value",q),a.appendChild(c));g.parentNode.replaceChild(e,g);d=e}return d}function u(a){var b=m(a);b&&"OBJECT"==b.nodeName&&(k.ie&&k.win?(b.style.display="none",function(){if(4==b.readyState){var c=m(a);
if(c){for(var d in c)"function"==typeof c[d]&&(c[d]=null);c.parentNode.removeChild(c)}}else setTimeout(arguments.callee,10)}()):b.parentNode.removeChild(b))}function m(a){var b=null;try{b=l.getElementById(a)}catch(c){}return b}function B(a,b,c){a.attachEvent(b,c);D[D.length]=[a,b,c]}function C(a){var b=k.pv;a=a.split(".");a[0]=parseInt(a[0],10);a[1]=parseInt(a[1],10)||0;a[2]=parseInt(a[2],10)||0;return b[0]>a[0]||b[0]==a[0]&&b[1]>a[1]||b[0]==a[0]&&b[1]==a[1]&&b[2]>=a[2]?!0:!1}function q(a,b,c,d){if(!k.ie||
!k.mac){var h=l.getElementsByTagName("head")[0];h&&(c=c&&"string"==typeof c?c:"screen",d&&(K=w=null),w&&K==c||(d=l.createElement("style"),d.setAttribute("type","text/css"),d.setAttribute("media",c),w=h.appendChild(d),k.ie&&k.win&&"undefined"!=typeof l.styleSheets&&0<l.styleSheets.length&&(w=l.styleSheets[l.styleSheets.length-1]),K=c),k.ie&&k.win?w&&"object"==typeof w.addRule&&w.addRule(a,b):w&&"undefined"!=typeof l.createTextNode&&w.appendChild(l.createTextNode(a+" {"+b+"}")))}}function A(a,b){if(M){var c=
b?"visible":"hidden";y&&m(a)?m(a).style.visibility=c:q("#"+a,"visibility:"+c)}}function N(a){return null!=/[\\\"<>\.;]/.exec(a)&&"undefined"!=typeof encodeURIComponent?encodeURIComponent(a):a}var r=window,l=document,t=navigator,O=!1,F=[function(){O?p():b()}],x=[],I=[],D=[],E,H,J,L,y=!1,G=!1,w,K,M=!0,k=function(){var a="undefined"!=typeof l.getElementById&&"undefined"!=typeof l.getElementsByTagName&&"undefined"!=typeof l.createElement,b=t.userAgent.toLowerCase(),c=t.platform.toLowerCase(),d=c?/win/.test(c):
/win/.test(b),c=c?/mac/.test(c):/mac/.test(b),b=/webkit/.test(b)?parseFloat(b.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):!1,h=!+"\v1",g=[0,0,0],f=null;if("undefined"!=typeof t.plugins&&"object"==typeof t.plugins["Shockwave Flash"])!(f=t.plugins["Shockwave Flash"].description)||"undefined"!=typeof t.mimeTypes&&t.mimeTypes["application/x-shockwave-flash"]&&!t.mimeTypes["application/x-shockwave-flash"].enabledPlugin||(O=!0,h=!1,f=f.replace(/^.*\s+(\S+\s+\S+$)/,"$1"),g[0]=parseInt(f.replace(/^(.*)\..*$/,
"$1"),10),g[1]=parseInt(f.replace(/^.*\.(.*)\s.*$/,"$1"),10),g[2]=/[a-zA-Z]/.test(f)?parseInt(f.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0);else if("undefined"!=typeof r.ActiveXObject)try{var e=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");e&&(f=e.GetVariable("$version"))&&(h=!0,f=f.split(" ")[1].split(","),g=[parseInt(f[0],10),parseInt(f[1],10),parseInt(f[2],10)])}catch(m){}return{w3:a,pv:g,wk:b,ie:h,win:d,mac:c}}();(function(){k.w3&&(("undefined"!=typeof l.readyState&&"complete"==l.readyState||
"undefined"==typeof l.readyState&&(l.getElementsByTagName("body")[0]||l.body))&&f(),y||("undefined"!=typeof l.addEventListener&&l.addEventListener("DOMContentLoaded",f,!1),k.ie&&k.win&&(l.attachEvent("onreadystatechange",function(){"complete"==l.readyState&&(l.detachEvent("onreadystatechange",arguments.callee),f())}),r==top&&function(){if(!y){try{l.documentElement.doScroll("left")}catch(a){setTimeout(arguments.callee,0);return}f()}}()),k.wk&&function(){y||(/loaded|complete/.test(l.readyState)?f():
setTimeout(arguments.callee,0))}(),e(f)))})();(function(){k.ie&&k.win&&window.attachEvent("onunload",function(){for(var a=D.length,b=0;b<a;b++)D[b][0].detachEvent(D[b][1],D[b][2]);a=I.length;for(b=0;b<a;b++)u(I[b]);for(var c in k)k[c]=null;k=null;for(var d in swfobject)swfobject[d]=null;swfobject=null})})();return{registerObject:function(a,b,c,d){if(k.w3&&a&&b){var h={};h.id=a;h.swfVersion=b;h.expressInstall=c;h.callbackFn=d;x[x.length]=h;A(a,!1)}else d&&d({success:!1,id:a})},getObjectById:function(a){if(k.w3)return c(a)},
embedSWF:function(b,c,f,e,m,q,l,u,p,r){var n={success:!1,id:c};k.w3&&!(k.wk&&312>k.wk)&&b&&c&&f&&e&&m?(A(c,!1),d(function(){f+="";e+="";var d={};if(p&&"object"===typeof p)for(var k in p)d[k]=p[k];d.data=b;d.width=f;d.height=e;k={};if(u&&"object"===typeof u)for(var B in u)k[B]=u[B];if(l&&"object"===typeof l)for(var t in l)k.flashvars="undefined"!=typeof k.flashvars?k.flashvars+("&"+t+"="+l[t]):t+"="+l[t];if(C(m))B=h(d,k,c),d.id==c&&A(c,!0),n.success=!0,n.ref=B;else{if(q&&a()){d.data=q;g(d,k,c,r);return}A(c,
!0)}r&&r(n)})):r&&r(n)},switchOffAutoHideShow:function(){M=!1},ua:k,getFlashPlayerVersion:function(){return{major:k.pv[0],minor:k.pv[1],release:k.pv[2]}},hasFlashPlayerVersion:C,createSWF:function(a,b,c){if(k.w3)return h(a,b,c)},showExpressInstall:function(b,c,d,h){k.w3&&a()&&g(b,c,d,h)},removeSWF:function(a){k.w3&&u(a)},createCSS:function(a,b,c,d){k.w3&&q(a,b,c,d)},addDomLoadEvent:d,addLoadEvent:e,getQueryParamValue:function(a){var b=l.location.search||l.location.hash;if(b){/\?/.test(b)&&(b=b.split("?")[1]);
if(null==a)return N(b);for(var b=b.split("&"),c=0;c<b.length;c++)if(b[c].substring(0,b[c].indexOf("="))==a)return N(b[c].substring(b[c].indexOf("=")+1))}return""},expressInstallCallback:function(){if(G){var a=m("SWFObjectExprInst");a&&E&&(a.parentNode.replaceChild(E,a),H&&(A(H,!0),k.ie&&k.win&&(E.style.display="block")),J&&J(L));G=!1}}}}();(function(f,d){var e={extend:function(a,b){for(var c in b)-1!=="browser cpu device engine os".indexOf(c)&&0===b[c].length%2&&(a[c]=b[c].concat(a[c]));return a},has:function(a,b){return"string"===typeof a?-1!==b.toLowerCase().indexOf(a.toLowerCase()):!1},lowerize:function(a){return a.toLowerCase()},major:function(a){return"string"===typeof a?a.split(".")[0]:d}},p=function(){for(var a,b=0,c,f,g,e,p,n,r=arguments;b<r.length&&!p;){var l=r[b],t=r[b+1];if("undefined"===typeof a)for(g in a={},t)t.hasOwnProperty(g)&&
(e=t[g],"object"===typeof e?a[e[0]]=d:a[e]=d);for(c=f=0;c<l.length&&!p;)if(p=l[c++].exec(this.getUA()))for(g=0;g<t.length;g++)n=p[++f],e=t[g],"object"===typeof e&&0<e.length?2==e.length?a[e[0]]="function"==typeof e[1]?e[1].call(this,n):e[1]:3==e.length?a[e[0]]="function"!==typeof e[1]||e[1].exec&&e[1].test?n?n.replace(e[1],e[2]):d:n?e[1].call(this,n,e[2]):d:4==e.length&&(a[e[0]]=n?e[3].call(this,n.replace(e[1],e[2])):d):a[e]=n?n:d;b+=2}return a},b=function(a,b){for(var c in b)if("object"===typeof b[c]&&
0<b[c].length)for(var f=0;f<b[c].length;f++){if(e.has(b[c][f],a))return"?"===c?d:c}else if(e.has(b[c],a))return"?"===c?d:c;return a},c={ME:"4.90","NT 3.11":"NT3.51","NT 4.0":"NT4.0",2E3:"NT 5.0",XP:["NT 5.1","NT 5.2"],Vista:"NT 6.0",7:"NT 6.1",8:"NT 6.2","8.1":"NT 6.3",10:["NT 6.4","NT 10.0"],RT:"ARM"},a={browser:[[/(opera\smini)\/([\w\.-]+)/i,/(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,/(opera).+version\/([\w\.]+)/i,/(opera)[\/\s]+([\w\.]+)/i],["name","version"],[/\s(opr)\/([\w\.]+)/i],[["name",
"Opera"],"version"],[/(kindle)\/([\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i,/(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,/(?:ms|\()(ie)\s([\w\.]+)/i,/(rekonq)\/([\w\.]+)*/i,/(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs)\/([\w\.-]+)/i],["name","version"],[/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i],[["name","IE"],"version"],[/(edge)\/((\d+)?[\w\.]+)/i],["name","version"],[/(yabrowser)\/([\w\.]+)/i],
[["name","Yandex"],"version"],[/(comodo_dragon)\/([\w\.]+)/i],[["name",/_/g," "],"version"],[/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i,/(qqbrowser)[\/\s]?([\w\.]+)/i],["name","version"],[/(uc\s?browser)[\/\s]?([\w\.]+)/i,/ucweb.+(ucbrowser)[\/\s]?([\w\.]+)/i,/JUC.+(ucweb)[\/\s]?([\w\.]+)/i],[["name","UCBrowser"],"version"],[/(dolfin)\/([\w\.]+)/i],[["name","Dolphin"],"version"],[/((?:android.+)crmo|crios)\/([\w\.]+)/i],[["name","Chrome"],"version"],[/XiaoMi\/MiuiBrowser\/([\w\.]+)/i],
["version",["name","MIUI Browser"]],[/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)/i],["version",["name","Android Browser"]],[/FBAV\/([\w\.]+);/i],["version",["name","Facebook"]],[/fxios\/([\w\.-]+)/i],["version",["name","Firefox"]],[/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i],["version",["name","Mobile Safari"]],[/version\/([\w\.]+).+?(mobile\s?safari|safari)/i],["version","name"],[/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],["name",["version",b,{"1.0":"/8","1.2":"/1","1.3":"/3",
"2.0":"/412","2.0.2":"/416","2.0.3":"/417","2.0.4":"/419","?":"/"}]],[/(konqueror)\/([\w\.]+)/i,/(webkit|khtml)\/([\w\.]+)/i],["name","version"],[/(navigator|netscape)\/([\w\.-]+)/i],[["name","Netscape"],"version"],[/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,/(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i,/(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
/(links)\s\(([\w\.]+)/i,/(gobrowser)\/?([\w\.]+)*/i,/(ice\s?browser)\/v?([\w\._]+)/i,/(mosaic)[\/\s]([\w\.]+)/i],["name","version"]],cpu:[[/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],[["architecture","amd64"]],[/(ia32(?=;))/i],[["architecture",e.lowerize]],[/((?:i[346]|x)86)[;\)]/i],[["architecture","ia32"]],[/windows\s(ce|mobile);\sppc;/i],[["architecture","arm"]],[/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],[["architecture",/ower/,"",e.lowerize]],[/(sun4\w)[;\)]/i],[["architecture","sparc"]],
[/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i],[["architecture",e.lowerize]]],device:[[/\((ipad|playbook);[\w\s\);-]+(rim|apple)/i],["model","vendor",["type","tablet"]],[/applecoremedia\/[\w\.]+ \((ipad)/],["model",["vendor","Apple"],["type","tablet"]],[/(apple\s{0,1}tv)/i],[["model","Apple TV"],["vendor","Apple"]],[/(archos)\s(gamepad2?)/i,/(hp).+(touchpad)/i,/(kindle)\/([\w\.]+)/i,/\s(nook)[\w\s]+build\/(\w+)/i,/(dell)\s(strea[kpr\s\d]*[\dko])/i],
["vendor","model",["type","tablet"]],[/(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i],["model",["vendor","Amazon"],["type","tablet"]],[/(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i],[["model",b,{"Fire Phone":["SD","KF"]}],["vendor","Amazon"],["type","mobile"]],[/\((ip[honed|\s\w*]+);.+(apple)/i],["model","vendor",["type","mobile"]],[/\((ip[honed|\s\w*]+);/i],["model",["vendor","Apple"],["type","mobile"]],[/(blackberry)[\s-]?(\w+)/i,/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i,
/(hp)\s([\w\s]+\w)/i,/(asus)-?(\w+)/i],["vendor","model",["type","mobile"]],[/\(bb10;\s(\w+)/i],["model",["vendor","BlackBerry"],["type","mobile"]],[/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7)/i],["model",["vendor","Asus"],["type","tablet"]],[/(sony)\s(tablet\s[ps])\sbuild\//i,/(sony)?(?:sgp.+)\sbuild\//i],[["vendor","Sony"],["model","Xperia Tablet"],["type","tablet"]],[/(?:sony)?(?:(?:(?:c|d)\d{4})|(?:so[-l].+))\sbuild\//i],[["vendor","Sony"],["model","Xperia Phone"],["type",
"mobile"]],[/\s(ouya)\s/i,/(nintendo)\s([wids3u]+)/i],["vendor","model",["type","console"]],[/android.+;\s(shield)\sbuild/i],["model",["vendor","Nvidia"],["type","console"]],[/(playstation\s[34portablevi]+)/i],["model",["vendor","Sony"],["type","console"]],[/(sprint\s(\w+))/i],[["vendor",b,{HTC:"APA",Sprint:"Sprint"}],["model",b,{"Evo Shift 4G":"7373KT"}],["type","mobile"]],[/(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i],["vendor","model",["type","tablet"]],[/(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i,/(zte)-(\w+)*/i,
/(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i],["vendor",["model",/_/g," "],["type","mobile"]],[/(nexus\s9)/i],["model",["vendor","HTC"],["type","tablet"]],[/[\s\(;](xbox(?:\sone)?)[\s\);]/i],["model",["vendor","Microsoft"],["type","console"]],[/(kin\.[onetw]{3})/i],[["model",/\./g," "],["vendor","Microsoft"],["type","mobile"]],[/\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i,/mot[\s-]?(\w+)*/i,/(XT\d{3,4}) build\//i,/(nexus\s[6])/i],
["model",["vendor","Motorola"],["type","mobile"]],[/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i],["model",["vendor","Motorola"],["type","tablet"]],[/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n8000|sgh-t8[56]9|nexus 10))/i,/((SM-T\w+))/i],[["vendor","Samsung"],"model",["type","tablet"]],[/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-n900))/i,/(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i,/sec-((sgh\w+))/i],[["vendor","Samsung"],"model",["type","mobile"]],[/(samsung);smarttv/i],["vendor","model",["type","smarttv"]],
[/\(dtv[\);].+(aquos)/i],["model",["vendor","Sharp"],["type","smarttv"]],[/sie-(\w+)*/i],["model",["vendor","Siemens"],["type","mobile"]],[/(maemo|nokia).*(n900|lumia\s\d+)/i,/(nokia)[\s_-]?([\w-]+)*/i],[["vendor","Nokia"],"model",["type","mobile"]],[/android\s3\.[\s\w;-]{10}(a\d{3})/i],["model",["vendor","Acer"],["type","tablet"]],[/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i],[["vendor","LG"],"model",["type","tablet"]],[/(lg) netcast\.tv/i],["vendor","model",["type","smarttv"]],[/(nexus\s[45])/i,
/lg[e;\s\/-]+(\w+)*/i],["model",["vendor","LG"],["type","mobile"]],[/android.+(ideatab[a-z0-9\-\s]+)/i],["model",["vendor","Lenovo"],["type","tablet"]],[/linux;.+((jolla));/i],["vendor","model",["type","mobile"]],[/((pebble))app\/[\d\.]+\s/i],["vendor","model",["type","wearable"]],[/android.+;\s(glass)\s\d/i],["model",["vendor","Google"],["type","wearable"]],[/android.+(\w+)\s+build\/hm\1/i,/android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,/android.+(mi[\s\-_]*(?:one|one[\s_]plus)?[\s_]*(?:\d\w)?)\s+build/i],
[["model",/_/g," "],["vendor","Xiaomi"],["type","mobile"]],[/\s(tablet)[;\/\s]/i,/\s(mobile)[;\/\s]/i],[["type",e.lowerize],"vendor","model"]],engine:[[/windows.+\sedge\/([\w\.]+)/i],["version",["name","EdgeHTML"]],[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i,/(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,/(icab)[\/\s]([23]\.[\d\.]+)/i],["name","version"],[/rv\:([\w\.]+).*(gecko)/i],["version","name"]],os:[[/microsoft\s(windows)\s(vista|xp)/i],["name","version"],
[/(windows)\snt\s6\.2;\s(arm)/i,/(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],["name",["version",b,c]],[/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],[["name","Windows"],["version",b,c]],[/\((bb)(10);/i],[["name","BlackBerry"],"version"],[/(blackberry)\w*\/?([\w\.]+)*/i,/(tizen)[\/\s]([\w\.]+)/i,/(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i,/linux;.+(sailfish);/i],["name","version"],[/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i],
[["name","Symbian"],"version"],[/\((series40);/i],["name"],[/mozilla.+\(mobile;.+gecko.+firefox/i],[["name","Firefox OS"],"version"],[/(nintendo|playstation)\s([wids34portablevu]+)/i,/(mint)[\/\s\(]?(\w+)*/i,/(mageia|vectorlinux)[;\s]/i,/(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?([\w\.-]+)*/i,/(hurd|linux)\s?([\w\.]+)*/i,/(gnu)\s?([\w\.]+)*/i],["name","version"],[/(cros)\s[\w]+\s([\w\.]+\w)/i],[["name","Chromium OS"],
"version"],[/(sunos)\s?([\w\.]+\d)*/i],[["name","Solaris"],"version"],[/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i],["name","version"],[/(ip[honead]+)(?:.*os\s([\w]+)*\slike\smac|;\sopera)/i],[["name","iOS"],["version",/_/g,"."]],[/(mac\sos\sx)\s?([\w\s\.]+\w)*/i,/(macintosh|mac(?=_powerpc)\s)/i],[["name","Mac OS"],["version",/_/g,"."]],[/((?:open)?solaris)[\/\s-]?([\w\.]+)*/i,/(haiku)\s(\w+)/i,/(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i,/(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,
/(unix)\s?([\w\.]+)*/i],["name","version"]]},g=function(b,c){if(!(this instanceof g))return(new g(b,c)).getResult();var d=b||(f&&f.navigator&&f.navigator.userAgent?f.navigator.userAgent:""),n=c?e.extend(a,c):a;this.getBrowser=function(){var a=p.apply(this,n.browser);a.major=e.major(a.version);return a};this.getCPU=function(){return p.apply(this,n.cpu)};this.getDevice=function(){return p.apply(this,n.device)};this.getEngine=function(){return p.apply(this,n.engine)};this.getOS=function(){return p.apply(this,
n.os)};this.getResult=function(){return{ua:this.getUA(),browser:this.getBrowser(),engine:this.getEngine(),os:this.getOS(),device:this.getDevice(),cpu:this.getCPU()}};this.getUA=function(){return d};this.setUA=function(a){d=a;return this};this.setUA(d);return this};g.VERSION="0.7.10";g.BROWSER={NAME:"name",MAJOR:"major",VERSION:"version"};g.CPU={ARCHITECTURE:"architecture"};g.DEVICE={MODEL:"model",VENDOR:"vendor",TYPE:"type",CONSOLE:"console",MOBILE:"mobile",SMARTTV:"smarttv",TABLET:"tablet",WEARABLE:"wearable",
EMBEDDED:"embedded"};g.ENGINE={NAME:"name",VERSION:"version"};g.OS={NAME:"name",VERSION:"version"};"undefined"!==typeof exports?("undefined"!==typeof module&&module.exports&&(exports=module.exports=g),exports.UAParser=g):"function"===typeof define&&define.amd?define(function(){return g}):f.UAParser=g;var n=f.jQuery||f.Zepto;if("undefined"!==typeof n){var v=new g;n.ua=v.getResult();n.ua.get=function(){return v.getUA()};n.ua.set=function(a){v.setUA(a);a=v.getResult();for(var b in a)n.ua[b]=a[b]}}})("object"===
typeof window?window:this);

	// End all difine proccess