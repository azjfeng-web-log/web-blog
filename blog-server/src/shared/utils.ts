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
