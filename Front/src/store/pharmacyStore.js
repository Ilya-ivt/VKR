import { create } from "zustand";
import axios from "axios";

const usePharmacyStore = create((set) => ({
  pharmacies: [],
  loading: false,

  fetchPharmacies: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("http://127.0.0.1:8000/pharmacies");
      set({ pharmacies: response.data });
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      set({ loading: false });
    }
  },

  updatePharmacy: async (updatedPharmacy) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/pharmacies/${updatedPharmacy.id}`,
        updatedPharmacy
      );

      set((state) => ({
        pharmacies: state.pharmacies.map((pharmacy) =>
          pharmacy.id === updatedPharmacy.id ? response.data : pharmacy
        ),
      }));
    } catch (error) {
      console.error("Ошибка при обновлении аптеки:", error);
    }
  },

  addPharmacy: async (newPharmacy) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/pharmacies",
        newPharmacy
      );

      set((state) => ({
        pharmacies: [...state.pharmacies, response.data],
      }));
    } catch (error) {
      console.error("Ошибка при добавлении аптеки:", error);
    }
  },

  deletePharmacy: async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/pharmacies/${id}`);

      set((state) => ({
        pharmacies: state.pharmacies.filter((pharmacy) => pharmacy.id !== id),
      }));
    } catch (error) {
      console.error("Ошибка при удалении аптеки:", error);
    }
  },
}));

export default usePharmacyStore;
