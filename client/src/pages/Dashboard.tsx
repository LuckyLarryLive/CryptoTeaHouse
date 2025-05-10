import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@/contexts/WalletContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const { user } = useWallet();

  if (!user?.id) {
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

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">0</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Daily Pulls</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-secondary">0/1</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Winnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-accent">0 SOL</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-light-300 text-center py-4">No tickets yet</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-light-300 text-center py-4">No recent activity</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
