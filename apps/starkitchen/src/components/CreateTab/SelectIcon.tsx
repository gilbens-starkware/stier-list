import React, { useState } from 'react';
import FileSelector from './FileSelector'; // Adjust the import path as necessary
import { updateGlobalSelectedFile } from './globals';

const SelectTierlistIcon: React.FC = () => {
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleFileChange = (files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];
            setSelectedFileName(file.name); // Update local state to display the file name
            updateGlobalSelectedFile(file); // Update the global variable

            // Generate a preview URL if the file is an image
            if (file.type.startsWith('image/')) {
                const previewUrl = URL.createObjectURL(file);
                setImagePreview(previewUrl);
            } else {
                setImagePreview(null);
            }
        } else {
            setSelectedFileName(null);
            setImagePreview(null);
            updateGlobalSelectedFile(null);
        }
    };

    return (
        <div>
            <FileSelector onChange={handleFileChange} />
            {selectedFileName && (
                <div className="mt-2 flex items-center space-x-4">
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt={selectedFileName}
                            className="w-16 h-16 object-cover rounded-md border"
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default SelectTierlistIcon;



// import React, { useState, useMemo, useEffect } from 'react'
// import * as LucideIcons from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import FileSelector from './FileSelector'

// interface Block {
//     id: number;
//     itemName: string;
//     imageFile: File | null;
// }

// interface DynamicBlocksProps {
//     blocks: Block[];
//     setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
// }

// const IconSelector = () => {

//     const setIcon = () => {
//         const newId = blocks.length ? blocks[blocks.length - 1].id + 1 : 1;
//         const newBlock: Block = { id: newId, itemName: '', imageFile: null };
//         setBlocks((prev) => [...prev, newBlock]);
//     };

//     return (
//         <div>
//             {blocks.map((block) => (
//                 <div key={block.id} className="flex space-x-4 mb-4">
//                     Choose an icon:
//                     <FileSelector
//                         onChange={(files) => {
//                             const file = files && files.length > 0 ? files[0] : null;
//                             handleBlockChange(block.id, 'imageFile', file);
//                         }}
//                     />
//                 </div>
//             ))}
//             <Button onClick={setIcon}>Add Item</Button>
//         </div>
//     );
// };

// export default IconSelector;

// // type IconName = keyof typeof LucideIcons;

// // export default function IconSelector() {
// //     const [selectedIcon, setSelectedIcon] = useState<IconName | null>(null)
// //     const [searchTerm, setSearchTerm] = useState('')

// //     const iconList = useMemo(() => {
// //         console.log("INSIDE iconList", Object.keys(LucideIcons).slice(0, 10)) // Debugging log
// //         console.log(LucideIcons[Object.keys(LucideIcons)[0] as IconName]) // Debugging log
// //         console.log(LucideIcons[Object.keys(LucideIcons)[1] as IconName]) // Debugging log
// //         console.log(LucideIcons[Object.keys(LucideIcons)[2] as IconName]) // Debugging log
// //         const list = (Object.keys(LucideIcons) as IconName[]).filter(
// //             (key) =>
// //                 typeof LucideIcons[key] === 'function' &&
// //                 key !== 'createLucideIcon'
// //         )
// //         console.log('Icon list:', list) // Debugging log
// //         return list
// //     }, [])

// //     // const filteredIcons = useMemo(() => {
// //     //     const filtered = iconList.filter((icon) =>
// //     //         icon.toLowerCase().includes(searchTerm.toLowerCase())
// //     //     )
// //     //     console.log('Filtered icons:', filtered) // Debugging log
// //     //     return filtered
// //     // }, [iconList, searchTerm])
// //     const filteredIcons = useMemo(() => {
// //         const normalizedSearchTerm = searchTerm.trim().toLowerCase();
// //         const filtered = iconList.filter((icon) => {
// //             const normalizedIcon = icon.toLowerCase();
// //             console.log(`Comparing "${normalizedIcon}" with "${normalizedSearchTerm}"`);
// //             return normalizedIcon.includes(normalizedSearchTerm);
// //         });
// //         console.log('Filtered icons:', filtered); // Debugging log
// //         return filtered;
// //     }, [iconList, searchTerm]);


// //     const handleSelectIcon = (iconName: IconName) => {
// //         setSelectedIcon(iconName)
// //     }

// //     useEffect(() => {
// //         console.log('LucideIcons:', LucideIcons) // Debugging log
// //     }, [])

// //     return (
// //         <div className="w-full max-w-sm space-y-4">
// //             <Popover>
// //                 <PopoverTrigger asChild>
// //                     <Button variant="outline" className="w-full justify-start">
// //                         {selectedIcon ? (
// //                             <>
// //                                 {React.createElement(LucideIcons[selectedIcon] as React.ComponentType<{ className?: string }>, { className: "mr-2 h-4 w-4" })}
// //                                 <span>{selectedIcon}</span>
// //                             </>
// //                         ) : (
// //                             "Select an icon"
// //                         )}
// //                     </Button>
// //                 </PopoverTrigger>
// //                 <PopoverContent className="w-96 p-0">
// //                     <div className="p-4 pb-0">
// //                         <Input
// //                             placeholder="Search icons..."
// //                             value={searchTerm}
// //                             onChange={(e) => setSearchTerm(e.target.value)}
// //                             className="mb-2"
// //                         />
// //                     </div>
// //                     <ScrollArea className="h-[300px] p-4 pt-0">
// //                         <div className="grid grid-cols-4 gap-2">
// //                             {filteredIcons.length > 0 ? (
// //                                 filteredIcons.map((iconName) => {
// //                                     const Icon = LucideIcons[iconName] as React.ComponentType<{ className?: string }>
// //                                     return (
// //                                         <Button
// //                                             key={iconName}
// //                                             variant="ghost"
// //                                             className="flex flex-col items-center justify-center h-20"
// //                                             onClick={() => handleSelectIcon(iconName)}
// //                                         >
// //                                             <Icon className="h-8 w-8 mb-1" />
// //                                             <span className="text-xs text-center">{iconName}</span>
// //                                         </Button>
// //                                     )
// //                                 })
// //                             ) : (
// //                                 <div className="col-span-4 text-center py-4">No icons found</div>
// //                             )}
// //                         </div>
// //                     </ScrollArea>
// //                 </PopoverContent>
// //             </Popover>
// //             {selectedIcon && (
// //                 <p className="text-sm">Selected icon: {selectedIcon}</p>
// //             )}
// //         </div>
// //     )
// // }

