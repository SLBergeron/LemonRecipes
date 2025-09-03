import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { Recipe } from "@/types"
import { cn } from "@/lib/utils"

interface BatchSauceCardProps {
  recipe: Recipe
}

export function BatchSauceCard({ recipe }: BatchSauceCardProps) {
  const [expanded, setExpanded] = useState(false)

  const getBorderColor = (color: string) => {
    switch (color) {
      case "#f7c52d": return "border-yellow-400"
      case "#dc3545": return "border-red-500"
      case "#28a745": return "border-green-500"
      default: return "border-border"
    }
  }

  const getBgColor = (color: string) => {
    switch (color) {
      case "#f7c52d": return "bg-yellow-50"
      case "#dc3545": return "bg-red-50"
      case "#28a745": return "bg-green-50"
      default: return "bg-card"
    }
  }

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all hover:shadow-md border-2",
      getBorderColor(recipe.color || ""),
      getBgColor(recipe.color || "")
    )}>
      {/* Recipe number badge */}
      <div 
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10"
        style={{ 
          backgroundColor: recipe.color, 
          color: recipe.color === "#f7c52d" ? "#92400e" : "white"
        }}
      >
        {recipe.number}
      </div>
      
      <CardHeader>
        <div className="space-y-2">
          <div className="text-2xl">{recipe.emoji}</div>
          <CardTitle className="text-lg leading-tight pr-12">
            {recipe.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Time:</span> {recipe.time} | 
            <span className="font-medium"> Uses:</span> {recipe.uses}
          </p>
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className="space-y-4 pt-0">
          <div>
            <p className="text-sm font-medium text-primary mb-2">Ingrédients:</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {recipe.ingredients}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-primary mb-2">Méthode:</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {recipe.method}
            </p>
          </div>
        </CardContent>
      )}
      
      <div className="px-6 pb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="w-full justify-center gap-2"
        >
          {expanded ? (
            <>
              Hide Recipe <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Show Recipe <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}