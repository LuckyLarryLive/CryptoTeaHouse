import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Winner {
  id: number;
  publicKey: string;
  drawType: string;
  prize: string;
  createdAt: string;
  transactionSignature: string | null;
}

export default function Winners() {
  const { data: winners = [], isLoading } = useQuery<Winner[]>({
    queryKey: ['/api/winners'],
  });
  
  // Group winners by draw type
  const groupedWinners = winners.reduce((acc, winner) => {
    const drawType = winner.drawType;
    if (!acc[drawType]) {
      acc[drawType] = [];
    }
    acc[drawType].push(winner);
    return acc;
  }, {} as Record<string, Winner[]>);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // Format public key for display
  const formatPublicKey = (key: string) => {
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };
  
  return (
    <div className="pt-20 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Winners Circle</h1>
          <p className="text-xl text-light-300 max-w-3xl mx-auto">
            Fortune favors the brave. These lucky tea drinkers pulled their way to prosperity.
          </p>
        </div>
        
        <Tabs defaultValue="all" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="all">All Draws</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                // Loading skeleton
                Array(6).fill(0).map((_, idx) => (
                  <Card key={idx} className="bg-dark-800 border-dark-700">
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-dark-700 rounded w-1/4"></div>
                            <div className="h-6 bg-dark-700 rounded w-2/3"></div>
                          </div>
                          <div className="h-6 bg-dark-700 rounded w-1/4"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-dark-700 rounded w-1/4"></div>
                          <div className="h-8 bg-dark-700 rounded w-1/3"></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="h-4 bg-dark-700 rounded w-1/4"></div>
                          <div className="h-4 bg-dark-700 rounded w-1/3"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : winners.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-xl text-light-300">No winners found. Be the first!</p>
                </div>
              ) : (
                winners.map((winner) => (
                  <Card key={winner.id} className="bg-dark-800 border-dark-700 hover:shadow-xl transition-all hover:border-primary/30">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="text-sm text-light-300 mb-1">Wallet</div>
                          <div className="font-mono text-primary truncate w-36">{formatPublicKey(winner.publicKey)}</div>
                        </div>
                        <div className={`
                          ${winner.drawType === 'daily' ? 'bg-accent/20 text-accent' : 
                            winner.drawType === 'weekly' ? 'bg-secondary/20 text-secondary' : 
                            winner.drawType === 'monthly' ? 'bg-primary/20 text-primary' :
                            'bg-blue-500/20 text-blue-500'
                          } rounded-lg px-3 py-1 text-sm font-medium
                        `}>
                          {winner.drawType.charAt(0).toUpperCase() + winner.drawType.slice(1)} Draw
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="text-sm text-light-300 mb-1">Prize</div>
                        <div className="text-2xl font-bold">{winner.prize} SOL</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-light-300">{formatDate(winner.createdAt)}</div>
                        {winner.transactionSignature ? (
                          <a 
                            href={`https://explorer.solana.com/tx/${winner.transactionSignature}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary text-sm hover:underline"
                          >
                            View Transaction
                          </a>
                        ) : (
                          <span className="text-light-300 text-sm">Pending</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          {['daily', 'weekly', 'monthly', 'yearly'].map(drawType => (
            <TabsContent key={drawType} value={drawType}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  // Loading skeleton
                  Array(3).fill(0).map((_, idx) => (
                    <Card key={idx} className="bg-dark-800 border-dark-700">
                      <CardContent className="p-6">
                        <div className="animate-pulse space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="h-4 bg-dark-700 rounded w-1/4"></div>
                              <div className="h-6 bg-dark-700 rounded w-2/3"></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-4 bg-dark-700 rounded w-1/4"></div>
                            <div className="h-8 bg-dark-700 rounded w-1/3"></div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="h-4 bg-dark-700 rounded w-1/4"></div>
                            <div className="h-4 bg-dark-700 rounded w-1/3"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : groupedWinners[drawType]?.length ? (
                  groupedWinners[drawType].map((winner) => (
                    <Card key={winner.id} className="bg-dark-800 border-dark-700 hover:shadow-xl transition-all hover:border-primary/30">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="text-sm text-light-300 mb-1">Wallet</div>
                            <div className="font-mono text-primary truncate w-36">{formatPublicKey(winner.publicKey)}</div>
                          </div>
                          <div className={`
                            ${winner.drawType === 'daily' ? 'bg-accent/20 text-accent' : 
                              winner.drawType === 'weekly' ? 'bg-secondary/20 text-secondary' : 
                              winner.drawType === 'monthly' ? 'bg-primary/20 text-primary' :
                              'bg-blue-500/20 text-blue-500'
                            } rounded-lg px-3 py-1 text-sm font-medium
                          `}>
                            {winner.drawType.charAt(0).toUpperCase() + winner.drawType.slice(1)} Draw
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="text-sm text-light-300 mb-1">Prize</div>
                          <div className="text-2xl font-bold">{winner.prize} SOL</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-light-300">{formatDate(winner.createdAt)}</div>
                          {winner.transactionSignature ? (
                            <a 
                              href={`https://explorer.solana.com/tx/${winner.transactionSignature}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary text-sm hover:underline"
                            >
                              View Transaction
                            </a>
                          ) : (
                            <span className="text-light-300 text-sm">Pending</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-xl text-light-300">No {drawType} winners found yet. Stay tuned!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
