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
} from "@mui/material";
import useCityStore from "../store/cityStore";

const CityTable = () => {
  const { cities, fetchCities, addCity, updateCity, deleteCity } = useCityStore();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleSort = (property) => {
    setOrder(orderBy === property && order === "asc" ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleDialogOpen = (city) => {
    setSelectedCity(city ? { ...city } : { name: "" });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedCity(null);
  };

  const handleSaveChanges = async () => {
    if (!selectedCity) return;
    try {
      if (selectedCity.id) {
        await updateCity(selectedCity);
      } else {
        await addCity(selectedCity);
      }
      handleDialogClose();
    } catch (error) {
      console.error("Ошибка при сохранении города:", error);
    }
  };

  const handleDeleteCity = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот город?")) return;
    try {
      await deleteCity(id);
    } catch (error) {
      console.error("Ошибка при удалении города:", error);
    }
  };

  // Фильтрация и сортировка
  const filteredData = cities
    .filter((city) => city.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const valA = a[orderBy].toLowerCase();
      const valB = b[orderBy].toLowerCase();
      return order === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

  return (
    <Box sx={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: 3, overflowX: "hidden" }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Список городов
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        По Вашему запросу найдено <strong>{filteredData.length}</strong> записи(ей)
      </Typography>
      <Divider sx={{ marginBottom: 3 }} />

      <Grid container spacing={1} sx={{ marginBottom: 2 }}>
        <Grid item xs={12} md={3}>
          <TextField
            label="Название города"
            variant="outlined"
            fullWidth
            size="small"
            margin="none"
            value={search}
            onChange={handleSearchChange}
            sx={{
              backgroundColor: "#f9f9f9",
              borderRadius: "6px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "6px",
                padding: "5px",
              },
            }}
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleDialogOpen(null)}
        sx={{ mb: 2 }}
      >
        Добавить город
      </Button>

      <TableContainer component={Paper} elevation={4} sx={{ borderRadius: "12px", overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>#</TableCell>
              <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={order}
                  onClick={() => handleSort("name")}
                  sx={{ color: "#fff", "&:hover": { color: "#fff" } }}
                >
                  Название города
                </TableSortLabel>
              </TableCell>
              <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((city, index) => (
              <TableRow
                key={city.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                  "&:hover": { backgroundColor: "#e3f2fd" },
                }}
              >
                <TableCell align="center" sx={{ fontWeight: "bold" }}>{index + 1}</TableCell>
                <TableCell align="center">{city.name}</TableCell>
                <TableCell align="center">
                  <Button onClick={() => handleDialogOpen(city)} color="primary">Редактировать</Button>
                  <Button onClick={() => handleDeleteCity(city.id)} color="secondary">Удалить</Button>
                </TableCell>
              </TableRow>
            ))}
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

      {/* Диалоговое окно редактирования */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{selectedCity ? "Редактировать город" : "Добавить город"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <TextField
              label="Название города *"
              fullWidth
              margin="dense"
              value={selectedCity?.name || ""}
              onChange={(e) => setSelectedCity((prev) => ({ ...prev, name: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Отмена</Button>
          <Button onClick={handleSaveChanges} color="primary">Сохранить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CityTable;
