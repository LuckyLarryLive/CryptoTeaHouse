import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import LuckyCat from "@/components/LuckyCat";
import { Activity, Ticket } from "@/types";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

interface NextDraw {
  type: string;
  drawTime: string;
}

export default function Dashboard() {
  const { user } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user tickets
  const {
    data: tickets = [],
    isLoading: ticketsLoading,
    error: ticketsError,
    refetch: refetchTickets
  } = useQuery({
    queryKey: [`/api/user/${user?.id}/tickets`],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/tickets/user/${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch tickets');
      return response.json();
    },
    enabled: !!user?.id,
    retry: 1
  });

  // Fetch next draw times
  const { 
    data: nextDraws = [],
    error: drawsError,
    isLoading: drawsLoading
  } = useQuery({
    queryKey: ['/api/draws/upcoming'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/draws/upcoming`);
      if (!response.ok) throw new Error('Failed to fetch draws');
      return response.json();
    },
    enabled: !!user?.id,
    retry: 1
  });
  
  // Fetch user activities
  const {
    data: activities = [],
    isLoading: activitiesLoading,
    error: activitiesError,
    refetch: refetchActivities
  } = useQuery({
    queryKey: [`/api/user/${user?.id}/activities`],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/activities/user/${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch activities');
      return response.json();
    },
    enabled: !!user?.id,
    retry: 1
  });

  // Log user state changes
  useEffect(() => {
    console.log('[Dashboard] User state changed:', {
      hasUser: !!user,
      userId: user?.id,
      isProfileComplete: user?.is_profile_complete,
      userData: user
    });
  }, [user]);

  // Log data fetching state
  useEffect(() => {
    console.log('[Dashboard] Data fetching state:', {
      ticketsLoading,
      activitiesLoading,
      drawsLoading,
      hasTickets: tickets.length > 0,
      hasActivities: activities.length > 0,
      hasDraws: nextDraws.length > 0
    });
  }, [ticketsLoading, activitiesLoading, drawsLoading, tickets, activities, nextDraws]);

  // Handle errors
  useEffect(() => {
    if (ticketsError) {
      console.error('Error fetching tickets:', ticketsError);
      toast({
        title: "Error",
        description: "Failed to load tickets. Please try again.",
        variant: "destructive"
      });
    }
    if (drawsError) {
      console.error('Error fetching draws:', drawsError);
      toast({
        title: "Error",
        description: "Failed to load upcoming draws. Please try again.",
        variant: "destructive"
      });
    }
    if (activitiesError) {
      console.error('Error fetching activities:', activitiesError);
      toast({
        title: "Error",
        description: "Failed to load activities. Please try again.",
        variant: "destructive"
      });
    }
  }, [ticketsError, drawsError, activitiesError, toast]);

  // Format countdown time
  const formatTimeUntil = (drawTime: string) => {
    const now = new Date();
    const drawDate = new Date(drawTime);
    const diffMs = drawDate.getTime() - now.getTime();
    
    if (diffMs <= 0) return "Drawing now...";
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    let timeString = "";
    if (diffDays > 0) timeString += `${diffDays}d `;
    if (diffHours > 0 || diffDays > 0) timeString += `${diffHours}h `;
    timeString += `${diffMinutes}m`;
    
    return timeString;
  };
  
  // Get countdown for specific ticket type
  const getCountdown = (type: string) => {
    const draw = nextDraws.find((d: NextDraw) => d.type === type);
    if (!draw) return "TBA";
    return formatTimeUntil(draw.drawTime);
  };
  
  // Format date for activity display
  const formatActivityDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " • " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle pull completion
  const handlePullComplete = () => {
    // Refresh tickets and activities data
    setRefreshing(true);
    Promise.all([
      refetchTickets(),
      refetchActivities()
    ]).finally(() => {
      setRefreshing(false);
    });
  };
  
  // Show loading state if any data is loading
  if (!user?.id) {
    console.log('[Dashboard] No user ID, showing loading state');
    return (
      <div className="min-h-screen pt-20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-4xl">
              <div className="animate-pulse space-y-8">
                <div className="h-12 bg-dark-700 rounded-lg w-3/4 mx-auto"></div>
                <div className="h-96 bg-dark-700 rounded-xl"></div>
                <div className="h-12 bg-dark-700 rounded-lg w-1/2 mx-auto"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-dark-700 rounded-xl"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state if any data is loading
  if (ticketsLoading || activitiesLoading || drawsLoading) {
    console.log('[Dashboard] Data loading, showing loading state');
    return (
      <div className="min-h-screen pt-20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-4xl">
              <div className="animate-pulse space-y-8">
                <div className="h-12 bg-dark-700 rounded-lg w-3/4 mx-auto"></div>
                <div className="h-96 bg-dark-700 rounded-xl"></div>
                <div className="h-12 bg-dark-700 rounded-lg w-1/2 mx-auto"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-dark-700 rounded-xl"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if any data failed to load
  if (ticketsError || drawsError || activitiesError) {
    console.log('[Dashboard] Error loading data:', {
      ticketsError,
      drawsError,
      activitiesError
    });
    return (
      <div className="min-h-screen pt-20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="bg-dark-800 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h2>
              <p className="text-light-300 mb-4">Failed to load dashboard data. Please try again.</p>
              <Button
                onClick={() => {
                  console.log('[Dashboard] Retrying data fetch');
                  refetchTickets();
                  refetchActivities();
                }}
                className="bg-primary hover:bg-primary/90"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Welcome to the <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Crypto Tea House</span>
          </h2>
          
          {/* Lucky Cat Interactive Element */}
          <LuckyCat onPullComplete={handlePullComplete} />
          
          {/* Ticket Collection Information */}
          <div className="w-full max-w-2xl">
            <h3 className="text-2xl font-bold mb-4 text-center">Your Collected Tickets</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Daily */}
              <div className="bg-dark-800 rounded-xl p-4 text-center border border-dark-700 hover:border-primary/50 transition-all">
                <div className="text-lg font-medium text-primary mb-2">Daily</div>
                <div className="text-3xl font-bold">
                  {ticketsLoading ? 
                    <span className="inline-block w-10 h-10 bg-dark-700 animate-pulse rounded"></span> :
                    tickets.find((t: Ticket) => t.type === 'daily')?.count || 0
                  }
                </div>
                <div className="text-sm text-light-300 mt-2">Next draw in: {getCountdown('daily')}</div>
              </div>
              
              {/* Weekly */}
              <div className="bg-dark-800 rounded-xl p-4 text-center border border-dark-700 hover:border-secondary/50 transition-all">
                <div className="text-lg font-medium text-secondary mb-2">Weekly</div>
                <div className="text-3xl font-bold">
                  {ticketsLoading ? 
                    <span className="inline-block w-10 h-10 bg-dark-700 animate-pulse rounded"></span> :
                    tickets.find((t: Ticket) => t.type === 'weekly')?.count || 0
                  }
                </div>
                <div className="text-sm text-light-300 mt-2">Next draw in: {getCountdown('weekly')}</div>
              </div>
              
              {/* Monthly */}
              <div className="bg-dark-800 rounded-xl p-4 text-center border border-dark-700 hover:border-accent/50 transition-all">
                <div className="text-lg font-medium text-accent mb-2">Monthly</div>
                <div className="text-3xl font-bold">
                  {ticketsLoading ? 
                    <span className="inline-block w-10 h-10 bg-dark-700 animate-pulse rounded"></span> :
                    tickets.find((t: Ticket) => t.type === 'monthly')?.count || 0
                  }
                </div>
                <div className="text-sm text-light-300 mt-2">Next draw in: {getCountdown('monthly')}</div>
              </div>
              
              {/* Yearly */}
              <div className="bg-dark-800 rounded-xl p-4 text-center border border-dark-700 hover:border-blue-500/50 transition-all">
                <div className="text-lg font-medium text-blue-500 mb-2">Yearly</div>
                <div className="text-3xl font-bold">
                  {ticketsLoading ? 
                    <span className="inline-block w-10 h-10 bg-dark-700 animate-pulse rounded"></span> :
                    tickets.find((t: Ticket) => t.type === 'yearly')?.count || 0
                  }
                </div>
                <div className="text-sm text-light-300 mt-2">Next draw in: {getCountdown('yearly')}</div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">Recent Activity</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-light-300 hover:text-white"
                  onClick={() => refetchActivities()}
                  disabled={refreshing}
                >
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
              
              <div className="bg-dark-800 rounded-xl overflow-hidden">
                <div className="divide-y divide-dark-700">
                  {activitiesLoading ? (
                    // Loading skeleton
                    Array(3).fill(0).map((_, idx) => (
                      <div key={idx} className="p-4 hover:bg-dark-700/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-dark-700 animate-pulse mr-4"></div>
                            <div>
                              <div className="h-5 w-32 bg-dark-700 animate-pulse rounded mb-2"></div>
                              <div className="h-4 w-24 bg-dark-700 animate-pulse rounded"></div>
                            </div>
                          </div>
                          <div className="h-6 w-16 bg-dark-700 animate-pulse rounded"></div>
                        </div>
                      </div>
                    ))
                  ) : activities.length === 0 ? (
                    <div className="p-8 text-center text-light-300">
                      No activity yet. Pull the lucky cat to start earning rewards!
                    </div>
                  ) : (
                    activities.map((activity) => (
                      <div key={activity.id} className="p-4 hover:bg-dark-700/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full ${
                              activity.type === 'reward' ? 'bg-primary/20' : 
                              activity.type === 'ticket_earned' ? 'bg-secondary/20' : 'bg-accent/20'
                            } flex items-center justify-center mr-4`}>
                              {activity.type === 'reward' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                </svg>
                              ) : activity.type === 'ticket_earned' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">
                                {activity.type === 'reward' ? 'Pull Reward' : 
                                 activity.type === 'ticket_earned' ? `${activity.details?.pullType || 'Ticket'} Ticket Earned` :
                                 'Activity'}
                              </div>
                              <div className="text-sm text-light-300">{formatActivityDate(activity.createdAt)}</div>
                            </div>
                          </div>
                          <div className={`text-lg font-bold ${
                            activity.type === 'reward' ? 'text-primary' : 
                            activity.type === 'ticket_earned' ? 'text-secondary' : 'text-accent'
                          }`}>
                            {activity.type === 'reward' ? 
                              `+${activity.details?.prize} SOL` : 
                              activity.type === 'ticket_earned' ? 
                              '+1 Ticket' : ''}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
