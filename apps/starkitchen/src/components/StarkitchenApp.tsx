import { useState } from 'react';
import { Header } from './Header/Header';
import { useAccount, } from '@starknet-react/core';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ChartBarDecreasing, Users, WandSparkles } from 'lucide-react';
import { AppTabs } from '../types/ui';
import { useMealData } from '../hooks/useMealData';
import { ManagementTab } from './ManagementTab/ManagementTab';
import { TierListTab } from './TierListTab/TierListTab';
import { CreateTab } from './CreateTab/CreateTab';

/// A function to create the main StarkitchenApp component.
export const StarkitchenApp = () => {
  const starknetWallet = useAccount();
  /// useState is a React hook that allows you to have state variables which can be accessed and updated in your component.
  /// In this case, we can access the activeTab value through the activeTab variable.
  /// We can also update the activeTab value by calling the setActiveTab function. This will cause the component to re-render.
  const [activeTab, setActiveTab] = useState<string>(AppTabs.MEAL_REGISTRATION);
  const {
    isAdmin,
    setSuccessFetchingUserEvents,
  } = useMealData();

  const onConnectWallet = async () => {
    setSuccessFetchingUserEvents(false);
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100">
      <Header wallet={starknetWallet} onConnectWallet={onConnectWallet} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value={AppTabs.TIER_LIST}>
              <ChartBarDecreasing className="mr-2 h-4 w-4" />
              View Tier Lists & Vote
            </TabsTrigger>
            <TabsTrigger value={AppTabs.TIER_LIST_CREATE}>
              <WandSparkles />
              Create Tier List
            </TabsTrigger>

            {isAdmin ? (
              <TabsTrigger value={AppTabs.MANAGEMENT}>
                <Users className="mr-2 h-4 w-4" />
                Management
              </TabsTrigger>
            ) : null}
          </TabsList>
          <TabsContent value={AppTabs.TIER_LIST} className="space-y-12">
            <TierListTab activeTab={activeTab} />
          </TabsContent>
          <TabsContent value={AppTabs.TIER_LIST_CREATE} className="space-y-12">
            <CreateTab />
          </TabsContent>
          {isAdmin ? (
            <TabsContent value={AppTabs.MANAGEMENT} className="space-y-12">
              <ManagementTab />
            </TabsContent>
          ) : null}
        </Tabs>
      </main>
    </div>
  );
};
