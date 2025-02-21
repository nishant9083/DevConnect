'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
// import { createClient } from '@/utils/supabase/server'

import { headers } from 'next/headers'
import { RequestCookies } from "@edge-runtime/cookies";
import { createServerClient } from '@supabase/ssr'

async function createClient() {
 const cookies = new RequestCookies(headers()) as any;
  // "use server"
  // return createServerComponentClient({ cookies })
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            // Handle cookie setting error in read-only contexts
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set(name, '', options)
          } catch (error) {
            // Handle cookie removal error in read-only contexts
          }
        },
      },
    }
  )
}
export async function onSubmit(formData: FormData) {
  const supabase = await createClient()

  try {
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
      throw error
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
  } catch (error: any) {
    console.error('Sign in error:', error)
    redirect('/signin?error=' + encodeURIComponent(error.message))
  }
}