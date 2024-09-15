import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import FormPopover from './FormPopover';

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

interface DataTableWithPopoverProps {
  artworks: Artwork[];
  globalSelections: Set<number>;
  rows: number;
  totalRecords: number;
  page: number;
  loading: boolean;
  onPageChange: (e: any) => void;
  onRowSelect: (selectedRows: Artwork[]) => void;
  onInputChange: (e: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const DataTableWithPopover: React.FC<DataTableWithPopoverProps> = ({
  artworks,
  globalSelections,
  rows,
  totalRecords,
  page,
  loading,
  onPageChange,
  onRowSelect,
  onInputChange,
  onSubmit
}) => {
  const op = React.useRef<OverlayPanel | null>(null);

  return (
    <div style={{ position: 'relative' }}>
      <DataTable
        value={artworks}
        paginator
        rows={rows}
        totalRecords={totalRecords}
        lazy
        first={page * rows}
        onPage={onPageChange}
        selection={artworks.filter(artwork => globalSelections.has(artwork.id))}
        onSelectionChange={(e) => onRowSelect(e.value)}
        dataKey="id"
        selectionMode="checkbox"
        loading={loading}
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />

        <Column
          header={
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <img
                onClick={(e) => op.current?.toggle(e)}
                src="/pop_over.png"
                alt="Show Form"
                style={{ marginLeft: '8px', cursor: 'pointer', height: "10px" }}
              />
              <OverlayPanel ref={op} style={{ position: 'absolute', top: '100%', left: '0', zIndex: 1000 }}>
                <FormPopover onInputChange={onInputChange} onSubmit={onSubmit} />
              </OverlayPanel>
            </div>
          }
          headerStyle={{ width: '10em' }} // Adjust width if necessary
        />

        <Column field="title" header="Title" />
        <Column field="place_of_origin" header="Place of Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
      </DataTable>
    </div>
  );
};

export default DataTableWithPopover;
