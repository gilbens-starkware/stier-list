'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { useContract, useProvider, useReadContract, useSendTransaction } from "@starknet-react/core";
import { ABI, CONTRACT_ADDRESS, PROVIDER } from '@/utils/consts';
import { openFullscreenLoader } from '../FullscreenLoaderModal/FullscreenLoaderModal';
import { RawArgsObject, TypedContractV2, UINT_128_MAX } from 'starknet';

export interface TierListItem {
    index: number
    name: string
    image_id: string
}

interface TierListMakerProps {
    list_id: number
}

const tiers = ['S', 'T', 'A', 'R', 'K']
const tiers_to_text = { 'S': 'Super', 'T': 'Top-Notch', 'A': 'Acceptable', 'R': 'Run-of-the-mill', 'K': 'Keep Trying...' }

export default function TierListMaker({ list_id }: TierListMakerProps) {
    const [items, setItems] = useState<TierListItem[]>([])
    const [hoveredItem, setHoveredItem] = useState<TierListItem | null>(null)
    const { data: tierListElements } = useReadContract({
        functionName: 'get_tier_list_elements',
        abi: ABI,
        address: CONTRACT_ADDRESS,
        args: [Number(list_id)],
    });
    useEffect(() => {
        const fetchElements = async () => {
            console.log('Fetching elements...')
            try {
                await tierListElements;
                console.log('Elements:', tierListElements)
                const newItems: TierListItem[] = tierListElements?.map((element: any, index: number) => ({
                    index,
                    name: element.name,
                    image_id: element.image_id
                })) ?? [];
                setItems(newItems)
            } catch (e) {
                setError('Failed to fetch lists. Please try again later.')
                console.error('Fetch error:', e)
            }
        }

        fetchElements()
    }, [list_id])

    useEffect(() => {
        setTierItems({
            S: [],
            T: [],
            A: [],
            R: [],
            K: [],
            unranked: items,
        })
    }, [items])

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
        e.dataTransfer.setData('text/plain', item.name)
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
                updatedTierItems[tier] = updatedTierItems[tier].filter((item) => item.image_id !== draggingItem.image_id)
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
    const [rank_vector, updatetRankVector] = useState<number[]>([]);

    const { contract } = useContract({
        abi: ABI,
        address: CONTRACT_ADDRESS,
        provider: PROVIDER
    }) as { contract?: TypedContractV2<typeof ABI> };
    const calls = useMemo(() => {
        if (!contract) return undefined;
        console.log("Sending vote to chain");
        // const calldata: RawArgsObject = {
        //   name: 'default_tierlist_name',
        //   initial_elements: [{ name: 'default_item_name', image_id: 'default_image_id' }],
        // };
        let content: { list_id: number, votes: number[] } = {
            list_id: list_id,
            votes: rank_vector,
        };
        console.log("Pre populate", content ?? '');
        return [contract.populate('vote_to_list', content)];
    }, [rank_vector]);

    const { sendAsync } = useSendTransaction({
        calls,
    });

    const submitVote = async () => {
        console.log("Voting", rank_vector)
        let closeFullscreenLoader;
        try {
            closeFullscreenLoader = openFullscreenLoader(
                'Voting for tierlist...',
            );
            const { transaction_hash } = await sendAsync();
            await contract?.providerOrAccount?.waitForTransaction(transaction_hash, {
                retryInterval: 2e3,
            });

        } catch (e) {
            console.error('Error:submit failed', e);
        } finally {
            closeFullscreenLoader?.();
        }
    };


    const SubmitTierList = async () => {
        // const summary = Object.entries(tierItems).reduce((acc, [tier, items]) => {
        //     if (tier !== 'unranked') {
        //         acc[tier] = items.length
        //     }
        //     return acc
        // }, {} as { [key: string]: number })

        // Images IDs run from 0 to n, map image idea to rank: S=1, T=2...
        // let send_data: { [key: string]: string[] } = { S: [], T: [], A: [], R: [], K: [] };
        // for (let rank of tiers) {
        //     for (let idx in tierItems[rank]) {
        //         let item = tierItems[rank][idx].name;
        //         send_data[rank].push(item);
        //     }

        // }



        let ln = 0;
        for (let rank of tiers) {
            ln += tierItems[rank].length;
        }
        let new_rank_vector = new Array(ln).fill(0);
        for (let rank of tiers) {

            for (let idx in tierItems[rank]) {
                let item = tierItems[rank][idx].index;
                new_rank_vector[item] = "STARK".indexOf(rank);
            }

        }
        updatetRankVector(new_rank_vector);
        console.log('Tier List Summary raw:', tierItems)
        console.log('Tier List Summary for contract from global var:', rank_vector)
        console.log('Tier List Summary for contract from local var:', new_rank_vector)
        await submitVote();
        // console.log('Tier List Summary:', summary)
        // alert(`Tier List Summary: ${JSON.stringify(summary, null, 2)}`)
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
    console.log('TierListMaker', { list_id, tierListElements, tierItems })

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Tier List Rank</h1>
            {[...tiers, 'unranked'].map((tier) => (
                <div key={tier} className={`mb-2 p-2 rounded-lg ${getTierColor(tier)}`}>
                    <h2 className="text-xl font-semibold mb-2">{tiers_to_text[tier]}</h2>
                    <div
                        className="flex flex-wrap gap-2 min-h-[80px] rounded"
                        onDragEnter={(e) => handleDragEnter(e, tier)}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, tier)}
                    >
                        {tierItems[tier].map((item) => (
                            <div
                                key={item.name}
                                draggable
                                onDragStart={(e) => handleDragStart(e, item, tier)}
                                onDragEnd={handleDragEnd}
                                onMouseEnter={() => setHoveredItem(item)}
                                onMouseLeave={() => setHoveredItem(null)}
                                className="w-16 h-16 bg-white rounded shadow cursor-move relative"
                                role="button"
                                tabIndex={0}
                                aria-label={`Item ${item.name} in tier ${tier}`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault()
                                        handleDragStart(e as unknown as React.DragEvent<HTMLDivElement>, item, tier)
                                    }
                                }}
                            >
                                <img
                                    src={`http://192.168.13.34:8000/images/${item.image_id}/`}
                                    alt={`Item ${item.name}`}
                                    className="w-full h-full object-cover rounded"
                                />
                                {hoveredItem === item && (
                                    <div className="absolute z-10 left-1/2 bottom-full mb-2 transform -translate-x-1/2">
                                        <img
                                            src={`http://192.168.13.34:8000/images/${item.image_id}/`}
                                            alt={`Enlarged ${item.name}`}
                                            className="max-w-[200px] max-h-[200px] w-auto h-auto object-contain rounded shadow-lg border-2 border-white bg-white"
                                        />
                                    </div>
                                )}
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

function setError(arg0: string) {
    throw new Error('Function not implemented.');
}

