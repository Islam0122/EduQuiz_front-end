import React from "react";
import "./Students.scss";
import { useGetGroupByIdQuery } from "../../redux/groupApi";
import { useParams } from "react-router-dom";
// import { FaTrash, FaEdit } from "react-icons/fa";

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
                <div className="info-group-students">
                    <div className="info-group">
                        <h5 className={"students-h5"}>Группа: <span className={"students-span"}>{group.name}</span> </h5>
                    </div>
                    <div className="info-group-students-list">
                        {group?.students?.map((student) => (
                            <div key={student.id} className="student-item">
                                <h4 className={"students-h4"}>
                                    {student.full_name}<p>|</p>{" "}
                                    <span className={`students-span ${student.is_active ? "active" : "inactive"}`}>
                                        {student.is_active ? "Активен" : "Неактивен"}
                                    </span>
                                </h4>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Students;