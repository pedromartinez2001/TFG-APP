const User = require('../models/user.model')
const bcryptjs=require('bcryptjs')
const { OAuth2Client } = require('google-auth-library')
const createAccessToken=require('../libs/jwt')

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const register=async(req,res)=>{ 
    const {email,username,password}= req.body
    
  try{
    const passwordHash=await bcryptjs.hash(password,10)
    const newUser= new User({
        email,
        username,
        password:passwordHash
    })
   const savedUser= await newUser.save()
   const token=await createAccessToken({id:savedUser.id})
//    res.cookie('token',token)
   res.json({message:"'Usuario creado'"})

  }catch(error){
    res.status(500).json({message: 'Este correo ya fue utilizado. Utiliza otro.'})
  }
    
}

const getCookieOptions = (req) => {
  const isSecureRequest = req.secure || req.headers['x-forwarded-proto'] === 'https'

  return {
    httpOnly: true,
    secure: isSecureRequest,
    sameSite: isSecureRequest ? 'none' : 'lax',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000
  }
}

const createSessionResponse = async (req, res, user) => {
  const token = await createAccessToken({ id: user.id })

  res.cookie('token', token, getCookieOptions(req))

  return res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  })
}

const login=async (req,res)=>{
     const {email,password}= req.body
     try {
        const userFound= await User.findOne({email})
        if(!userFound) return res.status(400).json({message:'El usuario no existe.'})

        if (!userFound.password) {
          return res.status(400).json({message:'Cuenta de Google. Usa el botón de Google para iniciar sesión.'})
        }
        
        const isMatch = await bcryptjs.compare(password,userFound.password)
        if(!isMatch) return res.status(400).json({message:'Contraseña incorrecta'})

        return await createSessionResponse(req, res, userFound)
     } catch (error) {
        res.status(500).json({message: 'Error al iniciar sesión'})
     }
    
}

const loginWithGoogle = async (req, res) => {
  const { credential } = req.body

  if (!credential) {
    return res.status(400).json({ message: 'Token de Google requerido.' })
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()

    if (!payload?.email) {
      return res.status(400).json({ message: 'No se pudo verificar la cuenta de Google.' })
    }

    let user = await User.findOne({ email: payload.email })

    if (!user) {
      user = new User({
        username: payload.name || payload.given_name || payload.email.split('@')[0],
        email: payload.email,
        password: payload.sub,
      })

      await user.save()
    }

    return await createSessionResponse(req, res, user)
  } catch (error) {
    return res.status(401).json({ message: 'La autenticación con Google falló.' })
  }
}

const logout=(req,res)=>{
    const cookieOptions = getCookieOptions(req)

    res.cookie('token', '', {
      ...cookieOptions,
      expires: new Date(0)
    })
    return res.sendStatus(200)
}

const profile=async(req,res)=>{
   const userFound= await User.findById(req.user.id)
   if(!userFound) return res.status(400).json({message:'El usuario no existe.'})
        return res.json({
            id:userFound.id,
            username:userFound.username,
            email:userFound.email,
            createdAt:userFound.createdAt,
            updatedAt:userFound.updatedAt
        })
}

module.exports={register,login,logout,profile,loginWithGoogle}

