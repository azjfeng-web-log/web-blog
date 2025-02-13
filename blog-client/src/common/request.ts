export function request(url: string, method?: string, params?: any) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: method || "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res?.status === 401) {
          window.location.href = "/#login";
          return;
        }
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

export function requestFile(url: string, method?: string, params?: any) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: method || "POST",
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
      body: params,
    })
      .then((response) => response.json())
      .then((res) => {
        if (res?.status === 401) {
          window.location.href = "/#login";
          return;
        }
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}


export async function CheckLogin(url, params = {}) {
  const result = await request(url, "", params);
  return result;
}

export async function UseLogin(url, params = {}) {
  const result = await request(url, "", params);
  return result;
}

export async function Logout() {
  const result = await request('/auth/logout', "", {});
  return result;
}

export async function CreateBlog(params = {}) {
  const result = await request('/blogs/create', "", params);
  return result;
}


export async function QueryBlog(params = {}) {
  const result = await request('/blogs/query', "", params);
  return result;
}

export async function UploadFiles(params = {}) {
  const result = await requestFile('/upload/file', "", params);
  return result;
}