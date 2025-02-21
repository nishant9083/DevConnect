// app/api/auth/login/route.ts (API route)
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()

  const body = await req.json()
  const { email, password } = body  

  // Authenticate the user
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    console.error('Sign in error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  // Create a response to send back
  const response = NextResponse.json({ message: 'Login successful'}, {status: 200})


  return response
}
