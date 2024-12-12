'use client'

import { ABI, CONTRACT_ADDRESS } from '@/utils/consts';
import { useReadContract } from '@starknet-react/core';
import React, { useEffect, useState } from 'react'

interface TierListViewerProps {
    list_id: number
}

interface ListVotes {
    // A two-dimensional array of item IDs and their rank distribution. each entry is the image id and the ranks.
    id_ranks: { image_id: number, ranks: number[] }[]
}

const sumRows = (matrix: number[][]): Number[] => {
    // Sum val*index for each row
    return matrix.map(row => row.reduce((acc, val, idx) => acc + Number(val) * Number(idx), 0))
};

const tiers = ['S', 'T', 'A', 'R', 'K']
const tiers_to_text = { 'S': 'Super', 'T': 'Top-Notch', 'A': 'Acceptable', 'R': 'Run-of-the-mill', 'K': 'Keep Trying...' }

export default function TierListViewer({ list_id }: TierListViewerProps) {
    const [votes, setVotes] = useState<ListVotes>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    console.log('TierListViewer', { list_id })
    const { data: tierListVote, isFetching } = useReadContract({
        // Read data from the contract
        functionName: 'get_votes', // The function name in the contract
        abi: ABI, // TODO: Replace with your own ABI
        address: CONTRACT_ADDRESS, // TODO: Replate with your contract address
        args: [Number(list_id)], // The contract method's arguments as an array
    });
    console.log('TierListViewer', { list_id, tierListVote })

    useEffect(() => {
        const fetchVotes = async () => {
            console.log('totalPossiblePointses...')
            setLoading(true)
            setError(null)
            try {
                await tierListVote;

                console.log('Votes:', tierListVote)
                let newVotes: ListVotes = tierListVote
                setVotes(newVotes)
            } catch (e) {
                setError('Failed to fetch lists. Please try again later.')
                console.error('Fetch error:', e)
            } finally {
                setLoading(false)
            }
        }

        fetchVotes()
    }, [list_id])


    console.log('TierLIST:', tierListVote)
    console.log('loading', loading)
    if (isFetching) {
        return <p>Loading...</p>
    }
    let n_votes: Number = tierListVote ? tierListVote[0].votes.reduce((acc, val) => acc + Number(val), 0) : 0

    let votes_sum = sumRows(tierListVote.map(vote => vote.votes))
    console.log('n_votes', n_votes)
    console.log('votes_sum', votes_sum)

    // Assign ranks based on sorted scores
    let totalPossiblePoints = n_votes * 4;

    const mean = totalPossiblePoints / 2
    const stdDev = mean / 2

    const getThreshHoldRank = (score: number) => {
        const z = (score - mean) / stdDev
        if (z >= 1) return 'K'
        if (z >= 0.5) return 'R'
        if (z >= 0) return 'A'
        if (z >= -0.5) return 'T'
        return 'S'
    }

    const sortedItems: [number, number][] = votes_sum.map((score, id) => [id, score]).sort((a, b) => b[1] - a[1])
    const rankedData: { [key: string]: { [key: number]: number } } = { S: {}, T: {}, A: {}, R: {}, K: {} }

    sortedItems.forEach(([id, score]: [number, number]) => {
        const tier = getThreshHoldRank(score)
        rankedData[tier][id] = score
    })

    const getRankedItems = (rank: string) => {
        const rankEntries = rankedData[rank] || {}
        return Object.entries(rankEntries).sort((a, b) => b[1] - a[1])
    }

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'S': return 'bg-red-100'
            case 'T': return 'bg-orange-100'
            case 'A': return 'bg-yellow-100'
            case 'R': return 'bg-green-100'
            case 'K': return 'bg-blue-100'
            default: return 'bg-gray-100'
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Tier List Viewer</h1>
            {tiers.map((tier) => (
                <div key={tier} className={`mb-4 p-4 rounded-lg shadow ${getTierColor(tier)}`}>
                    <h2 className="text-xl font-semibold mb-2">{tiers_to_text[tier]}</h2>
                    <div className="flex flex-wrap gap-4">
                        {getRankedItems(tier).map(([id]) => (
                            <div
                                key={id}
                                className="w-16 h-16 bg-white rounded shadow overflow-hidden"
                                title={`ID: ${id}`}
                            >
                                <img
                                    src={
                                        `http://192.168.13.34:8000/images/${tierListVote[id].image_id}/` || '/default-image.png'}
                                    alt={`ID: ${id}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
