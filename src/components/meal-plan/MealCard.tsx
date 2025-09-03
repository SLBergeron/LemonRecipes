import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { MealCard as MealCardType } from "@/types"

interface MealCardProps {
  meal: MealCardType
}

export function MealCard({ meal }: MealCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-md">
      {/* Day letter badge */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-lemon text-lemon-foreground rounded-full flex items-center justify-center font-bold text-sm z-10">
        {meal.day_letter}
      </div>
      
      <CardHeader>
        <div className="space-y-2">
          <div className="text-2xl">{meal.emoji}</div>
          <CardTitle className="text-lg leading-tight pr-12">
            {meal.day} — {meal.title}
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium text-primary">Protein:</p>
          <p className="text-sm text-muted-foreground">{meal.protein}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-primary">Sides:</p>
          <p className="text-sm text-muted-foreground">{meal.sides}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-primary">Prep:</p>
          <p className="text-sm text-muted-foreground">{meal.prep}</p>
        </div>
        
        {meal.sauce && (
          <div>
            <p className="text-sm font-medium text-primary">Sauce:</p>
            <p className="text-sm text-muted-foreground">{meal.sauce}</p>
          </div>
        )}
        
        {expanded && meal.notes && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium text-primary">Notes:</p>
            <p className="text-sm text-muted-foreground">{meal.notes}</p>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="w-full justify-center gap-2 mt-4"
        >
          {expanded ? (
            <>
              Show Less <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              More Details <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}