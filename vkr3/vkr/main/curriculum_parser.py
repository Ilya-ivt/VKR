import pandas as pd
import re
from collections import defaultdict
from .models import Subject, CurriculumItem

def parse_curriculum(file_path, curriculum):
    type_map = {
        3: "Экзамен",
        4: "Зачет",
        5: "Зачет с оценкой",
        6: "Курсовой проект",
        7: "Курсовая работа",
        10: "Реферат",
        12: "РГР"
    }

    lab_columns = {
        1: 23, 2: 30, 3: 37, 4: 44,
        5: 51, 6: 58, 7: 65, 8: 72
    }

    practice_columns = {
        1: 24, 2: 31, 3: 38, 4: 45,
        5: 52, 6: 59, 7: 66, 8: 73
    }

    phys_culture_semesters = set()

    def is_module_header(index: str, name: str) -> bool:
        return (
            name.lower().startswith("дисциплины (модули) по выбору") or
            re.match(r'^Б\d\.[А-Я]\.ДВ\.\d{2}$', index)
        )

    df = pd.read_excel(file_path, sheet_name="План", header=None)

    for _, row in df.iterrows():
        index = str(row[1]).strip() if pd.notna(row[1]) else ""
        name = str(row[2]).strip() if pd.notna(row[2]) else ""

        if not index or not name or name.lower() == "наименование":
            continue
        if is_module_header(index, name):
            continue

        is_phys_culture = index.startswith("Б1.В.ДВ.04")

        if not is_phys_culture:
            dept_code = str(row[77]).strip() if pd.notna(row[77]) else ""
            if not dept_code:
                continue

        sem_control_map = defaultdict(list)

        for col_idx, ctrl_type in type_map.items():
            val = row[col_idx]
            if pd.notna(val):
                sem_str = str(val).strip()
                for ch in sem_str:
                    if ch.isdigit():
                        sem = int(ch)
                        if is_phys_culture:
                            phys_culture_semesters.add(sem)
                        else:
                            sem_control_map[sem].append(ctrl_type)

        if not is_phys_culture:
            for sem, ctrl_list in sem_control_map.items():
                lab_col = lab_columns.get(sem)
                practice_col = practice_columns.get(sem)

                lab_cell = row[lab_col] if lab_col is not None else None
                practice_cell = row[practice_col] if practice_col is not None else None

                has_lab = bool(pd.notna(lab_cell) and str(lab_cell).strip() not in ("", "0"))
                has_practice = bool(pd.notna(practice_cell) and str(practice_cell).strip() not in ("", "0"))

                course = (sem + 1) // 2

                controls = []
                works = []

                for c in ctrl_list:
                    if c in ["Экзамен", "Зачет", "Зачет с оценкой"]:
                        controls.append(c)
                    else:
                        works.append(c)

                subject, _ = Subject.objects.get_or_create(name=name)

                CurriculumItem.objects.create(
                    curriculum=curriculum,
                    subject=subject,
                    semester=sem,
                    course=course,
                    control_types=", ".join(controls),
                    work_types=", ".join(works),
                    has_laboratory=has_lab,
                    has_practice=has_practice
                )

    # Добавление физкультуры
    for sem in phys_culture_semesters:
        course = (sem + 1) // 2
        subject, _ = Subject.objects.get_or_create(name="Физическая культура")
        CurriculumItem.objects.create(
            curriculum=curriculum,
            subject=subject,
            semester=sem,
            course=course,
            control_types="Зачет",
            work_types="",
            has_laboratory=False,
            has_practice=False
        )
