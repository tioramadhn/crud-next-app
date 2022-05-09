import cookie from 'cookie'

export default function handler(req, res) {

  if(!req.body.token){
    res.status(404).json({success: false}).end()
  }

  res.setHeader("Set-Cookie", cookie.serialize("session", req.body.token,{
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 60*60,
    sameSite: "strict",
    path: '/'
  }))
  res.status(200).json({ success: true });


}
