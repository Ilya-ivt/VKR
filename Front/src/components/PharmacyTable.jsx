import { useEffect, useState } from "react";

const PharmacyTable = () => {
    const [pharmacies, setPharmacies] = useState([]);
    const [filters, setFilters] = useState({
        number: "",
        address: "",
        opening_time: "",
        closing_time: "",
        lunch_time: "",
        work_schedule: "",
        driving_directions: ""
    });

    useEffect(() => {
        fetch("http://localhost:8000/pharmacies")
            .then((response) => response.json())
            .then((data) => {
                console.log("Полученные данные:", data); // ✅ Проверяем в консоли
                setPharmacies(data); // Сохраняем данные из API
            })
            .catch((error) => console.error("Ошибка:", error));
    }, []);

    // Функция для обновления фильтров
    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    // Фильтрация данных на основе состояния фильтров
    const filteredPharmacies = pharmacies.filter((pharmacy) => {
        return (
            pharmacy.number.toLowerCase().includes(filters.number.toLowerCase()) &&
            pharmacy.address.toLowerCase().includes(filters.address.toLowerCase()) &&
            pharmacy.opening_time.toLowerCase().includes(filters.opening_time.toLowerCase()) &&
            pharmacy.closing_time.toLowerCase().includes(filters.closing_time.toLowerCase()) &&
            (pharmacy.lunch_time ? pharmacy.lunch_time.toLowerCase().includes(filters.lunch_time.toLowerCase()) : true) &&
            (pharmacy.work_schedule ? pharmacy.work_schedule.toLowerCase().includes(filters.work_schedule.toLowerCase()) : true) &&
            (pharmacy.driving_directions ? pharmacy.driving_directions.toLowerCase().includes(filters.driving_directions.toLowerCase()) : true)
        );
    });

    return (
        <div>
            <h2>Список аптек</h2>
            <p>По Вашему запросу найдено {filteredPharmacies.length} запись(ей)</p>

            {/* Форма фильтрации */}
            <div>
                <label>Номер аптеки: 
                    <input
                        type="text"
                        name="number"
                        value={filters.number}
                        onChange={handleFilterChange}
                    />
                </label>
                <label>Адрес: 
                    <input
                        type="text"
                        name="address"
                        value={filters.address}
                        onChange={handleFilterChange}
                    />
                </label>
                <label>Время открытия: 
                    <input
                        type="text"
                        name="opening_time"
                        value={filters.opening_time}
                        onChange={handleFilterChange}
                    />
                </label>
                <label>Время закрытия: 
                    <input
                        type="text"
                        name="closing_time"
                        value={filters.closing_time}
                        onChange={handleFilterChange}
                    />
                </label>
                <label>Обед: 
                    <input
                        type="text"
                        name="lunch_time"
                        value={filters.lunch_time}
                        onChange={handleFilterChange}
                    />
                </label>
                <label>График работы: 
                    <input
                        type="text"
                        name="work_schedule"
                        value={filters.work_schedule}
                        onChange={handleFilterChange}
                    />
                </label>
                <label>Как добраться: 
                    <input
                        type="text"
                        name="driving_directions"
                        value={filters.driving_directions}
                        onChange={handleFilterChange}
                    />
                </label>
            </div>

            {/* Таблица */}
            <table border="1">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Номер</th>
                        <th>Адрес</th>
                        <th>Время открытия</th>
                        <th>Время закрытия</th>
                        <th>Обед</th>
                        <th>График работы</th>
                        <th>Как добраться</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPharmacies.map((pharmacy, index) => (
                        <tr key={pharmacy.id}>
                            <td>{index + 1}</td> 
                            <td>{pharmacy.number}</td>
                            <td>{pharmacy.address}</td>
                            <td>{pharmacy.opening_time}</td>
                            <td>{pharmacy.closing_time}</td>
                            <td>{pharmacy.lunch_time || "—"}</td>
                            <td>{pharmacy.work_schedule || "—"}</td>
                            <td>{pharmacy.driving_directions || "—"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PharmacyTable;
