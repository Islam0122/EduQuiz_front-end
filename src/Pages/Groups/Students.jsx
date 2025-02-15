import React from "react";
import "./Students.scss";
import { useGetGroupByIdQuery } from "../../redux/groupApi";
import { useParams } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";

const Students = () => {
    const { id } = useParams();
    const { data: group, error, isLoading, refetch } = useGetGroupByIdQuery(id);

    return (
        <div className="container">
            <h1 className="students-h1">Студенты</h1>

            {isLoading && <p className="loading">Загрузка...</p>}
            {error && <p className="error">Ошибка загрузки данных</p>}

            <div className="group-info">
                {group && (
                    <>
                        <h2>{group.name}</h2>
                        <img src={group.logoSrc} alt="Логотип группы" className="group-logo" />
                    </>
                )}
            </div>

            <div className="students-list">
                {group?.students?.map(({ id, name }) => (
                    <div key={id} className="student-item">
                        <h3>{name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Students;
