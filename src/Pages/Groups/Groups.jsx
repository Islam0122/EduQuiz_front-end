import React, { useState } from 'react';
import "./Groups.scss";
import {
    useGetGroupsQuery,
    useCreateGroupMutation,
    useDeleteGroupMutation,
    useUpdateGroupMutation
} from "../../redux/groupApi";
import logo from './group-icons/number1.svg';
import logo2 from './group-icons/number2.svg';
import { FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Modal = ({ closeModal, createGroup }) => {
    const [groupName, setGroupName] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!groupName.trim()) return;

        try {
            await createGroup({ name: groupName }).unwrap();
            closeModal();
        } catch (err) {
            console.error("Ошибка при создании группы:", err);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-button" onClick={closeModal}>
                    <FaTimes size={20} color="#fff" />
                </button>
                <h2>Добавить новую группу</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Введите название группы"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="add-button">Добавить</button>
                </form>
            </div>
        </div>
    );
};

const ConfirmDeleteModal = ({ closeModal, deleteGroup, groupName }) => (
    <div className="modal-overlay">
        <div className="modal">
            <button className="close-button" onClick={closeModal}>
                <FaTimes size={20} color="#fff" />
            </button>
            <h2>Удалить группу?</h2>
            <p>Вы уверены, что хотите удалить группу <b>{groupName}</b>?</p>
            <div className="modal-buttons">
                <button className="delete-button" onClick={deleteGroup}>Удалить</button>
                <button className="cancel-button" onClick={closeModal}>Отмена</button>
            </div>
        </div>
    </div>
);

const EditModal = ({ closeModal, updateGroup, group,refetch }) => {
    const [newName, setNewName] = useState(group.name);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newName.trim()) {
            try {
                await updateGroup({ id: group.id, name: newName }).unwrap();
                closeModal();
                refetch();
            } catch (err) {
                setError("Ошибка при изменении группы. Попробуйте снова.");
            }
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-button" onClick={closeModal}>
                    <FaTimes size={20} color="#fff" />
                </button>
                <h2>Редактировать группу</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="add-button">Сохранить</button>
                </form>
            </div>
        </div>
    );
};

const GroupItem = ({ name, id, logoSrc, onDelete, onEdit }) => {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/groups/${id}`)} className="group-item">
            <img src={logoSrc} alt="Логотип группы" />
            <h1>{name}</h1>
            <FaTrash className="delete-icon" onClick={(e) => { e.stopPropagation(); onDelete(id, name); }} />
            <FaEdit className="edit-icon" onClick={(e) => { e.stopPropagation(); onEdit({ id, name }); }} />
        </div>
    );
};


const Groups = () => {
    const { data: groups, error, isLoading, refetch } = useGetGroupsQuery();
    const [createGroup, { isLoading: isCreating }] = useCreateGroupMutation();
    const [deleteGroup] = useDeleteGroupMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [groupToEdit, setGroupToEdit] = useState(null);
    const [updateGroup] = useUpdateGroupMutation();

    const handleCreateGroup = async (newGroup) => {
        try {
            await createGroup(newGroup).unwrap();
            refetch();
            setIsModalOpen(false);
        } catch (err) {
            console.error("Ошибка при создании группы:", err);
        }
    };

    const handleDeleteClick = (id, name) => {
        setGroupToDelete({ id, name });
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteGroup = async () => {
        if (!groupToDelete) return;
        try {
            await deleteGroup(groupToDelete.id).unwrap();
            refetch();
            setIsDeleteModalOpen(false);
        } catch (err) {
            console.error("Ошибка при удалении группы:", err);
        }
    };

    const handleEditClick = async (group) => {
        setGroupToEdit(group);
        setIsEditModalOpen(true);
    };


    return (
        <section className="Groups">
            <div className="container">
                <h2 className="group-page-title">Группы</h2>
                <div className="groups">
                    {isLoading ? (
                        <div className="status-message loading">
                            <p>⏳ Загрузка групп...</p>
                        </div>
                    ) : error ? (
                        <div className="status-message error">
                            <p>❌ Ошибка загрузки групп. Попробуйте еще раз.</p>
                        </div>
                    ) : groups?.length ? (
                        groups.map((group) => (
                            <GroupItem
                                key={group.id}
                                name={group.name}
                                id={group.id}
                                logoSrc={logo}
                                onDelete={handleDeleteClick}
                                onEdit={handleEditClick}
                            />
                        ))
                    ) : (
                        <div className="group-item add-group" onClick={() => setIsModalOpen(true)} style={isCreating ? { pointerEvents: "none", opacity: 0.5 } : {}}>
                            <img src={logo} alt="Логотип добавления" />
                            <h1>Группы отсутствуют</h1>
                        </div>
                    )}
                    <div className="group-item add-group" onClick={() => setIsModalOpen(true)} style={isCreating ? { pointerEvents: "none", opacity: 0.5 } : {}}>
                        <img src={logo2} alt="Логотип добавления" />
                        <h1>Добавить группу</h1>
                    </div>
                </div>
            </div>

            {isModalOpen && <Modal closeModal={() => setIsModalOpen(false)} createGroup={handleCreateGroup} />}
            {isDeleteModalOpen && <ConfirmDeleteModal closeModal={() => setIsDeleteModalOpen(false)} deleteGroup={confirmDeleteGroup} groupName={groupToDelete?.name} />}
            {isEditModalOpen && <EditModal closeModal={() => setIsEditModalOpen(false)} updateGroup={updateGroup} group={groupToEdit} refetch={refetch} />}
        </section>
    );
};

export default Groups;