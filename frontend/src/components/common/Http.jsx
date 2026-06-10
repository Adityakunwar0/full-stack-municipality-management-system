export const apiurl = 'http://localhost:8000/api/';
export const fileUrl = 'http://localhost:8000/';

export const token = () => {
  const userInfo = localStorage.getItem("userInfo");
  if (!userInfo) return null; // Safe check: returns null if user isn't logged in

  const data = JSON.parse(userInfo);
  return data ? data.token : null;
};
