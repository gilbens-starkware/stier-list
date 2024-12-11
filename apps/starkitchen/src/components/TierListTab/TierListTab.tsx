import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ABI, CONTRACT_ADDRESS } from "@/utils/consts";
import { useEffect, useState } from "react";
import { useReadContract } from "@starknet-react/core";
import { get } from "http";
import { Button } from "../ui/button";
import { shortString } from "starknet";

interface TierList {
    id: number;
    name: string;
}

export function TierListTab({ nLists, activeTab }: { nLists?: number, activeTab?: string }) {
    const [count, setCount] = useState(nLists || 0)
    const [lists, setLists] = useState<TierList[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { data: tierListMeta, refetch: getTierListMeta } = useReadContract({
        // Read data from the contract
        functionName: 'get_all_tier_lists', // The function name in the contract
        enabled: true, // Should we fetch the data immediately or later(manually)
        abi: ABI, // TODO: Replace with your own ABI
        address: CONTRACT_ADDRESS, // TODO: Replate with your contract address
        args: [], // The contract method's arguments as an array
    });

    useEffect(() => {
        const fetchLists = async () => {
            console.log('Fetching lists...')
            console.log('Count:', count)
            setLoading(true)
            setError(null)
            try {
                await getTierListMeta()
                console.log('Data:', tierListMeta)
                const newLists: TierList[] = tierListMeta.map((meta: any) => ({
                    id: meta.id,
                    name: meta.name,
                }))
                setLists(newLists)
            } catch (e) {
                setError('Failed to fetch lists. Please try again later.')
                console.error('Fetch error:', e)
            } finally {
                setLoading(false)
            }
        }

        fetchLists()
    }, [count, activeTab])

    console.log('Lists:', lists)
    return (
        <div className="space-y-8">
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* <Button onClick={fetchLists}>Fetch Lists</Button> */}
                {lists.map((list) => (
                    <Card key={list.id} className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-gray-100">{shortString.decodeShortString(list.name)}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-400">ID: {list.id?.toString()}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {loading && <p className="text-center">Loading lists...</p>}
        </div>
    )
}