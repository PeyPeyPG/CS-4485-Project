import './ProviderProfile.css';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; 


const ProviderProfile = () => {
    const [data, setProfile] = useState({});

    // Fetch profile from the API
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userInfo = Cookies.get('userInfo');
                const username = userInfo ? JSON.parse(userInfo).username : null;
                const response = await fetch(`/api/dashboard/getproviderprofile/${username}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                } 
                const profile = await response.json();
                console.log(profile);
                const formattedProfile = {
                    username: profile.username,
                    email: profile.email,
                    name: profile.Name,
                    profession: profile.profession,
                    placeofwork: profile.placeOfWork,
                };
                console.log(formattedProfile);
                setProfile(formattedProfile);
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };
    
        fetchProfile();
    }, []);

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
                    <div className = "profile-info-entry-title">Username: </div>
                    <div className = "profile-info-entry">{data.username}</div>
                </div>
                <div className = "profile-info-line">
                    <div className = "profile-info-entry-title">Email: </div>
                    <div className = "profile-info-entry">{data.email}</div>
                </div>
                <div className = "profile-info-line">
                    <div className = "profile-info-entry-title">Profession: </div>
                    <div className = "profile-info-entry">{data.profession}</div>
                </div>
                <div className = "profile-info-line">
                    <div className = "profile-info-entry-title">Place Of Work: </div>
                    <div className = "profile-info-entry">{data.placeofwork}</div>
                </div>
            </div>
        </div>
    );
};
export default ProviderProfile;