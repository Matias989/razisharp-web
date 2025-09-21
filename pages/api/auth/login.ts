import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { getCollection } from '../../../lib/mongodb'
import jwt from 'jsonwebtoken'
import { AuthResponse } from '../../../types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Faltan credenciales' })
    }

    const users = await getCollection('users')

    // Buscar usuario
    const user = await users.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    // Crear JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    const response: AuthResponse = {
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin || false
      }
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}
