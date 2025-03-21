import React, { useState, useEffect } from "react";
import "./Students.scss";
import { useGetGroupByIdQuery } from "../../redux/groupApi";
import { useCreateStudentMutation, useDeleteStudentMutation, useUpdateStudentMutation } from "../../redux/studentApi";
import { useParams } from "react-router-dom";
import {FaEdit, FaTimes} from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import {useSelector} from "react-redux";

const Students = () => {
    const { id } = useParams();
    const { data: group, isLoading } = useGetGroupByIdQuery(id);
    const [deleteStudent] = useDeleteStudentMutation();
    const [updateStudent] = useUpdateStudentMutation();
    const [addStudent] = useCreateStudentMutation();

    const [studentsList, setStudentsList] = useState([]);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [newStudentName, setNewStudentName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [currentStudent, setCurrentStudent] = useState(null);
    const isAuthenticated = useSelector((state) => !!state.auth.token);

    useEffect(() => {
        if (group?.students) {
            setStudentsList(group.students);
        }
    }, [group]);

    const handleEdit = (student) => {
        setCurrentStudent(student);
        setEditModalOpen(true);
    };

    const handleDeleteConfirm = (student) => {
        setCurrentStudent(student);
        setDeleteModalOpen(true);
    };

    const handleAddStudentSubmit = async (e) => {
        e.preventDefault();
        if (!newStudentName.trim()) {
            setErrorMessage("Поле не может быть пустым.");
            return;
        }

        try {
            const newStudent = await addStudent({ group: id, full_name: newStudentName }).unwrap();
            setStudentsList((prev) => [...prev, newStudent]);
            handleAddModalClose(true);
        } catch {
            setErrorMessage("Ошибка при добавлении студента. Попробуйте снова.");
        }
    };

    const handleUpdateStudent = async () => {
        if (!currentStudent) return;

        try {
            const updatedStudent = await updateStudent({ id: currentStudent.id, full_name: currentStudent.full_name }).unwrap();
            setStudentsList((prev) => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
            handleEditModalClose();
        } catch (err) {
            console.error("Ошибка при редактировании студента:", err);
        }
    };

    const handleDeleteStudent = async () => {
        if (!currentStudent) return;

        try {
            await deleteStudent(currentStudent.id).unwrap();
            setStudentsList((prev) => prev.filter(s => s.id !== currentStudent.id));
            handleDeleteModalClose();
        } catch (err) {
            console.error("Ошибка при удалении студента:", err);
        }
    };

    const toggleActiveStatus = async (student) => {
        try {
            const updatedStudent = await updateStudent({ id: student.id, is_active: !student.is_active }).unwrap();
            setStudentsList((prev) => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
        } catch (err) {
            console.error("Ошибка при обновлении статуса:", err);
        }
    };

    const handleAddModalClose = () => {
        setAddModalOpen(false);
        setNewStudentName("");
        setErrorMessage("");
    };

    const handleEditModalClose = () => {
        setEditModalOpen(false);
        setCurrentStudent(null);
    };

    const handleDeleteModalClose = () => {
        setDeleteModalOpen(false);
        setCurrentStudent(null);
    };

    if (isLoading) return <p>Загрузка...</p>;

    return (
        <section className="group-detail-page">
            <div className="container">
                <div className="group-detail-page-title">
                    <h1 className="students-h1">Студенты</h1>
                </div>
                <div className="info-group-students">
                    <div className="info-group">
                        <h5 className="students-h5">Группа: <span className="students-span">{group?.name}</span></h5>
                        {isAuthenticated && (
                            <h4 className="students-h4" onClick={() => setAddModalOpen(true)}>+ Добавить студента</h4>
                        )}
                    </div>
                    <div className="info-group-students-list">
                        {studentsList.length === 0 ? (
                            <p onClick={() => setAddModalOpen(true)} className="no-students">Пока нет студентов</p>
                        ) : (
                            studentsList.map((student) => (
                                <div key={student.id} className="student-item">
                                    <div className="Student-info">
                                        <h4 className="students-h4">{student.full_name}</h4>
                                        <p>|</p>
                                        <span
                                            className={`students-span ${student.is_active ? "active" : "inactive"}`}
                                            onClick={isAuthenticated ? () => toggleActiveStatus(student) : null}
                                            style={{ cursor: isAuthenticated ? "pointer" : "default", }}
                                        >
                                                {student.is_active ? "Активен" : "Неактивен"}
                                        </span>

                                    </div>
                                    {isAuthenticated && (
                                        <div className="Modalka">
                                            <button className="Edit-button" onClick={() => handleEdit(student)}>
                                                <FaEdit className="Edit-icon" />
                                            </button>
                                            <button className="Delete-button" onClick={() => handleDeleteConfirm(student)}>
                                                <MdOutlineDelete className="Delete-icon" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
                {addModalOpen && (
                    <div className="modal-overlay3">
                        <div className="modal">
                            <button className="close-button" onClick={handleAddModalClose}><AiOutlineClose /></button>
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
                                        <button type="submit" className="btn2">Добавить</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {editModalOpen && (
                    <div className="modal-overlay2">
                        <div className="modal">
                            <button className="close-button" onClick={handleEditModalClose}><AiOutlineClose /></button>
                            <div className="modal-content">
                                <h2>Редактировать студента</h2>
                                <input
                                    type="text"
                                    value={currentStudent?.full_name || ""}
                                    onChange={(e) => setCurrentStudent(prev => prev ? { ...prev, full_name: e.target.value } : null)}
                                />
                                <div className="modal-buttons">
                                    <button className="save-button" onClick={handleUpdateStudent}>Сохранить</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {deleteModalOpen && (
                    <div className="modal-overlay5">
                            <div className="modal">
                                <button className="close-button" onClick={handleDeleteModalClose}><AiOutlineClose /></button>

                                <h2>Удалить  студенту ?</h2>
                                <p style={{color:"white"}}>Вы уверены, что хотите удалить {currentStudent?.full_name}?</p>
                                <div className="modal-buttons">
                                    <button className="delete-button" onClick={handleDeleteStudent}>Удалить</button>
                                    <button className="cancel-button" onClick={handleDeleteModalClose}>Отмена</button>
                                </div>
                            </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Students;
