export const getResponseError = (e: any) => {
  return e.response?.data?.message || e.response?.message || e.message;
}
