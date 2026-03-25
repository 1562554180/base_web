import { isFieldValid, isValidPort } from 'utils/form';
import _ from 'lodash';

export function ip(nv) {
  if (!nv) return true;
  const v = nv.split('.');
  if (v.length > 4) {
    return false;
  }
  let i = 0;
  for (const item of v) {
    i += 1;
    if (!item) {
      return i === v.length;
    }
    const d = Number(item);
    if (isNaN(d) || d > 255) {
      return false;
    }
  }

  return (v.length < 4 || !v[3] || isFieldValid(nv, 'ipv4') === true);
}

export function ipRange(nv) {
  if (!nv) return false;
  let v = nv.split('/');
  if (v.length !== 2) return false;
  let d = parseInt(v[1], 10);
  if (isNaN(d) || d <= 0 || d > 32) {
    return false;
  }
  v = v[0].split('.');
  if (v.length !== 4) return false;
  for (const item of v) {
    d = parseInt(item, 10);
    if (isNaN(d) || d > 255 || d < 0) {
      return false;
    }
  }
}

function isValidMaskItem(iv) {
  if (iv === 255) return true;

  let mask = 0x80;
  let cnt = 0;
  let isZero = false;

  while (cnt < 8) {
    if ((iv & mask) === 0) {
      isZero = true;
    } else if (isZero) {
      return false;
    }
    cnt += 1;
    mask >>= 1;
  }

  return true;
}

export function number(v) {
  const nv = v * 1;
  return _.isNumber(nv) && !isNaN(nv);
}

export function ipMask(nv) {
  if (!nv) return true;

  const v = nv.split('.');
  if (v.length > 4) {
    return false;
  }

  let i = 0;
  let is255 = true;
  const last = v.length - 1;

  for (const item of v) {
    if (!item) {
      return i === v.length - 1;
    }
    const iv = parseInt(item, 10);
    if (iv > 255) {
      return false;
    }
    if (i === last) {
      break;
    }
    if (i === 0 && iv === 0) {
      return false;
    }
    if (!is255 && iv !== 0) {
      return false;
    }
    if (!isValidMaskItem(iv)) {
      return false;
    }
    if (iv !== 255) {
      is255 = false;
    }
    i += 1;
  }
  
  return true;
}

export function port(nv) {
  return !nv || isValidPort(nv);
}

export function isLetter(v) {
  const n=/^[a-zA-Z_]{1,}$/;
  if(v.match(n)) {
    return true;
  }
  return false;
}

export function verifyIp(nv) {
  
  if (!nv) return true;
  const v = nv.split('.');
  if (v.length > 4) {
    return false;
  }
  let i = 0;
  v.forEach(item => {
    if(item !== '') {
      const d = Number(item);
      if (isNaN(d) || d > 255 || d < 0) {
        i = 1;
        return false;
      }
    }
  })
  if(i !== 0) {
    return false;
  }
  return true;
}


// IP 正则验证
export function regexpCheckIp (ip) {
  if (!ip) return false;
  const ipCheck = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
  return ipCheck.test(ip);
  // const ipCheck = /^25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)$/;
  // const maskCheck = /^((()))
}

// 去除头尾空格
export function trimStr (str){
  if(str === "") return "";
  return str.replace(/(^\s*)|(\s*$)/g,"");
}

export function ipPort (nv) {
  if (!nv) return true;
  if(nv.indexOf(':') > 0){
    const text = nv.split(':');
    let isIp = true;
    let port = true;
    if(text[0] !== ''){
      isIp = ip(text[0]);
    }
    if(text[1] !== ''){
      port = isPort(text[1]);
    }
    if(isIp && port){
      return true;
    } else {
      return false;
    }
  } else {
    return ip(nv);
  }
}

export function isPort(nv) {
  if (nv.indexOf(':') > -1) {
    const brr = nv.split(':');
    const n1 = Number(brr[0]);
    const n2 = Number(brr[1]);
    if((n1 && !isNaN(n1)) && (n2 || !isNaN(n2)) && n1 >= 0 && n2 <= 65535) {
      return true;
    }
  }

   const v = Number(nv);
   if (v >= 1 && v <= 65535) {
     return true;
   }

  return false;
}