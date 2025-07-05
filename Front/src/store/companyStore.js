import { create } from "zustand";
import axios from "axios";

const useCompanyStore = create((set) => ({
  companies: [],

  fetchCompanies: async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/companies");
      set({ companies: response.data });
    } catch (error) {
      console.error("Ошибка при получении компаний:", error);
    }
  },

  addCompany: async (newCompany) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/companies", newCompany);
      set((state) => ({
        companies: [...state.companies, response.data],
      }));
    } catch (error) {
      console.error("Ошибка при добавлении компании:", error);
    }
  },

  updateCompany: async (updatedCompany) => {
    try {
      await axios.put(`http://127.0.0.1:8000/companies/${updatedCompany.id}`, updatedCompany);
      set((state) => ({
        companies: state.companies.map((company) =>
          company.id === updatedCompany.id ? updatedCompany : company
        ),
      }));
    } catch (error) {
      console.error("Ошибка при обновлении компании:", error);
    }
  },

  deleteCompany: async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/companies/${id}`);
      set((state) => ({
        companies: state.companies.filter((company) => company.id !== id),
      }));
    } catch (error) {
      console.error("Ошибка при удалении компании:", error);
    }
  },
}));

export default useCompanyStore;
