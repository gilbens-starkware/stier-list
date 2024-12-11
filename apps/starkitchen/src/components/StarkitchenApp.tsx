import { useState } from 'react';
import { Header } from './Header/Header';
import { useAccount, useProvider, useReadContract } from '@starknet-react/core';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar, Cat, Users, Wrench } from 'lucide-react';
import { AppTabs } from '../types/ui';
import { useMealData } from '../hooks/useMealData';
import { ManagementTab } from './ManagementTab/ManagementTab';
import { ABI, CONTRACT_ADDRESS } from '@/utils/consts';
import { TierListTab } from './TierListTab/TierListTab';
import TierListMaker from './TierListRank/TIerListRank';
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

  const sampleItems = [
    { id: '1', image: 'http://192.168.13.34:8000/images/1/' },
    { id: '2', image: '/placeholder.svg?height=64&width=64&text=2' },
    { id: '3', image: '/placeholder.svg?height=64&width=64&text=3' },
    { id: '4', image: '/placeholder.svg?height=64&width=64&text=4' },
    { id: '5', image: '/placeholder.svg?height=64&width=64&text=5' },
    { id: '6', image: '/placeholder.svg?height=64&width=64&text=6' },
    { id: '7', image: '/placeholder.svg?height=64&width=64&text=7' },
    { id: '8', image: '/placeholder.svg?height=64&width=64&text=8' },
  ]

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
              <Calendar className="mr-2 h-4 w-4" />
              TierList
            </TabsTrigger>
            <TabsTrigger value={AppTabs.TIER_LIST_MAKER}>
              <Cat />
              Tier List Maker
            </TabsTrigger>
            <TabsTrigger value={AppTabs.TIER_LIST_CREATE}>
              <Wrench />
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
          <TabsContent value={AppTabs.TIER_LIST_MAKER} className="space-y-12">
            <TierListMaker items={sampleItems} />
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
