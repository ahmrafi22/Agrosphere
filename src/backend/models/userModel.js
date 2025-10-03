import sql from "../config/database.js"

export const userModel = {
  async createUser(userData) {
    const { name, email, password } = userData
    const result = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${password})
      RETURNING id, name, email, created_at
    `
    return result[0]
  },

  // Find user by email
  async findUserByEmail(email) {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `
    return result[0]
  },

  // Find user by ID
  async findUserById(id) {
    const result = await sql`
      SELECT id, name, email, phone, area, city, country, profile_pic, age, preferred_crops, created_at, updated_at
      FROM users WHERE id = ${id}
    `
    return result[0]
  },

  // Update user profile
  async updateUser(id, userData) {
    const { name, phone, area, city, country, age, preferred_crops } = userData
    const result = await sql`
      UPDATE users 
      SET name = ${name}, phone = ${phone}, area = ${area}, 
          city = ${city}, country = ${country}, age = ${age}, 
          preferred_crops = ${preferred_crops}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, name, email, phone, area, city, country, profile_pic, age, preferred_crops, updated_at
    `
    return result[0]
  },

  // Update profile picture
  async updateProfilePicture(id, profilePicUrl) {
    const result = await sql`
      UPDATE users 
      SET profile_pic = ${profilePicUrl}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, name, email, profile_pic, updated_at
    `
    return result[0]
  },
}
