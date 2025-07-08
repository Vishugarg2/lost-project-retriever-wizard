import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVoted?: string;
}

const EcoPoll = () => {
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: "1",
      question: "What's your biggest barrier to sustainable shopping?",
      options: [
        { id: "price", text: "Higher prices", votes: 142 },
        { id: "availability", text: "Limited availability", votes: 89 },
        { id: "convenience", text: "Less convenient", votes: 56 },
        { id: "quality", text: "Quality concerns", votes: 34 },
      ],
      totalVotes: 321,
    },
    {
      id: "2",
      question: "Which eco-friendly feature matters most to you?",
      options: [
        { id: "packaging", text: "Sustainable packaging", votes: 178 },
        { id: "local", text: "Local sourcing", votes: 234 },
        { id: "organic", text: "Organic ingredients", votes: 156 },
        { id: "carbon", text: "Carbon neutral shipping", votes: 98 },
      ],
      totalVotes: 666,
    },
  ]);

  const handleVote = (pollId: string, optionId: string) => {
    setPolls(prevPolls =>
      prevPolls.map(poll => {
        if (poll.id === pollId) {
          if (poll.userVoted) {
            toast.error("You've already voted in this poll!");
            return poll;
          }

          const updatedOptions = poll.options.map(option =>
            option.id === optionId
              ? { ...option, votes: option.votes + 1 }
              : option
          );

          toast.success("Thank you for voting! 🗳️");

          return {
            ...poll,
            options: updatedOptions,
            totalVotes: poll.totalVotes + 1,
            userVoted: optionId,
          };
        }
        return poll;
      })
    );
  };

  return (
    <div className="space-y-4">
      {polls.map((poll) => (
        <Card key={poll.id}>
          <CardHeader>
            <CardTitle className="text-base">{poll.question}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{poll.totalVotes} votes</Badge>
              {poll.userVoted && (
                <Badge className="bg-emerald-100 text-emerald-700">✓ Voted</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {poll.options.map((option) => {
              const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
              const isSelected = poll.userVoted === option.id;

              return (
                <div key={option.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVote(poll.id, option.id)}
                      disabled={!!poll.userVoted}
                      className={`flex-1 justify-start ${
                        isSelected ? "bg-emerald-600 hover:bg-emerald-700" : ""
                      }`}
                    >
                      {option.text}
                    </Button>
                    <span className="text-sm text-muted-foreground ml-2">
                      {option.votes} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  {poll.userVoted && (
                    <Progress value={percentage} className="h-2" />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EcoPoll;