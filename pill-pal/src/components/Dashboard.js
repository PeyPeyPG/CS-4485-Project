import './Dashboard.css';
const Dashboard = () => {
    return(
        <div className = "dashboard-container">
            <div className = "medicine-stack-container">
                <div className = "stack-text">Medicine Stack</div>
                <div className = "daily-pill-container">
                    <div className = "day-button">Mon</div>
                    <div className = "day-button">Tue</div>
                    <div className = "day-button">Wed</div>
                    <div className = "day-button">Thur</div>
                    <div className = "day-button">Fri</div>
                    <div className = "day-button">Sat</div>
                    <div className = "day-button">Sun</div>
                </div>
                <div className="dropdown"></div>
            </div>

        </div>
    );
};
export default Dashboard;