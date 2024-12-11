'use client'

import React from 'react'

interface TierListViewerProps {
    rankData: { [key: string]: { [id: string]: number } } // { rank: { id: count } }
    images: { [id: string]: string } // { id: imageURL }
}

const tiers = ['S', 'T', 'A', 'R', 'K']

export default function TierListViewer({ rankData, images }: TierListViewerProps) {
    // Calculate scores for each item
    const scores: { [id: string]: number } = {}

    Object.entries(rankData).forEach(([tier, items]) => {
        const tierScore = tier === 'S' ? 10 : tier === 'T' ? 5 : tier === 'A' ? 1 : 0
        Object.entries(items).forEach(([id, count]) => {
            if (!scores[id]) scores[id] = 0
            scores[id] += count * tierScore
        })
    })

    // Sort items by score
    const sortedItems = Object.entries(scores).sort((a, b) => b[1] - a[1])

    // Assign ranks based on sorted scores
    const rankedData: { [tier: string]: { [id: string]: number } } = { S: {}, T: {}, A: {}, R: {}, K: {} }
    const totalPossiblePoints = Object.keys(rankData).reduce((sum, tier) => {
        const tierScore = tier === 'S' ? 10 : tier === 'T' ? 5 : tier === 'A' ? 1 : 0
        return sum + tierScore
    }, 0)

    const mean = totalPossiblePoints / 2
    const stdDev = mean / 2

    const getGaussianRank = (score: number) => {
        const z = (score - mean) / stdDev
        if (z >= 1) return 'S'
        if (z >= 0.5) return 'T'
        if (z >= 0) return 'A'
        if (z >= -0.5) return 'R'
        return 'K'
    }

    sortedItems.forEach(([id, score]) => {
        const tier = getGaussianRank(score)
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
                    <h2 className="text-xl font-semibold mb-2">{tier}</h2>
                    <div className="flex flex-wrap gap-4">
                        {getRankedItems(tier).map(([id]) => (
                            <div
                                key={id}
                                className="w-16 h-16 bg-white rounded shadow overflow-hidden"
                                title={`ID: ${id}`}
                            >
                                <img
                                    src={
                                        `http://192.168.13.34:8000/images/${id}/` || '/default-image.png'}
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
