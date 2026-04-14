import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Trash2 } from "lucide-react";

interface Conversation {
  id: number;
  prompt: string;
  response: string;
}

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  onDelete: (id: number) => void;
}

export function HistoryPanel({ isOpen, onClose, conversations, onDelete }: HistoryPanelProps) {
  const { toast } = useToast();

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard!",
        description: `${type} has been copied.`,
      });
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] sm:max-w-xl flex flex-col">
        <SheetHeader>
          <SheetTitle>Chat History</SheetTitle>
          <SheetDescription>
            Review your past conversations.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-grow overflow-hidden mt-4">
          <ScrollArea className="h-full pr-6">
            {conversations && conversations.length > 0 ? (
              <div className="space-y-4">
                {conversations.map((convo) => (
                  <Card key={convo.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Conversation</CardTitle>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(convo.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-semibold text-sm">Prompt</h4>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(convo.prompt, 'Prompt')}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm bg-muted p-2 rounded-md max-h-28 overflow-y-auto">{convo.prompt}</p>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-semibold text-sm">Response</h4>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(convo.response, 'Response')}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm bg-muted p-2 rounded-md max-h-48 overflow-y-auto">{convo.response}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground mt-8">No history found.</p>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}