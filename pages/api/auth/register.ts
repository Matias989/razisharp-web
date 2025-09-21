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
    const { username, email, password } = req.body

    // Validaciones básicas
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Faltan campos requeridos' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' })
    }

    if (username.length < 3) {
      return res.status(400).json({ message: 'El nombre de usuario debe tener al menos 3 caracteres' })
    }

    const users = await getCollection('users')

    // Verificar si el usuario ya existe
    const existingUser = await users.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' })
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crear usuario
    const user = {
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      isAdmin: false
    }

    const result = await users.insertOne(user)

    // Crear JWT token
    const token = jwt.sign(
      { userId: result.insertedId, username },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    const response: AuthResponse = {
      message: 'Usuario creado exitosamente',
      token,
      user: {
        id: result.insertedId.toString(),
        username,
        email,
        isAdmin: false
      }
    }

    res.status(201).json(response)
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}
