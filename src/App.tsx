import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

const App: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [globalSelections, setGlobalSelections] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [rows, setRows] = useState(12);
  const [loading, setLoading] = useState(false);

  const fetchArtworks = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.artic.edu/api/v1/artworks?page=${page + 1}&limit=${rows}`
      );
      setArtworks(response.data.data);
      setTotalRecords(response.data.pagination.total);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  }, [rows]);

  useEffect(() => {
    fetchArtworks(page);
  }, [page, fetchArtworks]);

  const handleRowSelect = (selectedRows: Artwork[]) => {
    setGlobalSelections(new Set(selectedRows.map(row => row.id)));
  };

  const selectAllCurrentRows = () => {
    // Select all currently displayed rows
    const selectedArtworkIds = new Set(artworks.map((artwork) => artwork.id));
    setGlobalSelections(selectedArtworkIds);
  };

  const onPageChange = (e: any) => {
    setPage(e.page);
  };

  return (
    <div className="App">
      <h2 className="text-2xl font-bold mb-4">Art Work</h2>

      {/* DataTable */}
      <DataTable
        value={artworks}
        paginator
        rows={rows}
        totalRecords={totalRecords}
        lazy
        first={page * rows}
        onPage={onPageChange}
        selection={artworks.filter(artwork => globalSelections.has(artwork.id))}
        onSelectionChange={(e) => handleRowSelect(e.value)}
        dataKey="id"
        selectionMode="checkbox"
        loading={loading}
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
        <Column header={<PopOver setRows={setRows} selectAllRows={selectAllCurrentRows} />} /> {/* Pass setRows and selectAllRows */}
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

interface PopOverProps {
  setRows: React.Dispatch<React.SetStateAction<number>>;
  selectAllRows: () => void;
}

export const PopOver: React.FC<PopOverProps> = ({ setRows, selectAllRows }) => {
  const op = useRef<OverlayPanel | null>(null);
  const [inputRows, setInputRows] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRows && inputRows > 0) {
      setRows(inputRows);
      selectAllRows(); // Automatically select all rows after setting the number of rows
      if (op.current) {
        op.current.hide(); // Close the overlay panel after submitting
      }
    }
  };

  return (
    <div className="card flex justify-content-center">
      <img onClick={(e) => op.current?.toggle(e)} src="../../public/pop_over.png" alt="" style={{ height: "15px" }} />
      <OverlayPanel ref={op}>
        <form onSubmit={handleSubmit} className="flex-col p-2">
          <InputNumber
            value={inputRows}
            onValueChange={(e) => setInputRows(e.value)}
            min={1}
            max={100}  // Adjust max according to your needs
            placeholder="Enter row number"
            className="p-inputtext-sm mb-2"
          />
          <Button label="Submit" icon="pi pi-check" className="p-button-sm" type="submit" />
        </form>
      </OverlayPanel>
    </div>
  );
};

export default App;
