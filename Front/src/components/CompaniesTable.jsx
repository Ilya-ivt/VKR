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
import useCompanyStore from "../store/companyStore";
import useCityStore from "../store/cityStore";

const CompaniesTable = () => {
  const { companies, fetchCompanies, addCompany, updateCompany, deleteCompany } = useCompanyStore();
  const { cities, fetchCities } = useCityStore();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [search, setSearch] = useState({ name: "", city_name: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    fetchCompanies();
    fetchCities();
  }, [fetchCompanies, fetchCities]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch((prev) => ({ ...prev, [name]: value }));
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleDialogOpen = (company) => {
    setSelectedCompany(company || { name: "", city_id: "" });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedCompany(null);
  };

  const handleSaveChanges = async () => {
    if (!selectedCompany) return;
    try {
      if (selectedCompany.id) {
        await updateCompany(selectedCompany);
      } else {
        await addCompany(selectedCompany);
      }
      handleDialogClose();
    } catch (error) {
      console.error("Ошибка при сохранении компании:", error);
    }
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту компанию?")) return;
    try {
      await deleteCompany(id);
    } catch (error) {
      console.error("Ошибка при удалении компании:", error);
    }
  };

  // Фильтрация данных с учетом названия города
  const filteredData = companies
    .filter((item) => {
      // Фильтруем по названию города
      const city = cities.find(city => city.id === Number(item.city_id));
      return Object.keys(search).every((key) => {
        if (search[key]) {
          if (key === "city_name") {
            // Фильтруем по названию города
            return city?.name?.toLowerCase().includes(search[key].toLowerCase());
          } else {
            return item[key]?.toString().toLowerCase().includes(search[key].toLowerCase());
          }
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
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>Список компаний</Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        По Вашему запросу найдено <strong>{filteredData.length}</strong> записи(ей)
      </Typography>
      <Divider sx={{ marginBottom: 3 }} />

      <Grid container spacing={1} sx={{ marginBottom: 2 }}>
        {Object.keys(search).map((key) => (
          <Grid item xs={12} md={6} key={key}>
            <TextField
              label={key === "name" ? "Название" : "Город"}
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
        Добавить компанию
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
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Город</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
              const city = cities.find(city => city.id === Number(item.city_id));
              return (
                <TableRow key={item.id}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{city?.name || "Неизвестно"}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleDialogOpen(item)} color="primary">Редактировать</Button>
                    <Button onClick={() => handleDeleteCompany(item.id)} color="secondary">Удалить</Button>
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
        <DialogTitle>{selectedCompany?.id ? "Редактировать компанию" : "Добавить компанию"}</DialogTitle>
        <DialogContent>
          <TextField label="Название" fullWidth margin="dense" value={selectedCompany?.name || ""} onChange={(e) => setSelectedCompany((prev) => ({ ...prev, name: e.target.value }))} />

          {/* Используем Select для выбора города */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Город</InputLabel>
            <Select
              value={selectedCompany?.city_id || ""}
              onChange={(e) => setSelectedCompany((prev) => ({ ...prev, city_id: e.target.value }))}
              label="Город"
            >
              {cities.map((city) => (
                <MenuItem key={city.id} value={city.id}>
                  {city.name}
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

export default CompaniesTable;
