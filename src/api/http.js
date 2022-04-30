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

export const getAllUserByProjectId = async function (params) {
  const { data: res } = await http.post("/user/getProjectAllUser", params);
  return res;
};

export const getAllRouterByAuthByProject = async function (projectId) {
  const { data: res } = await http.post("/router/getAllRouterByAuthByProject", {
    projectId,
  });
  return res;
};

export const getAllRouterByAuthByAdminProject = async function (projectId) {
  const { data: res } = await http.post(
    "/router/getAllRouterByAuthByAdminProject",
    {
      projectId,
    }
  );
  return res;
};

export const GetAllAuthByProjectId = async function (projectId) {
  const { data: res } = await http.post("/auth/GetAllAuthByProjectId", {
    projectId,
  });
  return res;
};

export const registerUser = async function (params) {
  const { data: res } = await http.post("/user/register", params);
  return res;
};

export const setUserAuth = async function (params) {
  const { data: res } = await http.post("/user/setUserAuth", params);
  return res;
};

export const getAllWebCOnfig = async function () {
  const { data: res } = await http.post("/getConfigByUser");
  return res;
};

export const addRouter = async function (params) {
  const { data: res } = await http.post("/router/addRouter", params);
  return res;
};

export const addButton = async function (params) {
  const { data: res } = await http.post("/button/addButton", params);
  return res;
};

export const getOneRouterById = async function (params) {
  const { data: res } = await http.post("/router/getOneRouterById", params);
  return res;
};

export const getButton = async function (params) {
  const { data: res } = await http.post("/button/getButton", params);
  return res;
};

export const setRouter = async function (params) {
  const { data: res } = await http.post("/router/setRouterById", params);
  return res;
};

export const addRole = async function (params) {
  const { data: res } = await http.post("/auth/addRole", params);
  return res;
};

export const getProjectAndShowProject = async function (params) {
  const { data: res } = await http.post(
    "/project/getProjectAndShowProject",
    params
  );
  return res;
};

export const getAllRouterByAdminProject = async function (params) {
  const { data: res } = await http.post(
    "/router/getAllRouterByAdminProject",
    params
  );
  return res;
};
