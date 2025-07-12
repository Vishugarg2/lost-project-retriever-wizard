import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface User {
  id: string
  email: string
  name: string
  eco_points: number
  co2_saved: number
  level: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  barcode: string
  price: number
  eco_score: number
  co2_footprint: number
  carbon_percentage: string
  image: string
  category: string
  created_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  added_at: string
}

export interface EcoBotMessage {
  id: string
  user_id: string
  message: string
  response: string
  is_voice: boolean
  created_at: string
}

// Auth functions
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name
      }
    }
  })
  
  if (data.user && !error) {
    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: data.user.id,
          email,
          name,
          eco_points: 0,
          co2_saved: 0,
          level: 'Eco Beginner'
        }
      ])
    
    if (profileError) throw profileError
  }
  
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    return profile
  }
  return null
}

// Product functions
export const addProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single()
  
  return { data, error }
}

export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

// Cart functions
export const addToCart = async (userId: string, productId: string, quantity: number = 1) => {
  const { data, error } = await supabase
    .from('cart_items')
    .insert([{
      user_id: userId,
      product_id: productId,
      quantity
    }])
    .select()
    .single()
  
  return { data, error }
}

export const getCartItems = async (userId: string) => {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      products (*)
    `)
    .eq('user_id', userId)
  
  return { data, error }
}

export const removeFromCart = async (cartItemId: string) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId)
  
  return { error }
}

export const clearCart = async (userId: string) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
  
  return { error }
}

// EcoBot functions
export const saveBotMessage = async (userId: string, message: string, response: string, isVoice: boolean = false) => {
  const { data, error } = await supabase
    .from('eco_bot_messages')
    .insert([{
      user_id: userId,
      message,
      response,
      is_voice: isVoice
    }])
    .select()
    .single()
  
  return { data, error }
}

export const getBotHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from('eco_bot_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(50)
  
  return { data, error }
}

// User update functions
export const updateUserPoints = async (userId: string, pointsToAdd: number, co2ToAdd: number) => {
  const { data, error } = await supabase
    .from('users')
    .update({
      eco_points: pointsToAdd,
      co2_saved: co2ToAdd,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single()
  
  return { data, error }
}