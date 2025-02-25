import { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { MessageList } from '@/components/message-list'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Messages - DevConnect',
  description: 'Chat with other developers',
}

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: any
}) {
  const {user: user_name} = await searchParams;
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: selectedUser } = user_name ? await supabase
    .from('profiles')
    .select('*')
    .eq('username', user_name)
    .single() : { data: null }

  return (
    <div className="p-8 ">
      <div className="mb-8 sm:hidden">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">
          Chat with other developers
        </p>
      </div>

      <MessageList 
        currentUser={currentProfile} 
        selectedUser={selectedUser}
      />
    </div>
  )
}