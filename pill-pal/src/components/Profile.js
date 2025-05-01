//import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {

    const data = {uid: 1, name: "John Doe", email: "johnDoe@gmail.com", bdate: "4/30/2025", height: "5' 8\""}

    return(
        <div className = "profile-container">
            <div className= "profile-picture-container">
                <div className = "profile-picture">
                    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                    </svg>
                </div>
                <div className = "profile-name">{data.name}</div>
            </div>
            <div className = "profile-info-container">
                <div className = "profile-info-line">
                    <div className = "profile-info-entry-title">Email: </div>
                    <div className = "profile-info-entry">{data.email}</div>
                </div>
                <div className = "profile-info-line">
                    <div className = "profile-info-entry-title">DOB: </div>
                    <div className = "profile-info-entry">{data.bdate}</div>
                </div>
                <div className = "profile-info-line">
                    <div className = "profile-info-entry-title">Height: </div>
                    <div className = "profile-info-entry">{data.height}</div>
                </div>
            </div>
        </div>
    );
};
export default Profile;