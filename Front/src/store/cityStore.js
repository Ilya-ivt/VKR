import { create } from "zustand";
import axios from "axios";

const useCityStore = create((set) => ({
  cities: [],
  loading: false,

  fetchCities: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("http://127.0.0.1:8000/cities");
      set({ cities: response.data });
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      set({ loading: false });
    }
  },

  updateCity: async (updatedCity) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/cities/${updatedCity.id}`,
        updatedCity
      );

      set((state) => ({
        cities: state.cities.map((city) =>
          city.id === updatedCity.id ? response.data : city
        ),
      }));
    } catch (error) {
      console.error("Ошибка при обновлении аптеки:", error);
    }
  },

  addCity: async (newCity) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/cities",
        newCity
      );

      set((state) => ({
        cities: [...state.cities, response.data],
      }));
    } catch (error) {
      console.error("Ошибка при добавлении аптеки:", error);
    }
  },

  deleteCity: async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/cities/${id}`);

      set((state) => ({
        cities: state.cities.filter((city) => city.id !== id),
      }));
    } catch (error) {
      console.error("Ошибка при удалении аптеки:", error);
    }
  },
}));

export default useCityStore;
