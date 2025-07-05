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
import usePharmacyStore from "../store/pharmacyStore";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { parse, format } from "date-fns";


const TableComponent = () => {
  const { pharmacies, fetchPharmacies, addPharmacy, updatePharmacy, deletePharmacy } = usePharmacyStore();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("number");
  const [search, setSearch] = useState({
    number: "",
    address: "",
    opening_time: "",
    closing_time: "",
    lunch_time: "",
    work_schedule: "",
    driving_directions: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);

  useEffect(() => {
    fetchPharmacies();
  }, [fetchPharmacies]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleDialogOpen = (pharmacy) => {
    setSelectedPharmacy(pharmacy ? {
      ...pharmacy,
      opening_time: pharmacy.opening_time ? parse(pharmacy.opening_time, "HH:mm:ss", new Date()) : null,
      closing_time: pharmacy.closing_time ? parse(pharmacy.closing_time, "HH:mm:ss", new Date()) : null,
      lunch_time: pharmacy.lunch_time ? parse(pharmacy.lunch_time, "HH:mm:ss", new Date()) : null,
    } : {
      number: "", address: "", opening_time: null, closing_time: null,
      lunch_time: "", work_schedule: "", driving_directions: ""
    });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedPharmacy(null);
  };

 const handleSaveChanges = async () => {
   if (!selectedPharmacy) return;

    const updatedPharmacy = {
      ...selectedPharmacy,
      opening_time: selectedPharmacy.opening_time ? format(selectedPharmacy.opening_time, "HH:mm:ss") : "",
      closing_time: selectedPharmacy.closing_time ? format(selectedPharmacy.closing_time, "HH:mm:ss") : "",
      lunch_time: selectedPharmacy.lunch_time ? format(selectedPharmacy.lunch_time, "HH:mm:ss") : ""
    };

    try {
      if (selectedPharmacy.id) {
        await updatePharmacy(updatedPharmacy);
      } else {
        await addPharmacy(updatedPharmacy);
      }
      handleDialogClose();
    } catch (error) {
      console.error("Ошибка при сохранении аптеки:", error);
    }
 };

 const handleDeletePharmacy = async (id) => {
  if (!window.confirm("Вы уверены, что хотите удалить эту аптеку?")) return;

  try {
    await deletePharmacy(id);
  } catch (error) {
    console.error("Ошибка при удалении аптеки:", error);
  }
};


  // Фильтрация и сортировка
  const filteredData = pharmacies
    .filter((item) =>
      Object.keys(search).every((key) => {
        if (!search[key]) return true;
        return item[key]?.toString().toLowerCase().includes(search[key].toLowerCase());
      })
    )
    .sort((a, b) => {
      if (!orderBy) return 0;

      let valA = a[orderBy];
      let valB = b[orderBy];

      if (!isNaN(Number(valA)) && !isNaN(Number(valB))) {
        valA = Number(valA);
        valB = Number(valB);
      } else {
        valA = valA?.toString().toLowerCase();
        valB = valB?.toString().toLowerCase();
      }

      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <Box sx={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: 3, overflowX: "hidden" }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Список аптек
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        По Вашему запросу найдено <strong>{filteredData.length}</strong> записи(ей)
      </Typography>
      <Divider sx={{ marginBottom: 3 }} />

      <Grid container spacing={1} sx={{ marginBottom: 2 }}>
        {Object.keys(search).map((key) => (
          <Grid item xs={12} md={3} key={key}>
            <TextField
              label={
                key === "number" ? "Номер" :
                key === "address" ? "Адрес" :
                key === "opening_time" ? "Открытие" :
                key === "closing_time" ? "Закрытие" :
                key === "lunch_time" ? "Обед" :
                key === "work_schedule" ? "График" :
                "Ориентир"
              }
              variant="outlined"
              fullWidth
              size="small"
              margin="none"
              name={key}
              value={search[key]}
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
        ))}
      </Grid>


      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setSelectedPharmacy({
            number: "",
            address: "",
            opening_time: "",
            closing_time: "",
            lunch_time: "",
            work_schedule: "",
            driving_directions: "",
          });
          setOpenDialog(true);
        }}
        sx={{ mb: 2 }}
      >
        Добавить аптеку
      </Button>


      <TableContainer component={Paper} elevation={4} sx={{ borderRadius: "12px", overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>#</TableCell>
              <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                <TableSortLabel
                  active={orderBy === "number"}
                  direction={order}
                  onClick={() => handleSort("number")}
                  sx={{ color: "#fff", "&:hover": { color: "#fff" } }}
                >
                  Номер
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Адрес</TableCell>
              <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>Открытие</TableCell>
              <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>Закрытие</TableCell>
              <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>Перерыв</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Время работы</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Ориентир</TableCell>
              <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => (
                <TableRow
                  key={item.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                    "&:hover": { backgroundColor: "#e3f2fd" },
                  }}
                >
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>{index + 1}</TableCell>
                  <TableCell align="center">{item.number}</TableCell>
                  <TableCell>{item.address}</TableCell>
                  <TableCell align="center">{item.opening_time}</TableCell>
                  <TableCell align="center">{item.closing_time}</TableCell>
                  <TableCell align="center">{item.lunch_time || "-"}</TableCell>
                  <TableCell>{item.work_schedule || "-"}</TableCell>
                  <TableCell>{item.driving_directions || "-"}</TableCell>
                  <TableCell align="center">
                    <Button onClick={() => handleDialogOpen(item)} color="primary">
                      Редактировать
                    </Button>
                    <Button onClick={() => handleDeletePharmacy(item.id)} color="secondary">
                      Удалить
                    </Button>
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
        <DialogTitle>{selectedPharmacy ? "Редактировать аптеку" : "Добавить аптеку"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <TextField
              label="Номер аптеки *"
              fullWidth
              margin="dense"
              value={selectedPharmacy?.number || ""}
              onChange={(e) =>
                setSelectedPharmacy((prev) => ({ ...prev, number: e.target.value }))
              }
            />

            <TextField
              label="Адрес *"
              fullWidth
              margin="dense"
              value={selectedPharmacy?.address || ""}
              onChange={(e) =>
                setSelectedPharmacy((prev) => ({ ...prev, address: e.target.value }))
              }
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Время открытия *"
                  value={selectedPharmacy?.opening_time}
                  onChange={(newValue) =>
                    setSelectedPharmacy((prev) => ({ ...prev, opening_time: newValue }))
                  }
                  renderInput={(params) => <TextField {...params} fullWidth margin="dense" required />}
                />
                <TimePicker
                  label="Время закрытия *"
                  value={selectedPharmacy?.closing_time}
                  onChange={(newValue) =>
                    setSelectedPharmacy((prev) => ({ ...prev, closing_time: newValue }))
                  }
                  renderInput={(params) => <TextField {...params} fullWidth margin="dense" required />}
                />
                <TimePicker
                  label="Перерыв *"
                  value={selectedPharmacy?.lunch_time}
                  onChange={(newValue) =>
                    setSelectedPharmacy((prev) => ({ ...prev, lunch_time: newValue }))
                  }
                  renderInput={(params) => <TextField {...params} fullWidth margin="dense" required />}
                />
            </LocalizationProvider>

            <TextField
              label="Рабочие дни *"
              fullWidth
              margin="dense"
              value={selectedPharmacy?.work_schedule || ""}
              onChange={(e) =>
                setSelectedPharmacy((prev) => ({ ...prev, work_schedule: e.target.value }))
              }
            />

            <TextField
              label="Ориентир"
              fullWidth
              margin="dense"
              value={selectedPharmacy?.driving_directions || ""}
              onChange={(e) =>
                setSelectedPharmacy((prev) => ({ ...prev, driving_directions: e.target.value }))
              }
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

export default TableComponent;
