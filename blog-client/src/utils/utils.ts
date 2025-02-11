export function GetBase64Url(file: File): Promise<{ url: string }> {
    return new Promise((reslove) => {
      const reader = new FileReader();
      reader.onloadend = async (e: any) => {
        reslove({ url: e.target.result });
      };
      reader.onerror = () => {
        reslove({ url: '' });
      };
      reader.readAsDataURL(file);
    });
  }
  
  function getCookiesList(cookies: string) {
    return cookies.split('; ').map((item) => {
      const newArr = item.split('=');
      return {
        name: newArr[0],
        value: newArr[1],
      };
    });
  }
  
  export function getCookie(cookies: string, name: string) {
    try {
      const cookiesList = getCookiesList(cookies);
      return cookiesList.filter((item) => item.name === name)[0].value;
    } catch (error) {
      return '';
    }
  }