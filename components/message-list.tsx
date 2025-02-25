'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SendIcon } from 'lucide-react'
import { set } from 'date-fns'

interface Profile {
  id: string
  username: string
  full_name: string
}

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  sender: Profile
  receiver: Profile
}

export function MessageList({ 
  currentUser, 
  selectedUser 
}: { 
  currentUser: Profile
  selectedUser: Profile | null
}) {
  const supabase = createClient()
  const [conversations, setConversations] = useState<Profile[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [activeChat, setActiveChat] = useState<Profile | null>(selectedUser)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState('messages')  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (selectedUser) {
      setActiveChat(selectedUser)
    }
  }, [selectedUser])

  useEffect(() => {
    const fetchConversations = async () => {
      const { data } = await supabase
        .from('messages')
        .select(`
          sender:sender_id(id, username, full_name),
          receiver:receiver_id(id, username, full_name)
        `)
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false })

      if (data) {
        const uniqueUsers = new Map<string, Profile>()
        data.forEach((msg: any) => {
          const otherUser = msg.sender.id === currentUser.id ? msg.receiver : msg.sender
          if (!uniqueUsers.has(otherUser.id)) {
            uniqueUsers.set(otherUser.id, otherUser)
          }
        })
        setConversations(Array.from(uniqueUsers.values()))
      }
    }

    fetchConversations()
  }, [currentUser.id, supabase])

  useEffect(() => {
    if (!activeChat) return

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(id, username, full_name),
          receiver:receiver_id(id, username, full_name)
        `)
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${activeChat.id}),and(sender_id.eq.${activeChat.id},receiver_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true })

      if (data) {
        setMessages(data)
        scrollToBottom()
      }
    }

    fetchMessages()

    // Subscribe to new messages
    if (!activeChat.id || !currentUser.id) {
      console.error('Invalid IDs for subscription');
      return;
    }
    
    const filter = `sender_id=eq.${activeChat.id}`;// , receiver_id=eq.${currentUser.id}`;
    console.log(`Filter: ${filter}`);
    
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: filter,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((current) => [...current, newMessage]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeChat, currentUser.id, supabase])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeChat) return

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: currentUser.id,
        receiver_id: activeChat.id,
        content: newMessage.trim(),
      })

    if (!error) {
      setNewMessage('')
    }
  }

  return (
    <Card className="h-[calc(100vh-rem)]">
      <Tabs defaultValue={activeTab} className="h-full" value={activeTab}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className='hidden sm:block'>Messages</CardTitle>
            <TabsList>
              <TabsTrigger className='cursor-pointer' onClick={()=>setActiveTab('messages')} value="messages">Messages</TabsTrigger>
              <TabsTrigger className='cursor-pointer' value="contacts" onClick={()=>setActiveTab('contacts')}>Contacts</TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent className="flex h-[calc(100vh-10rem)] gap-4 p-0">
          <TabsContent value="messages" className="h-full w-full">
            <div className="flex h-full">
              <div className="w-64 border-r hidden sm:block">
                <ScrollArea className="h-full">
                  {conversations.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => setActiveChat(user)}
                      className={`flex w-full items-center gap-3 p-3 hover:bg-muted ${
                        activeChat?.id === user.id ? 'bg-muted' : ''
                      }`}
                    >
                      <Avatar className="h-10 w-10">
                        <img
                          src={`https://avatar.vercel.sh/${user.username}`}
                          alt={user.full_name}
                        />
                      </Avatar>
                      <div className="text-left">
                        <p className="font-medium">{user.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          @{user.username}
                        </p>
                      </div>
                    </button>
                  ))}
                </ScrollArea>
              </div>

              <div className="flex flex-1 flex-col">
                {activeChat ? (
                  <>
                    <div className="border-b p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <img
                            src={`https://avatar.vercel.sh/${activeChat.username}`}
                            alt={activeChat.full_name}
                          />
                        </Avatar>
                        <div>
                          <p className="font-medium">{activeChat.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            @{activeChat.username}
                          </p>
                        </div>
                      </div>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.map((message) => {
                          const isCurrentUser = message.sender_id === currentUser.id
                          return (
                            <div
                              key={message.id}
                              className={`flex ${
                                isCurrentUser ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div
                                className={`rounded-lg px-4 py-2 ${
                                  isCurrentUser
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <p>{message.content}</p>
                              </div>
                            </div>
                          )
                        })}
                        <div />
                      </div>
                    </ScrollArea>

                    <form
                      onSubmit={sendMessage}
                      className="flex gap-2 border-t p-4"
                    >
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <Button type="submit">
                        <SendIcon className="h-4 w-4" />
                      </Button>
                    </form>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">
                      Select a conversation to start messaging
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="h-full w-full">
            <ScrollArea className="h-full px-4">
              {conversations.map((user) => (
                <Card key={user.id} className="mb-4">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <img
                        src={`https://avatar.vercel.sh/${user.username}`}
                        alt={user.full_name}
                      />
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{user.full_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        @{user.username}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setActiveTab('messages')
                        setActiveChat(user)
                      }}
                    >
                      Send Message
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}