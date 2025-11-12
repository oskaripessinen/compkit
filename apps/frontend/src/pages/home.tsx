import { supabase } from "@/lib/supabase"
import { Footer } from "@/components/home/footer"
import { Hero } from "@/components/home/hero"



const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    }
  })
  if (error) console.error('Google signIn error:', error)
}



const Home = () => {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Hero signInWithGoogle={signInWithGoogle} />
      <Footer />
    </div>
  ) 
}

export default Home