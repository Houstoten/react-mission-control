"use client"

import { Button } from "@/components/ui/button"
import { Command } from "lucide-react"
import { useExposeActions } from "react-expose"

export function DemoButton() {
  const actions = useExposeActions();
  
  return (
    <Button 
      size="lg" 
      variant="outline" 
      className="gap-2"
      onClick={() => actions.activate()}
    >
      <Command className="w-4 h-4" />
      Try Demo (↑↑)
    </Button>
  )
}