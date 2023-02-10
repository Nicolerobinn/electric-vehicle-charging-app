import { type StationInter } from '../typings/stationType'

export const emailValidator = (email:string) => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) {
    return 'Email cannot be empty.';
  }
  if (!re.test(email)) {
    return 'Ooops! We need a valid email address.';
  }
  return '';
};

export const passwordValidator = (password:string) => {
  if (!password || password.length <= 0) {
    return 'Password cannot be empty.';
  }
  return '';
};

export const confirmPasswordValidator = (password:string) => {
  if (!password || password.length <= 0) {
    return 'Comfirm password cannot be empty.';
  }
  return '';
};

export const passwordMatch = (password1?:string, password2?:string) => {
  if (!password1 && !password2 && password1 !== password2) {
    return "Two Passwords don't match, please check again.";
  }
  return '';
};

/**
 * Station AC/DC type checker.
 * Rule: Check string contains "_CCS" or "_AA" then they are DC type, otherwise are AC type
 * todo: need to confirm this function
 *
 * @param {Object} connectorList - list of connecter
 * @return {String} type - AC/DC
 *
 */
export const connecterTypeChecker = (connectorList:string[]) => {
  const type = new Set();
  connectorList.forEach((connector) => {
    if (connector.includes('_CCS') || connector.includes('_AA')) {
      type.add('DC');
    } else {
      type.add('AC');
    }
  });

  return Array.from(type).join(' ');
};

export const arrayMapEqul = (arr:StationInter[], station:StationInter) => {
  arr.forEach((obj) => {
    if (obj?.smpctNumber === station.smpctNumber) {
      return true;
    }
  });
};
