import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import FileSelector from './FileSelector'; // Adjust the path as needed

interface Block {
    id: number;
    itemName: string;
    imageFile: File | null;
}

interface DynamicBlocksProps {
    blocks: Block[];
    setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
}

const DynamicBlocks: React.FC<DynamicBlocksProps> = ({ blocks, setBlocks }) => {
    const handleBlockChange = (id: number, field: keyof Block, value: any) => {
        setBlocks((prev) =>
            prev.map((block) => (block.id === id ? { ...block, [field]: value } : block))
        );
    };

    const handleAddBlock = () => {
        const newId = blocks.length ? blocks[blocks.length - 1].id + 1 : 1;
        const newBlock: Block = { id: newId, itemName: '', imageFile: null };
        setBlocks((prev) => [...prev, newBlock]);
    };

    return (
        <div>
            {blocks.map((block) => (
                <div key={block.id} className="flex space-x-4 mb-4">
                    <Textarea
                        placeholder="Item Name"
                        className="min-h-[40px]"
                        value={block.itemName}
                        onChange={(e) => handleBlockChange(block.id, 'itemName', e.target.value)}
                    />
                    <FileSelector
                        onChange={(files) => {
                            const file = files && files.length > 0 ? files[0] : null;
                            handleBlockChange(block.id, 'imageFile', file);
                        }}
                    />
                </div>
            ))}
            <Button onClick={handleAddBlock}>Add Item</Button>
        </div>
    );
};

export default DynamicBlocks;
