import { useMemo, useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { getCurrentDate } from '../../utils/date';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import DynamicBlocks from './AddItem';
import { Textarea } from '../ui/textarea';
import { ABI, CONTRACT_ADDRESS } from '@/utils/consts';
import { useContract, useSendTransaction } from '@starknet-react/core';
import { RawArgsObject, TypedContractV2 } from 'starknet';
import { openFullscreenLoader } from '../FullscreenLoaderModal/FullscreenLoaderModal';
import { tierlistIconFile } from './globals';

import SelectTierlistIcon from './SelectIcon';

const { month: currentMonth, year: currentYear } = getCurrentDate();



export const CreateTab = ({ }: {

}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    `${currentYear}-${currentMonth}`,
  );



  const [blocks, setBlocks] = useState<{ id: number; itemName: string; imageFile: File | null; imagePreview: string | null }[]>([
    { id: 1, itemName: '', imageFile: null, imagePreview: null },
  ]);

  const [tierlist_data_for_chain, setTierlistDataForChain] = useState<RawArgsObject>({
    name: 'default_tierlist_name',
    initial_elements: [{ name: 'default_item_name', image_id: 'default_image_id' }],
    image_id: 'default_image_id',
  });

  const [tierlist_name, updatetTierlistName] = useState<string>('default_tierlist_name');


  // let tierlist_data_for_chain: RawArgsObject = {
  //   name: 'default_tierlist_name',
  //   initial_elements: [{ name: 'default_item_name', image_id: 'default_image_id' }],
  // };
  // const handleDisplayItemNames = () => {
  //   const itemNames = blocks.map((block) => block.itemName).join(', ');
  //   console.log(`Item Names: ${itemNames}`);
  // };
  const { contract } = useContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
  }) as { contract?: TypedContractV2<typeof ABI> };

  const calls = useMemo(() => {
    if (!contract) return undefined;
    console.log("Sending tierlist to chain");
    // const calldata: RawArgsObject = {
    //   name: 'default_tierlist_name',
    //   initial_elements: [{ name: 'default_item_name', image_id: 'default_image_id' }],
    // };
    console.log("Pre populate", tierlist_data_for_chain ?? '');
    return [contract.populate('add_tier_list', tierlist_data_for_chain ?? [])];
  }, [tierlist_data_for_chain]);

  const { sendAsync } = useSendTransaction({
    calls,
  });

  const getTierlistContent = async (blocks: { id: number; itemName: string; imageFile: File | null }[], data: any, tierlist_icon: any) => {
    let content: { name: string; initial_elements: { name: string; image_id: any }[]; image_id: any } = {
      name: tierlist_name,
      initial_elements: [],
      image_id: '0',
    };
    blocks.forEach((block) => {
      if (block.imageFile !== null) {
        content.initial_elements.push({
          name: block.itemName,
          image_id: data.uploaded_images[block.imageFile.name],
        });
      } else {
        content.initial_elements.push({
          name: block.itemName,
          image_id: '0',
        });
      }
    });
    console.log("Finished getTierlistContent", content);
    console.log(tierlistIconFile, tierlist_icon)
    if (tierlistIconFile !== null && tierlist_icon !== 0) {
      console.log("Found proper ID for tierlist icon", tierlist_icon.uploaded_images[tierlistIconFile.name]);
      content.image_id = tierlist_icon.uploaded_images[tierlistIconFile.name];
    }
    setTierlistDataForChain(content);
  }

  const sendImagesToServer = async (files: File[]): Promise<void> => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file${index + 1}`, file);
    });

    try {
      const response = await fetch('http://192.168.13.34:8000/api/upload/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload images');
      }

      const data = await response.json();
      console.log('Images uploaded successfully', data);
      return data;
    } catch (error) {
      console.error('Error uploading images', error);
    }
  };

  const saveTierlist = async () => {

    console.log(blocks);
    let data = await sendImagesToServer(blocks.map((block) => block.imageFile).filter((file) => file !== null) as File[]);
    let tierlistIconForChain = await sendImagesToServer([tierlistIconFile].filter((file) => file !== null) as File[]);

    let icon_data = 0;
    let icon_file_array = [tierlistIconFile].filter((file) => file !== null) as File[];
    if (icon_file_array.length > 0) {
      let icon_data = await sendImagesToServer(icon_file_array);
      console.log("Icon data", icon_data);

    }


    // if (tierlistIconFile !== null) {
    //   console.log("TODO: add tierlist_icon id to content", tierlist_icon.uploaded_images[tierlistIconFile.name]);
    //   content.image_id = tierlist_icon.uploaded_images[tierlistIconFile.name];
    // } else {
    //   content.image_id = 0;
    // }

    //let tierlistIconForChain = await sendImagesToServer([tierlistIconFile].filter((file) => file !== null) as File[]);
    console.log(data)
    await getTierlistContent(blocks, data, tierlistIconForChain);
    console.log("Full content", tierlist_data_for_chain);
    console.log("Icone file", tierlistIconFile);
    // for (file in blocks.map((block) => block.imageFile)) {

    // }
  };
  const submitTierList = async () => {
    let closeFullscreenLoader;
    try {
      closeFullscreenLoader = openFullscreenLoader(
        'Adding new tierlist...',
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
  return (
    <>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Create a new Tierlist</h2>

        <Select value={selectedDate} onValueChange={setSelectedDate}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
        </Select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Tierlist Name and Icon</CardTitle>
          </CardHeader>
          <CardContent>

            <Textarea
              className="min-h-[40px]"
              placeholder="Enter tierlist name here"
              onChange={(e) => updatetTierlistName(e.target.value)}
            />
            <hr className="my-4 border-gray-300" />
            <SelectTierlistIcon />
            <hr className="my-4 border-gray-300" />

            <DynamicBlocks blocks={blocks} setBlocks={setBlocks} />
          </CardContent>
          <div className="flex space-x-4 mb-4">
            <CardFooter>
              <Button onClick={saveTierlist}>Save Tierlist</Button>
            </CardFooter>
            <CardFooter>
              <Button onClick={submitTierList}>Submit Tierlist</Button>
            </CardFooter>
          </div>
        </Card>


      </div>
    </>
  );
};
