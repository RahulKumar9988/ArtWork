import React, { useState, useEffect, useCallback } from 'react';
import DataTableWithPopover from './DataTableWithPopover';
import axios from 'axios';

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

const ArtGallery: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [globalSelections, setGlobalSelections] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [rows] = useState(10);
  const [loading, setLoading] = useState(false);
  const [inputRows, setInputRows] = useState(0);

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

  return (
    <DataTableWithPopover
      artworks={artworks}
      globalSelections={globalSelections}
      rows={rows}
      totalRecords={totalRecords}
      page={page}
      loading={loading}
      onPageChange={onPageChange}
      onRowSelect={handleRowSelect}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
    />
  );
};

export default ArtGallery;
