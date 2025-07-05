import { create } from "zustand";
import axios from "axios";

const useMedicinesStore = create((set) => ({
  medicines: [],
  loading: false,

  fetchMedicines: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("http://127.0.0.1:8000/medicines");
      set({ medicines: response.data });
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      set({ loading: false });
    }
  },

  updateMedicines: async (updatedMedicines) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/medicines/${updatedMedicines.id}`,
        updatedMedicines
      );

      set((state) => ({
        medicines: state.medicines.map((medicines) =>
          medicines.id === updatedMedicines.id ? response.data : medicines
        ),
      }));
    } catch (error) {
      console.error("Ошибка при обновлении аптеки:", error);
    }
  },

  addMedicines: async (newMedicines) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/medicines",
        newMedicines
      );

      set((state) => ({
        medicines: [...state.medicines, response.data],
      }));
    } catch (error) {
      console.error("Ошибка при добавлении аптеки:", error);
    }
  },

  deleteMedicines: async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/medicines/${id}`);

      set((state) => ({
        medicines: state.medicines.filter((medicines) => medicines.id !== id),
      }));
    } catch (error) {
      console.error("Ошибка при удалении аптеки:", error);
    }
  },
}));

export default useMedicinesStore;
