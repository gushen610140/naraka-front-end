import http from "../utils/http.ts";

export const getSessionAPI = async () => {
  const { data }: Result<Session[]> = await http({
    url: "/session",
    method: "get",
  });
  return new Promise((resolve, reject) => {
    if (data) {
      resolve(data);
    } else {
      reject("请求失败");
    }
  });
};
