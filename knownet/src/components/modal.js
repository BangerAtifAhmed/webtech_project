import React from 'react';
import { RiCloseLine } from 'react-icons/ri';
import "../css/Modal.css";
import {useNavigate} from "react-router-dom"
export default function Modal({ setModalOpen }) {
    const navigate=useNavigate()
    return (
        <div className="darkBg" onClick={() => setModalOpen(false)}>

            <div className="centered">
                <div className="modal">
                    <div className="modalHeader">
                        <h5 className="heading">Confirm</h5>
                    </div>

                    <button className="closebtn" onClick={() => setModalOpen(false)}>
                        <RiCloseLine />
                    </button>

                    <div className="modalContent">
                        Are you sure you want to log out?
                    </div>
                    <div className="modalActions">
                        <div className="actionsContainer">
                            <button className="logoutbtn" onClick={() => {
                                setModalOpen(false); // Close the modal
                                localStorage.clear(); // Clear the localStorage
                                navigate("./signin")
                                window.location.reload(); // Refresh the page
                            }}>Log Out</button>


                            <button className="cancelbtn" onClick={() => setModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
