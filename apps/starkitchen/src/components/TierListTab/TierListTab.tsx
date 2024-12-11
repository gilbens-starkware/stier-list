import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ABI, CONTRACT_ADDRESS } from "@/utils/consts";
import { act, useEffect, useState } from "react";
import { useProvider, useReadContract } from "@starknet-react/core";
import { shortString } from "starknet";
import { Button } from "@/components/ui/button";
import TierListMaker from "../TierListRank/TIerListRank";
import TierListViewer from "../TierListView/TierListView";

interface TierList {
    id: number;
    name: string;
    creation_time: any;
}

const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });
};


const fetchImage = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Failed to fetch image:', error);
        throw error;
    }
};

const sampleItems = [
    { id: '1', image: 'http://192.168.13.34:8000/images/1/' },
    { id: '2', image: 'http://192.168.13.34:8000/images/2/' },
    { id: '3', image: 'http://192.168.13.34:8000/images/3/' },
    { id: '4', image: 'http://192.168.13.34:8000/images/4/' },
    { id: '5', image: 'http://192.168.13.34:8000/images/5/' },
    { id: '6', image: 'http://192.168.13.34:8000/images/6/' },
    { id: '7', image: 'http://192.168.13.34:8000/images/7/' },
    { id: '8', image: 'http://192.168.13.34:8000/images/8/' },
]

const rankData = {
    S: {
        1: 3,
        2: 1,
        3: 2,
    },
    T: {
        1: 2,
        4: 3,
        5: 1,
    },
    A: {
        2: 4,
        3: 1,
        6: 2,
    },
    R: {
        4: 2,
        5: 3,
        7: 1,
    },
    K: {
        1: 1,
        6: 2,
        8: 3,
    },
}


interface List {
    id: number
    name: string
    creation_time?: string
}

interface Item {
    id: string
    image: string
}


interface ListViewerProps {
    lists: List[]
    loading: boolean
    error: string | null
}

export default function ListViewer({ lists, loading, error }: ListViewerProps) {
    const [activeListId, setActiveListId] = useState<number | null>(null)
    const [viewLists, setViewLists] = useState<boolean>(false)

    const handleActivateEvent = (id: number) => {
        console.log(`Activating event with ID: ${id}`)
        setActiveListId(id)
    }

    const handleViewLists = (id: number) => {
        console.log('Viewing lists')
        setViewLists(true)
    }

    if (activeListId !== null) {
        return (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Button onClick={() => setActiveListId(null)} className="mb-4">
                    Back to Lists
                </Button>
                <TierListMaker items={sampleItems} />
            </main>
        )
    }

    if (viewLists) {
        return (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Button onClick={() => setViewLists(false)} className="mb-4">
                    Back to Tier List
                </Button>
                <TierListViewer rankData={rankData} images={{}} />
            </main>
        )
    }

    return (
        <div className="space-y-8">
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lists.map((list) => (
                    <Card key={list.id} className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-gray-100">{shortString.decodeShortString(list.name)}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-400">ID: {list.id?.toString()}</p>
                        </CardContent>
                        <CardContent>
                            <p className="text-gray-400">Created At: {list.creation_time?.toString()}</p>
                        </CardContent>
                        <CardContent>
                            <Button onClick={() => handleActivateEvent(list.id)}>Submit your list!</Button>
                        </CardContent>
                        <CardContent>
                            <Button onClick={() => handleViewLists(list.id)}>view!</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {loading && <p className="text-center">Loading lists...</p>}
        </div>
    )
}

export function TierListTab({ activeTab }: { activeTab: string }) {
    // const [count, setCount] = useState(nLists || 0)
    const [lists, setLists] = useState<TierList[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    console.log('rendering TierListTab...');
    const { data: tierListMeta } = useReadContract({
        // Read data from the contract
        functionName: 'get_all_tier_lists', // The function name in the contract
        abi: ABI, // TODO: Replace with your own ABI
        address: CONTRACT_ADDRESS, // TODO: Replate with your contract address
        args: [], // The contract method's arguments as an array
    });

    useEffect(() => {
        const fetchLists = async () => {
            console.log('Fetching lists...')
            setLoading(true)
            setError(null)
            try {
                console.log('Data:', tierListMeta)
                const newLists: TierList[] = tierListMeta?.map((meta: any) => ({
                    id: meta.id,
                    name: meta.name,
                    creation_time: formatDate(new Date(Number(meta.creation_time.seconds))),
                })) ?? [];
                setLists(newLists)
            } catch (e) {
                setError('Failed to fetch lists. Please try again later.')
                console.error('Fetch error:', e)
            } finally {
                setLoading(false)
            }
        }

        fetchLists()
    }, [activeTab])

    console.log('Lists:', lists)

    return (
        <ListViewer lists={lists} loading={loading} error={error} />
    )

}
