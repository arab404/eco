import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Shield, MessageCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-50 to-rose-100">
      <header className="w-full py-6 px-4 bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-rose-500" />
            <h1 className="text-2xl font-bold text-gray-900">Ecohub</h1>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-rose-500 hover:bg-rose-600" asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Find Your Perfect Match</h2>
              <p className="text-xl text-gray-600">
                Connect with like-minded individuals, build meaningful relationships, and discover your perfect match.
              </p>
              <div className="flex gap-4">
                <Button className="bg-rose-500 hover:bg-rose-600 text-lg py-6 px-8" size="lg" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg py-6 px-8" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative h-[500px] w-full max-w-[400px] mx-auto">
                <div className="absolute inset-0 rounded-3xl shadow-xl bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">App Interface Preview</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose Ecohub?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Users className="h-10 w-10 text-rose-500" />}
                title="Smart Matching"
                description="Our advanced algorithm finds compatible matches based on your preferences and interests."
              />
              <FeatureCard
                icon={<Shield className="h-10 w-10 text-rose-500" />}
                title="Verified Profiles"
                description="Account verification ensures you're connecting with real people who are serious about relationships."
              />
              <FeatureCard
                icon={<MessageCircle className="h-10 w-10 text-rose-500" />}
                title="Seamless Communication"
                description="Chat, video call, and join virtual clubs to connect in ways that feel natural to you."
              />
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-rose-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Subscription Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PlanCard
                title="Free"
                price="$0"
                features={[
                  "Create an account",
                  "Add up to 5 pictures",
                  "See who messaged you",
                  "Basic search functionality",
                  "Send up to 20 messages per day",
                ]}
                buttonText="Get Started"
                buttonVariant="outline"
              />
              <PlanCard
                title="Premium"
                price="$9.99/month"
                features={[
                  "Add up to 10 pictures",
                  "Audio calls",
                  "Advanced search filters",
                  "Join virtual clubs",
                  "Send up to 50 messages per day",
                ]}
                buttonText="Upgrade to Premium"
                buttonVariant="default"
                highlighted={true}
              />
              <PlanCard
                title="Gold"
                price="$19.99/month"
                features={[
                  "Unlimited pictures & videos",
                  "Video calls & conferences",
                  "Send & receive media",
                  "Priority in search results",
                  "Unlimited messaging",
                ]}
                buttonText="Upgrade to Gold"
                buttonVariant="outline"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 text-rose-400" />
                <h3 className="text-xl font-bold">Ecohub</h3>
              </div>
              <p className="text-gray-400">Connecting hearts in the digital age.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-rose-400">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-rose-400">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-rose-400">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/terms" className="hover:text-rose-400">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-rose-400">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-rose-400">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-rose-400">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="hover:text-rose-400">
                    Safety Tips
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-rose-400">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Ecohub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <div className="mb-2">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

function PlanCard({
  title,
  price,
  features,
  buttonText,
  buttonVariant = "default",
  highlighted = false,
}: {
  title: string
  price: string
  features: string[]
  buttonText: string
  buttonVariant?: "default" | "outline"
  highlighted?: boolean
}) {
  return (
    <Card className={`border-2 ${highlighted ? "border-rose-500 shadow-xl" : "border-gray-200 shadow-md"}`}>
      <CardHeader className={highlighted ? "bg-rose-50" : ""}>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-3xl font-bold text-gray-900">{price}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-rose-500 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant={buttonVariant} className={`w-full ${highlighted ? "bg-rose-500 hover:bg-rose-600" : ""}`}>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}
