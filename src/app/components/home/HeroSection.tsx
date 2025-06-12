// C:\Users\Anirudha\Desktop\CogniCare\frontend\src\components\home\HeroSection.tsx
'use client';

import * as React from "react";
import Image from "next/image";
import Link from "next/link"; // For client-side navigation
import { Button } from "@/components/ui/button"; // Shadcn Button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Shadcn Card components
import { BrainCircuit, HeartPlus, MessageSquareWarning } from "lucide-react"; // Icons from lucide-react

// (You'll need to remove the props from the previous HeroSection if they are still there
// since this new version is a standalone component without direct backendMessage/error props)

const features = [
  { icon: BrainCircuit, title: "AI-Powered Insights", content: "Our advanced AI analyzes your well-being patterns and provides personalized recommendations." },
  { icon: MessageSquareWarning, title: "Proactive Support", content: "Get timely suggestions and information for your health concerns." },
  { icon: HeartPlus, title: "Personalized Wellness", content: "Receive tailored guidance designed to address your specific needs and goals." },
];

const steps = [
  { title: "Sign Up", content: "Create your account and tell us about your wellness goals and any concerns." },
  { title: "Engage with AI", content: "Interact with our AI to get personalized insights and pre-assessments." },
  { title: "Empower Your Health", content: "Follow your personalized plan and track your progress over time." },
];

const HeroSection: React.FC = () => (
  <>
    <section className="w-full min-h-[92dvh] bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 md:py-24 lg:py-32 pt-10"> {/* Added py for padding */}
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
          <div className="flex flex-col items-center md:items-start space-y-4 text-center md:text-left pt-10 md:pt-0 md:w-1/2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-black dark:text-blue-400">
              Personalized Wellness at Your Fingertips
            </h1>
            <p className="max-w-[700px] text-gray-600 md:text-xl dark:text-gray-300">
              CogniCare is your AI-powered companion, helping you proactively manage your health, understand symptoms, and enhance your quality of life.
            </p>
            <div className="flex space-x-4 mt-8">
              <Link href="/auth/signup" passHref> {/* Updated link to match your routes */}
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
              </Link>
              <Link href="#features" passHref>
                <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-100">Learn More</Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <Image src="/hero_bgr.png" alt="CogniCare Hero Image" fetchPriority="high" width={400} height={400} className="w-full h-auto"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>

    <section id="features" className="w-full py-16 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-gray-900 dark:text-white">Why Choose CogniCare?</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <feature.icon className="w-12 h-12 mb-4 text-green-600" />
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{feature.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    <section id="how-it-works" className="w-full py-16 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-gray-900 dark:text-white">How It Works</h2>
        <div className="grid gap-8 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold mb-4">{index + 1}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{step.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section id="cta" className="w-full py-16 md:py-24 lg:py-32 bg-blue-600 dark:bg-blue-800">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">Start Your Journey to Better Wellness</h2>
          <p className="mx-auto max-w-[600px] text-blue-100 md:text-lg">
            Thousands are already finding personalized health and well-being with CogniCare. Take the first step—sign up today!.
          </p>
          <Link href="/auth/signup" passHref>
            <Button size="lg" className="mt-8 bg-white text-blue-600 hover:bg-blue-50">Get Started Now</Button>
          </Link>
        </div>
      </div>
    </section>
  </>
);

export default HeroSection;