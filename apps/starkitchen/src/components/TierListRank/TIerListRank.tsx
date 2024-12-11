'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'

export interface TierListItem {
    id: string
    image: string
}

interface TierListMakerProps {
    items: TierListItem[]
}

const tiers = ['S', 'T', 'A', 'R', 'K']

export default function TierListMaker({ items }: TierListMakerProps) {
    const [tierItems, setTierItems] = useState<{ [key: string]: TierListItem[] }>({
        S: [],
        T: [],
        A: [],
        R: [],
        K: [],
        unranked: items,
    })
    const [draggingItem, setDraggingItem] = useState<TierListItem | null>(null)
    const dragNode = useRef<HTMLDivElement | null>(null)

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: TierListItem, tier: string) => {
        setDraggingItem(item)
        dragNode.current = e.target as HTMLDivElement
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', item.id)
        setTimeout(() => {
            if (dragNode.current) dragNode.current.style.opacity = '0.5'
        }, 0)
    }

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, targetTier: string) => {
        e.preventDefault()
        e.currentTarget.classList.add('bg-gray-200')
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('bg-gray-200')
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetTier: string) => {
        e.preventDefault()
        e.currentTarget.classList.remove('bg-gray-200')
        if (draggingItem) {
            const updatedTierItems = { ...tierItems }
            Object.keys(updatedTierItems).forEach((tier) => {
                updatedTierItems[tier] = updatedTierItems[tier].filter((item) => item.id !== draggingItem.id)
            })
            updatedTierItems[targetTier].push(draggingItem)
            setTierItems(updatedTierItems)
        }
        if (dragNode.current) dragNode.current.style.opacity = '1'
        setDraggingItem(null)
    }

    const handleDragEnd = () => {
        if (dragNode.current) dragNode.current.style.opacity = '1'
        setDraggingItem(null)
    }

    const SubmitTierList = () => {
        const summary = Object.entries(tierItems).reduce((acc, [tier, items]) => {
            if (tier !== 'unranked') {
                acc[tier] = items.length
            }
            return acc
        }, {} as { [key: string]: number })

        console.log('Tier List Summary:', summary)
        alert(`Tier List Summary: ${JSON.stringify(summary, null, 2)}`)
    }

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'S': return 'bg-red-100';
            case 'T': return 'bg-orange-100';
            case 'A': return 'bg-yellow-100';
            case 'R': return 'bg-green-100';
            case 'K': return 'bg-blue-100';
            default: return 'bg-gray-100';
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Tier List Rank</h1>
            {[...tiers, 'unranked'].map((tier) => (
                <div key={tier} className={`mb-2 p-2 rounded-lg ${getTierColor(tier)}`}>
                    <h2 className="text-xl font-semibold mb-2">{tier.toUpperCase()}</h2>
                    <div
                        className="flex flex-wrap gap-2 min-h-[80px] rounded"
                        onDragEnter={(e) => handleDragEnter(e, tier)}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, tier)}
                    >
                        {tierItems[tier].map((item) => (
                            <div
                                key={item.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, item, tier)}
                                onDragEnd={handleDragEnd}
                                className="w-16 h-16 bg-white rounded shadow cursor-move"
                                role="button"
                                tabIndex={0}
                                aria-label={`Item ${item.id} in tier ${tier}`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault()
                                        handleDragStart(e as unknown as React.DragEvent<HTMLDivElement>, item, tier)
                                    }
                                }}
                            >
                                <img src={item.image} alt={`Item ${item.id}`} className="w-full h-full object-cover rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <Button onClick={SubmitTierList} className="mt-4">
                Submit
            </Button>
        </div>
    )
}

