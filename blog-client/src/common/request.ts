export function request(url: string, options: any, callback?: any) {
  return new Promise((resolve, reject) => {
    fetch(url, options)
    .then((response) => response.json())
    .then((res)=> {
        resolve(res);
    })
    .catch((err) => {
        reject(err);
    });
  });
}


export async function getHello(url, options?: any){
    const result = await request(url, options)
    return result;
}

export async function login(url, options?: any){
    const result = await request(url, options)
    return result;
}