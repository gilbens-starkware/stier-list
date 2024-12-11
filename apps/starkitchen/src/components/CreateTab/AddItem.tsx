import React from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import FileSelector from './FileSelector'; // Adjust the path as needed

interface Block {
    id: number;
    itemName: string;
    imageFile: File | null;
    imagePreview: string | null; // Add an image preview field
}

interface DynamicBlocksProps {
    blocks: Block[];
    setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
}

const DynamicBlocks: React.FC<DynamicBlocksProps> = ({ blocks, setBlocks }) => {
    // Handle block changes (e.g., itemName or imageFile)
    const handleBlockChange = (id: number, field: keyof Block, value: any) => {
        setBlocks((prev) =>
            prev.map((block) =>
                block.id === id ? { ...block, [field]: value } : block
            )
        );
    };

    // Handle file selection and set the preview URL
    const handleFileChange = (id: number, file: File | null) => {
        const previewUrl = file ? URL.createObjectURL(file) : null;
        setBlocks((prev) =>
            prev.map((block) =>
                block.id === id
                    ? { ...block, imageFile: file, imagePreview: previewUrl }
                    : block
            )
        );
    };

    // Add a new block
    const handleAddBlock = () => {
        const newId = blocks.length ? blocks[blocks.length - 1].id + 1 : 1;
        const newBlock: Block = {
            id: newId,
            itemName: '',
            imageFile: null,
            imagePreview: null,
        };
        setBlocks((prev) => [...prev, newBlock]);
    };

    return (
        <div>
            {blocks.map((block) => (
                <div key={block.id} className="flex space-x-4 mb-4 items-center">
                    <Textarea
                        placeholder="Item Name"
                        className="min-h-[40px]"
                        value={block.itemName}
                        onChange={(e) =>
                            handleBlockChange(block.id, 'itemName', e.target.value)
                        }
                    />
                    <FileSelector
                        onChange={(files) => {
                            const file = files && files.length > 0 ? files[0] : null;
                            handleFileChange(block.id, file);
                        }}
                    />
                    {block.imagePreview && (
                        <img
                            src={block.imagePreview}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-md border"
                        />
                    )}
                </div>
            ))}
            <Button onClick={handleAddBlock}>Add Item</Button>
        </div>
    );
};

export default DynamicBlocks;
