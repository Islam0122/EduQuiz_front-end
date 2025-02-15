import React from "react";
import "./Students.scss";
import { useGetGroupByIdQuery } from "../../redux/groupApi";
import { useParams } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";

const Students = () => {
    const { id } = useParams();
    const { data: group, error, isLoading, refetch } = useGetGroupByIdQuery(id);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <section className="group-detail-page">
            <div className="container">
                <div className="group-detail-page-title">
                    <h1 className="students-h1">Студенты</h1>
                </div>
                <div className="info-group">
                    <h5>Группа: {group.name}</h5>
                </div>
                <div className="info-group-students-list">
                    <ul>
                        {group.students.map((student) => (
                            <li key={student.id} className="student-item">
                                <span>{student.full_name}</span>
                                <div className="student-actions">

                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Students;