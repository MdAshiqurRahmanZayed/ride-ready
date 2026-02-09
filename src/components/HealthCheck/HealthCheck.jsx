import React, { useState, useEffect } from 'react';
import { baseUrl } from '../../redux/baseUrls';
import './HealthCheck.css';

const HealthCheck = () => {
    const [healthData, setHealthData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHealthCheck = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${baseUrl}api/health-check/`);
            if (!response.ok) {
                throw new Error('Health check failed');
            }
            const data = await response.json();
            setHealthData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealthCheck();
    }, []);

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    const getStatusColor = (status) => {
        return status === 'healthy' ? 'green' : 'red';
    };

    return (
        <div className="health-check-container">
            <div className="health-check-card">
                <h2>🏥 API Health Check</h2>
                
                {loading && <div className="loading-spinner">Checking...</div>}
                
                {error && (
                    <div className="error-message">
                        <span className="status-indicator status-error">●</span>
                        <p>Error: {error}</p>
                    </div>
                )}
                
                {healthData && !loading && !error && (
                    <div className="health-info">
                        <div className="health-item">
                            <span className="label">Status:</span>
                            <span 
                                className="value" 
                                style={{ color: getStatusColor(healthData.status) }}
                            >
                                <span className="status-indicator">●</span>
                                {healthData.status.toUpperCase()}
                            </span>
                        </div>
                        
                        <div className="health-item">
                            <span className="label">Service:</span>
                            <span className="value">{healthData.service}</span>
                        </div>
                        
                        <div className="health-item">
                            <span className="label">Database:</span>
                            <span 
                                className="value" 
                                style={{ color: getStatusColor(healthData.database) }}
                            >
                                <span className="status-indicator">●</span>
                                {healthData.database.toUpperCase()}
                            </span>
                        </div>
                        
                        <div className="health-item">
                            <span className="label">Timestamp:</span>
                            <span className="value">{formatTimestamp(healthData.timestamp)}</span>
                        </div>
                    </div>
                )}
                
                <button className="refresh-btn" onClick={fetchHealthCheck}>
                    🔄 Refresh Status
                </button>
            </div>
        </div>
    );
};

export default HealthCheck;
