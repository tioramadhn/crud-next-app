import cookie from 'cookie'

export default function handler(req, res) {

  res.setHeader("Set-Cookie", cookie.serialize("session","",{
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    expires: new Date(0),
    sameSite: "strict",
    path: '/'
  }))
  res.status(200).json({ success: true });


}
