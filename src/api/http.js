import http from "./service.js";

export const searchWebConfigById = async function (id) {
  const { data: res } = await http.post("/getConfig", {
    id,
  });
  return res.data.data;
};

export const login = async function (info) {
  const { data: res } = await http.post("/user/login", info);
  return res;
};

export const getAllProjectByRole = async function () {
  const { data: res } = await http.post("/project/getAllProject");
  return res;
};

export const getAllUserByProjectId = async function (projectId) {
  const { data: res } = await http.post("/user/getProjectAllUser", {
    projectId,
  });
  return res;
};

export const getAllRouterByProject = async function (projectId) {
  const { data: res } = await http.post("/router/getAllRouterByAuthByProject", {
    projectId,
    auth: 2,
  });
  return res;
};

export const GetAllAuthByProjectId = async function (projectId) {
  const { data: res } = await http.post("/auth/GetAllAuthByProjectId", {
    projectId,
    auth: 2,
  });
  return res;
};
