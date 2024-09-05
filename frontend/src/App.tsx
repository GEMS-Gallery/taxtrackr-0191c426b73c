import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, Box, TextField, Button, CircularProgress } from '@mui/material';
import DataTable from 'react-data-table-component';
import { useForm, Controller } from 'react-hook-form';

type TaxPayer = {
  tid: string;
  firstName: string;
  lastName: string;
  address: string;
};

const App: React.FC = () => {
  const [taxPayers, setTaxPayers] = useState<TaxPayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTID, setSearchTID] = useState('');
  const { control, handleSubmit, reset } = useForm<TaxPayer>();

  const fetchTaxPayers = async () => {
    setLoading(true);
    try {
      const result = await backend.getAllTaxPayers();
      setTaxPayers(result);
    } catch (error) {
      console.error('Error fetching tax payers:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTaxPayers();
  }, []);

  const onSubmit = async (data: TaxPayer) => {
    setLoading(true);
    try {
      await backend.createTaxPayer(data.tid, data.firstName, data.lastName, data.address);
      reset();
      fetchTaxPayers();
    } catch (error) {
      console.error('Error creating tax payer:', error);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (searchTID) {
      setLoading(true);
      try {
        const result = await backend.getTaxPayerByTID(searchTID);
        if (result) {
          setTaxPayers([result]);
        } else {
          setTaxPayers([]);
        }
      } catch (error) {
        console.error('Error searching tax payer:', error);
      }
      setLoading(false);
    } else {
      fetchTaxPayers();
    }
  };

  const columns = [
    { name: 'TID', selector: (row: TaxPayer) => row.tid, sortable: true },
    { name: 'First Name', selector: (row: TaxPayer) => row.firstName, sortable: true },
    { name: 'Last Name', selector: (row: TaxPayer) => row.lastName, sortable: true },
    { name: 'Address', selector: (row: TaxPayer) => row.address, sortable: true },
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        TaxPayer Management System
      </Typography>
      <Box mb={4}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="tid"
            control={control}
            defaultValue=""
            rules={{ required: 'TID is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField {...field} label="TID" fullWidth margin="normal" error={!!error} helperText={error?.message} />
            )}
          />
          <Controller
            name="firstName"
            control={control}
            defaultValue=""
            rules={{ required: 'First Name is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField {...field} label="First Name" fullWidth margin="normal" error={!!error} helperText={error?.message} />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            defaultValue=""
            rules={{ required: 'Last Name is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField {...field} label="Last Name" fullWidth margin="normal" error={!!error} helperText={error?.message} />
            )}
          />
          <Controller
            name="address"
            control={control}
            defaultValue=""
            rules={{ required: 'Address is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField {...field} label="Address" fullWidth margin="normal" error={!!error} helperText={error?.message} />
            )}
          />
          <Button type="submit" variant="contained" color="primary">
            Add TaxPayer
          </Button>
        </form>
      </Box>
      <Box mb={4}>
        <TextField
          label="Search by TID"
          value={searchTID}
          onChange={(e) => setSearchTID(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button onClick={handleSearch} variant="contained" color="secondary">
          Search
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <DataTable
          title="TaxPayer Records"
          columns={columns}
          data={taxPayers}
          pagination
          responsive
          highlightOnHover
        />
      )}
    </Container>
  );
};

export default App;
