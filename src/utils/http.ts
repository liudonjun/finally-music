import VueAxios from "./VueAxios";
import { encryption } from "./paramsAES";
//get
const getAction = (url: String, params: any = {}) => {
  let time = new Date().getTime();
  return VueAxios({
    url: url,
    method: "get",
    params: {
      key: encryption(JSON.stringify(Object.assign(params, { _t: time }))),
    },
  });
};

export { getAction };
