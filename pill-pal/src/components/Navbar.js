import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { NavbarData } from './NavbarData';
import Cookies from 'js-cookie';
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar() {
    const [sidebar, setSideBar] = useState(false);
    const showSideBar = () => setSideBar(!sidebar);
    const [notificationCount, setNotificationCount] = useState(0);
    const [dropdown, setDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [requestedProviders, setRequestedProviders] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const showDropdown = () => setDropdown(!dropdown);
    
    const dropdownRef = useRef(null);

    const navigate = useNavigate();

    const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null;
    const dashboardPath =
        userInfo?.userType === 'provider'
            ? '/home/provider/dashboard'
            : '/home/patient/dashboard';

            useEffect(() => {
                
                setNotificationCount(3);
                
            }, []);
            useEffect(() => {
                if (showNotifications && userInfo?.userType === 'patient' && userInfo.username) {
                    setLoadingRequests(true);
                    fetch(`/api/patients/${userInfo.username}/requested-providers`)
                        .then(res => res.json())
                        
                        .then(data => {
                            console.log(data)
                            setRequestedProviders(data);
                            setLoadingRequests(false);
                        })
                        .catch(() => setLoadingRequests(false));
                }
            }, [showNotifications, userInfo]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        Cookies.remove('userInfo');
        navigate('/auth');
    };

    const handleShowNotifications = () => {
        setRequestedProviders([]); // Clear previous data
        setLoadingRequests(true);  // Set loading to true
        setShowNotifications(true);
    };
    
    const handleCloseNotifications = () => {
        setShowNotifications(false);
        setRequestedProviders([]); // Optionally clear data on close
        setLoadingRequests(false); // Optionally reset loading
    };

    return (
        <div className="navbar-container">
            <div className="navbar">
                <div>
                    <svg
                        cursor="pointer"
                        onClick={showSideBar}
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        fill="currentColor"
                        className="bi bi-list"
                        viewBox="0 0 16 16"
                    >
                        <path
                            fillRule="evenodd"
                            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                        />
                    </svg>
                </div>
                <div className="right-section">
                <div className="notification-bell-container">
        <button
            className="notification-bell-btn"
            onClick={handleShowNotifications}
            style={{ background: 'none', border: 'none', position: 'relative', padding: 0, cursor: 'pointer' }}
            aria-label="Show notifications"
        >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="white"
            className="bi bi-bell-fill"
            viewBox="0 0 16 16"
        >
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
        </svg>
        {notificationCount > 0 && (
            <span className="notification-badge">{notificationCount}</span>
        )}
    </button>

    {/* Bootstrap Modal */}
    <div
    className={`modal fade ${showNotifications ? 'show d-block' : ''}`}
    tabIndex="-1"
    style={{ background: showNotifications ? 'rgba(0,0,0,0.3)' : 'transparent' }}
    onClick={handleCloseNotifications}
    aria-modal="true"
    role="dialog"
>
    <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Notifications</h5>
                <button type="button" className="btn-close" onClick={handleCloseNotifications}></button>
            </div>
            <div className="modal-body">
            {userInfo?.userType === 'patient' ? (
    requestedProviders.length === 0 ? (
        <p>No providers have requested access.</p>
    ) : (
        <div>
            {requestedProviders.map((provider, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ flex: 1 }}>
                        {provider.Name} ({provider.username}) has requested access
                    </span>
                    <button
                        className="btn btn-success btn-sm"
                        style={{ marginRight: '8px' }}
                        onClick={() => {/* handle accept logic here */}}
                    >
                        Accept
                    </button>
                    <button
    className="btn btn-danger btn-sm"
    onClick={async () => {
        try {
            const response = await fetch(
                `/api/patients/${userInfo.username}/requested-providers/${provider.username}`,
                { method: 'DELETE' }
            );
            if (response.ok) {
                // Remove the provider from the local state
                setRequestedProviders(prev =>
                    prev.filter(p => p.username !== provider.username)
                );
            } else {
                console.error('Failed to reject request');
            }
        } catch (err) {
            console.error('Error rejecting request:', err);
        }
    }}
>
    Reject
</button>
                </div>
            ))}
        </div>
    )
) : (
    <p>No new notifications.</p>
)}
            </div>
        </div>
    </div>
</div>
</div>
                    <div className="nav-dropdown" ref={dropdownRef}>
                        <button onClick={showDropdown} className="link">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="38"
                                height="38"
                                fill="currentColor"
                                className="bi bi-person-fill"
                                viewBox="0 0 16 16"
                            >
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                            </svg>
                        </button>
                        <div className={dropdown ? 'nav-dropdown-menu active' : 'nav-dropdown-menu'}>
                            <div onClick={handleLogout}>logout</div>
                        </div>
                    </div>
                </div>
            </div>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className="nav-menu-items">
                    <li className="toggle">
                        <div>Navigation</div>
                        <svg
                            cursor="pointer"
                            onClick={showSideBar}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-x-lg"
                            viewBox="0 0 16 16"
                        >
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                        </svg>
                    </li>
                    {NavbarData.map((item, index) => {
                        const path = item.title === 'dashboard' ? dashboardPath : item.path;
                        return (
                            <li key={index} className={item.cName}>
                                <Link to={path}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                <footer className="footer">
                    <svg
                        width="64"
                        height="72"
                        viewBox="0 0 64 72"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M14.1353 33.8776C6.69564 30.4105 3.47802 21.5701 6.94853 14.1321C10.419 6.69403 19.2635 3.47492 26.7031 6.942L40.6199 13.4276L28.0521 40.3631L14.1353 33.8776Z"
                            fill="#E70000"
                            stroke="black"
                        />
                        <path
                            d="M28.8371 41.3H58.5756V56.6307C58.5756 64.8428 51.9184 71.5 43.7063 71.5C35.4943 71.5 28.8371 64.8428 28.8371 56.6307V41.3Z"
                            fill="white"
                            stroke="black"
                        />
                        <path
                            d="M36.9823 35.7639C36.9823 32.1829 39.8852 29.28 43.4662 29.28C47.0471 29.28 49.9501 32.1829 49.9501 35.7639V40.8H36.9823V35.7639Z"
                            fill="#9EC9F9"
                        />
                        <ellipse
                            cx="43.7063"
                            cy="24.96"
                            rx="7.20434"
                            ry="7.2"
                            fill="#9EC9F9"
                        />
                        <rect
                            width="13.9249"
                            height="3.0517"
                            rx="1.52585"
                            transform="matrix(0.766235 -0.64256 0.643015 0.765854 45.1452 35.9463)"
                            fill="#9EC9F9"
                        />
                        <ellipse
                            cx="58.3551"
                            cy="26.64"
                            rx="1.68101"
                            ry="1.68"
                            fill="#9EC9F9"
                        />
                        <path
                            d="M59.4152 21.828C61.1485 22.1336 62.5055 23.4898 62.8114 25.2221L62.4717 25.5615C62.1659 23.8293 60.8088 22.4731 59.0756 22.1674L59.4152 21.828Z"
                            fill="black"
                        />
                        <path
                            d="M58.4546 22.7879C60.1879 23.0936 61.5449 24.4498 61.8508 26.1821L61.5112 26.5215C61.2053 24.7893 59.8483 23.433 58.115 23.1274L58.4546 22.7879Z"
                            fill="black"
                        />
                    </svg>
                    <div>PillPal</div>
                </footer>
            </nav>
                <Outlet />
        </div>
    );
}

export default Navbar;