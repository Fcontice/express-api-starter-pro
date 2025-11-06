export const sendAuthCookies = (res, access, refresh) => {
  const prod = process.env.NODE_ENV === "production";
  res.cookie("accessToken", access, {
    httpOnly: true, sameSite: "lax", secure: prod, maxAge: 15 * 60 * 1000
  });
  res.cookie("refreshToken", refresh, {
    httpOnly: true, sameSite: "lax", secure: prod, maxAge: 7 * 24 * 60 * 60 * 1000
  });
};
