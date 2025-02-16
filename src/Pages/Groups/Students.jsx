import React, { useState } from "react";
import "./Students.scss";
import { useGetGroupByIdQuery } from "../../redux/groupApi";
import { useGetStudentsQuery, useDeleteStudentMutation, useUpdateStudentMutation, useCreateStudentMutation } from "../../redux/studentApi";
import { useParams } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";

const Students = () => {
    const { id } = useParams();
    const { data: group, error, isLoading, refetch: refetchGroup } = useGetGroupByIdQuery(id);
    const { data: students, refetch: refetchStudents } = useGetStudentsQuery();
    const [deleteStudent] = useDeleteStudentMutation();
    const [updateStudent] = useUpdateStudentMutation();
    const [addStudent] = useCreateStudentMutation();

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const [newStudentName, setNewStudentName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [currentStudent, setCurrentStudent] = useState(null);

    // Открытие модалки добавления
    const handleAddStudent = () => {
        setAddModalOpen(true);
    };

    const handleAddModalClose = () => {
        setAddModalOpen(false);
        setNewStudentName("");
        setErrorMessage("");
    };

    const handleAddStudentSubmit = async (e) => {
        e.preventDefault();
        if (newStudentName.trim()) {
            try {
                await addStudent({ group: id, full_name: newStudentName }).unwrap();
                refetchGroup();
                refetchStudents();
                handleAddModalClose();
            } catch (err) {
                setErrorMessage("Ошибка при добавлении студента. Попробуйте снова.");
            }
        } else {
            setErrorMessage("Поле не может быть пустым.");
        }
    };

    // Открытие и закрытие модалки редактирования
    const handleEdit = (student) => {
        setCurrentStudent(student);
        setEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setEditModalOpen(false);
        setCurrentStudent(null);
    };

    const handleUpdateStudent = async () => {
        if (currentStudent) {
            try {
                await updateStudent({ id: currentStudent.id, full_name: currentStudent.full_name }).unwrap();
                refetchStudents();
                handleEditModalClose();
            } catch (err) {
                console.error("Ошибка при редактировании студента:", err);
            }
        }
    };

    // Открытие и закрытие модалки удаления
    const handleDeleteConfirm = (student) => {
        setCurrentStudent(student);
        setDeleteModalOpen(true);
    };

    const handleDeleteModalClose = () => {
        setDeleteModalOpen(false);
        setCurrentStudent(null);
    };

    const handleDeleteStudent = async () => {
        if (currentStudent) {
            try {
                await deleteStudent(currentStudent.id).unwrap();
                refetchStudents();
                handleDeleteModalClose();
            } catch (err) {
                console.error("Ошибка при удалении студента:", err);
            }
        }
    };

    const toggleActiveStatus = async (student) => {
        try {
            await updateStudent({ id: student.id, is_active: !student.is_active }).unwrap();
            refetchStudents();
        } catch (err) {
            console.error("Ошибка при обновлении статуса:", err);
        }
    };

    return (
        <section className="group-detail-page">
            <div className="container">
                <div className="group-detail-page-title">
                    <h1 className="students-h1">Студенты</h1>
                </div>
                <div className="info-group-students">
                    <div className="info-group">
                        <h5 className="students-h5">Группа: <span className="students-span">{group?.name}</span></h5>
                        <h4 className="students-h4" onClick={handleAddStudent}>+ Добавить студента</h4>
                    </div>
                    <div className="info-group-students-list">
                        {group?.students?.map((student) => (
                            <div key={student.id} className="student-item">
                                <div className="Student-info">
                                    <h4 className="students-h4">{student.full_name}</h4>
                                    <p>|</p>
                                    <span
                                        className={`students-span ${student.is_active ? "active" : "inactive"}`}
                                        onClick={() => toggleActiveStatus(student)}
                                        style={{cursor: "pointer"}}
                                    >
                                        {student.is_active ? "Активен" : "Неактивен"}
                                    </span>
                                </div>
                                <div className="Modalka">
                                    <button className="Edit-button" onClick={() => handleEdit(student)}>
                                        <FaEdit className="Edit-icon"/>
                                    </button>
                                    <button className="Delete-button" onClick={() => handleDeleteConfirm(student)}>
                                        <MdOutlineDelete className="Delete-icon"/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Модальное окно добавления студента */}
                {addModalOpen && (
                    <div className="modal-overlay3">
                        <div className="modal">
                            <div className="modal-content">
                                <h2>Добавить студента</h2>
                                <form onSubmit={handleAddStudentSubmit}>
                                    <input
                                        type="text"
                                        value={newStudentName}
                                        onChange={(e) => setNewStudentName(e.target.value)}
                                        placeholder="Введите ФИО студента"
                                    />
                                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                                    <div className="modal-buttons">
                                        <button className={"btn1"} type="button" onClick={handleAddModalClose}>Отмена</button>
                                        <button type="submit" className={"btn2"}>Добавить</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Модальное окно редактирования студента */}
                {editModalOpen && (
                    <div className="modal-overlay2">
                        <div className="modal">
                            <div className="modal-content">
                                <h2>Редактировать студента</h2>
                                <input
                                    type="text"
                                    value={currentStudent?.full_name || ""}
                                    onChange={(e) => setCurrentStudent({ ...currentStudent, full_name: e.target.value })}
                                />
                                <div className="modal-buttons">
                                    <button className={"save-button"} onClick={handleUpdateStudent}>Сохранить</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Модальное окно удаления студента */}
                {deleteModalOpen && (
                    <div className="modal-overlay1">
                        <div className="modal">
                            <div className="modal-content">
                                <p>Вы уверены, что хотите удалить {currentStudent?.full_name}?</p>
                                <div className="modal-buttons">
                                    <button className={"cancel-button"} onClick={handleDeleteModalClose}>Отмена</button>
                                    <button className={"delete-button"} onClick={handleDeleteStudent}>Удалить</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Students;