import {CHOOSE_AVATAR} from './actionTypes';

export const chooseAvatar = avatar => {
  return {
    type: CHOOSE_AVATAR,
    avatar: avatar,
  };
};
