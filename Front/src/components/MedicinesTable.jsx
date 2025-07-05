import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Box,
  Grid,
  Typography,
  Divider,
  TableSortLabel,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import useCompanyStore from "../store/companyStore";
import usePharmacyStore from "../store/pharmacyStore.js";
import useMedicinesStore from "../store/medicinesStore.js";

const MedicinesTable = () => {
  const { medicines, fetchMedicines, addMedicines, updateMedicines, deleteMedicines } = useMedicinesStore();
  const { companies, fetchCompanies } = useCompanyStore();
  const { pharmacies, fetchPharmacies } = usePharmacyStore();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [search, setSearch] = useState({
    name: "",
    price: "",
    quantity: "",
    production_date: "",
    best_before_date: "",
    manufacturer_name: "",
    pharmacies_name: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  useEffect(() => {
    fetchMedicines();
    fetchCompanies();
    fetchPharmacies();
  }, [fetchMedicines, fetchCompanies, fetchPharmacies]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch((prev) => ({ ...prev, [name]: value }));
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleDialogOpen = (medicine) => {
    setSelectedMedicine(medicine || { name: "", prise: "", quantity: "", production_date: null, best_before_date: null, manufacturer_id: "", pharmacy_id: "" });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedMedicine(null);
  };

  const handleSaveChanges = async () => {
    if (!selectedMedicine) return;
    try {
      if (selectedMedicine.id) {
        await updateMedicines(selectedMedicine);
      } else {
        await addMedicines(selectedMedicine);
      }
      handleDialogClose();
    } catch (error) {
      console.error("Ошибка при сохранении компании:", error);
    }
  };

  const handleDeleteMedicine = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту компанию?")) return;
    try {
      await deleteMedicines(id);
    } catch (error) {
      console.error("Ошибка при удалении компании:", error);
    }
  };

  // Фильтрация данных
    const filteredData = medicines.filter((item) => {
      const manufacturer = companies.find(m => m.id === Number(item.manufacturer_id));
      const pharmacy = pharmacies.find(f => f.id === Number(item.pharmacy_id));

      return Object.keys(search).every((key) => {
        if (search[key]) {
          if (key === "manufacturer_name") {
            return manufacturer?.name?.toLowerCase().includes(search[key].toLowerCase());
          }
          if (key === "pharmacies_name") {
            return pharmacy?.number?.toLowerCase().includes(search[key].toLowerCase());
          }
          return item[key]?.toString().toLowerCase().includes(search[key].toLowerCase());
        }
        return true;
      });
    })
    .sort((a, b) => {
      if (!orderBy) return 0;
      let valA = a[orderBy]?.toString().toLowerCase() || "";
      let valB = b[orderBy]?.toString().toLowerCase() || "";
      return order === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

  return (
    <Box sx={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: 3, overflowX: "hidden" }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>Список лекарств</Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        По Вашему запросу найдено <strong>{filteredData.length}</strong> записи(ей)
      </Typography>
      <Divider sx={{ marginBottom: 3 }} />

      <Grid container spacing={1} sx={{ marginBottom: 2 }}>
        {Object.keys(search).map((key) => (
          <Grid item xs={12} md={3} key={key}>
            <TextField
              label={
                key === "name" ? "Название" :
                key === "price" ? "Цена" :
                key === "quantity" ? "Количество" :
                key === "production_date" ? "Дата изготовления" :
                key === "best_before_date" ? "Годен до" :
                key === "manufacturer_name" ? "Производитель" :
                "Аптека"
              }
              variant="outlined"
              fullWidth
              size="small"
              name={key}
              value={search[key]}
              onChange={handleSearchChange}
            />
          </Grid>
        ))}
      </Grid>

      <Button variant="contained" color="primary" onClick={() => handleDialogOpen(null)} sx={{ mb: 2 }}>
        Добавить лекарство
      </Button>

      <TableContainer component={Paper} elevation={4} sx={{ borderRadius: "12px" }} >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>#</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                <TableSortLabel active={orderBy === "name"} direction={order} onClick={() => handleSort("name")}>
                  Название
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Цена</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Количество</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Дата производства</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Годен до</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Производитель</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Номер аптеки</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
              const company = companies.find(company => company.id === Number(item.manufacturer_id));
              const pharmacy = pharmacies.find(pharmacy => pharmacy.id === Number(item.pharmacy_id));
              return (
                <TableRow key={item.id}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="center">{item.price}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="center">{item.production_date}</TableCell>
                  <TableCell align="center">{item.best_before_date}</TableCell>
                  <TableCell>{company?.name || "Неизвестно"}</TableCell>
                  <TableCell align="center">{pharmacy?.number || "Неизвестно"}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleDialogOpen(item)} color="primary">Редактировать</Button>
                    <Button onClick={() => handleDeleteMedicine(item.id)} color="secondary">Удалить</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        sx={{ marginTop: 2 }}
      />

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{selectedMedicine?.id ? "Редактировать лекарство" : "Добавить лекарство"}</DialogTitle>
        <DialogContent>
          <TextField label="Название *" fullWidth margin="dense" value={selectedMedicine?.name || ""} onChange={(e) => setSelectedMedicine((prev) => ({ ...prev, name: e.target.value }))} />

          <TextField
              label="Цена *"
              fullWidth
              margin="dense"
              value={selectedMedicine?.price || ""}
              onChange={(e) =>
                setSelectedMedicine((prev) => ({ ...prev, price: e.target.value }))
              }
          />

          <TextField
              label="Количество *"
              fullWidth
              margin="dense"
              value={selectedMedicine?.quantity || ""}
              onChange={(e) =>
                setSelectedMedicine((prev) => ({ ...prev, quantity: e.target.value }))
              }
          />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Дата изготовления"
                value={selectedMedicine?.production_date ?? null}
                onChange={(newValue) => setSelectedMedicine((prev) => ({ ...prev, production_date: newValue }))}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <DatePicker
                label="Годен до"
                value={selectedMedicine?.best_before_date ?? null}
                onChange={(newValue) => setSelectedMedicine((prev) => ({ ...prev, best_before_date: newValue }))}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Box>

          <FormControl fullWidth margin="dense">
            <InputLabel>Производитель *</InputLabel>
            <Select
              value={selectedMedicine?.manufacturer_id || ""}
              onChange={(e) => setSelectedMedicine((prev) => ({ ...prev, manufacturer_id: e.target.value }))}
              label="Производитель"
            >
              {companies.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Номер аптеки *</InputLabel>
            <Select
              value={selectedMedicine?.pharmacy_id || ""}
              onChange={(e) => setSelectedMedicine((prev) => ({ ...prev, pharmacy_id: e.target.value }))}
              label="Производитель"
            >
              {pharmacies.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.number}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Отмена</Button>
          <Button onClick={handleSaveChanges} color="primary">Сохранить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicinesTable;
