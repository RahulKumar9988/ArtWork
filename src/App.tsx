import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import PopOver from './components/PopOver' 

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
  const [globalSelections, setGlobalSelections] = useState<Set<number>>(new Set()); // Store selected rows by id
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [rows, setRows] = useState(12); // Default rows per page
  const [loading, setLoading] = useState(false);
  const [inputRows, setInputRows] = useState(0); // Input value for number of rows
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility

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

  const handleInputChange = (e: any) => {
    setInputRows(e.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRows <= 0 || inputRows > totalRecords) return;

    setLoading(true);
    let fetchedArtworks: Artwork[] = [];
    let currentPage = 0;

    // Incremental loading to reduce API load
    while (fetchedArtworks.length < inputRows && fetchedArtworks.length < totalRecords) {
      try {
        const response = await axios.get(
          `https://api.artic.edu/api/v1/artworks?page=${currentPage + 1}&limit=${rows}`
        );
        fetchedArtworks = [...fetchedArtworks, ...response.data.data];
        currentPage++;
      } catch (error) {
        console.error('Error fetching data:', error);
        break;
      }
    }

    handleRowSelect(fetchedArtworks.slice(0, inputRows));
    setLoading(false);
  };

  const onPageChange = (e: any) => {
    setPage(e.page);
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="App">
      <h2 className="text-2xl font-bold mb-4">Art Gallery</h2>

      {/* Button to toggle form visibility */}
      <Button icon="pi pi-plus" className="p-button-sm mb-4" onClick={toggleFormVisibility} />

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 flex items-center border-4">
          <InputNumber
            id="rowsInput"
            value={inputRows}
            onValueChange={handleInputChange}
            min={0}
            max={totalRecords}
            placeholder="Enter row number"
            className="p-inputtext-sm mr-3"
          />
          <Button label="Submit" icon="pi pi-check" className="p-button-sm" />
        </form>
      )}

      {/* DataTable */}
      <DataTable
        value={artworks}
        paginator
        rows={rows} // Use rows per page
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
        <Column header={<PopOver/>} />  
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

export default App;
