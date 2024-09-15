import React from 'react';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

interface FormPopoverProps {
  onInputChange: (e: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const FormPopover: React.FC<FormPopoverProps> = ({ onInputChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', alignItems: 'center' }}>
      <InputNumber
        id="rowsInput"
        onValueChange={onInputChange}
        min={0}
        max={Number.MAX_SAFE_INTEGER}
        placeholder="Enter row number"
        style={{ marginRight: '8px' }}
      />
      <Button label="Submit" icon="pi pi-check" />
    </form>
  );
};

export default FormPopover;
