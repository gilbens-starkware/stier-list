import React, { ChangeEvent } from 'react';

interface FileSelectorProps {
  onChange: (files: FileList | null) => void;
}

const FileSelector: React.FC<FileSelectorProps> = ({ onChange }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.files);
  };

  return (
    <input
      type="file"
      accept="image/jpeg, image/png, image/jpg"
      onChange={handleFileChange}
    />
  );
};

export default FileSelector;
