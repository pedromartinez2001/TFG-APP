const User = require('../models/user.model')
const bcryptjs=require('bcryptjs')
const createAccessToken=require('../libs/jwt')

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

const login=async (req,res)=>{
     const {email,password}= req.body
     try {
        const userFound= await User.findOne({email})
        if(!userFound) return res.status(400).json({message:'El usuario no existe.'})
        
            const isMatch = await bcryptjs.compare(password,userFound.password)
        if(!isMatch) return res.status(400).json({message:'Contraseña incorrecta'})
            const token=await createAccessToken({id:userFound.id})
        res.cookie('token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 24 * 60 * 60 * 1000
        })
        res.json({
            id:userFound.id,
            username:userFound.username,
            email:userFound.email,
            createdAt:userFound.createdAt,
            updatedAt:userFound.updatedAt
        })
     } catch (error) {
        res.status(500).json({message: 'Error al iniciar sesión'})
     }
    
}

const logout=(req,res)=>{
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
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

module.exports={register,login,logout,profile}

