'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import axios from 'axios';
import {
  Box,
  Button,
  Drawer,
  FormControl,
  MenuItem,
  Select,
  Checkbox,
  Slider,
  TextField,
  SelectChangeEvent,
  InputLabel,
} from '@mui/material';
import moment from 'moment';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { saveAs } from 'file-saver'; // Import file-saver
import { FaDownload } from 'react-icons/fa';

interface Product {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  createdAt: string;
  updatedAt: string;
  price: number;
  sale_price?: number;
}

const DataTable: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    id: true,
    name: true,
    category: true,
    subcategory: true,
    price: true,
  });
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [isAscending, setIsAscending] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [subcategoryFilter, setSubcategoryFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[moment.Moment | null, moment.Moment | null]>([null, null]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    axios.get<Product[]>('/sample-data.json')
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }, []);

  const columns = useMemo<MRT_ColumnDef<Product>[]>(() => [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'category', header: 'Category' },
    { accessorKey: 'subcategory', header: 'Subcategory' },
    {
      accessorKey: 'price',
      header: 'Price',
      Cell: ({ cell }) => `$${cell.getValue<number>().toFixed(2)}`
    },
    {
      accessorKey: 'sale_price',
      header: 'Sale Price',
      Cell: ({ cell }) => cell.getValue<number>() ? `$${cell.getValue<number>().toFixed(2)}` : 'N/A'
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      Cell: ({ cell }) => moment(cell.getValue<string>()).format('DD-MMM-YYYY')
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated At',
      Cell: ({ cell }) => moment(cell.getValue<string>()).format('DD-MMM-YYYY')
    }
  ], []);

  const filteredData = useMemo(() => {
    return data.filter(product => {
      const matchesCategory = categoryFilter.length ? categoryFilter.includes(product.category) : true;
      const matchesSubcategory = subcategoryFilter.length ? subcategoryFilter.includes(product.subcategory) : true;
      const matchesSearch = searchTerm ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesDate = (!dateRange[0] || moment(product.createdAt).isSameOrAfter(dateRange[0])) &&
                          (!dateRange[1] || moment(product.createdAt).isSameOrBefore(dateRange[1]));
      return matchesCategory && matchesSubcategory && matchesSearch && matchesPrice && matchesDate;
    });
  }, [data, categoryFilter, subcategoryFilter, searchTerm, priceRange, dateRange]);

  const handleGroupByChange = (event: SelectChangeEvent<string[]>) => {
    setGroupBy(event.target.value as string[]);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortColumn(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryFilterChange = (event: SelectChangeEvent<string[]>) => {
    setCategoryFilter(event.target.value as string[]);
  };

  const handleSubcategoryFilterChange = (event: SelectChangeEvent<string[]>) => {
    setSubcategoryFilter(event.target.value as string[]);
  };

  const handleDateRangeChange = (newRange: [moment.Moment | null, moment.Moment | null]) => {
      setDateRange(newRange);
  };

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleColumnVisibilityChange = (column: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const handleExportData = () => {
    const csv = filteredData.map((item) =>
      [
        item.id,
        item.name,
        item.category,
        item.subcategory,
        item.price,
        item.sale_price || "N/A",
        item.createdAt,
        item.updatedAt,
      ].join(",")
    );
    const csvData = ["ID,Name,Category,Subcategory,Price,Sale Price,Created At,Updated At", ...csv].join("\n");

    // Use file-saver to download the CSV
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "product-data.csv");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div className="p-4">
        <div className='flex gap-6'>
        <Button variant="outlined" startIcon={<FaDownload />} color="secondary"
        onClick={handleExportData}>
              Export Data
            </Button>
        <Button variant='outlined' onClick={() => setDrawerOpen(true)}>Open Sidebar</Button>
        </div>

        <Drawer anchor="right" open={isDrawerOpen} onClose={() => setDrawerOpen(false)} variant="temporary">
          <Box p={2} width={400}>
            <h3>Data Filters</h3>

            <FormControl fullWidth margin="normal">
              <InputLabel>Group By</InputLabel>
              <Select multiple value={groupBy} onChange={handleGroupByChange}>
                {columns.map(column => (
                  <MenuItem key={column.accessorKey} value={column.accessorKey}>
                    {column.header}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <h4>Show/Hide Columns</h4>
            {columns.map(column => (
              <Box key={column.accessorKey}>
                <Checkbox
                  checked={visibleColumns[column.accessorKey as string] || false}
                  onChange={() => handleColumnVisibilityChange(column.accessorKey as string)}
                />
                {column.header}
              </Box>
            ))}

            <h4>Sorting</h4>
            <FormControl fullWidth margin="normal">
              <InputLabel>Sort By</InputLabel>
              <Select value={sortColumn || ''} onChange={handleSortChange}>
                {columns.map(col => (
                  col.accessorKey && <MenuItem key={col.accessorKey} value={col.accessorKey}>
                    {col.header}
                  </MenuItem>
                ))}
              </Select>
              <Checkbox
                checked={isAscending}
                onChange={() => setIsAscending(!isAscending)}
              />
              Ascending
            </FormControl>

            <h4>Fuzzy Search</h4>
            <TextField
              fullWidth
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />

            <h4>Category Filter</h4>
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select multiple value={categoryFilter} onChange={handleCategoryFilterChange}>
                {Array.from(new Set(data.map(product => product.category))).map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <h4>Subcategory Filter</h4>
            <FormControl fullWidth margin="normal">
              <InputLabel>Subcategory</InputLabel>
              <Select multiple value={subcategoryFilter} onChange={handleSubcategoryFilterChange}>
                {Array.from(new Set(data.map(product => product.subcategory))).map(subcategory => (
                  <MenuItem key={subcategory} value={subcategory}>
                    {subcategory}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <h4>Date Range</h4>
            <DateRangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              // @ts-expect-error renderInput prop doesn't exist in the current version
              renderInput={(startProps, endProps) => (
                <>
                  <TextField {...startProps} />
                  <Box sx={{ mx: 2 }}> to </Box>
                  <TextField {...endProps} />
                </>
              )}
            />

            <h4>Price Range</h4>
            <Slider
              value={priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              step={10}
            />
          </Box>
        </Drawer>

        <MaterialReactTable
          columns={columns}
          data={filteredData}
          state={{
            grouping: groupBy,
            sorting: sortColumn
              ? [{ id: sortColumn, desc: !isAscending }]
              : [],
            columnVisibility: visibleColumns
          }}
        />
      </div>
    </LocalizationProvider>
  );
};

export default DataTable;
